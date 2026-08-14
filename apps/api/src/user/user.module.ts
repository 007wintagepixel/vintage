// ============================================
// User Module
// ============================================

import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AchievementService } from "./achievement.service";
import { KYCService } from "./kyc.service";

@Module({
  controllers: [UserController],
  providers: [UserService, AchievementService, KYCService],
  exports: [UserService, AchievementService, KYCService],
})
export class UserModule {}
