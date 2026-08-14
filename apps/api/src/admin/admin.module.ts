// ============================================
// Admin Module
// ============================================

import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { AdminAuthGuard } from "./guards/admin-auth.guard";
import { UserModule } from "../user/user.module";
import { WalletModule } from "../wallet/wallet.module";

@Module({
  imports: [UserModule, WalletModule],
  controllers: [AdminController],
  providers: [AdminService, AdminAuthGuard],
  exports: [AdminService],
})
export class AdminModule {}
