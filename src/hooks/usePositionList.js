import { useState, useEffect } from 'react';
import { getPosition } from '@/services/personnel/info';

/**
 * 获取员工岗位
 */
export default function() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await getPosition();
      setList(data);
    };
    getData();
  }, []);

  return [list];
}
