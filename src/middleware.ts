import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export default middleware;

// Opcional: ajuste de matcher se necessário no futuro
// export const config = {
//   matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
// };
