import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { authenticatedQuery } from '@/lib/api';
import { createUserByCredential } from '@/graphql/mutation';

export const POST = async (request: Request) => {
  const body = await request.json();
  const { email, password } = body;
  try {
    if (email && password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      const variables = { email, password: hashedPassword };
      const data = await authenticatedQuery(createUserByCredential, variables);
      return NextResponse.json({ user: data });
    }
  } catch (error) {
    return NextResponse.json({ error });
  }
};
