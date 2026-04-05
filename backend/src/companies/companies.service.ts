import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  // 会社一覧取得（会社名で部分一致検索）
  async findAll(search?: string) {
    return this.prisma.company.findMany({
      where: search
        ? { name: { contains: search } }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  // 会社詳細取得（契約・請求書も含む）
  async findOne(id: number) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        contracts: { orderBy: { createdAt: 'desc' } },
        invoices: { orderBy: { issuedAt: 'desc' } },
      },
    });
    if (!company) throw new NotFoundException(`会社ID ${id} が見つかりません`);
    return company;
  }
}
