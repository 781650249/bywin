import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'dva';

let chart = null;
export default function() {
  const dispatch = useDispatch();
  const local = useRef();
  const [ width, setWidth ] = useState(0);
  const [ height, setHeight ] = useState(0);
  const { gxObject = {} } = useSelector(({ profile }) => profile, shallowEqual);

  const handleItemClick = (e) => {
    e.stopPropagation();
    const { newValue = {} } = e;
    const { source, target } = newValue;
    if (source && target) {
      dispatch({
        type: 'profile/getTrajectoryByPidtx',
        payload: {
          pid: source.pid,
          pidtx: target.pid,
        },
        callback: () => {
          dispatch({
            type: 'profile/setState',
            payload: {
              selectedPeer: { ...newValue, source: { ...source }, target: { ...target } },
            },
          });
        }
      });
    }
  };

  const newChart = () => {
    const { links: mapLinks = [], nodes: mapNodes = [] } = gxObject;
    let nodes = [];
    let links = [];
    if (links && nodes) {
      mapNodes.forEach((item, index) => {
        nodes = [
          ...nodes,
          {
            name: item.name || '',
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

      const element = document.querySelector('#relation');
      element.innerHTML = '';
      new Promise((resolve) => {
        setWidth(document.querySelector('#relation-box').offsetWidth);
        setHeight(document.querySelector('#relation-box').offsetHeight);
        resolve(chart);
      }).then(() => {
        const { RelationChart } = window
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

        // const orignalSetItem = localStorage.setItem;
        local.current = localStorage.setItem;
        localStorage.setItem = function fn(key, newValue) {
          const setItemEvent = new Event('setItemEvent');
          setItemEvent.key = key;
          setItemEvent.newValue = newValue;
          window.dispatchEvent(setItemEvent);
                //  orignalSetItem.apply(this, arguments);
        };
        window.addEventListener('setItemEvent', handleItemClick);
      });
    }
  }
  useEffect(() => {
    newChart()
    return () => {
      localStorage.setItem = local.current;
      window.removeEventListener('setItemEvent', handleItemClick);
    };
  }, [])
  return (
    <>
      <div style={{ width: '100%', height: '100%' }} id="relation-box">
        <div id="relation" style={{ width, height }} />
      </div>
    </>
  );
}
