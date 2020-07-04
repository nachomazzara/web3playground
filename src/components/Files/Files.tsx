import React, { useContext } from 'react'

import { AppContext } from 'components/App'
import { removeFile } from 'libs/localstorage'
import { Props, File } from './types'

import './Files.css'

export default function Files(props: Props) {
  const { files, currentFileId, handleFileSelected } = props
  const { refreshFiles } = useContext(AppContext)

  function removeFileFromList(file: File) {
    removeFile(file)
    refreshFiles()
  }

  function selectFile(file: File) {
    handleFileSelected(file)
  }

  return (
    <div className="Files">
      <div className="files-wrapper">
        {files.map(file => (
          <div
            key={file.id}
            className={`file ${currentFileId === file.id ? 'active' : ''}`}
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
    </div>
  )
}
