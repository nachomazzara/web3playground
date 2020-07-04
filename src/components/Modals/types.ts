import { ReactNode } from 'react'

export type Props = {
  onClose: () => void
  className?: string
  children?: ReactNode
  title?: string
}