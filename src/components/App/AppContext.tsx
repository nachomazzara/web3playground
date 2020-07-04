import { createContext } from 'react'

type AppContext = {
  refreshFiles: () => void
}

export const AppContext = createContext<AppContext>({
  refreshFiles: () => {}
})
