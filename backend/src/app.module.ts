import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { InvoicesModule } from './invoices/invoices.module';

@Module({
  imports: [PrismaModule, AuthModule, CompaniesModule, InvoicesModule],
})
export class AppModule {}
