import React, { useState, useEffect, useRef } from 'react';
import { Collapse, Timeline, Row, Col, Avatar } from 'antd';
import { uniqBy } from 'lodash';
import { Viewer } from '@/components';
import { initMap, LngLat } from '@/utils/leafletMap';
import { getTrack } from '@/services/file/vehicle-file';
import Card from '../components/Card';
import styles from './index.less';

const { Panel } = Collapse;

export default function({ carNumber }) {
  const mapRef = useRef();
  const polylineLayer = useRef(L.layerGroup());
  const polylineDotLayer = useRef(L.featureGroup());
  const polylineArrowLayer = useRef(L.layerGroup());

  const [trackData, setTrackData] = useState([]);
  const [largeImgIndex, setLargeImgIndex] = useState(-1);

  useEffect(() => {
    const map = initMap('trailMap', { minZoom: 2 });
    polylineLayer.current.addTo(map);
    polylineDotLayer.current.addTo(map);
    polylineArrowLayer.current.addTo(map);
    mapRef.current = map;
  }, []);

  useEffect(() => {
    getTrack({ carPlate: carNumber }).then((data) => {
      setTrackData(data);
      polylineLayer.current.clearLayers();
      polylineArrowLayer.current.clearLayers();
      polylineArrowLayer.current.clearLayers();
      if (!mapRef.current || data.length === 0) return;
      const lnglats = data.map((item) => LngLat(item.lng, item.lat));
      // 设置轨迹点位
      const polyline = L.polyline(lnglats, {
        color: '#4751f1',
        weight: 10,
      });
      polylineLayer.current.addLayer(polyline);
      mapRef.current.fitBounds(lnglats);
      // 设置轨迹箭头
      polylineArrowLayer.current.addLayer(
        L.polylineDecorator(polyline, {
          patterns: [
            {
              repeat: 20,
              symbol: L.Symbol.arrowHead({
                pixelSize: 6,
                polygon: false,
                pathOptions: { color: '#fff', weight: 2, opacity: 0.65, stroke: true },
              }),
            },
          ],
        }),
      );
      uniqBy(lnglats, (el) => `${el.lng}${el.lat}`).forEach((lnglat) => {
        polylineDotLayer.current.addLayer(
          L.marker(lnglat, {
            icon: L.divIcon({
              html: `<div class="f-circle-marker"></div>`,
              className: '',
              iconSize: [4, 4],
              iconAnchor: [2, 2],
            }),
          }),
        );
      });
    });
  }, [carNumber]);

  return (
    <Card id="trail" title="轨迹记录" extra={`${trackData.length}条`}>
      <div className={styles.trailWrapper}>
        <div className={styles.trailMap} id="trailMap" />
        <div className={styles.trailPanel}>
          <Collapse ghost expandIconPosition="right">
            <Panel header="轨迹详情" key="1">
              <Timeline>
                {trackData.map((item, index) => (
                  <Timeline.Item key={index} dot={<span className={styles.dot}>{index + 1}</span>}>
                    <Row gutter={8} style={{ flexWrap: 'nowrap' }}>
                      <Col flex="64px">
                        <Avatar
                          shape="square"
                          size={64}
                          src={item.imageUrl}
                          onClick={() => {
                            setLargeImgIndex(index);
                          }}
                        />
                      </Col>
                      <Col flex="auto">
                        <p className={styles.trailPanelAddress}>{item.address}</p>
                        <p className={styles.trailPanelTime}>{item.time}</p>
                      </Col>
                    </Row>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Panel>
          </Collapse>
        </div>
      </div>
      <Viewer
        switching
        image={trackData[largeImgIndex] ? trackData[largeImgIndex].fullUrl : ''}
        onClose={() => {
          setLargeImgIndex(-1);
        }}
      />
    </Card>
  );
}
