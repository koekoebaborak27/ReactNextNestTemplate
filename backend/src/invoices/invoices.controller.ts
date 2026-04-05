import { Controller, Get, Post, Patch, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InvoicesService } from './invoices.service';

class CreateInvoiceDto {
  contractId: number;
  unitPrice: string;
}

class UpdateStatusDto {
  status: 'APPROVED' | 'REJECTED';
}

@UseGuards(AuthGuard('jwt'))
@Controller('companies/:companyId/invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  findAll(@Param('companyId', ParseIntPipe) companyId: number) {
    return this.invoicesService.findAll(companyId);
  }

  @Post()
  create(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Body() dto: CreateInvoiceDto,
  ) {
    return this.invoicesService.create(companyId, dto.contractId, dto.unitPrice);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.invoicesService.updateStatus(id, dto.status);
  }
}
