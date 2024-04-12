import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, ValidateNested, IsArray, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { ClientContactDTO } from './client.contact.dto';

export class ClientDTO {
  @ApiProperty({ description: 'Client name', example: 'Богдан' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Client surname', example: 'Ноздряков' })
  @IsString()
  @IsNotEmpty()
  surname: string;

  @ApiProperty({ description: 'Client last name', example: 'Валериевич', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ description: 'Client contacts', type: [ClientContactDTO], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClientContactDTO)
  @IsOptional()
  contacts?: ClientContactDTO[];
}
