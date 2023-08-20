import { gql } from '@apollo/client';

export const createUserByProviders = gql`
  mutation UserCreate(
    $email: Email!
    $username: String
    $image: String
    $name: String
  ) {
    userCreate(
      input: {
        email: $email
        username: $username
        image: $image
        name: $name
      }
    ) {
      user {
        id
      }
    }
  }
`;

export const createUserByCredential = gql`
  mutation UserCreate($email: Email!, $password: String) {
    userCreate(input: { email: $email, password: $password }) {
      user {
        id
        email
        username
        name
        image
      }
    }
  }
`;
