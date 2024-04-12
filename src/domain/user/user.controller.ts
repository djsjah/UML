import { Controller, Get, Post, Body, Query, Param, Res, Patch, Delete, UseInterceptors } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody, ApiResponse } from '@nestjs/swagger';
import { User, Prisma } from "@prisma/client";
import { UserService } from "./user.service";
import { Response } from 'express';
import { UserDTO } from './dto/user.dto';
import { UserModel } from "./user.model";
import { ValidateUserInterceptor } from './interceptor/user.interceptor';
import { ValidateUserContactInterceptor } from './interceptor/user.contact.interceptor';
import { ConstraintUserValidator } from './validator/constraint.user.validator';
import { ConstraintUserContactValidator } from './validator/constraint.user.contact.validator';

@ApiTags('users')
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: "Get all users" })
  @ApiQuery({
    name: 'search',
    required: false,
    description: "Search string",
    type: String,
    schema: {
      default: ''
    }
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: "Page Number",
    type: Number,
    schema: {
      default: 1
    }
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: "Number of items per page",
    type: Number,
    schema: {
      default: 10
    }
  })
  @ApiResponse({ status: 200, description: "List of all users", type: [UserModel] })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 422, description: "Unprocessable Entity" })
  @ApiResponse({ status: 500, description: "Internal Server Error" })
  @Get()
  async getAllUsers(
    @Query('search') searchString: string = '',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<User[]> {
    return await this.userService.getAllUsers(searchString, page, limit);
  }

  @ApiOperation({ summary: "Get a user by id" })
  @ApiParam({ name: 'id', required: true, description: "User id" })
  @ApiResponse({ status: 200, description: "User details", type: UserModel })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 422, description: "Unprocessable Entity" })
  @ApiResponse({ status: 500, description: "Internal Server Error" })
  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User | null> {
    return await this.userService.getUser(id);
  }

  @ApiOperation({ summary: "Create a new user" })
  @ApiBody({
    type: UserDTO,
    examples: {
      'Example User': {
        value: {
          name: 'user123',
          password: 'kgjhjUISj38!?',
          contacts: [
            {
              type: 'vk',
              value: '@vk_link'
            }
          ]
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: "The user has been successfully created", type: UserModel })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 422, description: "Unprocessable Entity" })
  @ApiResponse({ status: 500, description: "Internal Server Error" })
  @Post()
  @UseInterceptors(new ValidateUserInterceptor(new ConstraintUserValidator()))
  @UseInterceptors(new ValidateUserContactInterceptor(new ConstraintUserContactValidator()))
  async createUser(@Body() data: UserDTO, @Res() res: Response): Promise<Response> {
    const userCreateInput: Prisma.UserCreateInput = {
      ...data,
      contacts: {
        create: data.contacts.map(contactDTO => ({
          type: contactDTO.type,
          value: contactDTO.value,
        })),
      },
    };

    const newUser = await this.userService.createUser(userCreateInput);
    res.status(201).location(`/api/users/${newUser.id}`).send(newUser);
    return res;
  }

  @ApiOperation({ summary: "Update a user by id" })
  @ApiParam({ name: 'id', required: true, description: "User id" })
  @ApiBody({
    type: UserDTO,
    examples: {
      'Example User': {
        value: {
          name: 'user6372',
          password: 'Real_Madrid3329!',
          contacts: [
            {
              type: 'fb',
              value: '@fb_link'
            },
            {
              type: 'email',
              value: 'user_email@mail.ru'
            }
          ]
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: "The user has been successfully updated", type: UserModel })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 422, description: "Unprocessable Entity" })
  @ApiResponse({ status: 500, description: "Internal Server Error" })
  @Patch(':id')
  @UseInterceptors(new ValidateUserInterceptor(new ConstraintUserValidator()))
  @UseInterceptors(new ValidateUserContactInterceptor(new ConstraintUserContactValidator()))
  async updateUser(@Param('id') id: number, @Body() data: UserDTO): Promise<User> {
    const userCreateInput: Prisma.UserCreateInput = {
      ...data,
      contacts: {
        create: data.contacts.map(contactDTO => ({
          type: contactDTO.type,
          value: contactDTO.value,
        })),
      },
    };

    return await this.userService.updateUser(id, userCreateInput);
  }

  @ApiOperation({ summary: "Delete a user by id" })
  @ApiParam({ name: 'id', required: true, description: "User id" })
  @ApiResponse({ status: 200, description: "The user has been successfully deleted", type: UserModel })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 422, description: "Unprocessable Entity" })
  @ApiResponse({ status: 500, description: "Internal Server Error" })
  @Delete(':id')
  async removeUser(@Param('id') id: number): Promise<User> {
    return await this.userService.removeUser(id);
  }

  @ApiOperation({ summary: "Get a user with clients by id" })
  @ApiParam({ name: 'ip', required: true, description: "User id" })
  @ApiResponse({ status: 200, description: "User details with clients", type: UserModel })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 422, description: "Unprocessable Entity" })
  @ApiResponse({ status: 500, description: "Internal Server Error" })
  @Get(':id/clients')
  async getUserWithClients(@Param('id') id: number): Promise<User> {
    return await this.userService.getUsersWithClients(id);
  }

  @ApiOperation({ summary: "Create a user with a client" })
  @ApiParam({ name: 'id', required: true, description: "User id" })
  @ApiBody({ type: Number })
  @ApiResponse({ status: 201, description: "The user has been successfully created", type: UserModel })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 422, description: "Unprocessable Entity" })
  @ApiResponse({ status: 500, description: "Internal Server Error" })
  @Post(':id/clients')
  async createUserWithClient(@Param('id') id: number, @Body() clientId: number) {
    return await this.userService.createUserWithClient({ id }, clientId);
  }
}
