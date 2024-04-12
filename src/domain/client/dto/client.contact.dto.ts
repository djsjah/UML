import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ClientContactDTO {
  @ApiProperty({ description: 'Contact type', example: 'email' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Contact value', example: 'st1035@mail.ru' })
  @IsString()
  @IsNotEmpty()
  value: string;
}
