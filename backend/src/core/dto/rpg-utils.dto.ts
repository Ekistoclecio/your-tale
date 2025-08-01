import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RollDiceDto {
  @ApiProperty({
    description: 'Tipo de dado para rolagem',
    example: 'd20',
    enum: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100']
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'])
  diceType: string;
}

export class RollDiceResponseDto {
  @ApiProperty({
    description: 'Tipo de dado usado na rolagem',
    example: 'd20'
  })
  diceType: string;

  @ApiProperty({
    description: 'Resultado da rolagem',
    example: 15
  })
  result: number;

  @ApiProperty({
    description: 'Valor máximo possível para este tipo de dado',
    example: 20
  })
  maxValue: number;
} 