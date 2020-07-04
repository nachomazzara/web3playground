import React, { useContext, useState } from 'react'

import { AppContext } from 'components/App'
import { RenameModal } from 'components/Modals'
import { removeFile } from 'libs/localstorage'
import { Props, File } from './types'

import './Files.css'

export default function Files(props: Props) {
  const { files, currentFile, handleFileSelected } = props
  const { refreshFiles } = useContext(AppContext)
  const [isModalOpen, setIsModalOpen] = useState(false)

  function removeFileFromList(file: File) {
    removeFile(file)
    refreshFiles()
  }

  function selectFile(file: File) {
    handleFileSelected(file)
  }

  if (document.addEventListener) {
    document.addEventListener(
      'contextmenu',
      function(e) {
        toggleModal()
        e.preventDefault()
      },
      false
    )
  }

  function toggleModal() {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <div className="Files">
      <div className="files-wrapper">
        {files.map(file => (
          <div
            key={file.id}
            className={`file ${
              currentFile && currentFile.id === file.id ? 'active' : ''
            }`}
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
      {isModalOpen && <RenameModal onClose={toggleModal} file={currentFile!} />}
    </div>
  )
}
