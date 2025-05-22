import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class AuditLog {
  @PrimaryKey()
  id!: number;

  @Property()
  action!: string;

  @Property()
  entity!: string;

  @Property({ type: 'json' })
  data!: Record<string, any>;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;
}
