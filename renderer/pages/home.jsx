import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { useHotkeys } from 'react-hotkeys-hook'
import marked from 'marked'
import Head from 'next/Head'
import { Layout, Form, Input, Button, Tag, Divider, PageHeader, Switch } from 'antd'
import { EyeOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { Item: FormItem } = Form

const { Content, Sider } = Layout

import EventsCalendar from '../components/eventsCalendar'

import 'antd/dist/antd.css'
import { deleteEvent, saveEvent, getAllEvents } from '../stores/events'

const tags = ['activity', 'book', 'documentary', 'event', 'film', 'series']

const Home = () => {
  const [frontMatter, setFrontMatter] = useState({})
  const [content, setContent] = useState('')
  const [date, setDate] = useState(moment())
  const [allEvents, setAllEvents] = useState(getAllEvents())
  const [showPreview, setShowPreview] = useState(true)

  // ==================
  // Keyboard Shortcuts
  // ==================
  // TODO: they don't work when focusing on the textarea
  useHotkeys('cmd+s', () => {
    handleSubmit()
  })
  useHotkeys('cmd+/', () => {
    setShowPreview((prevMode) => !prevMode)
  })
  // ==================

  const handleSubmit = () => {
    saveEvent({ allEvents, date, frontMatter, content })
    setAllEvents(getAllEvents())
  }

  const handleCancel = () => {
    setContent()
  }

  const handleDelete = () => {
    const response = confirm('Are you sure you want to delete it?')
    if (!response) {
      return
    }
    setContent()
    deleteEvent(allEvents, date)
    setAllEvents(getAllEvents())
  }

  // change main textarea
  const handleChange = (event) => {
    setContent(event.target.value)
  }

  // change front matter textarea
  const handleFrontMatterChange = (event) => {
    setFrontMatter(event.target.value)
  }

  const handleSwitchMode = () => {
    setShowPreview(!showPreview)
  }

  return (
    <>
      <Head>
        <title>Moriræ</title>
      </Head>

      <PageHeader
        title="Moriræ"
        extra={[
          <Switch
            checked={showPreview}
            checkedChildren={<EyeOutlined />}
            onChange={handleSwitchMode}
          />,
        ]}
      />
      <Layout>
        <Sider width={'50%'} collapsible collapsedWidth="350">
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
                    style={{ fontSize: '1.25em' }}
                    dangerouslySetInnerHTML={{
                      __html: marked(content),
                    }}
                  />
                </FormItem>
              ) : (
                <>
                  <FormItem wrapperCol={{ span: 15, offset: 5 }}>
                    <TextArea
                      style={{ fontSize: '1.15em' }}
                      rows={5}
                      value={frontMatter}
                      onChange={handleFrontMatterChange}
                    />
                    <div>
                      tags:{' '}
                      {tags.map((tag) => {
                        return <Tag>{tag}</Tag>
                      })}
                    </div>
                  </FormItem>
                  <FormItem wrapperCol={{ span: 15, offset: 5 }}>
                    <TextArea
                      style={{ fontSize: '1.15em' }}
                      rows={20}
                      value={content}
                      onChange={handleChange}
                    />
                  </FormItem>
                  <FormItem style={{ marginTop: 40 }} wrapperCol={{ span: 15, offset: 5 }}>
                    <Button onClick={handleSubmit} type="primary" shape="round" size="large">
                      Submit
                    </Button>
                    <Button onClick={handleCancel} size="large" style={{ marginLeft: 8 }}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDelete}
                      type="primary"
                      danger
                      size="large"
                      style={{ marginLeft: 8 }}
                    >
                      Delete
                    </Button>
                  </FormItem>
                </>
              )}
            </Form>
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default Home
