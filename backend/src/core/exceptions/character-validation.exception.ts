import { BadRequestException } from '@nestjs/common';

export class CharacterValidationException extends BadRequestException {
  constructor(
    message: string,
    public readonly isMaster: boolean,
    public readonly errorCode: string
  ) {
    super({
      message,
      isMaster,
      errorCode,
    });
  }
} 