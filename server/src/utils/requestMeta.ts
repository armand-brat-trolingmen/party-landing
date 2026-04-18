import type { Request } from 'express';

export function getRequestIp(request: Request) {
  return request.ip || null;
}
