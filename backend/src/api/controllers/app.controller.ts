import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from 'src/app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check da API' })
  @ApiResponse({ 
    status: 200, 
    description: 'API está funcionando corretamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Your Tale API is running!'
        }
      }
    }
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
