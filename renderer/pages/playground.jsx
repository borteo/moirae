import React from 'react';
import Head from 'next/Head';
import Link from 'next/Link';
import {
  Layout,
  Form,
  Select,
  InputNumber,
  DatePicker,
  Switch,
  Slider,
  Button,
  Result,
} from 'antd';

import 'antd/dist/antd.css';

const {
  Header,
  Content,
} = Layout;
const { Item: FormItem } = Form;
const { Option } = Select;

const Playground = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Wilson</title>
      </Head>
  
      <Header>
        <Link href="/wilson">
          <a>Go to next page</a>
        </Link>
      </Header>
  
      <Content style={{ padding: 48 }}>
        <Form layout='horizontal'>
          <FormItem
            label='Input Number'
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
          >
            <InputNumber size='large' min={1} max={10} style={{ width: 100 }} defaultValue={3} name='inputNumber' />
            <a href='#'>Link</a>
          </FormItem>
  
          <FormItem
            label='Switch'
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
          >
            <Switch defaultChecked name='switch' />
          </FormItem>
  
          <FormItem
            label='Slider'
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
          >
            <Slider defaultValue={70} />
          </FormItem>
  
          <FormItem
            label='Select'
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
          >
            <Select size='large' defaultValue='lucy' style={{ width: 192 }} name='select'>
              <Option value='jack'>jack</Option>
              <Option value='lucy'>lucy</Option>
              <Option value='disabled' disabled>disabled</Option>
              <Option value='yiminghe'>yiminghe</Option>
            </Select>
          </FormItem>
  
          <FormItem
            label='DatePicker'
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
          >
            <DatePicker name='startDate' />
          </FormItem>
          <FormItem
            style={{ marginTop: 48 }}
            wrapperCol={{ span: 8, offset: 8 }}
          >
            <Button size='large' type='primary' htmlType='submit'>
            OK
            </Button>
            <Button size='large' style={{ marginLeft: 8 }}>
            Cancel
            </Button>
          </FormItem>
        </Form>
        <Result
          status="success"
          title="Nextron"
          subTitle="with Ant Design"
        />
      </Content>
    </React.Fragment>
  );
};

export default Playground;