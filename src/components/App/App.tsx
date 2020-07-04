import React, { useState, useEffect, useCallback } from 'react'

import { AppContext } from './AppContext'
import Playground from 'components/Playground'
import Files from 'components/Files'
import { File } from 'components/Files/types'
import { saveFile, getFiles } from 'libs/localstorage'

export default function App() {
  const [files, setFiles] = useState<File[]>(getFiles())
  const [isMaximized, setIsMaximized] = useState(false)
  const [currentFileId, setCurrentFileId] = useState<string>()

  function selectFile(file: File) {
    setCurrentFileId(file.id)
  }

  const refreshFiles = useCallback(() => {
    setFiles(getFiles())
  }, [])

  // Component will mount
  useEffect(() => {
    const paths = window.location.pathname.split('/').splice(1)
    const hash = paths[0]
    if (hash) {
      setCurrentFileId(hash)
      saveFile({ name: hash, id: hash })
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
          currentFileId={currentFileId}
          handleFileSelected={selectFile}
        />
        <Playground
          fileId={currentFileId}
          isMaximized={isMaximized}
          handleToggleMaximizeEditor={handleToggleMaximizeEditor}
        />
      </div>
    </AppContext.Provider>
  )
}
