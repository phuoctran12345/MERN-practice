import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import * as jwt from "jsonwebtoken";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException("Access token not found");
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
      request.user = payload; // Attach user to request
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid access token");
    }
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    // Extract JWT from cookie (same as Express middleware)
    return request.cookies?.jwt;
  }
}
