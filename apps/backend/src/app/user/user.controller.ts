import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/core';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { AuditLog } from '../audit-log/audit-log.entity';
import { Company } from '../company/company.entity';
import { Collection } from '@mikro-orm/core';

@Controller('users')
export class UserController {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: UserRepository,

    private readonly em: EntityManager
  ) {}

  @Post()
  async create(@Body() body: any): Promise<User> {
    // Referenz auf Company setzen
    let companyRef = null;
    if (body.company?.id) {
      companyRef = this.em.getReference(Company, body.company.id);
    }

    // Referenzen für relatedCoworkers erstellen
    let coworkers = [];
    if (Array.isArray(body.relatedCoworkers)) {
      coworkers = body.relatedCoworkers.map((c) =>
        this.em.getReference(User, c.id)
      );
    }

    const user = new User();
    user.name = body.name;
    user.email = body.email;
    user.address = body.address;
    user.company = companyRef;
    user.relatedCoworkers = new Collection<User>(user, coworkers);

    await this.em.persistAndFlush(user);

    const log = this.em.create(AuditLog, {
      action: 'CREATE',
      entity: 'User',
      data: { ...user },
    });
    await this.em.persistAndFlush(log);

    return user;
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() body: any): Promise<User> {
    const user = await this.userRepo.findOne({ id });
    if (!user) throw new NotFoundException('User not found');

    // Referenz auf Company aktualisieren
    if (body.company?.id) {
      user.company = this.em.getReference(Company, body.company.id);
    }

    // relatedCoworkers aktualisieren
    if (Array.isArray(body.relatedCoworkers)) {
      const coworkers = body.relatedCoworkers.map((c) =>
        this.em.getReference(User, c.id)
      );
      user.relatedCoworkers.set(coworkers);
    }

    // andere Felder zuweisen
    user.name = body.name ?? user.name;
    user.email = body.email ?? user.email;
    user.address = body.address ?? user.address;

    await this.em.flush();

    const log = this.em.create(AuditLog, {
      action: 'UPDATE',
      entity: 'User',
      data: { id, updated: body },
    });
    await this.em.persistAndFlush(log);

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
