import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './index.less';

let chart = null;

function RelationMap(props) {
  const { relationChartData, dispatch } = props;
  const local = useRef();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const handleItemClick = (e) => {
    e.stopPropagation();
    const { newValue = {} } = e;
    const { source, target } = newValue;
    if (source && target) {
      dispatch({
        type: 'discover/getTrajectoryByPidtx',
        payload: {
          pid: source.pid,
          pidtx: target.pid,
        },
      });
      dispatch({
        type: 'discover/setState',
        payload: {
          selectedPeerList: { ...newValue, source: { ...source }, target: { ...target } },
        },
      });
    }else {
      const { pid } = newValue;
      router.push(`/discover/${pid}`);
    }
  };

  useEffect(() => {
    if (Object.keys(relationChartData).length === 0) return;
    const { RelationChart } = window;
    const { links: mapLinks, nodes: mapNodes } = relationChartData;
    let nodes = [];
    let links = [];
    if (links && nodes) {
      mapNodes.forEach((item, index) => {
        nodes = [
          ...nodes,
          {
            name: '',
            avatar: item.avatar,
            role_id: Number(index),
            pid: item.pid,
          },
        ];
      });
      mapLinks.forEach((item) => {
        links = [
          ...links,
          {
            target: item.target,
            source: item.source,
            relation: item.relation,
            color: '734646',
          },
        ];
      });
      const data = {
        nodes,
        links,
      };

      const element = document.querySelector('#relationChartId');
      element.innerHTML = '';
      new Promise((resolve) => {
        setWidth(document.getElementById('relation-box').offsetWidth);
        setHeight(document.getElementById('relation-box').offsetHeight);
        resolve(chart);
      }).then(() => {
        chart = new RelationChart(element, data, {
          alphaDecay: 0.999,
          chargeStrength: 0,
          collide: 120,
          relFontSize: 14,
        });
        const elems = document.querySelectorAll('.rect_g');
        const edge = document.querySelectorAll('.edge');
        if (elems) {
          for (let i = 0; i < elems.length; i += 1) {
            elems[i].lastChild.style.fontSize = '14px';
            elems[i].lastChild.style.fontWeight = '600';
          }
        }
        if (edge) {
          for (let i = 0; i < elems.length; i += 1) {
            elems[i].style.cursor = 'pointer';
          }
        }

        local.current = localStorage.setItem;
        // const orignalSetItem = localStorage.setItem;
        localStorage.setItem = function fn(key, newValue) {
          const setItemEvent = new Event('setItemEvent');
          setItemEvent.key = key;
          setItemEvent.newValue = newValue;
          window.dispatchEvent(setItemEvent);
          // eslint-disable-next-line prefer-rest-params
          // orignalSetItem.apply(this, arguments);
        };
        window.addEventListener('setItemEvent', handleItemClick);
      });
    }
    return () => {
      localStorage.setItem = local.current;
      window.removeEventListener('setItemEvent', handleItemClick);
    };
  }, [relationChartData]);

  return (
    <div className={styles.containerWrap} id="relation-box">
      <div id="relationChartId" style={{ width, height }} />
    </div>
  );
}

export default connect(({ discover }) => {
  const { relationChartData } = discover;
  return {
    relationChartData,
  };
})(RelationMap);
