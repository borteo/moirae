const fs = require('fs')
const matter = require('gray-matter')
import moment, { utc } from 'moment'
import { encrypt, decrypt } from '../../main/helpers/crypto'
import { dirName, dateFormat } from '../../config'

const formatFrontMatter = (frontMatter) => {
  const text = ['---']
  for (const property in frontMatter) {
    text.push(`${property}: ${frontMatter[property]}`)
  }
  text.push('---')

  return text.join('\n')
}

const getNewEventContent = (date) => {
  const formattedDate = date.format(dateFormat)

  const frontMatter = {
    created: formattedDate,
    modified: formattedDate,
  }
  return [formatFrontMatter(frontMatter), '']
}

const getEventContent = (eventData) => {
  if (matter.test(eventData) === false) {
    console.error('this file does not contain a front matter')
    // show error ?
  }
  const { content, data } = matter(eventData)
  const { created, modified, ...rest } = data

  const frontMatter = {
    created: moment(created).utc().format(dateFormat),
    modified: moment(modified).utc().format(dateFormat),
    ...rest,
  }

  return [formatFrontMatter(frontMatter), content]
}

const updateDates = (frontMatter) => {
  const { _, data } = matter(frontMatter)
  data.created = moment(data.created).utc().format(dateFormat)
  data.modified = moment().format(dateFormat)

  return formatFrontMatter(data)
}

// ---- Exposed funcs ----

export const getAllEvents = () => {
  const files = fs.readdirSync(dirName)
  return files
    .map((file) => {
      const [date, extension] = file.split('.')
      return { date: moment(date), extension: extension, file }
    })
    .filter((file) => {
      return file.extension === 'md'
    })
}

export const deleteEvent = (allEvents, selectedDate) => {
  const existingEv = allEvents.find((event) => {
    return event.date.isSame(selectedDate, 'day')
  })

  // new event
  if (!existingEv) {
    return
  }

  // delete exisiting file
  const filePath = `${dirName}/${existingEv.file}`
  try {
    fs.unlinkSync(filePath)
    //file removed
  } catch (err) {
    console.error('error when deleting a file', err)
  }
}

export const saveEvent = ({ allEvents, date, frontMatter, content }) => {
  // I need to know the name of the file if it exists already
  const event = allEvents.find((evnt) => {
    return evnt.date.isSame(date, 'day')
  })

  let filePath

  if (!event) {
    // new event
    const fileName = date.format(dateFormat)
    filePath = `${dirName}/${fileName}.md`
  } else {
    // get existing event
    filePath = `${dirName}/${event.file}`
  }

  const updatedFrontMatter = updateDates(frontMatter)
  const newContent = updatedFrontMatter + content

  const encryptedContent = encrypt(newContent)

  fs.writeFile(filePath, encryptedContent, (err) => {
    if (err) {
      throw err
    }
    console.log(`${filePath} created or updated ✅`)
  })
}

export const getEvent = ({ allEvents, selectedDate }) => {
  let frontMatter, content

  const event = allEvents.find((evnt) => {
    return evnt.date.isSame(selectedDate, 'day')
  })

  if (!event) {
    // new event
    ;[frontMatter, content] = getNewEventContent(selectedDate)
  } else {
    // get existing event
    const filePath = `${dirName}/${event.file}`
    const data = fs.readFileSync(filePath, 'utf8')

    // decrypt the content
    // TODO: add a check here if data is not encrypted
    const decryptedData = decrypt(data)
    const isReading = true
    ;[frontMatter, content] = getEventContent(decryptedData, isReading)
  }

  return {
    frontMatter,
    content,
  }
}
