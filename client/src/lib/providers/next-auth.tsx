'use client';
import { SessionProvider } from 'next-auth/react';

type Props = {
  children?: React.ReactNode;
};

export const NextAuthProvider = (props: Props) => {
  return <SessionProvider>{props.children}</SessionProvider>;
};
