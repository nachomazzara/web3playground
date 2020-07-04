export type File = {
  id: string
  name: string
}

export type Props = {
  files: File[]
  currentFileId?: string
  handleFileSelected: (file: File) => void
}