/**
 * @Author Daniel Belohlavek
 * @Gitub https://github.com/belohlavek
 * With love to Nacho
 */

const fs = require('fs-extra')
const prettier = require('prettier')
const DEBUG = true
function log(...args) {
  if (DEBUG) console.log(...args)
}
const reserved = [
  'console',
  'crypto',
  'debugger',
  'dns',
  'domain',
  'errors',
  'events',
  'fs',
  'globals',
  'http',
  'http/2',
  'https',
  'inspector',
  'modules',
  'net',
  'os',
  'path',
  'perf_hooks',
  'process',
  'punycode',
  'querystring',
  'readline',
  'repl',
  'stream',
  'string_decoder',
  'timers',
  'tls',
  'tracing',
  'tty',
  'dgram',
  'url',
  'utilities',
  'v8',
  'vm',
  'zlib'
]
const resolved = new Set()
const initialPath = process.argv[2]
const targetPath = process.argv[3]
async function parseImports(path) {
  log('Attempting to read', path)
  let file = await fs.readFile(path, 'utf8')
  file = prettier.format(file, {
    semi: false,
    singleQuote: true,
    printWidth: 340,
    parser: 'typescript'
  })
  const lines = file.split('\n')
  log('Got lines', lines.length, 'for', path)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    let matches
    if (line.includes('require(')) {
      // The main RegEX doesn't match the import X = require('y.js') syntax y soy un vago
      matches = /require\(?["'\s]*([@\w/\._-]+)["'\s]\)/g.exec(line)
    } else {
      matches = /import(?:["'\s]*[\w*{}\n, ]+from\s*)?["'\s]*([@\w/_-]+)["'\s].*/m.exec(
        line
      )
    }
    const modulePath = matches ? matches[1] : null
    if (modulePath === 'net') debugger
    if (modulePath) {
      // Keep only one instance of serverved stuff
      if (reserved.includes(modulePath)) {
        if (!resolved.has(modulePath)) {
          resolved.add(modulePath)
        } else {
          lines[i] = '\n'
        }
        continue
      }
      log('Matched', modulePath, 'for', line, 'at', path)
      let nextPath = modulePath
      if (!modulePath.startsWith('.')) {
        let packagePath
        try {
          packagePath = require.resolve(`${modulePath}/package.json`)
        } catch (e) {
          log(`ERROR!!!!!!!!!!!!!!! ${e.message}`)
          continue
        }
        const packageFile = await fs.readFile(packagePath, 'utf8')
        const packageJson = JSON.parse(packageFile)
        if (packageJson.types) {
          const typingsPath = `${modulePath}/${packageJson.types}`
          log('Found typings for', modulePath, 'at', typingsPath)
          nextPath = typingsPath
        } else {
          // fuck this
          const atTypesPath = `@types/${modulePath}/index.d.ts`
          log('Last try searching at @types for', modulePath, atTypesPath)
          const exists = await fs.pathExists(require.resolve(atTypesPath))
          if (!exists) {
            log('Giving up on ', modulePath)
            // I give up
            continue
          }
          log('Found @types for', modulePath, atTypesPath)
          nextPath = atTypesPath
        }
      }
      log('Found module path', nextPath)
      const absolutePath = require.resolve(nextPath)
      log('Found absolute module path', absolutePath)
      if (!resolved.has(absolutePath)) {
        resolved.add(absolutePath)
        const v = await parseImports(absolutePath)
        lines[i] = v
      } else {
        lines[i] = '\n'
      }
    }
  }
  return lines.join('\n')
}
parseImports(initialPath).then(out => {
  // const pretty = out.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '').trim()
  const newOut = out
    .replace(/export declare/g, 'declare')
    .replace(/export class/g, 'declare class')
    .replace(/export interface/g, 'declare interface')
    .replace(/export default/g, 'declare')
    .replace(/export type/g, 'declare type')
    .replace(/export function/g, 'declare function')
    .replace(/methods: any/g, 'contractMethods')
    .replace(/^.*import .*$/gm, '')
    .replace(/^.*export =.*$/gm, '')
    .replace(/^.*export {.*$/gm, '')
    .replace(/(\r\n|\r|\n){2,}/g, '$1\n')
    .concat('\ndeclare var web3: Web3\n')

  fs.writeFile(targetPath, newOut, 'utf8')
})
