import React, { useEffect, useRef } from 'react';
import { orderBy } from 'lodash';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import styles from './index.less';

const getOption = (data) => ({
  color: ['#377fff', '#2ce3e8', '#3bac53', '#ffc25e', '#eb6f6c', '#454f6c'],
  series: [
    {
      name: '',
      type: 'pie',
      radius: ['40%', '55%'],
      // hoverAnimation: false,
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '14',
          fontWeight: 'bold',
          formatter: '{b}\n{d}%',
        },
        radius: [0, '40%'],
      },
      labelLine: {
        show: false,
      },
      data,
    },
  ],
});

export default React.memo(function OrgDiscovery({ data = [] }) {
  const other = data.find((item) => item.name === '其他');
  let chartData = data.filter((item) => item.name !== '其他');
  if (other) {
    chartData.push(other);
  }

  const colors = ['#377fff', '#2ce3e8', '#3bac53', '#ffc25e', '#eb6f6c', '#454f6c'];
  chartData = chartData.map((item, i) => ({ ...item, color: colors[i] }));
  const chartRef = useRef();
  const chart = useRef();
  useEffect(() => {
    chart.current = echarts.init(chartRef.current);
    window.addEventListener('resize', chartResize);
    return () => {
      window.removeEventListener('resize', chartResize);
    };
  }, []);

  useEffect(() => {
    const chartOption = getOption(
      chartData.map((item) => ({ value: item.count, name: item.name })),
    );
    chart.current.setOption(chartOption);
    chart.current.resize();
  }, [chartData]);

  function chartResize() {
    if (chart.current) {
      chart.current.resize();
    }
  }

  return (
    <div className={styles.container}>
      <div>
        <div className="title-2">组织发现</div>
      </div>
      <div className={styles.content}>
        <div className={styles.boxs}>
          {orderBy(chartData, 'count', 'desc')
            .slice(0, 6)
            .map((item, i) => (
              <div className={styles.box} key={i}>
                <div className={styles.boxBg}>
                  <svg width="100%" height="100%" viewBox="0 0 101 101" version="1.1">
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                      <g transform="translate(-2117.000000, -1711.000000)" fill={item.color}>
                        <g transform="translate(2059.000000, 1698.500000)">
                          <g transform="translate(58.500000, 13.000000)">
                            <path d="M82.5296314,52.1271077 L74.5060153,71.4978307 L77.4699236,74.4617389 L80.8430621,74.4617389 C84.3673696,74.4617389 87.2243854,77.3187547 87.2243854,80.8430621 C87.2243854,84.3673696 84.3673696,87.2243854 80.8430621,87.2243854 C77.3187547,87.2243854 74.4617389,84.3673696 74.4617389,80.8430621 L74.4617389,77.4699236 L71.4978307,74.5060153 L52.1271077,82.5296314 L52.1271077,86.7212307 L54.5122769,89.1063999 C57.0043386,91.5984616 57.0043386,95.638892 54.5122769,98.1309537 C52.0202152,100.623015 47.9797848,100.623015 45.4877231,98.1309537 C42.9956614,95.638892 42.9956614,91.5984616 45.4877231,89.1063999 L47.8728923,86.7212307 L47.8728923,81.6485546 L29.1251847,73.8829999 L25.5382611,77.4699236 L25.5382611,80.8430621 C25.5382611,84.3673696 22.6812453,87.2243854 19.1569379,87.2243854 C15.6326304,87.2243854 12.7756146,84.3673696 12.7756146,80.8430621 C12.7756146,77.3187547 15.6326304,74.4617389 19.1569379,74.4617389 L22.5300764,74.4617389 L26.998077,69.9937384 L19.5974763,52.1271077 L13.2787693,52.1271077 L10.8936001,54.5122769 C8.40153839,57.0043386 4.36110802,57.0043386 1.86904629,54.5122769 C-0.623015431,52.0202152 -0.623015431,47.9797848 1.86904629,45.4877231 C4.36110802,42.9956614 8.40153839,42.9956614 10.8936001,45.4877231 L13.2787693,47.8728923 L20.4785532,47.8728923 L27.6210924,30.6292771 L22.5300764,25.5382611 L19.1569379,25.5382611 C15.6326304,25.5382611 12.7756146,22.6812453 12.7756146,19.1569379 C12.7756146,15.6326304 15.6326304,12.7756146 19.1569379,12.7756146 C22.6812453,12.7756146 25.5382611,15.6326304 25.5382611,19.1569379 L25.5382611,22.5300764 L30.6292771,27.6210924 L47.8728923,20.4785532 L47.8728923,13.2787693 L45.4877231,10.8936001 C42.9956614,8.40153839 42.9956614,4.36110802 45.4877231,1.86904629 C47.9797848,-0.623015431 52.0202152,-0.623015431 54.5122769,1.86904629 C57.0043386,4.36110802 57.0043386,8.40153839 54.5122769,10.8936001 L52.1271077,13.2787693 L52.1271077,19.5974763 L69.9937384,26.998077 L74.4617389,22.5300764 L74.4617389,19.1569379 C74.4617389,15.6326304 77.3187547,12.7756146 80.8430621,12.7756146 C84.3673696,12.7756146 87.2243854,15.6326304 87.2243854,19.1569379 C87.2243854,22.6812453 84.3673696,25.5382611 80.8430621,25.5382611 L77.4699236,25.5382611 L73.8829999,29.1251847 L81.6485546,47.8728923 L86.7212307,47.8728923 L89.1063999,45.4877231 C91.5984616,42.9956614 95.638892,42.9956614 98.1309537,45.4877231 C100.623015,47.9797848 100.623015,52.0202152 98.1309537,54.5122769 C95.638892,57.0043386 91.5984616,57.0043386 89.1063999,54.5122769 L86.7212307,52.1271077 L82.5296314,52.1271077 Z" />
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
                <span className={styles.label}>{item.name}</span>
                <span className={styles.value}>{item.count}</span>
              </div>
            ))}
        </div>
      </div>
      <div className={styles.pieChartWrap}>
        <div className={styles.pieChart} ref={chartRef} />
      </div>
      <div className={styles.legends}>
        {chartData.slice(0, 6).map((item, i) => (
          <div className={styles.legend} key={i}>
            {item.name}
            <i className={styles.color} style={{ borderRightColor: item.color }} />
          </div>
        ))}
      </div>
    </div>
  );
});
