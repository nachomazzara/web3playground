import { SelectedContracts } from 'components/Playground/types'


export type Props = {
  contracts: SelectedContracts
  isMaximized: boolean
  initCode: string | null
  onChangeSize: () => void
}