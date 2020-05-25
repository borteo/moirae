import React, { useState, useEffect } from "react";
import moment from "moment";
import marked from "marked";
import Head from "next/Head";
import Link from "next/Link";
import { Layout, Form, Input, Button, PageHeader } from "antd";

const { TextArea } = Input;
const { Item: FormItem } = Form;

const { Header, Content, Sider } = Layout;

import EventsCalendar from "../components/eventsCalendar";

import "antd/dist/antd.css";
import { saveEvent, getAllEvents } from "../stores/events";

const Home = () => {
  const [frontMatter, setFrontMatter] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(moment());
  const [allEvents, setAllEvents] = useState(getAllEvents());
  const [showPreview, setShowPreview] = useState(true);

  const handleSubmit = () => {
    saveEvent(allEvents, date, content);
    setAllEvents(getAllEvents());
  };

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handlePreviewMode = (mode) => {
    setShowPreview(mode);
  };

  return (
    <>
      <Head>
        <title>Wilson</title>
      </Head>

      <PageHeader
        title="Wilson"
        extra={[
          <Button
            key="1"
            type="primary"
            onClick={() => handlePreviewMode(true)}
          >
            Preview Mode
          </Button>,
          <Button key="2" onClick={() => handlePreviewMode(false)}>
            Edit Mode
          </Button>,
        ]}
      />
      <Layout>
        <Sider width={"50%"} collapsible collapsedWidth="350">
          <EventsCalendar
            allEvents={allEvents}
            setDate={setDate}
            setFrontMatter={setFrontMatter}
            setContent={setContent}
          />
        </Sider>
        <Layout>
          <Content style={{ padding: 15 }}>
            <Form layout="horizontal">
              {showPreview ? (
                <FormItem wrapperCol={{ span: 15, offset: 5 }}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: marked(content),
                    }}
                  />
                </FormItem>
              ) : (
                <>
                  <FormItem wrapperCol={{ span: 15, offset: 5 }}>
                    <TextArea rows={5} value={frontMatter} />
                  </FormItem>
                  <FormItem wrapperCol={{ span: 15, offset: 5 }}>
                    <TextArea
                      rows={20}
                      value={content}
                      onChange={handleChange}
                    />
                  </FormItem>
                  <FormItem
                    style={{ marginTop: 40 }}
                    wrapperCol={{ span: 15, offset: 5 }}
                  >
                    <Button
                      onClick={handleSubmit}
                      type="primary"
                      shape="round"
                      size="large"
                    >
                      Submit
                    </Button>
                    <Button size="large" style={{ marginLeft: 8 }}>
                      Cancel
                    </Button>
                  </FormItem>
                </>
              )}
            </Form>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Home;
