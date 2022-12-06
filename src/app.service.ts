import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';

import { client } from './main';
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
    const usersFromCache = await client.get('usersList');
    const isUsersFromCacheStale = !(await client.get('usersList:validation'));

    if (isUsersFromCacheStale) {
      const isRefetching = !!(await client.get('usersList:refetching'));

      if (!isRefetching) {
        await client.set('usersList:refetching', 'true', { EX: 20 });

        const users = await prisma.user.findMany();
        await client.set('usersList', JSON.stringify(users));
        await client.set('usersList:validation', 'true', { EX: 5 });
        await client.del('usersList:refetching');
      }
    }

    return JSON.parse(usersFromCache);
  }

  async deleteUser(id: number): Promise<User> {
    await client.del('usersList');

    return await prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async updateUser(id: number, user: User): Promise<User> {
    await client.del('usersList');

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
