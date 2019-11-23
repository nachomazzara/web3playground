import React, { PureComponent } from 'react'
import MonacoEditor from 'react-monaco-editor'
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api'

// @ts-ignore
import editorTypes from '!!raw-loader!./editorTypes.d.ts'
// @ts-ignore
import defaultScript from '!!raw-loader!./defaultScript.js'

// import { saveLastUsedCode, getLastUsedCode } from 'lib/localStorage'
import { typeContractMethods } from 'libs/contract'
import { getWeb3Instance } from 'libs/web3'
import { isIOS } from 'libs/device'

import { Props, State } from './types'

import './Editor.css'

export const OUTPUT_HEADLINE = '/***** Output *****/\n'

export default class Editor extends PureComponent<Props, State> {
  textarea!: HTMLTextAreaElement
  textTimeout: number = 0

  constructor(props: Props) {
    super(props)

    this.state = {
      code: /* getLastUsedCode(props.index) || */ defaultScript,
      isRunning: false,
      output: null,
      error: null,
      copyText: 'Copy'
    }
  }

  editorWillMount = (monaco: typeof monacoEditor) => {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `${typeContractMethods(editorTypes, this.props.contracts!)}\n
      ${
        this.props.contracts[0]
          ? `declare var ${this.props.contracts[0].name}: Contract`
          : ''
      }`,
      'index.d.ts'
    )
  }

  editorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof monacoEditor
  ) => {
    const model = editor.getModel()
    if (model && model.getModeId() === 'typescript') {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
        // saveLastUsedCode(this.state.code)
        editor.trigger('format', 'editor.action.formatDocument', null)
      })
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.textTimeout)
  }

  handleExecuteCode = async () => {
    const { code } = this.state
    // @ts-ignore
    const { contracts } = this.props // contract should be available when evaluating the script
    // @ts-ignore
    const web3 = getWeb3Instance()

    if (contracts[0]) {
      //@TODO: change it
      window[contracts[0].name] = contracts[0].instance
    }

    // saveLastUsedCode(code, index)

    let output: string

    const setState = (...values: any) => {
      if (output === undefined) {
        output = ''
      }

      if (values.length > 1) {
        values.forEach(
          (value: any) => (output += JSON.stringify(value, null, 2) + '\n')
        )
      } else {
        output += JSON.stringify(values[0], null, 2) + '\n'
      }

      this.setState({ output })
    }

    try {
      this.setState({ isRunning: true, output: null, error: null })
      setState(
        await eval(`
       (function(){
          const console = {}

          console.log = function() {
            setState(...arguments)
          }
          ${code}
          return main()
        })()
      `)
      )

      this.setState({ isRunning: false })
    } catch (e) {
      this.setState({ error: e.stack, isRunning: false })
    }
  }

  handleCodeChange = (newValue: string) => {
    this.setState({ code: newValue })
  }

  handleResetCode = () => {
    this.handleCodeChange(defaultScript)
  }

  handleCopy = () => {
    this.setState({ copyText: 'Copied' })
    if (isIOS()) {
      const range = document.createRange()
      range.selectNodeContents(this.textarea)
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(range)
      }
      this.textarea.setSelectionRange(0, 999999)
    } else {
      this.textarea.select()
    }
    document.execCommand('copy')
    this.textTimeout = window.setTimeout(
      () => this.setState({ copyText: 'Copy' }),
      1000
    )
  }

  handleClearOutput = () => {
    this.setState({ output: null, error: null })
  }

  render() {
    const { code, output, isRunning, error, copyText } = this.state

    let outputValue = OUTPUT_HEADLINE

    if (isRunning) {
      outputValue = 'Running...'
    } else if (output) {
      outputValue = output
    } else if (error) {
      outputValue = error
    }

    return (
      <>
        <div className="Editor">
          <div className="code-wrapper">
            <div className="actions">
              <div className="col left">
                <button onClick={this.handleExecuteCode} title="Run">
                  <i className="icon run" />
                  {'Run'}
                </button>
              </div>
              <div className="col right">
                <button onClick={this.handleResetCode} title="Reset">
                  <i className="icon reset" />
                  {'Reset'}
                </button>
              </div>
            </div>
            <MonacoEditor
              language="typescript"
              theme="vs-dark"
              value={code}
              onChange={this.handleCodeChange}
              editorWillMount={this.editorWillMount}
              editorDidMount={this.editorDidMount}
              options={{
                automaticLayout: true,
                lineNumbers: 'off',
                minimap: { enabled: false },
                fontSize: 11
              }}
            />
          </div>
          <div className="output-wrapper">
            <div className="actions">
              <div className="col left">
                <button onClick={this.handleCopy} title="Copy">
                  <i className="icon copy" />
                  {copyText}
                </button>
              </div>
              <div className="col right">
                <button onClick={this.handleClearOutput} title="Clear">
                  <i className="icon reset" />
                  {'Clear'}
                </button>
              </div>
            </div>
            <MonacoEditor
              language="typescript"
              theme="vs-dark"
              value={outputValue}
              options={{
                readOnly: true,
                automaticLayout: true,
                lineNumbers: 'off',
                minimap: { enabled: false },
                fontSize: 10,
                folding: false
              }}
            />
          </div>
        </div>
        <textarea
          readOnly={true}
          className="no-visible"
          ref={textarea => {
            if (textarea) {
              this.textarea = textarea
            }
          }}
          value={outputValue}
        />
      </>
    )
  }
}
