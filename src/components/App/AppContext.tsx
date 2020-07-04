import { createContext } from 'react'

import { File } from 'components/Files/types'

type AppContext = {
  refreshFiles: (fileId?: File) => void
}

export const AppContext = createContext<AppContext>({
  refreshFiles: () => {}
})
