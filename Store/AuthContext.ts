import React, { createContext } from 'react';
import { Theme } from './themes';

export type AuthContextType = {
    isLoggedIn: boolean; // Define your Theme type
    setisLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    user: UserInfoProps | null;
  };

type UserInfoProps = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar: string;
  id: string;
  caloriesGoal: number;
}

export const AuthContext = createContext<AuthContextType | null>(null);

