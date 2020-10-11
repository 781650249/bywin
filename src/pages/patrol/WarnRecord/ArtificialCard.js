import React, { useEffect, useState } from 'react';
import { Avatar, Divider, Empty } from 'antd';
import Icon, { RightOutlined, DownOutlined, PictureOutlined } from '@ant-design/icons';
import cx from 'classnames';
import ShallowMark from '@/assets/patrol/shallow-mark.png';
import styles from './index.less';

const staffSvg = () => (
  <svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor">
    <path
      d="M923.648 840.128c-2.24-15.872-4.8-29.056-7.808-39.424-5.952-17.792-16.384-32.192-31.232-43.328-14.848-11.136-31.744-20.224-50.752-27.264-18.944-6.976-38.656-13.312-59.072-18.816-20.416-5.568-39.168-11.648-56.32-18.368-19.328-7.424-34.368-15.872-45.184-25.536-10.752-9.6-18.56-19.776-23.36-30.528C645.184 626.176 642.368 615.68 641.664 605.248c-0.704-10.368 0-20.672 2.24-31.104C646.848 557.184 652.416 545.088 660.608 538.112 668.8 531.072 679.168 522.368 691.84 512c5.888-4.48 10.944-10.944 15.04-19.456 4.032-8.512 8-17.216 11.712-26.112 3.712-9.6 7.04-20.352 10.048-32.192 4.48-2.24 8.512-5.952 12.224-11.072 3.712-4.416 7.04-10.944 10.048-19.456 2.944-8.512 5.248-20.16 6.656-35.008 1.472-11.072 2.048-20.352 1.728-27.712-0.384-7.424-0.96-13.696-1.728-18.88-0.704-5.184-1.856-9.6-3.328-13.312-0.768-26.624-2.944-53.696-6.656-81.088-3.712-23.68-9.664-48.704-17.856-74.944C721.536 126.4 708.928 102.144 691.84 80c-7.424-9.6-14.336-17.024-20.608-22.208C664.896 52.544 658.56 49.024 652.224 47.168c-6.272-1.856-12.8-2.752-19.456-2.752L611.584 44.416c-5.184-5.184-10.24-10.368-15.04-15.552C591.68 23.68 585.92 19.264 579.2 15.552 572.544 11.84 563.776 8.704 553.024 6.08 542.272 3.52 528.32 1.472 511.232 0c-15.68 0-32 1.28-49.088 3.904C445.12 6.464 428.16 11.072 411.52 17.792 394.752 24.448 378.56 33.856 362.944 46.08 347.328 58.304 332.928 73.664 319.488 92.16 304.576 112.192 293.888 134.72 287.168 159.936c-6.656 25.152-11.52 48.512-14.464 69.952-3.008 25.92-4.48 51.84-4.48 77.76-2.944 5.952-4.8 12.928-5.568 21.12C261.12 335.36 260.928 343.36 262.08 352.64c1.088 9.28 3.52 19.776 7.296 31.616 3.712 11.84 7.04 20.928 9.984 27.2C282.304 417.792 284.928 422.784 287.168 426.496 290.176 430.144 292.352 432.768 293.888 434.24 296.832 446.08 300.16 456.832 303.872 466.432c3.712 8.896 7.616 17.6 11.712 26.112C319.68 501.056 324.672 507.584 330.624 512c11.136 9.6 21.376 18.816 30.656 27.776 9.28 8.832 14.656 21.44 16.128 37.76 0.704 11.072 1.088 21.12 1.088 30.016 0 8.896-1.664 17.408-4.992 25.536-3.328 8.128-8.96 16.256-16.704 24.384C349.056 665.6 338.048 674.176 323.968 683.008c-17.856 11.84-38.848 20.736-63.04 26.624-24.064 5.952-47.168 12.8-69.056 20.544-21.952 7.808-41.28 18.368-57.984 31.68-16.64 13.376-26.88 32.576-30.592 57.728-6.72 44.48-8.256 80.576-4.544 108.288 3.776 27.776 8.96 44.224 15.68 49.472 3.712 3.712 13.568 7.168 29.504 10.56 16 3.328 35.328 6.848 57.984 10.56 22.656 3.712 47.744 6.976 75.2 9.984 27.456 2.944 55.168 5.568 83.072 7.744 27.84 2.24 54.976 4.032 81.344 5.568C467.968 1023.232 491.2 1024 511.232 1024c20.096 0 43.456-0.576 70.208-1.728 26.752-1.088 54.272-2.944 82.496-5.568 28.224-2.624 56.448-5.76 84.736-9.472 28.224-3.712 53.824-7.552 76.864-11.648 23.04-4.032 42.176-8.512 57.408-13.312 15.232-4.864 24.768-9.856 28.48-14.976 5.248-7.424 9.088-18.368 11.712-32.832 2.624-14.4 3.904-29.824 3.904-46.08C927.04 872.192 925.952 856.128 923.648 840.128zM558.016 764.096c-5.888 11.84-10.944 21.312-15.04 28.288-4.032 7.04-8.32 12.416-12.8 16.064 2.24 7.424 4.864 17.408 7.808 30.016 3.008 12.608 5.824 25.536 8.384 38.912 2.624 13.312 4.992 25.344 7.296 36.032 2.24 10.752 3.328 18.368 3.328 22.784 0 3.712-1.664 8.32-4.992 13.824-3.328 5.568-7.424 10.752-12.224 15.552-4.8 4.864-9.856 9.088-15.04 12.8-5.248 3.712-9.664 5.568-13.376 5.568-3.712 0-8-1.856-12.864-5.568-4.8-3.712-9.472-8.32-13.952-13.888-4.416-5.568-8.32-10.88-11.712-16.128-3.392-5.184-4.992-9.6-4.992-13.376 0-5.888 0.96-14.592 2.752-26.048 1.92-11.52 4.096-23.68 6.72-36.672 2.624-12.992 5.44-25.536 8.32-37.824 3.008-12.224 5.184-21.632 6.72-28.288-4.48-4.48-8.512-10.56-12.224-18.368-3.712-7.744-8.256-16.832-13.376-27.2-2.24-3.712-2.432-7.744-0.576-12.224 1.856-4.48 4.288-8.576 7.232-12.288 3.008-4.416 7.104-9.28 12.224-14.4l51.264 0c5.248 5.12 9.664 9.984 13.376 14.4 3.712 4.48 6.464 9.088 8.384 13.888C560.512 755.008 560.32 759.68 558.016 764.096z"
      p-id="5760"
      fill="#66EAF8"
    />
  </svg>
);

export default function(props) {
  const { data, cardIndex } = props;
  const {
    xm,
    sjhm,
    taskStatus,
    startTime,
    endTime,
    uploadRecord,
    patrolInspectionClockLog = [],
    patrolInspectionLog = [],
  } = data;
  const [openKey, setOpenKey] = useState(null);
  useEffect(() => {}, []);

  const handleOpen = () => {
    if (openKey === cardIndex) {
      setOpenKey(null);
    } else {
      setOpenKey(cardIndex);
    }
  };

  /**
   * json字符串转数组
   * @param {String} str
   */
  const strToObject = (str) => {
    if (str) {
      return JSON.parse(str);
    }
    return [];
  };

  return (
    <div
      className={cx(styles.warnListCard, openKey === cardIndex ? styles.closeBg : styles.openBg)}
    >
      <div className={styles.firstRow}>
        <Icon component={staffSvg} />
        <span>{xm}</span>
        <span>{`(${sjhm})`}</span>
        <div
          className={cx(styles.cardTag, {
            [styles.blueTag]: taskStatus === '巡逻中',
            [styles.redTag]: taskStatus === '未巡逻',
            [styles.yellowTag]: taskStatus === '超时未完成',
            [styles.grayTag]: taskStatus === '已完成',
          })}
        >
          {taskStatus}
        </div>
      </div>
      <p>
        <span>开始时间：</span>
        <span>{startTime}</span>
      </p>
      <p>
        <span>结束时间：</span>
        <span>{endTime}</span>
      </p>
      <p>
        <span>上报记录：</span>
        <span>{uploadRecord}</span>
      </p>
      <div className={styles.linkBtn} onClick={() => handleOpen()}>
        <span>{openKey === cardIndex ? '收起详情' : '查看详情'}</span>
        {openKey === cardIndex ? <DownOutlined /> : <RightOutlined />}
      </div>

      {openKey === cardIndex && (
        <div className={styles.warnListCardOpen}>
          <p>巡逻路径</p>
          {patrolInspectionClockLog.map((item, index) => (
            <div className={styles.stepLine} key={index}>
              <Avatar shape="square" src={item.ygdkjt || null} size={60} icon={<PictureOutlined />} />
              <div
                className={styles.stepLineDesc}
                style={{ border: patrolInspectionClockLog.length - 1 === index ? 0 : null }}
              >
                <div className={styles.stepLineDescAddress} title={item.azdd}>
                  {item.azdd}
                </div>
                <p>{item.clockTime}</p>
                <div className={styles.numMarkImg}>
                  <img style={{ width: '100%', height: '100%' }} src={ShallowMark} alt="" />
                  <span className={styles.serialNum}>{index + 1}</span>
                </div>
              </div>
            </div>
          ))}
          {patrolInspectionLog.length !== 0 && <Divider style={{ margin: '8px 0' }} />}
          {patrolInspectionLog.map((item, index) => (
            <div key={index} className={styles.reportRecord}>
              <div className={styles.reportRecordTitle}>
                <div style={{ display: 'flex' }}>
                  <div className={styles.reportRecordTitleMark}>{index + 1}</div>
                  <span>{item.abnormalTheme}</span>
                </div>
                <img style={{ width: 11, height: 15 }} src={ShallowMark} alt="" />
              </div>
              <div className={styles.reportRecordImgs}>
                {strToObject(item.imagesUrl).map((url, i) => (
                  <img
                    style={{ width: 64, height: 64, marginRight: 12 }}
                    src={url}
                    key={i}
                    alt=""
                  />
                ))}
              </div>
              <p>
                <span>详情：</span>
                <span>{item.abnormalContent}</span>
              </p>
              <p>
                <span>发生地点：</span>
                <span>{item.site}</span>
              </p>
              <p>
                <span>发生时间：</span>
                <span>{item.abnormalTime}</span>
              </p>
            </div>
          ))}
          {patrolInspectionClockLog.length === 0 && <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无巡逻路径"
            style={{ margin: '20px 0' }}
          />}
        </div>
      )}
    </div>
  );
}
