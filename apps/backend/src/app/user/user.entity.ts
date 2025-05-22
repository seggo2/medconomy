import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  ManyToMany,
  Collection,
} from '@mikro-orm/core';
import { Company } from '../company/company.entity';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  email!: string;

  @Property({ nullable: true })
  address?: string;

  @ManyToOne(() => Company, { nullable: true })
  company?: Company;
  

  @ManyToMany(() => User)
  relatedCoworkers = new Collection<User>(this);
}
