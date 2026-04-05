import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import Decimal from 'decimal.js';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  // 印税計算ロジック（金額計算はすべてdecimal.jsを使用）
  calculateRoyalty(quantity: number, unitPrice: string, royaltyRate: string): Decimal {
    const q = new Decimal(quantity);
    const p = new Decimal(unitPrice);
    const r = new Decimal(royaltyRate);
    return q.mul(p).mul(r).toDecimalPlaces(0);
  }

  // 請求書一覧取得
  async findAll(companyId: number) {
    return this.prisma.invoice.findMany({
      where: { companyId },
      orderBy: { issuedAt: 'desc' },
    });
  }

  // 請求書発行
  async create(companyId: number, contractId: number, unitPrice: string) {
    // 会社の存在確認
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException(`会社ID ${companyId} が見つかりません`);

    // 契約の存在確認（会社に紐づいているか確認）
    const contract = await this.prisma.contract.findFirst({
      where: { id: contractId, companyId },
    });
    if (!contract) throw new NotFoundException(`契約ID ${contractId} が見つかりません`);

    // 印税計算
    const amount = this.calculateRoyalty(
      contract.quantity,
      unitPrice,
      contract.royaltyRate.toString(),
    );

    // 請求書をDBに保存（amountはstring型でPrismaに渡す）
    return this.prisma.invoice.create({
      data: {
        companyId,
        amount: amount.toString(),
        issuedAt: new Date(),
        status: 'PENDING',
      },
    });
  }

  // 承認ステータスの更新（PENDING→APPROVED or REJECTED）
  async updateStatus(id: number, status: 'APPROVED' | 'REJECTED') {
    const invoice = await this.prisma.invoice.findUnique({ where: { id } });
    if (!invoice) throw new NotFoundException(`請求書ID ${id} が見つかりません`);
    if (invoice.status !== 'PENDING') {
      throw new BadRequestException('承認済みまたは却下済みの請求書は変更できません');
    }
    return this.prisma.invoice.update({
      where: { id },
      data: { status },
    });
  }
}
