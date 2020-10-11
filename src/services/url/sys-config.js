export default {
  // 后端配置
  QUERY_CONFIG_LIST: 'tConfigApi/queryConfigList',
  SAVE_CONFIG: 'tConfigApi/saveConfig',
  UPDATE_CONFIG: 'tConfigApi/updateConfig',
  DELETE_CONFIG: 'tConfigApi/deleteConfig',

  // 计时任务
  QUERY_TIMEDJOB_LIST: 'taskApi/getAll', // 所有定时任务
  ADD_TIMEDJOB: 'taskApi/add',
  UPDATE_TIMEDJOB: 'taskApi/update',
  DELETE_TIMEDJOB: 'taskApi/delete',
  START_TIMEDJOB: 'taskApi/start',
  STOP_TIMEDJOB: 'taskApi/stop',
  RUN_TIMEDJOB: 'taskApi/runOnce',
};
