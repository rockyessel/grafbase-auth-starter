import { createUserByProviders } from '@/graphql/mutation';
import { queryUserByEmail, queryUserById } from '@/graphql/query';
import { DocumentNode } from '@apollo/client';
import { GraphQLClient, Variables } from 'graphql-request';

export const authenticatedQuery = async (query: DocumentNode | string, variables: Variables) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-api-key': process.env.GRAFBASE_API_KEY!,
  };
  const client = new GraphQLClient(`${process.env.NEXT_PUBLIC_GRAFBASE_API_URL!}`,{ headers });
  const data = await client.request(query, variables);
  return data;
};

export const findUserByEmail = async (email: string) => {
  const { user } = (await authenticatedQuery(queryUserByEmail, { email })) as any;
  return user;
};

export const createUserUsingProvider = async (variables: Variables): Promise<string> => {
  const data = (await authenticatedQuery(createUserByProviders, variables)) as any;
  return data.userCreate.user.id as string;
};

// I'll leave this one for you to figure it out.
export const findUserById = async (id: string) => {
  const { user } = (await authenticatedQuery(queryUserById, { id })) as any;
  return user;
};