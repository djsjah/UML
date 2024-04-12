import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { UserContactDTO } from './user.contact.dto';

export class UserDTO {
  @ApiProperty({ description: 'User name', example: 'user12' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'User name', example: 'hdjjehWGY671!?' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'User contacts', type: [UserContactDTO], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserContactDTO)
  @IsOptional()
  contacts?: UserContactDTO[];
}
