import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UserContactDTO {
  @ApiProperty({ description: 'Contact type', example: 'phone' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Contact value', example: '+7 985 408 31 75' })
  @IsString()
  @IsNotEmpty()
  value: string;
}
