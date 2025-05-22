import { Controller, Get, Post, Put, Param, Body, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { EntityManager } from '@mikro-orm/core';

@Controller('users')
export class UserController {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: UserRepository,

    private readonly em: EntityManager
  ) {}

  @Post()
  async create(@Body() body: Partial<User>): Promise<User> {
    const user = this.userRepo.create(body);
    await this.em.persistAndFlush(user);
    return user;
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() body: Partial<User>): Promise<User> {
    const user = await this.userRepo.findOne({ id });
    if (!user) throw new NotFoundException('User not found');

    this.userRepo.assign(user, body);
    await this.em.flush();
    return user;
  }

  @Get()
async findAll(): Promise<User[]> {
  return this.userRepo.findAll({
    populate: ['company', 'relatedCoworkers'],
  });
}

@Get(':id')
async findOne(@Param('id') id: number): Promise<User> {
  const user = await this.userRepo.findOne(
    { id },
    { populate: ['company', 'relatedCoworkers'] }
  );
  if (!user) throw new NotFoundException('User not found');
  return user;
}

}