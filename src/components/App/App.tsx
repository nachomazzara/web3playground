import React, { useState, useEffect, useCallback } from 'react'

import { AppContext } from './AppContext'
import Etherjslayground from 'components/Playground/EtherjsPlayground'
import Files from 'components/Files'
import { File } from 'components/Files/types'
import { saveFile, getFiles, getFileFromHash } from 'libs/localstorage'

export default function App() {
  const [files, setFiles] = useState<File[]>(getFiles())
  const [isMaximized, setIsMaximized] = useState(false)
  const [currentFile, setCurrentFile] = useState<File>()

  function selectFile(file: File) {
    setCurrentFile(file)
  }

  const refreshFiles = useCallback((file?: File) => {
    setFiles(getFiles())
    if (file) {
      setCurrentFile(file)
    }
  }, [])

  // Component will mount
  useEffect(() => {
    const paths = window.location.pathname.split('/').splice(1)
    const hash = paths[0]
    if (hash) {
      const file = getFileFromHash(hash)

      setCurrentFile(file)
      saveFile(file)
      refreshFiles()
    }
  }, [refreshFiles])

  function handleToggleMaximizeEditor() {
    setIsMaximized(!isMaximized)
  }

  return (
    <AppContext.Provider value={{ refreshFiles }}>
      <div className={`${isMaximized ? 'maximized' : ''}`}>
        <Files
          files={files}
          currentFile={currentFile}
          handleFileSelected={selectFile}
        />
        <Etherjslayground
          fileId={currentFile ? currentFile.id : undefined}
          isMaximized={isMaximized}
          handleToggleMaximizeEditor={handleToggleMaximizeEditor}
        />
      </div>
    </AppContext.Provider>
  )
}
