import React from 'react';
import { Form, Input, DatePicker, Button } from 'antd';

const { RangePicker } = DatePicker;
const { Item: FormItem } = Form;

const Search = (props) => {
  const { onSearch } = props;

  const serach = (values) => {
    onSearch(values);
  };

  return (
    <Form layout="inline" onFinish={serach} >
      <FormItem label="研判名称" name="videoReseachName">
      <Input style={{ width: 200 }} autoComplete="off" />
      </FormItem>
      <FormItem label="案件名称" name="actionName">
        <Input style={{ width: 200 }} autoComplete="off" />
      </FormItem>
      <FormItem label="时间" name="time">
        <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="MM.DD HH:mm"
            placeholder={['开始时间', '结束时间']}
            style={{ width: 250 }}
          />
      </FormItem>
      <FormItem>
        <Button type="primary" htmlType="submit">
          搜索
        </Button>
      </FormItem>
    </Form>
  );
};

export default Search;
