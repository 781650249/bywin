import React from 'react';
import { connect } from 'dva';
import { Tabs, Row, Col, Popover } from 'antd';

const { TabPane } = Tabs;

@connect()
class ExpandedRow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: props.record.current,
    };
  }

  render() {
    const { record } = this.props;
    const { current, keyValue, selectedMultipleSearch } = record;
    const { activeKey } = this.state;
    return (
      <Tabs
        tabPosition="left"
        defaultActiveKey={current}
        onChange={(key) => this.setState({ activeKey: key })}
      >
        {Object.keys(keyValue).map((key) => (
          <TabPane
            tab={
              <span>
                <img
                  src={`data:image/jpeg;base64,${keyValue[key]}`}
                  alt=""
                  style={{
                    width: 40,
                    height: 40,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: activeKey === key ? '#1890ff' : '#fff',
                  }}
                />
              </span>
            }
            key={key}
          >
            <Row>
              <Col span={24}>
                {selectedMultipleSearch[key].map((item) => (
                  <Popover
                    placement="rightBottom"
                    content={
                      <img
                        src={item.imageUrl}
                        style={{ minHeight: 300, maxHeight: 500 }}
                        alt=""
                      />
                    }
                    trigger="hover"
                    key={item.id}
                  >
                    <img
                      src={item.imageUrl}
                      style={{
                        width: 50,
                        height: 50,
                        marginLeft: 10,
                        marginBottom: 5,
                      }}
                      alt=""
                    />
                  </Popover>
                ))}
              </Col>
            </Row>
          </TabPane>
        ))}
      </Tabs>
    );
  }
}

export default ExpandedRow;
