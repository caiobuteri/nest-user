import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { AppService } from './app.service';
import { UserDTO } from './dto/user';

interface AlterUserProps {
  id: string;
}

interface DeleteUserProps extends AlterUserProps {}

interface PutUserProps extends AlterUserProps {}

interface PutUserBodyProps {
  user: User;
}

@Controller('user')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  createUser(@Body() body: UserDTO): Promise<string> {
    return this.appService.createUser(body);
  }

  @Get()
  getUsers(): Promise<User[]> {
    return this.appService.getUsers();
  }

  @Delete(':id')
  deleteUser(@Param() { id }: DeleteUserProps): Promise<User> {
    return this.appService.deleteUser(Number(id));
  }

  @Put(':id')
  updateUser(
    @Body() { user }: PutUserBodyProps,
    @Param() { id }: PutUserProps,
  ): Promise<User> {
    return this.appService.updateUser(Number(id), user);
  }
}
