const fs = require("fs");

import React from "react";
import moment from "moment";
import { LocaleProvider, Calendar } from "antd";
// LocaleProvider and en_GB used to show Monday first day of week
// by default it's Sun first day of the week :|
import en_GB from "antd/lib/locale-provider/en_GB";

import "antd/dist/antd.css";
import "../styles/calendar.css";

import { dirName } from "../../config";
import { getNewEvent, getModifiedEvent, setEvent } from "../stores/events";

const EventsCalendar = ({ allEvents, setDate, setFrontMatter, setContent }) => {
  const handleCalendarChange = (selectedDate) => {
    setDate(selectedDate);

    const event = setEvent({
      allEvents,
      selectedDate,
      isReading: true,
    });
    setFrontMatter(event.frontMatter);
    setContent(event.content);
  };

  const dateCellRender = (currentDate) => {
    return allEvents.map((event) => {
      if (event.date.isSame(currentDate, "day")) {
        return <section id={event.date} className="event-available" />;
      }
    });
  };

  const disabledDate = (current) => {
    // Can not select days after today
    return current.valueOf() > moment();
  };

  return (
    <LocaleProvider locale={en_GB}>
      <Calendar
        dateCellRender={dateCellRender}
        disabledDate={disabledDate}
        onChange={handleCalendarChange}
      />
    </LocaleProvider>
  );
};

export default EventsCalendar;
