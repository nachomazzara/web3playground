import React, { useContext, useState, useEffect } from 'react'

import { AppContext } from 'components/App'
import { RenameModal } from 'components/Modals'
import { removeFile } from 'libs/localstorage'
import { Props, File } from './types'

import './Files.css'

const divs: { div: HTMLDivElement; func: (e: MouseEvent) => void }[] = []

export default function Files(props: Props) {
  const { files, currentFile, handleFileSelected } = props
  const { refreshFiles } = useContext(AppContext)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fileToEdit, setFileToEdit] = useState(currentFile)

  function removeFileFromList(file: File) {
    removeFile(file)
    refreshFiles()
  }

  function selectFile(file: File) {
    handleFileSelected(file)
  }

  function toggleModal() {
    setIsModalOpen(!isModalOpen)
  }

  useEffect(() => {
    return function cleanup() {
      divs.forEach(({ div, func }) =>
        div.removeEventListener('contextmenu', func)
      )
    }
  }, [])

  return (
    <div className="Files">
      <div className="files-wrapper">
        {files.map(file => (
          <div
            key={file.id}
            className={`file ${
              currentFile && currentFile.id === file.id ? 'active' : ''
            }`}
            ref={div => {
              if (div && document.addEventListener) {
                const func = (e: MouseEvent) => {
                  setFileToEdit(file)
                  toggleModal()
                  e.preventDefault()
                }
                div.addEventListener('contextmenu', func, false)
                divs.push({ div, func })
              }
            }}
          >
            <button className="name" onClick={() => selectFile(file)}>
              {file.name}
            </button>
            <button className="close" onClick={() => removeFileFromList(file)}>
              x
            </button>
          </div>
        ))}
      </div>
      {isModalOpen && <RenameModal onClose={toggleModal} file={fileToEdit!} />}
    </div>
  )
}
