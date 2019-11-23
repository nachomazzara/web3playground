import { Contracts } from 'components/Playground/types'

export type State = {
  code: string
  output: string | null
  error: string | null
  isRunning: boolean
  copyText: string
}

export type Props = {
  contracts: Contracts
}