import React, { createContext, useContext, useState } from 'react';
import { Theme } from './themes';

export type ThemeContextType = {
    theme: Theme; // Define your Theme type
    setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  };
export const ThemeContext = createContext<ThemeContextType | null>(null);

