import { Injectable, Logger } from '@nestjs/common';
import { LLMProvider, LLMRequest, LLMResponse } from '../interfaces/llm.interface';

@Injectable()
export class LLMService {
  private readonly logger = new Logger(LLMService.name);
  private providers: Map<string, LLMProvider> = new Map();

  registerProvider(name: string, provider: LLMProvider): void {
    this.providers.set(name, provider);
    this.logger.log(`LLM provider '${name}' registered successfully`);
  }

  getProvider(name: string): LLMProvider | undefined {
    return this.providers.get(name);
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  async generateResponse(
    providerName: string,
    request: LLMRequest,
  ): Promise<LLMResponse> {
    const provider = this.getProvider(providerName);
    
    if (!provider) {
      throw new Error(`LLM provider '${providerName}' not found. Available providers: ${this.getAvailableProviders().join(', ')}`);
    }

    if (!provider.validateRequest(request)) {
      throw new Error(`Invalid request for provider '${providerName}'`);
    }

    try {
      this.logger.debug(`Generating response with provider '${providerName}'`);
      const response = await provider.generateResponse(request);
      this.logger.debug(`Response generated successfully with provider '${providerName}'`);
      return response;
    } catch (error) {
      this.logger.error(`Error generating response with provider '${providerName}': ${error.message}`);
      throw error;
    }
  }

  getModelInfo(providerName: string) {
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`LLM provider '${providerName}' not found`);
    }
    return provider.getModelInfo();
  }
} 