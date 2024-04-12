import { ApiProperty } from '@nestjs/swagger';

export class UserContactModel {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'email' })
  type: string;

  @ApiProperty({ example: 'user@yandex.ru' })
  value: string;

  @ApiProperty({ example: 500 })
  userId: number;
}

export class UserModel {
  @ApiProperty({ example: 500 })
  id: number;

  @ApiProperty({ example: 'user1' })
  name: string;

  @ApiProperty({ example: new Date(), type: Date })
  createdAt: Date;

  @ApiProperty({ example: new Date(), type: Date })
  updatedAt: Date;

  @ApiProperty({ example: 'BarcaTheBest123564' })
  password: string;

  @ApiProperty({ type: [UserContactModel] })
  contacts: UserContactModel[];
}
