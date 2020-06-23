const fs = require('fs')


const formatContent = (data) => (
  `---
created: ${data.creationDate}
modified: ${data.modifiedDate}
type: Journal
---

${data.text}

${data.photos && data.photos[0].md5 ? '![](/photos/' + data.photos[0].md5 +'.'+ data.photos[0].type +'?raw=true)' : ''}
  `
)

const generateFiles = (entries) => {
  entries.map(entry => {
    const { creationDate } = entry

    // format 2020-04-12T20/23/32Z
    const dirName = creationDate.split('-')[0]
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName)
    }

    const content = formatContent(entry)

    fs.writeFile(`${__dirname}/${dirName}/${creationDate}.md`, content, (err) => {
      if (err) {
          throw err
      }
      console.log(`${creationDate}.md created ✅`)
    })
  })
  
}

const parseFile = (err, data) => {
  if (err) {
    throw err
  }
  const array = JSON.parse(data)

  if (!array || !array.entries) {
    throw new Error('Entries not available')
  }

  generateFiles(array.entries)
}

fs.readFile(`${__dirname}/Journal.json`, 'utf8', parseFile);