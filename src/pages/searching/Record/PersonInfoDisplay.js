import React from 'react';
import { connect } from 'dva';
import { Popover, List, Avatar } from 'antd';

const PersonInfoDisplay = (props) => {
  const { dispatch, children, data = [] } = props;
  const handleVisibleChange = (visible) => {
    if (!visible) {
      dispatch({
        type: 'record/changeState',
        payload: {
          personInfoList: [],
        },
      })
    }
  };
  return (
    <Popover
      trigger="click"
      content={
        <div style={{ minWidth: 320, maxHeight: 500 }}>
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={<a>{item.name}</a>}
                  description={
                    <div>
                      <div>
                        身份证：
                        {item.idCard}
                      </div>
                      <div>
                        地址：
                        {item.address}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      }
      onVisibleChange={handleVisibleChange}
    >
      {children}
    </Popover>
  );
};

export default connect(({ record }) => {
  const { personInfoList } = record;
  return {
    data: personInfoList,
  };
})(PersonInfoDisplay);
