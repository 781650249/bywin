import { useState, useEffect, useCallback } from 'react';
import { getList } from '@/services/personnel/info';

export default function(options = {}) {
  const { manual = false, defaultParams = {} } = options;
  const [list, setList] = useState([]);
  // const [page, setPage] = useState(2);
  // const [pageSize, setPageSize] = useState(10);
  const [payload, setPayload] = useState({
    page: 1,
    pageSize: 10,
    ...defaultParams,
  });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const getPersonnelLsit = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getList(payload);
      setList(data.rows || []);
      setTotal(data.total || []);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
    setLoading(false);
  }, [payload]);

  useEffect(() => {
    if (!manual) {
      getPersonnelLsit();
    }
  }, [getPersonnelLsit, manual]);

  return {
    list,
    pagination: {
      page: payload.page,
      pageSize: payload.pageSize,
      total,
    },
    loading,
    getList: getPersonnelLsit,
    setParams: (params) => setPayload({ ...payload, ...params }),
  };
}
