import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { UserController } from './user.controller';


@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [UserController],
})
export class UserModule {}
