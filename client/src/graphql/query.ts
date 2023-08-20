import { gql } from '@apollo/client';

export const queryUserByEmail = gql`
  query User($email: Email!) {
    user(by: { email: $email }) {
      id
      email
      name
      username
      password
      image
    }
  }
`;


export const queryUserById = gql`
  query User($id: ID!) {
    user(by: { id: $id }) {
      id
      email
      name
      username
      password
      image
    }
  }
`;
