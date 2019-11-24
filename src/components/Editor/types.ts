import { SelectedContracts } from 'components/Playground/types'


export type Props = {
  contracts: SelectedContracts
  isMaximized: boolean
  onChangeSize: () => void
}