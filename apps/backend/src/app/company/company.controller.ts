import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Company } from './company.entity';
import { EntityRepository } from '@mikro-orm/postgresql';

@Controller('companies')
export class CompanyController {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: EntityRepository<Company>,
  ) {}

  @Get()
  async findAll(): Promise<Company[]> {
    return this.companyRepo.findAll();
  }
  
}
