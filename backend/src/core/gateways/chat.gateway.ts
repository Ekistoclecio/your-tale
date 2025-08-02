import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../providers/chat.service';
import { CreateMessageDto } from '../dto/message.dto';
import { WsJwtAuthGuard } from '../guards/ws-jwt-auth.guard';
import { WsCurrentUser } from '../decorators/ws-current-user.decorator';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../providers/user.service';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  afterInit(server: Server) {
    console.log('Chat WebSocket Gateway initialized');
    // Passar a referência do servidor para o ChatService
    this.chatService.setWebSocketServer(server);
  }

  async handleConnection(client: Socket) {
    try {
      // Extrair token do handshake
      const token = this.extractTokenFromHandshake(client);
      
      if (!token) {
        console.log(`Client ${client.id} disconnected: No token provided`);
        client.disconnect();
        return;
      }

      // Verificar e decodificar o token
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findById(payload.sub);

      if (!user) {
        console.log(`Client ${client.id} disconnected: User not found`);
        client.disconnect();
        return;
      }

      // Adicionar o usuário ao objeto do cliente
      client.data.user = user;

      console.log(`Client connected: ${client.id} - User: ${user.id} (${user.name})`);
      
      // Adicionar o usuário à lista de usuários online
      await this.chatService.addOnlineUser(user.id, client.id);
      
      client.emit('connected', { 
        message: 'Connected to chat server',
        userId: user.id,
        userName: user.name
      });
    } catch (error) {
      console.error(`Connection error for client ${client.id}:`, error.message);
      client.disconnect();
    }
  }

  private extractTokenFromHandshake(client: Socket): string | undefined {
    const auth = client.handshake.auth.token || client.handshake.headers.authorization;
    
    if (!auth) {
      return undefined;
    }

    if (auth.startsWith('Bearer ')) {
      return auth.substring(7);
    }

    return auth;
  }

  async handleDisconnect(client: Socket) {
    try {
      const user = client.data.user as User;
      if (user) {
        console.log(`Client disconnected: ${client.id} - User: ${user.id}`);
        
        // Remover o usuário da lista de usuários online
        await this.chatService.removeOnlineUser(user.id);
        
        // Remover o usuário de todas as salas de sessão
        await this.chatService.leaveAllSessions(user.id);
      }
    } catch (error) {
      console.error('Disconnection error:', error);
    }
  }

  @SubscribeMessage('join_session')
  @UseGuards(WsJwtAuthGuard)
  async handleJoinSession(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
    @WsCurrentUser() user: User,
  ) {
    try {
      const { sessionId } = data;
      
      // Verificar se o usuário tem acesso à sessão
      const canJoin = await this.chatService.canUserJoinSession(user.id, sessionId);
      if (!canJoin) {
        client.emit('error', { message: 'Access denied to this session' });
        return;
      }

      // Entrar na sala da sessão
      await this.chatService.joinSession(user.id, sessionId, client);
      
      client.emit('joined_session', { 
        sessionId,
        message: 'Successfully joined session chat' 
      });
      
      // Notificar outros usuários na sessão
      client.to(`session:${sessionId}`).emit('user_joined', {
        userId: user.id,
        sessionId,
      });
      
    } catch (error) {
      console.error('Join session error:', error);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('leave_session')
  @UseGuards(WsJwtAuthGuard)
  async handleLeaveSession(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
    @WsCurrentUser() user: User,
  ) {
    try {
      const { sessionId } = data;
      
      // Sair da sala da sessão
      await this.chatService.leaveSession(user.id, sessionId, client);
      
      client.emit('left_session', { 
        sessionId,
        message: 'Successfully left session chat' 
      });
      
      // Notificar outros usuários na sessão
      client.to(`session:${sessionId}`).emit('user_left', {
        userId: user.id,
        sessionId,
      });
      
    } catch (error) {
      console.error('Leave session error:', error);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('send_message')
  @UseGuards(WsJwtAuthGuard)
  async handleSendMessage(
    @MessageBody() data: CreateMessageDto & { sessionId: string },
    @ConnectedSocket() client: Socket,
    @WsCurrentUser() user: User,
  ) {
    try {
      const { sessionId, ...messageData } = data;
      
      // Enviar mensagem usando o serviço existente
      const message = await this.chatService.sendMessage(sessionId, messageData, user.id);
      
      // Emitir a mensagem para todos na sessão
      this.server.to(`session:${sessionId}`).emit('new_message', message);
      
      // Confirmar o envio para o remetente
      client.emit('message_sent', { 
        messageId: message.id,
        sessionId 
      });
      
    } catch (error) {
      console.error('Send message error:', error);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('typing_start')
  @UseGuards(WsJwtAuthGuard)
  async handleTypingStart(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
    @WsCurrentUser() user: User,
  ) {
    try {
      const { sessionId } = data;
      
      // Notificar outros usuários que este usuário está digitando
      client.to(`session:${sessionId}`).emit('user_typing_start', {
        userId: user.id,
        sessionId,
      });
      
    } catch (error) {
      console.error('Typing start error:', error);
    }
  }

  @SubscribeMessage('typing_stop')
  @UseGuards(WsJwtAuthGuard)
  async handleTypingStop(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
    @WsCurrentUser() user: User,
  ) {
    try {
      const { sessionId } = data;
      
      // Notificar outros usuários que este usuário parou de digitar
      client.to(`session:${sessionId}`).emit('user_typing_stop', {
        userId: user.id,
        sessionId,
      });
      
    } catch (error) {
      console.error('Typing stop error:', error);
    }
  }
} 