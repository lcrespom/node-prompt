import { gitStatus, gitStatusFlags } from './git-status.ts'
import { colorize } from './colors.ts'
import { ucfirst } from './utils.ts'
import { colors, promptConfig } from './settings.ts'

type PromptInput = {
  cwd: string
  username: string
  hostname: string
}

const GIT_SYMBOL = '\ue0a0'

async function gitSection() {
  let gstatus = await gitStatus()
  if (!gstatus) return ''
  let flags = gitStatusFlags(gstatus, { unicode: promptConfig.powerFont as boolean })
  if (flags) flags = ' ' + flags
  let gitColor = gstatus.dirty ? colors.gitDirty : colors.gitClean
  let gitSymbol = promptConfig.powerFont ? GIT_SYMBOL + ' ' : ''
  let status = ' (' + gitSymbol + gstatus.branch + flags + ') '
  return colorize(gitColor, status)
}

function cutDirName(dirName: string, maxLength: number, ellipsis: string) {
  let suffixLen = ellipsis ? ellipsis.length : 0
  if (dirName.length <= maxLength + suffixLen) return dirName
  dirName = dirName.substring(0, maxLength)
  if (ellipsis) dirName += ellipsis
  return dirName
}

function makePath(cwd: string) {
  let dirs = cwd.split('/')
  let leafDir = dirs[dirs.length - 1]
  let maxLen = promptConfig.parentDirMaxLen as number
  let ellipsis = promptConfig.parentDirEllipsis as string
  if (maxLen) {
    dirs = dirs.map(d => (d == leafDir ? d : cutDirName(d, maxLen, ellipsis)))
  }
  let maxDirs = promptConfig.maxDirs as number
  let prefix = promptConfig.maxDirEllipsis as string
  if (maxDirs && maxDirs < dirs.length) {
    dirs = dirs.slice(dirs.length - maxDirs, dirs.length)
    if (prefix) dirs = [prefix, ...dirs]
  }
  return dirs.join('/')
}

function segment(name: string, value: string) {
  if (!promptConfig['show' + ucfirst(name)]) return ''
  return colorize(colors[name], value)
}

async function prompt({ cwd, username, hostname }: PromptInput) {
  let userAtHost = segment('user', username) + segment('at', '@')
  if (promptConfig.showHost) {
    userAtHost += colorize(colors.host, hostname)
  }
  let path = ''
  if (promptConfig.showPath) path = colorize(colors.path, makePath(cwd))
  let git = ''
  if (promptConfig.showGit) git = (await gitSection()) || ''
  return userAtHost + ' ' + path + git
}

async function main() {
  let cwd = process.env.PWD || '($PWD not found)'
  let home = process.env.HOME || '($HOME not found)'
  if (cwd.startsWith(home)) cwd = '~' + cwd.substring(home.length)
  let username = process.env.USER || '($USER not found)'
  let hostname = process.env.HOST || '($HOST not found)'
  console.log(await prompt({ cwd, username, hostname }))
}

main()
