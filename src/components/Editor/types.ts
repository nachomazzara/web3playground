import { SelectedContracts } from 'components/Playground/types'
import { LIB } from '../../constants'

export type Props = {
  library: LIB
  contracts: SelectedContracts
  isMaximized: boolean
  initCode: string | null
  isLoading: boolean
  onChangeSize: () => void
}
