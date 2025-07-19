import { Controller, Get, Patch, Body, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '../providers/user.service';
import { UpdateUserDto } from '../dto/auth.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obter perfil do usuário logado' })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil do usuário',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        name: { type: 'string', example: 'João Silva' },
        email: { type: 'string', example: 'joao@example.com' },
        avatar: { type: 'string', nullable: true, example: null },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado' 
  })
  async getProfile(@CurrentUser() user: any) {
    const userData = await this.userService.findById(user.userId);
    if (!userData) {
      throw new NotFoundException('User not found');
    }
    const { password, ...result } = userData;
    return result;
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualizar perfil do usuário logado' })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil atualizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        name: { type: 'string', example: 'João Silva' },
        email: { type: 'string', example: 'joao@example.com' },
        avatar: { type: 'string', nullable: true, example: null },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado' 
  })
  @ApiBody({ type: UpdateUserDto })
  async updateProfile(@CurrentUser() user: any, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.update(user.userId, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    const { password, ...result } = updatedUser;
    return result;
  }
} 