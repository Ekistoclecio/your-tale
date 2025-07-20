export interface LLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface LLMContext {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  stopSequences?: string[];
  [key: string]: any; // Para parâmetros específicos de cada modelo
}

export interface LLMRequest {
  messages: LLMMessage[];
  context?: LLMContext;
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  metadata?: {
    model: string;
    finishReason?: string;
    [key: string]: any;
  };
}

export interface LLMProvider {
  generateResponse(request: LLMRequest): Promise<LLMResponse>;
  validateRequest(request: LLMRequest): boolean;
  getModelInfo(): {
    name: string;
    maxTokens: number;
    supportedFeatures: string[];
  };
} 