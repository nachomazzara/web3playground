export type File = {
  id: string
  name: string
}

export type Props = {
  files: File[]
  currentFile?: File
  handleFileSelected: (file: File) => void
}