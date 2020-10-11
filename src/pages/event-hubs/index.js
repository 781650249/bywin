import React from 'react';
import HeaderBar from './HeaderBar'
import EventList from './EventList'
import styles from './index.less';

function VideoArchives({ history, location }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.info}>
        <HeaderBar history={history} location={location} />
      </div>
      <div className={styles.container}>
        <EventList history={history} location={location} />
      </div>
    </div>
  )
}

export default VideoArchives
