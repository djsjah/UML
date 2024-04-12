import { Controller, Get, Post, Body, Query, Param, Res, Patch, Delete, UseInterceptors } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Client, Prisma } from "@prisma/client";
import { Response } from 'express';
import { ClientService } from "./client.service";
import { ClientDTO } from './dto/client.dto';
import { ClientModel } from "./client.model";
import { ValidateClientInterceptor } from './interceptor/client.interceptor';
import { ValidateClientContactInterceptor } from './interceptor/client.contact.interceptor';
import { ConstraintClientValidator } from './validator/constraint.client.validator';
import { ConstraintClientContactValidator } from './validator/constraint.client.contact.validator';

@ApiTags('clients')
@Controller('api/clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) { }

  @ApiOperation({ summary: "Get all clients" })
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
  @ApiResponse({ status: 200, description: "List of all clients", type: [ClientModel] })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 422, description: "Unprocessable Entity" })
  @ApiResponse({ status: 500, description: "Internal Server Error" })
  @Get()
  async getAllClients(
    @Query('search') searchString: string = '',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Client[]> {
    return await this.clientService.getAllClients(searchString, page, limit);
  }

  @ApiOperation({ summary: "Get a client by id" })
  @ApiParam({ name: 'id', required: true, description: "Client id" })
  @ApiResponse({ status: 200, description: "Client details", type: ClientModel })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Client not found" })
  @ApiResponse({ status: 422, description: "Unprocessable Entity" })
  @ApiResponse({ status: 500, description: "Internal Server Error" })
  @Get(':id')
  async getClient(@Param('id') id: number): Promise<Client | null> {
    return await this.clientService.getClient(id);
  }

  @ApiOperation({ summary: "Create a new client" })
  @ApiBody({
    type: ClientDTO,
    examples: {
      'Example Client': {
        value: {
          name: 'Богдан',
          surname: 'Ноздряков',
          lastName: 'Валериевич',
          contacts: [
            {
              type: 'email',
              value: 'st1035@mail.ru'
            },
            {
              type: 'phone',
              value: '+7 982 408 31 75'
            }
          ]
        }
      },
      'Example Minimum Possible Client': {
        value: {
          name: 'Богдан',
          surname: 'Ноздряков'
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: "The client has been successfully created", type: ClientModel })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 422, description: "Unprocessable Entity" })
  @ApiResponse({ status: 500, description: "Internal Server Error" })
  @Post()
  @UseInterceptors(new ValidateClientInterceptor(new ConstraintClientValidator()))
  @UseInterceptors(new ValidateClientContactInterceptor(new ConstraintClientContactValidator()))
  async createClient(@Body() data: ClientDTO, @Res() res: Response): Promise<Response> {
    const newClientId = await this.clientService.getMaxClientId();
    const clientCreateInput: Prisma.ClientCreateInput = {
      ...data,
      id: newClientId,
      contacts: {
        create: data.contacts.map(contactDTO => ({
          type: contactDTO.type,
          value: contactDTO.value,
        })),
      },
    };

    const newClient = await this.clientService.createClient(clientCreateInput);
    res.status(201).location(`/api/clients/${newClient.id}`).send(newClient);
    return res;
  }

  @ApiOperation({ summary: "Update a client by id" })
  @ApiParam({ name: 'id', required: true, description: "Client id" })
  @ApiBody({
    type: ClientDTO,
    examples: {
      'Example Client': {
        value: {
          name: 'Богдан',
          surname: 'Ноздряков',
          lastName: 'Валериевич',
          contacts: [
            {
              type: 'email',
              value: 'st1035@mail.ru'
            },
            {
              type: 'phone',
              value: '+7 982 408 31 75'
            }
          ]
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: "The client has been successfully updated", type: ClientModel })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Client not found" })
  @ApiResponse({ status: 422, description: "Unprocessable Entity" })
  @ApiResponse({ status: 500, description: "Internal Server Error" })
  @Patch(':id')
  @UseInterceptors(new ValidateClientInterceptor(new ConstraintClientValidator()))
  @UseInterceptors(new ValidateClientContactInterceptor(new ConstraintClientContactValidator()))
  async updateClient(@Param('id') id: number, @Body() data: ClientDTO): Promise<Client> {
    await this.clientService.deleteClientContacts(id);

    const clientUpdateInput: Prisma.ClientUpdateInput = {
      ...data,
      contacts: {
        connectOrCreate: data.contacts.map(contactDTO => ({
          where: { type_value: { type: contactDTO.type, value: contactDTO.value } },
          create: {
            type: contactDTO.type,
            value: contactDTO.value,
          },
        })),
      },
    };

    return await this.clientService.updateClient(id, clientUpdateInput);
  }

  @ApiOperation({ summary: "Delete a client by id" })
  @ApiParam({ name: 'id', required: true, description: "Client id" })
  @ApiResponse({ status: 200, description: "The client has been successfully deleted", type: ClientModel })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Client not found" })
  @ApiResponse({ status: 422, description: "Unprocessable Entity" })
  @ApiResponse({ status: 500, description: "Internal Server Error" })
  @Delete(':id')
  async removeClient(@Param('id') id: number): Promise<Client> {
    return await this.clientService.removeClient(id);
  }

  @ApiOperation({ summary: "Get a client with users by id" })
  @ApiParam({ name: 'ip', required: true, description: "Client id" })
  @ApiResponse({ status: 200, description: "Client details with users", type: ClientModel })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Client not found" })
  @ApiResponse({ status: 422, description: "Unprocessable Entity" })
  @ApiResponse({ status: 500, description: "Internal Server Error" })
  @Get(':id/users')
  async getClientWithUsers(@Param('id') id: number): Promise<Client> {
    return await this.clientService.getClientWithUsers(id);
  }

  @ApiOperation({ summary: "Create a client with a user" })
  @ApiParam({ name: 'id', required: true, description: "Client id" })
  @ApiBody({ type: Number })
  @ApiResponse({ status: 201, description: "The client has been successfully created", type: ClientModel })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Client not found" })
  @ApiResponse({ status: 422, description: "Unprocessable Entity" })
  @ApiResponse({ status: 500, description: "Internal Server Error" })
  @Post(':id/users')
  async createClientWithUser(@Param('id') id: number, @Body() userId: number) {
    return await this.clientService.createClientWithUser({ id }, userId);
  }
}
