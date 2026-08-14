// ============================================
// Admin Auth Guard
// ============================================

import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class AdminAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: Error | null, user: any, _info: Error | null) {
    if (err || !user) {
      throw err || new UnauthorizedException("Admin authentication required");
    }
    // Check if user has admin role
    // This would be checked via a custom decorator or in the service
    return user;
  }
}
