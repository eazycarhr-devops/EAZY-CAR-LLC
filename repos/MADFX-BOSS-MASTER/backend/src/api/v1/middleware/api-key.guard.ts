import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard {
  private readonly validKeys = new Set([
    'madfx_test_key_123',
    'developer_key_abc',
    // In production, these would be loaded from a database/env
  ]);

  async canActivate(request: Request): Promise<boolean> {
    const apiKey = request.headers['x-api-key'];
    if (!apiKey || !this.validKeys.has(apiKey)) {
      throw new UnauthorizedException('Invalid or missing API key');
    }
    return true;
  }
}
