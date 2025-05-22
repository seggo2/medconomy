import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CompanyController } from './company.controller';
import { Company } from './company.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Company])], 
  controllers: [CompanyController],
})
export class CompanyModule {}
