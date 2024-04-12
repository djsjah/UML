import { ApiProperty } from '@nestjs/swagger';

export class ClientContactModel {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'phone' })
  type: string;

  @ApiProperty({ example: '+79824083175' })
  value: string;

  @ApiProperty({ example: 100000 })
  clientId: number;
}

export class ClientModel {
  @ApiProperty({ example: 100000 })
  id: number;

  @ApiProperty({ example: 'Богдан' })
  name: string;

  @ApiProperty({ example: 'Ноздряков' })
  surname: string;

  @ApiProperty({ example: 'Валериевич' })
  lastName?: string;

  @ApiProperty({ example: new Date(), type: Date })
  createdAt: Date;

  @ApiProperty({ example: new Date(), type: Date })
  updatedAt: Date;

  @ApiProperty({ type: [ClientContactModel] })
  contacts: ClientContactModel[];
}
