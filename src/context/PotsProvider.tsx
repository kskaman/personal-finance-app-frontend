import { useState, ReactNode } from "react";
import { Pot } from "../types/Data";
import { PotsActionContext, PotsDataContext } from "./PotsContext";

interface PotsProviderProps {
  children: ReactNode;
  pots: Pot[];
}

export const PotsProvider = ({ children, pots }: PotsProviderProps) => {
  const [potsState, setPotsState] = useState<Pot[]>(pots);

  return (
    <PotsDataContext.Provider value={{ pots: potsState }}>
      <PotsActionContext.Provider value={{ setPots: setPotsState }}>
        {children}
      </PotsActionContext.Provider>
    </PotsDataContext.Provider>
  );
};
