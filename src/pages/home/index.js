import React, { useState, useEffect } from 'react';
import Websocket from 'react-websocket';
import { useSelector } from 'dva'
import ErrorBoundary from '@/components/ErrorBoundary';
import { wsUrl } from '@/config'
import IntelligentPerception from './IntelligentPerception';
import IntelligentWarning from './IntelligentWarning';
import PersonInfo from './PersonInfo';
import VehicleInfo from './VehicleInfo';
import HouseInfo from './HouseInfo';
import TrendControl from './TrendControl';
import OrgDiscovery from './OrgDiscovery';
import Main from './Main';
import styles from './index.less';

export default function() {
  const [jsonString, setjsonString] = useState('');
  const [intelligentPerception, setIntelligentPerception] = useState({});
  const [intelligentWarning, setIntelligentWarning] = useState({});
  const [personInfo, setPersonInfo] = useState({});
  const [vehicleInfo, setVehicleInfo] = useState({});
  const [houseInfo, setHouseInfo] = useState(
    Array.from({ length: 6 }).map(() => ({ name: ' ', count: 0 })),
  );
  const [rrendControl, setTrendControl] = useState({});
  const [orgDiscovery, setOrgDiscovery] = useState({});
  const [headerItems, setHeaderItems] = useState(
    Array.from({ length: 6 }).map(() => ({ name: ' ', count: 0 })),
  );

  const { account } = useSelector((state) => state.auth)
  useEffect(() => {}, []);

  const handleData = (jsonData) => {
    if (jsonData === jsonString) return;
    setjsonString(jsonData);
    try {
      const {
        otherCount,
        perception,
        warning,
        peopleTrend,
        vehicleTrend,
        communityHomeCount,
        screenBehaviourControl,
        organizationCount,
      } = JSON.parse(jsonData);
      setHouseInfo(communityHomeCount);
      setHeaderItems(otherCount);

      const { cameraList, passPeopleList, passCarList } = perception;
      setIntelligentPerception({ cameraList, person: passPeopleList, vehicle: passCarList });

      const { eventCount, homeEventList } = warning;
      setIntelligentWarning({ eventList: eventCount, targetList: homeEventList });

      const { peopleCount, flowStatistics: personStatistics } = peopleTrend;
      setPersonInfo({ statistics: peopleCount, chartData: personStatistics.threeList });

      const { vehicleCount, flowStatistics: vehicleStatistics } = vehicleTrend;
      setVehicleInfo({ statistics: vehicleCount, chartData: vehicleStatistics.threeList });

      const { keyPersonCountList, caringPersonCount } = screenBehaviourControl;
      setTrendControl({ keyPerson: keyPersonCountList, caringObject: caringPersonCount });
      setOrgDiscovery({ data: organizationCount });
    } catch (error) {
      return error;
    }
  };
  return (
    <div className={styles.wrapper}>
      <Websocket url={`${wsUrl}/${account}`} onMessage={handleData} />
      <div className={styles.title}>智慧小区</div>
      <div className={styles.main}>
        <Main headerItems={headerItems} />
      </div>
      <div className={styles.left}>
        <div className={styles.leftCard}>
          <ErrorBoundary>
            <IntelligentPerception {...intelligentPerception} />
          </ErrorBoundary>
        </div>
        <div className={styles.leftCard}>
          <ErrorBoundary>
            <IntelligentWarning {...intelligentWarning} />
          </ErrorBoundary>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.rightCard}>
          <ErrorBoundary>
            <PersonInfo {...personInfo} />
          </ErrorBoundary>
        </div>
        <div className={styles.rightCard}>
          <ErrorBoundary>
            <VehicleInfo {...vehicleInfo} />
          </ErrorBoundary>
        </div>
        <div className={styles.rightCard}>
          <ErrorBoundary>
            <HouseInfo houseInfo={houseInfo} />
          </ErrorBoundary>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.bottomCard}>
          <ErrorBoundary>
            <TrendControl {...rrendControl} />
          </ErrorBoundary>
        </div>
        <div className={styles.bottomCard}>
          <OrgDiscovery {...orgDiscovery} />
        </div>
      </div>
    </div>
  );
}
