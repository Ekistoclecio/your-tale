import { Injectable, BadRequestException } from '@nestjs/common';
import { RollDiceDto, RollDiceResponseDto } from '../dto/rpg-utils.dto';

@Injectable()
export class RpgUtilsService {
  private readonly diceTypes = {
    'd4': 4,
    'd6': 6,
    'd8': 8,
    'd10': 10,
    'd12': 12,
    'd20': 20,
    'd100': 100
  };

  /**
   * Rola um dado do tipo especificado e retorna o resultado
   * @param rollDiceDto - DTO contendo o tipo de dado
   * @returns Resultado da rolagem com informações do dado
   */
  async rollDice(rollDiceDto: RollDiceDto): Promise<RollDiceResponseDto> {
    const { diceType } = rollDiceDto;
    
    if (!this.diceTypes[diceType]) {
      throw new BadRequestException(`Tipo de dado inválido: ${diceType}`);
    }

    const maxValue = this.diceTypes[diceType];
    const result = this.generateRandomNumber(1, maxValue);

    return {
      diceType,
      result,
      maxValue
    };
  }

  /**
   * Gera um número aleatório entre min e max (inclusive)
   * @param min - Valor mínimo
   * @param max - Valor máximo
   * @returns Número aleatório
   */
  private generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Retorna os tipos de dados disponíveis
   * @returns Lista de tipos de dados suportados
   */
  getAvailableDiceTypes(): string[] {
    return Object.keys(this.diceTypes);
  }
} 