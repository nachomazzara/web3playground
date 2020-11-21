/* eslint import/no-webpack-loader-syntax: off */
// @ts-ignore
import web3Types from '!!raw-loader!./web3EditorTypes.d.ts'
/* eslint import/no-webpack-loader-syntax: off */
// @ts-ignore
import ethersTypes from '!!raw-loader!./ethersTypes.d.ts'
// @ts-ignore
import ethersBigNumberTypes from '!!raw-loader!./ethersBignumberTypes.d.ts'
/* eslint import/no-webpack-loader-syntax: off */
/* eslint import/no-webpack-loader-syntax: off */
// @ts-ignore
import web3DefaultScript from '!!raw-loader!./web3DefaultScript.js'
/* eslint import/no-webpack-loader-syntax: off */
// @ts-ignore
import ethersDefaultScript from '!!raw-loader!./ethersDefaultScript.js'

import { LIB } from '../../../constants'

export function getEditorTypes(library: LIB): string {
  switch (library) {
    case LIB.WEB3:
      return web3Types
    case LIB.ETHERS:
      return ethersBigNumberTypes.concat(ethersTypes)
    default:
      return ''
  }
}

export function getDefaultScript(library: LIB): string {
  switch (library) {
    case LIB.WEB3:
      return web3DefaultScript
    case LIB.ETHERS:
      return ethersDefaultScript
    default:
      return ''
  }
}
