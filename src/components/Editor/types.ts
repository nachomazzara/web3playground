import { Contracts } from 'components/Playground/types'


export type Props = {
  contracts: Contracts
  isMaximized: boolean
  onChangeSize: () => void
}