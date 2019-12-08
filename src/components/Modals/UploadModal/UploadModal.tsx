import React, { useState, useEffect } from 'react'

import { isIOS } from 'libs/device'
import { upload } from 'libs/ipfs'
import Modal from '../Modal'
import { Props } from './types'

import './UploadModal.css'

export default function UploadModal(props: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [ipfsHash, setIPFSHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copyText, setCopyText] = useState('Copy')
  let textareaRef: HTMLTextAreaElement

  function handleCopy() {
    setCopyText('Copied')

    if (isIOS()) {
      const range = document.createRange()
      range.selectNodeContents(textareaRef)
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(range)
      }
      textareaRef.setSelectionRange(0, 999999)
    } else {
      textareaRef.select()
    }

    document.execCommand('copy')

    window.setTimeout(() => setCopyText('Copy'), 1000)
  }

  async function handleUpload() {
    setIsLoading(true)
    const { IpfsHash, error } = await upload()
    if (error) {
      setIPFSHash(null)
      setError(error)
    } else {
      setIPFSHash(IpfsHash)
      setError(null)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    handleUpload()
  }, [])

  const hashLink = `${window.location.origin}/${ipfsHash}`

  return (
    <Modal onClose={props.onClose} className="UploadModal">
      {isLoading && <p>Uploading...</p>}
      {ipfsHash && (
        <div>
          <p>{hashLink}</p>
          <textarea
            readOnly={true}
            className="no-visible"
            ref={textarea => {
              if (textarea) {
                textareaRef = textarea
              }
            }}
            value={hashLink}
          />
          <button onClick={handleCopy}>{copyText}</button>
        </div>
      )}
      {error && (
        <div>
          <p className="error">{error}</p>
          <button onClick={handleUpload}>Try again</button>
        </div>
      )}
    </Modal>
  )
}
