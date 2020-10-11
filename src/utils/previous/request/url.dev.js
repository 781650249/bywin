import { baseURL } from '@/config';

const URL_BASE = baseURL;

const URL = () => ({
  GET_MENU_LIST: `${URL_BASE}/getMenuList`, // 导航菜单列表
  ADD_LOG: `${URL_BASE}/logApi/addLog`, // 添加日志

  GET_DATA: `${URL_BASE}`,
  PARAMENTER_DATA: `${URL_BASE}/analysis/selectParameter.do`,
  GET_WARN_PERSON_LIST: `${URL_BASE}/warning/personWarnList`,
  SAVE_WARN_PERSON: `${URL_BASE}/warning/addWarnPerson`,
  UPDATE_WARN_PERSON: `${URL_BASE}/warning/updatePersonWarn`,
  DEL_WARN_PERSON: `${URL_BASE}/warning/delPersonWarn`,
  START_WARN_PERSON: `${URL_BASE}/warning/startPersonWarn`,
  STOP_WARN_PERSON: `${URL_BASE}/warning/stopPersonWarn`,
  GET_WARN_PERSON_IMAGE_LIST: `${URL_BASE}/warning/personWarnImageList`,
  UPDATE_PERSON_IMAGE: `${URL_BASE}/warning/updatePersonWarnImage`,

  GET_WARN_CAR_LIST: `${URL_BASE}/warning/carWarnList`,
  SAVE_WARN_CAR: `${URL_BASE}/warning/addWarnCar`,
  UPDATE_WARN_CAR: `${URL_BASE}/warning/updateCarWarn`,
  DEL_WARN_CAR: `${URL_BASE}/warning/delCarWarn`,
  START_WARN_CAR: `${URL_BASE}/warning/startCarWarn`,
  STOP_WARN_CAR: `${URL_BASE}/warning/stopCarWarn`,
  GET_WARN_CAR_IMAGE_LIST: `${URL_BASE}/warning/carWarnImageList`,
  UPDATE_CAR_IMAGE: `${URL_BASE}/warning/updateCarWarnImage`,

  GET_WARN_BICYCLE_LIST: `${URL_BASE}/warning/bicycleWarnList`,
  SAVE_WARN_BICYCLE: `${URL_BASE}/warning/addWarnBicycle`,
  UPDATE_WARN_BICYCLE: `${URL_BASE}/warning/updateBicycleWarn`,
  DEL_WARN_BICYCLE: `${URL_BASE}/warning/delBicycleWarn`,
  START_WARN_BICYCLE: `${URL_BASE}/warning/startBicycleWarn`,
  STOP_WARN_BICYCLE: `${URL_BASE}/warning/stopBicycleWarn`,
  GET_WARN_BICYCLE_IMAGE_LIST: `${URL_BASE}/warning/bicycleWarnImageList`,
  UPDATE_BICYCLE_IMAGE: `${URL_BASE}/warning/updateBicycleWarnImage`,

  GET_WARN_BEHAVIOR_LIST: `${URL_BASE}/warning/behaviorWarnList`,
  SAVE_WARN_BEHAVIOR: `${URL_BASE}/warning/addWarnBehavior`,
  UPDATE_WARN_BEHAVIOR: `${URL_BASE}/warning/updateBehaviorWarn`,
  DEL_WARN_BEHAVIOR: `${URL_BASE}/warning/delBehaviorWarn`,
  START_WARN_BEHAVIOR: `${URL_BASE}/warning/startBehaviorWarn`,
  STOP_WARN_BEHAVIOR: `${URL_BASE}/warning/stopBehaviorWarn`,

  // wk
  START_CAMEARA_SEARCH: '',
  INIT_KEY_PERSON: 'http://41.188.18.200/api/zxzh/getTheResult', // 在线感知
  INIT_KEY_CAR: 'http://41.188.18.200/api/zxzh/getTheResult', // 在线感知
  INIT_KEY_EVENT: 'http://41.188.18.200/api/zxzh/getTheResult', // 在线感知
  GET_KEY_PERSON_INFO: 'http://41.188.18.200/api/zxzh/getTheResult',
  GET_KEY_CAR_INFO: 'http://41.188.18.200/api/zxzh/getTheResult',
  GET_KEY_EVENT_INFO: 'http://41.188.18.200/api/zxzh/getTheResult',
  KEY_PERSON_TRAIL: `${URL_BASE}/datav/selectZdryByGmsfhm`, // 在线感知
  KEY_CAR_TRAIL: `${URL_BASE}/datav/selectVehicleByJdchphm`, // 在线感知
  INIT_CONTROL_PERSON: `${URL_BASE}/bkjg/rybkList`, // 在线感知
  INIT_CONTROL_BIKE: `${URL_BASE}/bkjg/fjdcbkList`, // 在线感知
  INIT_CONTROL_CAR: `${URL_BASE}/bkjg/jdcbkList`, // 在线感知
  INIT_CONTROL_EVENT: '', // 在线感知
  GET_PERSON_INFO: `${URL_BASE}/bkjg/rybkList`, // 在线感知
  GET_BIKE_INFO: `${URL_BASE}/bkjg/fjdcbkList`, // 在线感知
  GET_CAR_INFO: `${URL_BASE}/bkjg/jdcbkList`, // 在线感知
  GET_EVENT_INFO: '', // 在线感知
  PERSON_TRAIL: `${URL_BASE}/bkjg/rybkTrack`, // 在线感知
  CAR_TRAIL: `${URL_BASE}/bkjg/jdcbkTrack`, // 在线感知
  BIKE_TRAIL: `${URL_BASE}/bkjg/fjdcbkTrack`, // 在线感知
  SEARCH_NEAR_POLICE: 'http://41.188.18.200/api/zxzh/getTheResult', // 在线感知
  GET_NEAR_CAMERA: 'http://41.188.18.200/api/zxzh/getTheResult', // 在线感知
  GET_POLICE_INFO: '',
  SEND_MESSAGE: `${URL_BASE}/dispose/sendMessage`, // 在线感知
  WARING_PERSON_INFO: `${URL_BASE}/warning/personWarnDetail`, // 在线感知
  WARING_CAR_INFO: `${URL_BASE}/warning/carWarnDetail`, // 在线感知
  WARING_BIKE_INFO: `${URL_BASE}/warning/bicycleWarnDetail`, // 在线感知
  WARING_EVENT_INFO: `${URL_BASE}/warning/behaviorWarnDetail`, // 在线感知
  SELECT_ALL_CASE_NAME: `${URL_BASE}/warning/getAllCaseName`, // 在线感知
  SELECT_VEDIO_lIST: `${URL_BASE}/videoSchedulApi/selectCameraAndStateList`, // 动态调度 获取所有摄像 有用有修
  SELECT_VEDIO_lIST_TX: `${URL_BASE}/analysis/selectCameraAndStateList`,
  SELECT_VEDIO_lIST_TONGXIANG: `${URL_BASE}/analysis/selectCameraAndStateSsypList`,
  SELECT_VEDIO_lIST_BY_STATUS: `${URL_BASE}/analysis/selectCameraAndStateBySpbfbm`,
  VEDIO_CANCEL: `${URL_BASE}/videoSchedulApi/cancelAccessTopic`, // 动态调度 取消设备接入 有用有修
  VEDIO_ADD: `${URL_BASE}/videoSchedulApi/accessTopic`, // 动态调度 添加设备接入 有用有修
  GET_ALONG_WITH: `${URL_BASE}/alongWith/alongWith`, // 视算研判
  GET_ALONG_WITH_AGGREGATION_GJ_LIST: `${URL_BASE}/alongWith/selectMacAggregationGjList`, // 视算研判
  GET_ALONG_WITH_HISTORY: `${URL_BASE}/alongWith/selectKakouGxMacList`, // 视算研判
  GET_ALONG_WITH_HISTORY_RFID: `${URL_BASE}/alongWith/selectRFIDGxMacList`, // 视算研判
  SELECT_KAKOU_GJ_LIST: `${URL_BASE}/alongWith/selectKakouGjList`, // 视算研判
  SELECT_RFID_GJ_LIST: `${URL_BASE}/alongWith/selectRfidGjList`, // 视算研判
  SELECT_MAC_GJ_LIST: `${URL_BASE}/alongWith/selectMacGjList`, // 视算研判
  SELECT_MAC_GJ_LIST_POIS: `${URL_BASE}/alongWith/selectMacGjListByPois`, // 视算研判
  GET_RLT_LIST: `${URL_BASE}/situationAnalysis/getHeatMap`, // 在线感知 警情热力图
  GET_NOVEL_BY_RFID: `${URL_BASE}/nonmotorvehicle/queryNonMotorVehicleByRfid`, // 视算研判
  GET_SCOOP_MAC: `${URL_BASE}/alongWith/scoopMac`, // 视算研判
  GET_MAC_COLLECT_DEVICE_LIST: `${URL_BASE}/alongWith/getMacCollectDeviceList`, // 视算研判
  GET_CNT_BY_ZAJQ: `${URL_BASE}/situationAnalysis/getCntByZajq`, // [态势分析]未修改
  GET_CNT_BY_ALL_CASE_TYPE: `${URL_BASE}/situationAnalysis/getCntByAllCaseType`, // [姿态分析]未修改
  GET_CNT_BY_4CASE_TYPE: `${URL_BASE}/situationAnalysis/getCntBy4CaseType`, // [姿态分析]未修改
  GET_POLICE_CNT_BY_4CASE_TYPE: `${URL_BASE}/situationAnalysis/getPoliceCntBy4CaseType`, // [姿态分析]未修改
  GET_POLICE_CNT_TOP3_BY_4CASE_TYPE: `${URL_BASE}/situationAnalysis/getPoliceCntTop3By4CaseType`, // [姿态分析]未修改
  GET_CNT_BY_POLICE_STATION: `${URL_BASE}/situationAnalysis/getCntByPoliceStation`, // [姿态分析]未修改
  GET_CNT_BY_JJD: `${URL_BASE}/situationAnalysis/getCntByJJD`, // [姿态分析]未修改
  GET_CNT_BY_CJD: `${URL_BASE}/situationAnalysis/getCntByCjd`, // [姿态分析]未修改
  GET_TREND_ESTIMATE: `${URL_BASE}/situationAnalysis/getTrendEstimate`, // [姿态分析]未修改
  GET_CNT_THEFT: `${URL_BASE}/situationAnalysis/getCntTheft`, // [姿态分析]未修改
  GET_CNT_THEFT_GROUP: `${URL_BASE}/situationAnalysis/getCntTheftGroupFkdwmc`, // [姿态分析]未修改
  GET_CNT_THEFT_GROUP_TOP3: `${URL_BASE}/situationAnalysis/getCntTheftGroupFkdwmcTop3`, // [姿态分析]未修改
  GET_CNT_BY_ALL_CASE_TYPE_POLICESTATION: `${URL_BASE}/situationAnalysis/getCntByAllCaseTypePoliceStation`, // [姿态分析]未修改
  GET_CNT_TOP3_BY_ALL_CASE_TYPE_POLICESTATION: `${URL_BASE}/situationAnalysis/getCntTop3ByAllCaseTypePoliceStation`, // [姿态分析]未修改
  GET_CNT_COMPARE_BYWLTXZP: `${URL_BASE}/situationAnalysis/geCntCompareByWltxzp`,
  GET_CNT_COMPARE_BYWLTXZP_TOP3: `${URL_BASE}/situationAnalysis/geCntCompareTop3ByWltxzp`,
  GET_JQ_MARKERS: `${URL_BASE}/situationAnalysis/getSituationPointListByTime`, // [姿态分析]未修改
  GET_SITUATION_AREA: `${URL_BASE}/situationAnalysis/getSituationArea`, // [姿态分析]未修改
  GET_JJD_CNT_BY_DAY_FKDWDM: `${URL_BASE}/situationAnalysis/getJjdCntByDayFkdwdm`, // [姿态分析]未修改
  GET_CNT_BY_DAY_FKDWDM: `${URL_BASE}/situationAnalysis/getCntByDayFkdwdm`, // [姿态分析]未修改
  GET_CNT_BY_WEEK_FKDWDM: `${URL_BASE}/situationAnalysis/getCntByWeekFkdwdm`, // [姿态分析]未修改
  GET_CNT_BY_MONTH_FKDWDM: `${URL_BASE}/situationAnalysis/getCntByMonthFkdwdm`, // [姿态分析]未修改
  GET_CNT_BY_DAY_FKDWDM_4TYPE: `${URL_BASE}/situationAnalysis/getCntByDayFkdwdm4Type`, // [姿态分析]未修改
  GET_CNT_BY_DAY_FKDWDM_SDSQ: `${URL_BASE}/situationAnalysis/getCntByDayFkdwdmSdsq`, // [姿态分析]未修改
  GET_PDF: `${URL_BASE}/pdf.html`, // [姿态分析]未修改

  LOGIN: `${URL_BASE}/login/auth`, // 登陆
  LOGOUT: `${URL_BASE}/logout/auth`, // 退出登陆
  SELECT_PARAMETER: `${URL_BASE}/analysis/selectParameter`, // 视算研判
  SELECT_CAMERA_LIST: `${URL_BASE}/videoSchedulApi/selectCameraList`, // 视算研判，动态调度，档案管理/videoSchedulApi/selectCameraListAll
  SELECT_CAMERA_LIST_All: `${URL_BASE}/videoSchedulApi/selectCameraListAll`,
  SELECT_CAMERA_BY_ID: `${URL_BASE}/analysis/selectCameraById`, // 在线感知
  UPLOAD_IMG: `${URL_BASE}/common/uploadImg`, // 改动，视算研判
  SELECT_PARAMETER_BY_IMG: `${URL_BASE}/common/selectParameterByImg`, // 改动，视算研判，预警中心
  RESET_PWD: `${URL_BASE}/user/resetPWD`, // 修改密码
  OUT_OF_DATE: `${URL_BASE}/user/outOfDate`, // 密码是否超时
  SELECT_VIDEO_LIST: `${URL_BASE}/common/selectVideoList`, // 改动，视算研判
  SELECT_KAKOU_LIST: `${URL_BASE}/vehicle/getJdcKkList`, // 改动，视算研判
  SELECT_CAMERA_BY_SPBFBM: `${URL_BASE}/videoSchedulApi/selectCameraBySpbfbm`, // 改动，视算研判
  SELECT_PARAMETER_BY_YITU: `${URL_BASE}/common/selectParameterByYiTu`, // 改动，视算研判
  CAMERA_AREA_LIST: `${URL_BASE}/camera/cameraAreaList`, // 视算研判******
  ADD_WARN_CAR_FOR_IMG_URL: `${URL_BASE}/warning/addWarnCarForImgUrl`,
  ADD_WARN_BICYCLE_FOR_IMG_URL: `${URL_BASE}/warning/addWarnBicycleForImgUrl`,
  ADD_WARN_PERSON_FOR_IMG_URL: `${URL_BASE}/warning/addWarnPersonForImgUrl`,
  GET_DOWN_VIDEO_URL: `${URL_BASE}/analysis/getDownVideoUrl`, // 视算研判

  GET_YITU_BY_CONTENT: `${URL_BASE}/common/getYituByContent`, // 改动，视算研判
  SELECT_CAMERA_LIST_BY_SCHEDUL_LOG_TIME: `${URL_BASE}/videoSchedulApi/selectCameraListBySchedulLogTime`, // 改动，视算研判
  GET_RY_KK_LIST: `${URL_BASE}/person/getRyKkList`, // 改动，视算研判
  GET_JQ_LIST: `${URL_BASE}/casemanage/getJqList`, // 改动，视算研判，预警中心，动态调度，档案管理
  GET_GD_ID: `${URL_BASE}/shanalysis/getGdId`, // 改动，视算研判
  QUERY_NON_MOTOR_VEHICLE_BY_CARD_ID: `${URL_BASE}/nonmotorvehicle/queryNonMotorVehicleByCardId`, // 视算研判
  GET_ATTRIBUTE_PARAMETER_LIST: `${URL_BASE}/common/getAttributeParameterList`,
  QUERY_POLICE_AREA_CONFIG_LIST: `${URL_BASE}/policeAreaConfig/queryPoliceAreaConfigList`,
  GET_PERSON_GROUP_LIST: `${URL_BASE}/common/getPersonGroupList`,

  UPDATE_ACTION: `${URL_BASE}/casemanage/updateAction`, // [档案管理]已修改，案件管理模块修改设置
  ADD_ACTION: `${URL_BASE}/casemanage/addAction`, // [档案管理]已修改，案件管理模块添加
  UPLOAD_IMG_NOJGH: `${URL_BASE}/analysis/uploadImgNoJGH`, // [档案管理]未修改，档案管理大模块上传图片
  GET_CLUES_LIST: `${URL_BASE}/casemanage/getCluesList`, // [档案管理]已修改，案件管理获取线索信息
  DELETE_ACTION: `${URL_BASE}/casemanage/deleteAction`, // [档案管理]已修改，案件管理删除
  QUERY_KEY_PERSON: `${URL_BASE}/keyPerson/queryKeyPerson`, // [档案管理]未修改，人员模块修改、查看
  SAVE_KEY_PERSON: `${URL_BASE}/keyPerson/saveKeyPerson`, // [档案管理]已修改，人员模块新增
  UPDATE_KEY_PERSON: `${URL_BASE}/keyPerson/updateKeyPerson`, // [档案管理]已修改，人员模块修改
  DELETE_KEY_PERSON: `${URL_BASE}/keyPerson/deleteKeyPerson`, // [档案管理]未修改，人员模块删除

  SEARCH_PER_LABEL_LIST: `${URL_BASE}/keyPerson/searchPerLabelList`,
  SEARCH_LABELS: `${URL_BASE}/keyPerson/searchLabels`, // 改动，预警中心

  GET_HISTORY_PERSON_JV_JI_VIEW: `${URL_BASE}/warningDetail/getHistoryPersonJvJiView`,
  GET_HISTORY_PERSON_GATHER: `${URL_BASE}/warningDetail/getHistoryPersonGather`, // 改动，预警中心
  GET_HISTORY_PERSON_GATHER_VIEW: `${URL_BASE}/warningDetail/getHistoryPersonGatherView`, // 改动，预警中心
  AREA_MAC_NUM: `${URL_BASE}/alongWith/areaMacNum`, // 预警中心
  AREA_MAC_DEV: `${URL_BASE}/alongWith/areaMacDev`, // 预警中心
  STATISTICS_NUMBER: `${URL_BASE}/warningDetail/statisticsNumber`, // 改动，预警中心
  GET_LAST_TEN_POINT: `${URL_BASE}/warningDetail/getLastTenPoint`, // 改动，预警中心

  SAVE_KEY_CAR: `${URL_BASE}/keyCar/saveKeyCar`, // [档案管理]已修改，车辆模块新增
  UPDATE_KEY_CAR: `${URL_BASE}/keyCar/updateKeyCar`, // [档案管理]已修改，车辆模块修改
  DELETE_KEY_CAR: `${URL_BASE}/keyCar/deleteKeyCar`, // [档案管理]未修改，车辆模块删除

  SAVE_NON_MOTOR: `${URL_BASE}/nonMotor/saveNonMotor`, // [档案管理]未修改，非车辆模块新增
  UPDATE_NON_MOTOR: `${URL_BASE}/nonMotor/updateNonMotor`, // [档案管理]未修改，非车辆模块修改
  DELETE_NON_MOTOR: `${URL_BASE}/nonMotor/deleteNonMotor`, // [档案管理]未修改，非车辆模块删除

  SAVE_TASK_INFO: `${URL_BASE}/taskInfo/saveTaskInfo`, // 动态调度
  QUERY_TASK_LIST: `${URL_BASE}/taskInfo/queryTaskList`, // 动态调度 历史记录列表 有用有修改
  QUERY_TASK_INFO: `${URL_BASE}/taskInfo/queryTaskInfo`, // 动态调度 历史记录详情 有用有修改
  DELETE_TASK_INFO: `${URL_BASE}/taskInfo/deleteTaskInfo`, // 动态调度
  SWITCH_HISTORY_VIDEO: `${URL_BASE}/analysis/switchHistoryVideoSchedul`, // 动态调度
  GET_HISTORY_SCHEDUL_INFO: `${URL_BASE}/analysis/getHistorySchedulResourceInfo`, // 动态调度 历史是否可接入情况 有用无修改

  VIDEO_LIVE: `${URL_BASE}/video/VideoLive_sh.jsp`,
  VIDEO_HISTORY: `${URL_BASE}/video/VideoHistory_sh.jsp`, // 改动，视算研判，动态调度
  IMAGE_PREFIXION: 'http://10.120.203.77/', // 视算研判
  IMAGE_PREFIXION_OSS: 'http://10.120.203.77:1980/proxy/image?redirect=', // 视算研判
  HOLOGRAPHIC_ARCHIVES: 'http://41.188.47.152/qxda/index.jsp', // 视算研判
  GET_PLAY_HISTORY_VIDEO_URL: `${URL_BASE}/videoPlay/getPlayHistoryVideoUrl`, // 下载视频

  QUERY_CONFIG_LIST: `${URL_BASE}/tconfig/queryConfigList`,
  SAVE_CONFIG: `${URL_BASE}/tconfig/saveConfig`,
  UPDATE_CONFIG: `${URL_BASE}/tconfig/updateConfig`,
  DELETE_CONFIG: `${URL_BASE}/tconfig/deleteConfig`,
  LOGIN_CHECK: `${URL_BASE}/check/login`,

  QUERY_TIMEDJOB_LIST: `${URL_BASE}/taskApi/getAll`, // 所有定时任务
  ADD_TIMEDJOB: `${URL_BASE}/taskApi/add`,
  UPDATE_TIMEDJOB: `${URL_BASE}/taskApi/update`,
  DELETE_TIMEDJOB: `${URL_BASE}/taskApi/delete`,
  START_TIMEDJOB: `${URL_BASE}/taskApi/start`,
  STOP_TIMEDJOB: `${URL_BASE}/taskApi/stop`,
  RUN_TIMEDJOB: `${URL_BASE}/taskApi/runOnce`,

  QUERY_ALL_API_LOG: `${URL_BASE}/logApi/getAll`, // 查询所有API日志(支持条件+分页)
  QUERY_API_LOG_BYID: `${URL_BASE}/logApi/getById`,
  DELETE_API_LOG_BYID: `${URL_BASE}/logApi/deleteById`,

  QUERY_HEAT_MAP: `${URL_BASE}/situationAnalysis/getHeatMap`, // 在线感知热力图

  // 表单配置
  QUERY_BASIC_CONFIG_TREE: `${URL_BASE}/searchImageBasicConfig/getBasicConfigTree`,
  QUERY_BASIC_CONFIG_LIST_GROUP: `${URL_BASE}/searchImageBasicConfig/queryBasicConfigListByGroup`,
  QUERY_BASIC_CONFIG_LIST: `${URL_BASE}/searchImageBasicConfig/queryBasicConfigList`,
  SAVE_BASIC_CONFIG: `${URL_BASE}/searchImageBasicConfig/saveBasicConfig`,
  UPDATE_BASIC_CONFIG: `${URL_BASE}/searchImageBasicConfig/updateBasicConfig`,
  DELETE_BASIC_CONFIG: `${URL_BASE}/searchImageBasicConfig/deleteBasicConfig`,

  QUERY_BUSINESS_CONFIG_LIST_GROUP: `${URL_BASE}/searchImageBusinessConfig/queryBusinessConfigListByGroup`,
  QUERY_BUSINESS_CONFIG_LIST: `${URL_BASE}/searchImageBusinessConfig/queryBusinessConfigList`,
  SAVE_BUSINESS_CONFIG: `${URL_BASE}/searchImageBusinessConfig/saveBusinessConfig`,
  UPDATE_BUSINESS_CONFIG: `${URL_BASE}/searchImageBusinessConfig/updateBusinessConfig`,
  DELETE_BUSINESS_CONFIG: `${URL_BASE}/searchImageBusinessConfig/deleteBusinessConfig`,
  QUERY_BUSINESS_CONFIG_LIST_IDS: `${URL_BASE}/searchImageBusinessConfig/queryBusinessConfigListByIds`,
  UPDATE_BUSINESS_CONFIG_BY_ID: `${URL_BASE}/searchImageBusinessConfig/updateBusinessConfigById`,
  BATCH_UPDATE_BUSINESS_CONFIG: `${URL_BASE}/searchImageBusinessConfig/batchUpdateBusinessConfig`,

  SAVE_POLICE_AREA_CONFIG: `${URL_BASE}/policeAreaConfig/savePoliceAreaConfig`,
  UPDATE_POLICE_AREA_CONFIG: `${URL_BASE}/policeAreaConfig/updatePoliceAreaConfig`,
  DELETE_POLICE_AREA_CONFIG: `${URL_BASE}/policeAreaConfig/deletePoliceAreaConfig`,
  GET_PLAY_LIVE_VIDEO_URL: `${URL_BASE}/videoPlay/getPlayLiveVideoUrl`, // 获取视频资源
  GET_ALL_ELEMENTSEARCH_RESULT: `${URL_BASE}/allElement/getAllElementSearchResult`, // 全要素人
  GET_VEHICLE_ALL_ELEMENT_RESULT: `${URL_BASE}/allElement/getVehicleAllElementSearchResult`, // 全要素机动车
  GET_NON_MOTOR_VEHICLE_ALL_ELEMENT_RESULT: `${URL_BASE}/allElement/getNonMotorVehicleAllElementSearchResult`, // 全要素非机动车
  GET_DO_OSS_PHOTO_PROXY: `${URL_BASE}/allElement/doOssPhotoProxy`, // 全要素头像
  GET_CAMERA_RESOLUTION: `${URL_BASE}/videoSchedulApi/getCameraResolution`, // 获取摄像头像素
  GET_CAMERA_LISTBYRANGE: `${URL_BASE}/videoSchedulApi/getCameraListByRange`, // 获取点位附近摄像头

  GET_CAMERA_TRAIL: `${URL_BASE}/videoSchedulApi/trajectoryStudy`, // 轨迹研判

  GET_DICTIONARY_LIST: `${URL_BASE}/adsszjwsdictionary/getAdsSzjwsDictionaryList`, // 字典表数据

  SELECT_CAMERA_AZDD_LIST: `${URL_BASE}/videoSchedulApi/selectCameraListByAzdd`, // 获取摄像头地址（去重）
  GET_POLICE_STATIONS: `${URL_BASE}/videoSchedulApi/getPolice`, // 获取派出所列表
  SEARCH_PLACES_BY_KEY: `${URL_BASE}/mapApi/searchPlacesByKey`, // 档案管理，线索数据

  // 工作台
  GET_ACTION_NAME_LIST: `${URL_BASE}/casemanage/getActionNameList`, // 获取所有案件名
  GET_AJ_LIST: `${URL_BASE}/casemanage/getAjList`, // 获取列表数据
  GET_AJXQ_BY_JJDBH: `${URL_BASE}/casemanage/getAjxqByjjdbh`, // 查看某一案件数据
  GET_PERSON_LIST: `${URL_BASE}/keyPerson/nonQPzdryList`, // 获取人员列表

  // 案件中心
  GET_JQ_LIST_CONDTION: `${URL_BASE}/casemanage/getJqListByCondition`, // 获取警情列表
  GET_AJLIST_BYCOND_TION: `${URL_BASE}/casemanage/getAjListByCondition`, // 获取案件列表
  GET_AJMAC_XSLIST_BY_AJBH: `${URL_BASE}/casemanage/getAjMacxsListByAjbh`, // 获取mac数据列表
  UPDATA_DATE_AJMACXS_STATUS: `${URL_BASE}/casemanage/updateAjMacxsStatus`, // mac数据列表更新状态
  GET_JQXQBY_JJDBH: `${URL_BASE}/casemanage/getJqxqByJjdbh`, // 根据警情单编号获取警情信息
  GET_AJXQ_BY_AJBH: `${URL_BASE}/casemanage/getAjxqByAjbh`, // 获取案件详情上部分列表
  GET_AJBQLIST_BYAJBH: `${URL_BASE}/casemanage/getAjbqListByAjbh`, // 获取标签列表数据
  ADD_AJ_BQ: `${URL_BASE}/casemanage/addAjbq`, // 添加案件标签
  DELETE_AJ_BQ: `${URL_BASE}/casemanage/deleteAjbq`, // 删除案件标签
  GET_AJXY_LIST_BY_AJBH: `${URL_BASE}/casemanage/getAjXyrListByAjbh`, // 获取嫌疑人列表
  GET_AJAJLIST_BY_AJBH: `${URL_BASE}/casemanage/getAjAjListByAjbh`, // 获取串并案列表
  ADD_AJXS: `${URL_BASE}/casemanage/addAjxs`, // 添加视频线索
  GET_AJXS_LIST_BYAJBH: `${URL_BASE}/casemanage/getAjxsListByAjbh`, // 获取视频线索列表
  UPDATE_AJXS_STATUS: `${URL_BASE}/casemanage/updateAjxsStatus`, // 更新视频线索状态
  UPDATA_AJXYR_STATUS: `${URL_BASE}/casemanage/updateAjXyrStatus`, // 更新案件嫌疑人状态
  UPDATA_AJAJ_STATUS: `${URL_BASE}/casemanage/updateAjAjStatus`, // 更新案件串并案状态
  GET_AJXYR_BY_ID: `${URL_BASE}/casemanage/getAjXyrById`, // 根据嫌疑人id查询嫌疑人信息
  GET_AJAJ_BY_ID: `${URL_BASE}/casemanage/getAjAjById`, // 根据案件id查询案件信息
  DELETE_AJXS_BY_ID: `${URL_BASE}/casemanage/deleteAjxsById`, // 排除案件线索
  DELETE_AJMACXS_BY_ID: `${URL_BASE}/casemanage/deleteAjMacxsById`, // 排除案件mac线索
  DELETE_AJXYR_BY_ID: `${URL_BASE}/casemanage/deleteAjXyrById`, // 排除案件嫌疑人
  DELETE_AJAJ_BY_ID: `${URL_BASE}/casemanage/deleteAjAjById`, // 排除推荐案件
  GET_DETAIL_LIST: `${URL_BASE}/warningDetail/getDetailList`, // 布控预警列表
  EXCLUDE_AJXS_BY_ID: `${URL_BASE}/casemanage/excludeAjxsById`, // 排除/恢复案件线索
  PUT_OSS_BY_BASE64: `${URL_BASE}/szjws_oss/putOssByBase64`, // 将base64图片上传到数字警务室oss

  // 在线感知
  GET_AJ_LIST_BY_PERIOD: `${URL_BASE}/casemanage/getAjListByPeriod`, // 根据时间区间查询案件列表
  STATIS_STICAL_CASE_TYPE_BY_PERIOD: `${URL_BASE}/casemanage/statisticalCaseTypeByPeriod`, // 根据时间区间统计各个案件类型数量
  GET_KEY_PERSON_LIST_BY_PERIOD: `${URL_BASE}/situationAnalysis/getLastPointListByTimeUnit`, // 根据时间区间获取重点人
  GET_KEY_CAR_LIST_BY_PERIOD: `${URL_BASE}/situationAnalysis/getLastPointListByTimeUnit`, // 根据时间区间获取重点车
  GET_KEY_EVENT_LIST_BY_PERIOD: `${URL_BASE}/videoSchedulApi/selectCameraListBySchedulLogTime`, // 根据时间区间获取重点事件
  GET_KEY_RECORD_LIST_BY_PERIOD: `${URL_BASE}/shanalysis/getTotalByYearMonthWeek`, // 根据时间区间获取归档案件
  GET_SURVEILLANCE_RESULT_BY_PERIOD: `${URL_BASE}/bkjg/v2/getSurveillanceResultByTimeUnit`, // 根据时间区间统计预警信息数
  GET_SURVEILLANCE_RESULT_BY_TASKID: `${URL_BASE}/bkjg/getSurveillanceResultByTaskId`, // 根据任务id查询出该布控任务所有的布控结果
  GET_KEY_INFO_TOTAL: `${URL_BASE}/situationAnalysis/getCntByTimeUnit`, // 根据时间区间重点信息统计数
  GET_WARNING_LIST_BY_PERIOD: `${URL_BASE}/bkjg/getSurveillanceResultByTimeUnit`, // 根据时间区间重点信息统计数
  GET_GROUP_INFO: `${URL_BASE}/common/getGroupInfo`, // 获取登录用户信息
  UPDATE_ARCHIVE: `${URL_BASE}/shanalysis/updateArchive `, // 新增/修改归档信息
  GET_JJD_AJ_UNION_LIST: `${URL_BASE}/casemanage/getJjdAjUnionList`, // 新增/修改归档信息
  MERGE_ARCHIVE_BY_JQID: `${URL_BASE}/shanalysis/mergeArchiveByJqId `, // 合并归档
  GET_CNT_BY_TIANRANG: `${URL_BASE}/situationAnalysis/getCntByTianrang `, // 获取所有人员和车辆

  // 历史档案
  GET_GD_RECORD: `${URL_BASE}/shanalysis/getGdPageRecord`, // 获取列表
  GET_GD_RECORD_BY_ID: `${URL_BASE}/shanalysis/getGdRecordById?`, // 获取详情
  DELETE_GD_RECORD: `${URL_BASE}/shanalysis/deleteGdRecord`, // 删除
  UPDATE_STUDY_PROCESS: `${URL_BASE}/shanalysis/updateStudyProcess`, // 更新
  SAVE_STUDY_PROCESS: `${URL_BASE}/shanalysis/saveStudyProcess`, // 保存
  DOWNLOAD_GD_INFO: `${URL_BASE}/shanalysis/downloadGdInfo`, // 下载
  SET_RECORD_TOP_NUMBER: `${URL_BASE}/shanalysis/setSortTop`, // 置顶 取消置顶
  START_FACE_JUDEGEMENT: `${URL_BASE}/face/faceJudegement`, // 开始研判
  GET_FACE_JUDEGEMENT_RESULT: `${URL_BASE}//face/getFaceJudegementResult`, // 查看研判结果

  // 预警布控
  CHANGE_WARN_STATUS: `${URL_BASE}/warningDetail/changeWarnStatus`, // 改变布控状态
  GET_PERSON_WARNING_LIST: `${URL_BASE}/warningDetail/getPersonWarningList`, // 人员预警列表
  GET_CAR_WARNING_LIST: `${URL_BASE}/warningDetail/getCarWarningList`, // 机动车预警列表
  GET_BICYCLE_WARNING_LIST: `${URL_BASE}/warningDetail/getBicycleWarningList`, // 非机动车预警列表
  QUERY_KEY_PER_LIST: `${URL_BASE}/keyPerson/queryKeyPerList`, // 重点人员列表
  QUERY_NON_QP_KEY_PER_LIST: `${URL_BASE}/keyPerson/nonQPzdryList`, // 重点人员列表
  QUERY_KEY_CAR_LIST: `${URL_BASE}/keyCar/queryKeyCarList`, // 重点机动车列表
  QUERY_NON_MOTOR_LIST: `${URL_BASE}/nonMotor/queryNonMotorList`, // 重点非机动车列表
  ADD_DETAIL: `${URL_BASE}/warningDetail/addDetail`, // 新增布控预警
  UPDATE_DETAIL: `${URL_BASE}/warningDetail/updateDetail`, // 修改布控预警
  DEL_DETAIL: `${URL_BASE}/warningDetail/delDetail`, // 删除布控预警
  BATCH_EXECUTE_CONTROL: `${URL_BASE}/warningDetail/v2/batchAddAndStartWarnTask`, // 批量布控
  BATCH_EXECUTE_CONTROL_PROGRESS: `${URL_BASE}//warningDetail/selectBatchWarnTaskProgress`, // 查询布控进度    ?batchTaskId=xxxx
  SET_WARN_TOP_NUMBER: `${URL_BASE}/warningDetail/setSortTop`, // 置顶 取消置顶
  DELETE_WARN_RESULT: `${URL_BASE}/warningDetail/deleteWarnResultById`, // 单个预警结果删除
  GET_MONITOR_ACTION_LIST: `${URL_BASE}/warningDetail/getActionList`, // 模糊查询已添加的案件列表
  GET_KEY_PERSON_TYPE_LIST: `${URL_BASE}/keyPerson/selectKeyPerTypeList `, // 黄埔重点人员类型
  UPLOAD_API_CHECKFILEMD5: `${URL_BASE}/uploadApi/checkFileMD5`,

  // 系统配置
  DPGJ_BATCH_PUSH: `${URL_BASE}/dpgj/batchPush`, // 大屏接口批量推送
  DPGJ_BATCH_CANCLE: `${URL_BASE}/dpgj/batchCancle`, // 大屏接口批量取消

  // 天工
  GET_TG_TOKEN: `${URL_BASE}/login/getAccessToken`, // 天工token
  VERIFY_TG_TOKEN: `${URL_BASE}/login/verifyAccessToken`, // token验证

  // 黄埔token验证
  VERIFY_HUANGPU_TOKEN: `${URL_BASE}/login/verifyAccessToken`, // 天工token

  // 路径规划
  GET_ROUTE_PATH: `${URL_BASE}/videoSchedulApi/getRoutePlan`,

  // 向量搜索是否禁用
  GET_SEARCH_IMAGE_ERROR_INFO: `${URL_BASE}/common/getSearchImageErrorInfo`,

  // 上屏
  UP_DP: `${URL_BASE}/dpgj/upDp`,

  // 下屏
  DOWN_DP: `${URL_BASE}/dpgj/downDp`,

  // 根据业务名称查询具体的配置信息
  GET_SELECT_CONFIG: `${URL_BASE}/tconfig/selectConfig`,

  // 人脸识别

  FACE_SEARCH: `${URL_BASE}/face/faceSearch`,

  GET_STRUCTURED: `${URL_BASE}/face/getStructured`,
  GET_ALL_FACE: `${URL_BASE}/face/getAllFace`,

  GET_FACE_TO_PERSONINFO: `${URL_BASE}/face/getPersonInfo`, // 根据人脸获取人员信息

  // 车牌号识别
  GET_PERSONINFO: `${URL_BASE}/vehicle/getPersonInfo`,

  // 根据摄像头id判断该摄像头是否处于离线状态
  GET_CAMERA_STATUS: `${URL_BASE}/videoSchedulApi/getCameraStatus`,

  // 意见反馈
  CUSTOMER_ADVICE_ADD: `${URL_BASE}/customerAdvice/add`,
  CUSTOMER_ADVICE_QUERY_LIST: `${URL_BASE}/customerAdvice/queryList`,
  CUSTOMER_ADVICE_QUERY_DETAILS: `${URL_BASE}/customerAdvice/queryDetails`,
  CUSTOMER_ADVICE_UPDATE: `${URL_BASE}/customerAdvice/update`,

  // 更新日志
  QUERY_UPDATA_LOG_LIST: `${URL_BASE}/updatelogApi/getAll`,
  ADD_UPDATA_LOG: `${URL_BASE}/updatelogApi/add`,
  MODIFY_UPDATA_LOG: `${URL_BASE}/updatelogApi/modify`,
  DELETE_UPDATA_LOG: `${URL_BASE}/updatelogApi/deleteById`,
  QUERY_UPDATA_LOG_BYID: `${URL_BASE}/updatelogApi/getById`,

  // 人员追踪
  START_PERSON_TRACKING: `${URL_BASE}/track/startTrack`,
  STOP_PERSON_TRACKING: `${URL_BASE}/track/stopTrack`,
  GET_PERSON_TRACK: `${URL_BASE}/track/getTrack`,

  // 批量更新消息已读状态
  BATCH_UPDATE_READ_STATUS: `${URL_BASE}/warningDetail/batchUpdateReadStatus`,

  // 视算研判 他用token验证
  SZJWS_OSS: `${URL_BASE}/szjws_oss/proxy`,
  // 云盾人员历史轨迹同步接口
  SET_HISTORY_TRACK_INFO: `${URL_BASE}/yundun/setHistoryTrackInfo`,
  // 云盾线索库同步接口
  CLUE_SYNCLUE: `${URL_BASE}/yundun/clueSynclue`,

  // 动态调度 切换
  BATCH_CHANGE_CAMERA: `${URL_BASE}/dynamicSchedulApi/batchChangeCamera`,

  GET_CAMERA_TYPE_LIST: `${URL_BASE}/videoSchedulApi/getCameraTypeList`,

  CHECK_CAMERA_IS_EXIST: `${URL_BASE}/videoSchedulApi/checkCamera`, // 检测摄像头是否已存在

  // 设备状况统计 /statistics
  GET_CAMERA_RUNNING_STATUS: `${URL_BASE}/videoFlowMonitor/selectVideoStatues`,
  GET_CAMERA_PICTURE_OUTPUT: `${URL_BASE}/videoFlowMonitor/selectVideoStructure`,

  GET_CAMERA_MONITOR_LIST: `${URL_BASE}/videoFlowMonitor/selectCameraMonitor`,
  GET_CAMERA_ON_OF_LINE: `${URL_BASE}/videoFlowMonitor/selectOnlineOffline`,
  GET_CAMERA_FIND_TYPE: `${URL_BASE}/videoFlowMonitor/selectFindType`,
  GET_CAMERA_INTER_TYPE: `${URL_BASE}/videoFlowMonitor/selectInterType`,
  GET_CAMERA_DEFINITION: `${URL_BASE}/videoFlowMonitor/selectImageQuality`,
  GET_CAMERA_DISTRICT: `${URL_BASE}/videoFlowMonitor/selectVideoDistrict`,

  ES_NUM_LIST: `${URL_BASE}/camera/esNumList`,
  QUERY_RUNNING_CAMERAPAGE: `${URL_BASE}/analysis/queryRunningCameraPage`,
  SAVE_CUSTOME_AREA: `${URL_BASE}/videoSchedulApi/saveCustomeArea`,
  GET_CUSTOME_AREA_LIST: `${URL_BASE}/videoSchedulApi/getCustomeAreaList`,

  // 获取摄像头的topic值
  SELECT_SET_TOPIC_TASKBYSPBFBM: `${URL_BASE}/videoSchedulApi/selectSxtTopicTaskBySpbfbm`,

  // mac轨迹
  GET_TARGET_TRAJECTORY: `${URL_BASE}/macTrajectory/getTargetTrajectory`,

  // mac碰撞
  COMMON_RAIL_ANALYSIS: `${URL_BASE}/macTrajectory/commonRailAnalysis`,
  GET_STATISTICS_EXPORT: `${URL_BASE}/videoFlowMonitor/exportExcel`,

  // 黄浦区域直播摄像头地址获取
  PLAY_DEVICE_ADRESS: `http://15.112.22.168:8900/v2/play/device`, // 黄浦区摄像头地址

  CHECKLOGIN: `${URL_BASE}/check/login`,

  // 视频下载
  VIDEO_DOWNLOAD: `${URL_BASE}/shanalysis/downloadSingleSearchResultVideo`,

  // 视频销毁
  STOP_CAMERA_LIVE: `${URL_BASE}/analysis/stopCameraLive`,
  // 浏览器下载
  BROWSER_UPGRADE: `${URL_BASE}/szjws_oss/tools/chrome/ChromeStandaloneSetup64.exe`,

  // 更新消息
  MODIFY_READ_USER: `${URL_BASE}/updatelogApi/modifyReadUser`,

  // 大屏信息获取
  CHECK_DPYS: `${URL_BASE}/common/checkDpys`,

  // 线索库
  GET_CASE_LIST: `${URL_BASE}/publiccloud/getCaseList`,
  ADD_CASE: `${URL_BASE}/publiccloud/addCase`,
  UPDATE_CASE: `${URL_BASE}/publiccloud/updateCase`,
  DEL_CASE: `${URL_BASE}/publiccloud/delCase`,
  GET_CLUE_LIST: `${URL_BASE}/publiccloud/getClueList`,
  ADD_LABEL: `${URL_BASE}/publiccloud/addLabel`,
  GET_LABEL_LIST: `${URL_BASE}/publiccloud/getLabelList`,
  DEL_LABEL: `${URL_BASE}/publiccloud/delLabel`,
  GET_CASE_TYPE_LISt: `${URL_BASE}/publiccloud/getCaseTypeList`, // 获取案件类别

  // 证书上传
  LICENSE_UPLOAD: `${URL_BASE}/license/uploadLicense`,

  // 研判实时保存
  GET_REALTIME_RECORD: `${URL_BASE}/common/getRealtimeRecord`,
  SAVE_REALTIME_RECORD: `${URL_BASE}/common/setRealtimeRecord`,

  SELECT_CUR_FRAMED: `${URL_BASE}/videoPlay/selectCurUserWhetherFramed`,
  UPDATE_FRAMED_PLAY: `${URL_BASE}/videoPlay/updateFramedPlayStatus`,
  UPDATE_EXPIRE_STATUS: `${URL_BASE}/videoPlay/updateExpireFramedStatus`, // 请求跟踪前请求
  SCREEN_SHOT: `${URL_BASE}/videoPlay/screenshot`, // rtsp视频截图

  // 判断是否显示推送，云盾用户显示
  SEND_BKALARM_USER: `${URL_BASE}/tconfig/selectConfig/sendBkAlarmUser`,
  SEND_BK_ALARM: `${URL_BASE}/warningDetail/sendBkAlarm`,

  // 查看多屏播放距离
  SET_MAP_TREACKING: `${URL_BASE}/tconfig/selectConfig/map_tracking`,

  // 动态检索参数
  DYNAMIC_RETRIEVAL_LIST: `${URL_BASE}/dynamicRetrieval/getList`,
  GET_BYID: `${URL_BASE}/dynamicRetrieval/getById`,

  // 新手引导
  GUIDE_GET: `${URL_BASE}/guide/get`, // 获取步骤信息
  UPDATE_GUIDE: `${URL_BASE}/guide/updateGuide`, // 更新步骤信息

  // 人口查询、人口管理
  SELECT_PERSON_LIST: `${URL_BASE}/popman/personList`, // 查询常驻/流动人员列表
  SELECT_PERSON_BY_PVID: `${URL_BASE}/popman/selectPersonByPvid`, // 根据pvid查询个人详情
  GET_VIDEO_TRACE_LIST: `${URL_BASE}/popman/videoTraceList`, // 根据pvid查询视频轨迹列表
  ADD_PERSON_TAG: `${URL_BASE}/popman/addTag`, // 添加标签
  DELETE_PERSON_TAG: `${URL_BASE}/popman/tags`, // 删除标签
  GET_ACTIVE_AREA: `${URL_BASE}/popman/activeArea`, // 查询活跃地点
  SELECT_TOGETHER_PERSON_LIST: `${URL_BASE}/popman/selectActTogetherPersonList`, // 查询同行人员列表
  SELECT_INOUT_RECORD: `${URL_BASE}/popman/selectInOutRecord`, // 根据pvid查询进出小区记录

  SELECT_IN_OUT_COUNT: `${URL_BASE}/popman/selectInOutPersonCount`, // 根据日期和时间统计进出小区人数
  SELECT_GOTO_OUT_SCHOOL_COUNT: `${URL_BASE}/popman/selectGoToAndOutOfSchoolPersonCount`, // 统计接送小孩人数
  SELECT_TAKE_AWAY_COUNT: `${URL_BASE}/popman/selectTakeAwayAndDeliveryPersonCount`, // 统计送外卖快递人数
});
export default URL();
