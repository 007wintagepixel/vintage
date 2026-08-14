// ============================================
// KYC Service
// ============================================

import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

import type { KYCSubmission } from "@ludo-nexus/validation";

@Injectable()
export class KYCService {
  private readonly logger = new Logger(KYCService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getKYCStatus(userId: string) {
    const kyc = await this.prisma.kYC.findUnique({
      where: { userId },
      include: { documents: true },
    });

    if (!kyc) {
      return { status: "not_started", documents: [] };
    }

    return kyc;
  }

  async submitKYC(userId: string, data: KYCSubmission) {
    // Check if KYC already exists
    let kyc = await this.prisma.kYC.findUnique({ where: { userId } });

    if (kyc && kyc.status === "verified") {
      throw new BadRequestException("KYC already verified");
    }

    if (kyc && ["submitted", "under_review"].includes(kyc.status)) {
      throw new BadRequestException("KYC already submitted for review");
    }

    // Create or update KYC
    kyc = await this.prisma.kYC.upsert({
      where: { userId },
      create: {
        userId,
        status: "submitted",
        fullName: data.fullName,
        dateOfBirth: new Date(data.dateOfBirth),
        nationality: data.nationality,
        address: data.address as any,
        submittedAt: new Date(),
        documents: {
          create: data.documents.map((d) => ({
            type: d.type,
            documentType: d.documentType,
            fileUrl: d.fileUrl,
            status: "pending",
          })),
        },
      },
      update: {
        status: "submitted",
        fullName: data.fullName,
        dateOfBirth: new Date(data.dateOfBirth),
        nationality: data.nationality,
        address: data.address as any,
        submittedAt: new Date(),
        documents: {
          deleteMany: {},
          create: data.documents.map((d) => ({
            type: d.type,
            documentType: d.documentType,
            fileUrl: d.fileUrl,
            status: "pending",
          })),
        },
      },
      include: { documents: true },
    });

    // Notify admin — in production this would push to an admin queue/dashboard
    this.logger.log(
      `KYC submission notification sent to admin for user ${userId}`,
    );

    return kyc;
  }

  async updateKYCDraft(userId: string, data: Partial<KYCSubmission>) {
    let kyc = await this.prisma.kYC.findUnique({ where: { userId } });

    if (kyc && kyc.status === "verified") {
      throw new BadRequestException("KYC already verified");
    }

    kyc = await this.prisma.kYC.upsert({
      where: { userId },
      create: {
        userId,
        status: "draft",
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        nationality: data.nationality,
        address: data.address as any,
      },
      update: {
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        nationality: data.nationality,
        address: data.address as any,
        status: "draft",
      },
    });

    return kyc;
  }

  // Admin methods
  async getPendingKYC(page = 1, limit = 20) {
    const [kycs, total] = await Promise.all([
      this.prisma.kYC.findMany({
        where: { status: { in: ["submitted", "under_review"] } },
        include: {
          user: {
            select: { id: true, username: true, email: true, fullName: true },
          },
          documents: true,
        },
        orderBy: { submittedAt: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.kYC.count({
        where: { status: { in: ["submitted", "under_review"] } },
      }),
    ]);

    return {
      data: kycs,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async reviewKYC(
    kycId: string,
    adminId: string,
    action: "approve" | "reject",
    rejectionReason?: string,
  ) {
    const kyc = await this.prisma.kYC.findUnique({ where: { id: kycId } });
    if (!kyc) throw new NotFoundException("KYC not found");

    if (action === "approve") {
      await this.prisma.$transaction(async (tx: any) => {
        await tx.kyc.update({
          where: { id: kycId },
          data: {
            status: "verified",
            reviewedAt: new Date(),
            reviewedById: adminId,
          },
        });

        await tx.user.update({
          where: { id: kyc.userId },
          data: { kycStatus: "verified", isVerified: true },
        });

        // Approve all documents
        await tx.kycDocument.updateMany({
          where: { kycId },
          data: {
            status: "approved",
            reviewedAt: new Date(),
            reviewedById: adminId,
          },
        });
      });

      return { success: true, message: "KYC approved" };
    } else {
      await this.prisma.kYC.update({
        where: { id: kycId },
        data: {
          status: "rejected",
          reviewedAt: new Date(),
          reviewedById: adminId,
          rejectionReason,
        },
      });

      await this.prisma.kYCDocument.updateMany({
        where: { kycId },
        data: {
          status: "rejected",
          reviewedAt: new Date(),
          reviewedById: adminId,
          rejectionReason,
        },
      });

      return { success: true, message: "KYC rejected" };
    }
  }

  async requestAdditionalInfo(kycId: string, adminId: string, message: string) {
    await this.prisma.kYC.update({
      where: { id: kycId },
      data: {
        status: "additional_info",
        reviewedAt: new Date(),
        reviewedById: adminId,
        rejectionReason: message, // Reuse field for additional info request
      },
    });

    return { success: true };
  }
}
