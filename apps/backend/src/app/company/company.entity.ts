import { Entity, PrimaryKey, Property, OneToMany } from '@mikro-orm/core';
import { User } from '../user/user.entity';

@Entity()
export class Company {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @OneToMany(() => User, (user) => user.company)
  users = new Array<User>();
}
