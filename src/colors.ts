import chalkModule from 'chalk'

import { ucfirst } from './utils.ts'

type StringMapper = (str: string) => string

let chalk: any = null

function getChalk() {
  if (chalk) return chalk
  chalk = new chalkModule.Instance({ level: 3 })
  return chalk
}

export function colorizer(cname: string): StringMapper {
  if (!cname) return (str: string) => str
  let chalk = getChalk()
  let colors = cname.trim().split(' ')
  let colorfunc = chalk
  for (let color of colors) {
    if (color.startsWith('/')) {
      color = color.substr(1)
      if (color.startsWith('#')) colorfunc = colorfunc.bgHex(color)
      else colorfunc = colorfunc['bg' + ucfirst(color)]
    } else {
      if (color.startsWith('#')) colorfunc = colorfunc.hex(color)
      else colorfunc = colorfunc[color]
    }
  }
  return colorfunc
}

export function colorize(cname: string, str: string): string {
  if (str == '' || cname == '') return str
  let colorfunc = colorizer(cname)
  return colorfunc(str)
}
