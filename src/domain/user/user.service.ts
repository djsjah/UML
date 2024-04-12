import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  private handleError(error: any, id?: number): never {
    console.log("Error Service: ", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID - ${id} not found`);
      }
      else {
        throw new BadRequestException("An error occurred while processing the request");
      }
    }
    else {
      throw new InternalServerErrorException("Internal Server Error");
    }
  }

  async deleteUserContacts(userId: number): Promise<void> {
    await this.prisma.userContact.deleteMany({
      where: {
        userId: userId,
      },
    });
  }

  async getMaxUserId(): Promise<number> {
    const maxIdUser = await this.prisma.user.findFirst({
      orderBy: {
        id: 'desc',
      },
    });

    return maxIdUser ? maxIdUser.id + 1 : 100;
  }

  async getUser(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException(`User with ID - ${id} not found`);
    }

    return user;
  }

  async getAllUsers(searchString = '', page: number = 1, limit: number = 10): Promise<User[]> {
    try {
      const skip = (page - 1) * limit;
      let users = [];

      if (!searchString) {
        users = await this.prisma.user.findMany({
          skip,
          take: limit,
        });
      }
      else {
        users = await this.prisma.user.findMany({
          where: {
            OR: [
              { name: { contains: searchString, mode: 'insensitive' } },
            ]
          },
          skip,
          take: limit
        });

        if (users.length === 0) {
          users = await this.prisma.user.findMany({
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
            take: limit
          });
        }
      }

      return users;
    }
    catch (error) {
      this.handleError(error);
    }
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    try {
      return await this.prisma.user.create({ data });
    }
    catch (error) {
      this.handleError(error);
    }
  }

  async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data
      });
    }
    catch (error) {
      this.handleError(error, id);
    }
  }

  async removeUser(id: number): Promise<User> {
    try {
      await this.prisma.userContact.deleteMany({
        where: { userId: id },
      });

      return await this.prisma.user.delete({
        where: { id }
      });
    }
    catch (error) {
      this.handleError(error, id);
    }
  }

  async getUsersWithClients(id: number): Promise<User> {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
        include: { clients: true },
      });
    }
    catch (error) {
      this.handleError(error, id);
    }
  }

  async createUserWithClient(userData, clientId) {
    try {
      return await this.prisma.clientUser.create({
        data: {
          user: {
            create: userData
          },

          client: {
            connect: { id: clientId }
          }
        },
      });
    }
    catch (error) {
      this.handleError(error);
    }
  }
}
