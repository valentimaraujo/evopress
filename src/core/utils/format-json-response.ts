import { NextResponse } from 'next/server';

export function formatJSONResponse(
  data: unknown,
  init?: { status?: number; headers?: HeadersInit }
): NextResponse {
  return NextResponse.json(data, {
    status: init?.status ?? 200,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
}

