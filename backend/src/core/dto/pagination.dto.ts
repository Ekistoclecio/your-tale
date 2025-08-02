import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Lista de itens da página atual' })
  data: T[];

  @ApiProperty({ description: 'Página atual', example: 1 })
  currentPage: number;

  @ApiProperty({ description: 'Total de páginas', example: 5 })
  totalPages: number;

  @ApiProperty({ description: 'Total de itens', example: 100 })
  totalItems: number;

  @ApiProperty({ description: 'Número de itens por página', example: 20 })
  itemsPerPage: number;

  @ApiProperty({ description: 'Indica se há próxima página', example: true })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Indica se há página anterior', example: false })
  hasPreviousPage: boolean;
} 