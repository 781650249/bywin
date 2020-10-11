export const pieOption = {
  color: ['#2ce3e8', '#377fff', '#00C3ED', '#80EEF1'],
  series: [
    {
      name: '',
      type: 'pie',
      radius: ['60%', '75%'],
      // hoverAnimation: false,
      hoverOffset: 2,
      avoidLabelOverlap: false,
      label: {
        formatter: '{d}% \n{b}'
      },
    },
  ],
};

export const lineOption = {
  tooltip: {
    trigger: 'item',
    formatter: '{c} 次',
    position: 'top',
    backgroundColor: 'rgba(2,123,186,0.28)',
    borderWidth: 1,
    padding: [2, 12],
    borderColor: '#06FBFF',
  },
  grid: {
    top: 6,
    right: 16,
    bottom: 0,
    left: 16,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    show: true,
    boundaryGap: false,
    // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    axisLine: { show: true, lineStyle: { color: '#C0D2F3' } },
    axisTick: { show: false },
    axisLabel: { margin: 12, fontSize: 10 },
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { show: false },
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: 'rgba(255, 255, 255, 0.2)',
      },
    },
  },
  series: [
    {
      type: 'line',
      symbol: 'circle',
      itemStyle: {
        color: '#0A1034',
        borderColor: '#1ED5B6',
      },
      lineStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#36EAD0', // 0% 处的颜色
            },
            {
              offset: 1,
              color: '#384B90', // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
        width: 1,
      },
      areaStyle: {
        normal: {
          color: {
            type: 'linear',
            x: 1,
            y: 0,
            x2: 0,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: 'rgb(34, 58, 95)', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgb(6, 12, 47)', // 100% 处的颜色
              },
            ],
          },
        },
      },
    },
  ],
};
