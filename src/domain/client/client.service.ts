import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Client, Prisma } from '@prisma/client';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) { }

  private selectClientFields = {
    id: true,
    name: true,
    surname: true,
    lastName: true,
    createdAt: true,
    updatedAt: true,
    contacts: true
  }

  private handleError(error: any, id?: number): never {
    console.log("Error Service: ", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        console.log('NotFoundException');
        throw new NotFoundException(`Client with ID - ${id} not found`);
      }
      else {
        console.log('BadRequestException');
        throw new BadRequestException('An error occurred while processing the request');
      }
    }
    else {
      console.log('InternalServerErrorException');
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async deleteClientContacts(clientId: number): Promise<void> {
    await this.prisma.clientContact.deleteMany({
      where: {
        clientId: clientId,
      },
    });
  }

  async getMaxClientId(): Promise<number> {
    const maxIdClient = await this.prisma.client.findFirst({
      orderBy: {
        id: 'desc',
      },
    });

    return maxIdClient ? maxIdClient.id + 1 : 100000;
  }

  async getClient(id: number): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { id },
      select: this.selectClientFields
    });

    if (!client) {
      throw new NotFoundException(`Client with ID - ${id} not found`);
    }

    return client;
  }

  async getAllClients(searchString = '', page: number = 1, limit: number = 10): Promise<Client[]> {
    try {
      const skip = (page - 1) * limit;
      let clients = [];

      if (!searchString) {
        clients = await this.prisma.client.findMany({
          skip,
          take: limit,
          select: this.selectClientFields
        });
      }
      else {
        clients = await this.prisma.client.findMany({
          where: {
            OR: [
              { name: { contains: searchString, mode: 'insensitive' } },
              { surname: { contains: searchString, mode: 'insensitive' } },
              { lastName: { contains: searchString, mode: 'insensitive' } }
            ]
          },
          skip,
          take: limit,
          select: this.selectClientFields
        });

        if (clients.length === 0) {
          clients = await this.prisma.client.findMany({
            where: {
              contacts: {
                some: {
                  value: {
                    contains: searchString,
                    mode: 'insensitive'
                  }
                }
              }
            },
            skip,
            take: limit,
            select: this.selectClientFields
          });
        }
      }

      return clients;
    }
    catch (error) {
      this.handleError(error);
    }
  }

  async createClient(data: Prisma.ClientCreateInput): Promise<Client> {
    try {
      return await this.prisma.client.create({
        data,
        select: this.selectClientFields
      });
    }
    catch (error) {
      this.handleError(error);
    }
  }

  async updateClient(id: number, data: Prisma.ClientUpdateInput): Promise<Client> {
    try {
      return await this.prisma.client.update({
        where: { id },
        data,
        select: this.selectClientFields
      });
    }
    catch (error) {
      this.handleError(error, id);
    }
  }

  async removeClient(id: number): Promise<Client> {
    try {
      await this.prisma.clientContact.deleteMany({
        where: { clientId: id },
      });

      return await this.prisma.client.delete({
        where: { id }
      });
    }
    catch (error) {
      this.handleError(error, id);
    }
  }

  async getClientWithUsers(id: number): Promise<Client> {
    try {
      return await this.prisma.client.findUnique({
        where: { id },
        include: { users: true }
      });
    }
    catch (error) {
      this.handleError(error, id);
    }
  }

  async createClientWithUser(clientData, userId) {
    try {
      return await this.prisma.clientUser.create({
        data: {
          client: {
            create: clientData
          },

          user: {
            connect: { id: userId }
          }
        },
      });
    }
    catch (error) {
      this.handleError(error);
    }
  }
}
