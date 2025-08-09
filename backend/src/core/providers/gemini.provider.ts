import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { LLMProvider, LLMRequest, LLMResponse, LLMMessage, LLMContext } from '../interfaces/llm.interface';

@Injectable()
export class GeminiProvider implements LLMProvider {
  private readonly logger = new Logger(GeminiProvider.name);
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(apiKey: string, modelName: string = 'gemini-2.0-flash') {
    if (!apiKey) {
      throw new Error('Google AI API key is required for Gemini provider');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: modelName });
    this.logger.log(`Gemini provider initialized with model: ${modelName}`);
  }

  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    try {
      const { messages, context } = request;

      console.log({context});
      
      // Preparar o histórico de conversa para o Gemini
      const chat = this.model.startChat({
        history: this.convertMessagesToGeminiHistory(messages),
        generationConfig: this.convertContextToGeminiConfig(context),
      });

      // Pegar a última mensagem do usuário
      const lastUserMessage = messages[messages.length - 1];
      if (lastUserMessage.role !== 'user') {
        throw new Error('Last message must be from user');
      }

      const result = await chat.sendMessage(lastUserMessage.content);
      const response = await result.response;
      const text = response.text();

      // Extrair informações de uso se disponível
      const usage = result.response.usageMetadata ? {
        promptTokens: result.response.usageMetadata.promptTokenCount || 0,
        completionTokens: result.response.usageMetadata.candidatesTokenCount || 0,
        totalTokens: (result.response.usageMetadata.promptTokenCount || 0) + 
                    (result.response.usageMetadata.candidatesTokenCount || 0),
      } : undefined;

      return {
        content: text,
        usage,
        metadata: {
          model: 'gemini-2.0-flash',
          finishReason: result.response.candidates?.[0]?.finishReason || 'STOP',
        },
      };
    } catch (error) {
      this.logger.error(`Error generating response with Gemini: ${error.message}`);
      throw error;
    }
  }

  validateRequest(request: LLMRequest): boolean {

    if (!request.messages || request.messages.length === 0) {
      return false;
    }

    // Verificar se há pelo menos uma mensagem do usuário
    const hasUserMessage = request.messages.some(msg => msg.role === 'user');
    if (!hasUserMessage) {
      return false;
    }

    // Verificar se a última mensagem é do usuário
    const lastMessage = request.messages[request.messages.length - 1];
    if (lastMessage.role !== 'user') {
      return false;
    }

    return true;
  }

  getModelInfo() {
    return {
      name: 'gemini-2.0-flash',
      maxTokens: 32768, // Limite do Gemini Pro
      supportedFeatures: [
        'chat',
        'system_prompt',
        'temperature',
        'max_tokens',
        'top_p',
        'top_k',
        'stop_sequences',
      ],
    };
  }

  private convertMessagesToGeminiHistory(messages: LLMMessage[]) {
    const history: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    
    // Processar mensagens em pares (user/assistant)
    for (const message of messages) {
      if (message.role === 'user') {
        history.push({
          role: 'user',
          parts: [{ text: message.content }],
        });
      } else {
        history.push({
          role: 'model',
          parts: [{ text: message.content }],
        });
      }
    }

    return history;
  }

  private convertContextToGeminiConfig(context?: LLMContext) {
    if (!context) {
      return {};
    }

    const config: any = {};

    if (context.temperature !== undefined) {
      config.temperature = context.temperature;
    }

    if (context.maxTokens !== undefined) {
      config.maxOutputTokens = context.maxTokens;
    }

    if (context.topP !== undefined) {
      config.topP = context.topP;
    }

    if (context.topK !== undefined) {
      config.topK = context.topK;
    }

    if (context.stopSequences && context.stopSequences.length > 0) {
      config.stopSequences = context.stopSequences;
    }

    return config;
  }
} 