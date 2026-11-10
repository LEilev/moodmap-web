import { partnerDisabledResponse } from '@/lib/partner-disabled';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export function GET() {
  return partnerDisabledResponse();
}
