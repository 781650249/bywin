import React, { useRef, useEffect } from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';


const getChartOptions = () => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b} : {c} ({d}%)',
  },
  legend: {
    orient: 'horizontal',
    top: 'top',
    itemGap: 5,
    itemWidth: 5,
    itemHeight: 5,
    textStyle: {
      color: '#fff',
      fontSize: 12,
    },
    data: ['空调', '电梯', '门禁', '道闸', '照明', '其他']
},
  series: [
    {
      type: 'pie',
      radius: '75%',
      center: ['50%', '50%'],
      data: [
        { value: 335, name: '空调', itemStyle: { color: '#4751F1' } },
        { value: 310, name: '电梯', itemStyle: { color: '#45AAFF' } },
        { value: 274, name: '门禁', itemStyle: { color: '#EBAC44' } },
        { value: 235, name: '道闸', itemStyle: { color: '#D728CC' } },
        { value: 400, name: '照明', itemStyle: { color: '#49CEDD' } },
        { value: 300, name: '其他', itemStyle: { color: '#E13636' } },
      ].sort((a, b) => a.value - b.value),
      roseType: 'radius',
      label: { show: false },
      labelLine: { show: false },
      animation: false,
    },
  ],
});

export default function() {
  const chartRef = useRef();
  const chart = useRef();

  const chartResize = () => {
    if (chart.current) {
      chart.current.resize();
    }
  };
  useEffect(() => {
    chart.current = echarts.init(chartRef.current);
    window.addEventListener('resize', chartResize);
    return () => {
      window.removeEventListener('resize', chartResize);
    };
  }, []);

  useEffect(() => {
    if (!chart.current) return;
    chart.current.setOption(getChartOptions());
    chart.current.resize();
  }, []);

  return <div ref={chartRef} style={{ height: '100%' }} />;
}
