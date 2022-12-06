import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';

import { UserDTO } from './dto/user';

const prisma = new PrismaClient();

@Injectable()
export class AppService {
  async createUser(user: UserDTO): Promise<string> {
    const userCreated = await prisma.user.create({
      data: user,
    });

    return `${userCreated.email}: ${userCreated.name}`;
  }

  async getUsers(): Promise<User[]> {
    return await prisma.user.findMany();
  }

  async deleteUser(id: number): Promise<User> {
    return await prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async updateUser(id: number, user: User): Promise<User> {
    const oldUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return await prisma.user.update({
      data: {
        ...oldUser,
        ...user,
      },

      where: {
        id,
      },
    });
  }
}
