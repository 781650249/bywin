import moment from 'moment';
import request from '@/utils/request';

export const getIndexData = async (params) => {
  try {
    const res = await request.get('/lightCtrlApi/getIndexData', { ...params });
    const {
      eleRecord,
      errorRecord,
      deviceStatus,
      openStatusRecord: openStatus,
      deviceNum: deviceTotal,
      sumTodayEle,
      sumMonthEle,
    } = res.data;
    const label = [];
    const power = [];
    const failureNumber = [];
    eleRecord.forEach((item, i) => {
      label.push(moment(item.time).format('MM-DD'))
      power.push(item.power)
      failureNumber.push(errorRecord[i].num)
    });
    return {
      baseInfo: {
        deviceTotal,
        sumTodayEle,
        sumMonthEle,
      },
      chartData: {
        label,
        power,
        failureNumber,
      },

      deviceStatus,
      openStatus,

    };
  } catch (error) {
    return {
      chartData: [],
      deviceTotal: 0,
      deviceStatus: {
        errorNum: 0,
        normalNum: 0,
        normalPercent: 0,
      },
      openStatus: {
        closeNum: 0,
        openNum: 0,
        openPercent: 0,
      },
    };
  }
};

// 获取照明设备列表 fwxxbz 房屋信息标识 ldxxbz 楼栋信息标识 lch 楼层号 fwbh 房屋编号
export const getList = async (params) => {
  try {
    const res = await request.post('/lightCtrlApi/list', { ...params });
    return res.data.rows;
  } catch (error) {
    return [];
  }
};

export const getAvgData = (params) => request.get('/lightCtrlApi/getAvgData', { ...params });

// 空调控制
export const update = async (params) => {
  try {
    await request.post('/lightCtrlApi/update', { ...params });
    return true;
  } catch (error) {
    return false;
  }
};

const traversal = (array) =>
  array.map((item) => {
    let key = null;

    const { xqxxbz, ldxxbz, lch, streetNo, id } = item;
    if (id) {
      key = id;
    } else if (streetNo) {
      key = `${xqxxbz}&${streetNo}&`;
    } else if (lch) {
      key = `${xqxxbz}&${ldxxbz}&${lch}`;
    } else if (ldxxbz) {
      key = `${xqxxbz}&${ldxxbz}`;
    } else {
      key = `${xqxxbz}&`;
    }
    if (Array.isArray(item.children) && item.children.length > 0) {
      return {
        key,
        title: item.title,
        children: traversal(item.children),
      };
    }
    return {
      key,
      title: item.title,
    };
  });
// 获取园区信息
export const getTreeData = async (params) => {
  try {
    const res = await request.get('/lightCtrlApi/getLightTree', { ...params });
    return traversal(res.data);
  } catch (error) {
    return [];
  }
};
