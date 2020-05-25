const fs = require("fs");
const matter = require("gray-matter");
import moment from "moment";

import { dirName } from "../../config";

const getNewEvent = (date) => {
  const formattedDate = date.format("YYYY-MM-DD[T]HH:mm:ss[Z]");

  const frontMatter = `---
created: ${formattedDate}
modified: ${formattedDate}
---
`;

  return [frontMatter, ""];
};

const getModifiedEvent = ({ eventData, isReading = true }) => {
  if (matter.test(eventData) === false) {
    console.error("this file does not contain a front matter");
    // show error ?
  }
  const { content, data } = matter(eventData);

  // when saving, I should override the modified date
  const modifiedDate = isReading ? moment(data.modified).utc() : moment();

  const frontMatter = `---
created: ${moment(data.created).utc().format("YYYY-MM-DD[T]HH:mm:ss[Z]")}
modified: ${modifiedDate.format("YYYY-MM-DD[T]HH:mm:ss[Z]")}
---
`;
  return [frontMatter, content];
};

// ---- Exposed funcs ----

export const setEvent = ({ allEvents, selectedDate, isReading }) => {
  const existingEv = allEvents.find((event) => {
    return event.date.isSame(selectedDate, "day");
  });

  // new event
  if (!existingEv) {
    const creationDate = selectedDate.format("YYYY-MM-DD[T]HH:mm:ss[Z]");
    const [newFrontMatter, newContent] = getNewEvent(selectedDate);
    return {
      frontMatter: newFrontMatter,
      content: newContent,
      filePath: `${dirName}/${creationDate}.md`,
    };
  }

  // update existing event
  const filePath = `${dirName}/${existingEv.file}`;
  const data = fs.readFileSync(filePath, "utf8");
  const [frontMatter, content] = getModifiedEvent({
    eventData: data,
    isReading: isReading,
  });

  return {
    frontMatter: frontMatter,
    content: content,
    filePath: filePath,
  };
};

export const saveEvent = (allEvents, date, content) => {
  const event = setEvent({
    allEvents,
    selectedDate: date,
    isReading: false,
  });
  const newContent = event.frontMatter + content;

  fs.writeFile(event.filePath, newContent, (err) => {
    if (err) {
      throw err;
    }
    console.log(`${event.filePath} created or updated ✅`);
  });
};

export const getAllEvents = () => {
  const files = fs.readdirSync(dirName);
  return files
    .map((file) => {
      const [date, extension] = file.split(".");
      return { date: moment(date), extension: extension, file };
    })
    .filter((file) => {
      return file.extension === "md";
    });
};
