import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LLMService } from '../providers/llm.service';
import { GeminiProvider } from '../providers/gemini.provider';

@Global() // Torna o módulo global
@Module({
  imports: [ConfigModule],
  providers: [
    LLMService,
    {
      provide: 'GEMINI_PROVIDER',
      useFactory: (configService: ConfigService) => {
        const apiKey = configService.get<string>('GEMINI_API_KEY');
        const modelName = configService.get<string>('GEMINI_MODEL_NAME', 'gemini-2.0-flash');
        
        if (!apiKey) {
          console.warn('GEMINI_API_KEY not found in environment variables. Gemini provider will not be available.');
          return null;
        }
        
        return new GeminiProvider(apiKey, modelName);
      },
      inject: [ConfigService],
    },
  ],
  exports: [LLMService], // Exportar o LLMService
})
export class LLMModule {
  constructor(
    private readonly llmService: LLMService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    const apiKey = this.configService.get('GEMINI_API_KEY');
    const modelName = this.configService.get('GEMINI_MODEL_NAME', 'gemini-2.0-flash');
    
    if (apiKey) {
      const geminiProvider = new GeminiProvider(apiKey, modelName);
      this.llmService.registerProvider('gemini', geminiProvider);
    }
  }
} 