const fs = require('fs')
const { parse } = require('plist')
const { Command } = require('commander')
const program = new Command()

program
  .name('plist2ahk')
  .description('Converter for aText .plist files to AutoHotkey .ahk files')
  .version('0.1.0')

program
  .requiredOption('-i, --input <plistFile>', 'A .plist file exported from aText is needed')
  .requiredOption('-o, --output <ahkFile>', 'A file path for the new .ahk file is needed')
  .option('-b, --base <baseAhkFile>', 'You can provide a base .ahk that the new shortkeys will be appended to')

program.parse()

const options = program.opts()

const readFile = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

const saveFileWithBom = (file, contents) => {
  return new Promise((resolve, reject) => {
    const contentsWithBom = contents.indexOf("\ufeff") !== 0 ? "\ufeff" + contents : contents
    fs.writeFile(file, contentsWithBom, (err) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

readFile(options.input)
  .then(aTextData => parse(aTextData))
  .then(async hotkeys => {
    const hotkeyBase = options.base ? await readFile(options.base) : ''
    const convertedHotkeys = hotkeys.map(({ phrase, shortcut }) => '::' + shortcut + '::\n(\n' + phrase + '\n)')
    const combinedHotkeys = hotkeyBase + '\n' + convertedHotkeys.join('\n')
    return saveFileWithBom(options.output, combinedHotkeys)
  })
  .catch(err => console.error(err.message))
