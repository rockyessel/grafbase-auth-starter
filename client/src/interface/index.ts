import React from 'react';

export interface LayoutRootProps {
  children: React.ReactNode;
}


export interface UserProps {
  id: string;
  name: string;
  username: string;
  email: string;
  image: string;
}