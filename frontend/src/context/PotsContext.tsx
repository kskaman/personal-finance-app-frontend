import { createContext } from "react"
import { Pot } from "../types/Data"

interface PotsDataContextProps {
    pots: Pot[];
}

interface PotsActionContextProps { 
    setPots: React.Dispatch<React.SetStateAction<Pot[]>>
}

export const PotsDataContext = createContext<PotsDataContextProps>({
    pots: [],
})

export const PotsActionContext = createContext<PotsActionContextProps>({
    setPots: () => {},
}) 