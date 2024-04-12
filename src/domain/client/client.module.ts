import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ClientService],
  exports: [ClientService],
  controllers: [ClientController]
})
export class ClientModule {}
