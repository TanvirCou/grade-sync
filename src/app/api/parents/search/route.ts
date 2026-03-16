import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') ?? '';
  const id = searchParams.get('id');

  // Exact lookup by ID (used for pre-filling update mode)
  if (id) {
    const parent = await prisma.parent.findUnique({
      where: { id },
      select: { id: true, username: true, name: true, surname: true },
    });
    return NextResponse.json(parent ? [parent] : []);
  }

  // Search by username / name / surname
  const parents = await prisma.parent.findMany({
    where: {
      OR: [
        { username: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
        { surname: { contains: q, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      username: true,
      name: true,
      surname: true,
    },
    take: 10,
  });

  return NextResponse.json(parents);
}
