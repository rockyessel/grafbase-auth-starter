import '@/styles/global.css';
import type { Metadata } from 'next';
import { LayoutRootProps } from '@/interface';
import { NextAuthProvider } from '@/lib/providers/next-auth';

export const metadata: Metadata = {
  title:
    'A Comprehensive Walkthrough of Grafbase Integration with Next.js 13 for Database and Authentication-NextAuth',
  description: `So in this walkthrough, I'll take you from creating and deploying your Grafbase project from the CLI, and then integrate NextAuth within our Next.js 13 project while using Grafbase Graphql API. And in case you're worried if you don't understand GraphQL and how it works, then I'm here for you, I promise to explain thoroughly. So relax and follow along as I take you through this walkthrough.`,
};

export default function RootLayout(props: LayoutRootProps) {
  return (
    <html lang='en'>
      <NextAuthProvider>
        <body>
          <main>{props.children}</main>
        </body>
      </NextAuthProvider>
    </html>
  );
}
