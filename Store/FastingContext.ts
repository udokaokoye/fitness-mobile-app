import React, { createContext } from 'react';
import { Theme } from './themes';

export interface FastingContextProps  {
    fastingInfo: {
        startTime: number | null;
    endTime: number | null;
    }
    setfastingInfo:React.Dispatch<React.SetStateAction<FastingInfoType>>
    isFasting: boolean;
    setisFasting: React.Dispatch<React.SetStateAction<boolean>>
  };


  type FastingInfoType ={
    startTime: number | null;
    endTime: number | null;
  }

export const FastingContext = createContext<FastingContextProps | null>(null);

