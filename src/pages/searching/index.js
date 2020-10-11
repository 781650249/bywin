import React, { Component } from 'react';
import { connect } from 'dva';
// import { isEqual, orderBy } from 'lodash';
import { Spin } from 'antd';
import { imageCorrect } from '@/utils/previous/tools';
import Map from './Map';
import SearchPanel from './SearchPanel';
import PictureList from './PictureList';
import MultSearch from './MultSearch';
import TrackDetails from './TrackDetails';
import Reconfirm from './Reconfirm';
import { Record, AddRecord } from './Record';
import styles from './index.less';

@connect(({ searching, searchPanel }) => {
  const { loading } = searching;
  const { content,
    faceContent } = searchPanel;
  return { loading, content,
    faceContent };
})
class Searching extends Component {
  componentDidMount() {
    const { dispatch, location, content, faceContent } = this.props;
    if (location.state instanceof Object) {
      imageCorrect(location.state.imageUrl, (base64) => {

        if (location.state.type === 'person') {
          dispatch({
            type: 'searchPanel/setState',
            payload: {
              faceContent: [base64.replace(/^data:image\/(jpeg|png|gif);base64,/, ''), ...faceContent]
            }
          })
        } else {
          dispatch({
            type: 'searchPanel/setState',
            payload: {
              content: [base64.replace(/^data:image\/(jpeg|png|gif);base64,/, ''), ...content]
            }
          })
        }
      });
    }

    // const { params } = location;
    // if (params instanceof Object) {
    //   const { plateNumber, type = 0, id } = params;
    //   dispatch({
    //     type: 'searchPanel/setState',
    //     payload: {
    //       plateNumber,
    //       keyPersonParams: {
    //         type,
    //         id,
    //       },
    //     },
    //   });
    //   dispatch({
    //     type: 'reconfirm/setState',
    //     payload: {
    //       visible: true,
    //       content: content || [],
    //       faceContent: faceContent || [],
    //       selectedContent: content || [],
    //       selectedFaceContent: faceContent || [],
    //     },
    //   });
    // }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'searching/clear' });
    dispatch({ type: 'searchingMap/reset' });
    dispatch({ type: 'searchPanel/clear' });
    dispatch({ type: 'pictureUpload/clear' });
    dispatch({ type: 'incrementalSearch/clear' });
  }

  render() {
    const { loading } = this.props;
    return (
      <Spin spinning={loading}>
        <div className={styles.wrap}>
          <Map />
          <SearchPanel />
          <PictureList />
          <MultSearch />
          <TrackDetails />
          <Reconfirm />
          <Record />
          <AddRecord />
        </div>
      </Spin>
    );
  }
}
export default Searching;
