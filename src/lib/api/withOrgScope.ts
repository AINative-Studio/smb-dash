import { NextRequest, NextResponse } from 'next/server';

export function getOrgId(request: NextRequest): string | null {
  const fromParams = new URL(request.url).searchParams.get('organization_id');
  if (fromParams) return fromParams;
  const fromHeader = request.headers.get('x-organization-id');
  return fromHeader;
}

export function requireOrgId(request: NextRequest): string | NextResponse {
  const orgId = getOrgId(request);
  if (!orgId) {
    return NextResponse.json(
      { error: 'organization_id is required' },
      { status: 400 }
    );
  }
  return orgId;
}

export type OrgScopedHandler = (
  request: NextRequest,
  organizationId: string
) => Promise<NextResponse>;

export function withOrgScope(handler: OrgScopedHandler) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const result = requireOrgId(request);
    if (result instanceof NextResponse) return result;
    return handler(request, result);
  };
}
