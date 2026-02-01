import { createContext } from 'react';

type contextT={
    user: number,
    setUser: React.Dispatch<React.SetStateAction<number>>,
}

export const UserContext = createContext<contextT | undefined>(undefined);
