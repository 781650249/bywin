import authUrl from './auth';
import global from './global';
import videoArchives from './video-archives';
import discover from './discover';
import profile from './profile';
import vehicleFile from './vehicle-file'
import eventHubs from './event-hubs';
import personManage from './person-manage';
import situation from './situation';
import sysConfig from './sys-config';
import community from './community'
import patrol from './patrol';
import carManager from './carManager'
import realtyManager from './realty-manager'


const URL = {
  ...authUrl,
  ...global,
  ...videoArchives,
  ...discover,
  ...profile,
  ...vehicleFile,
  ...eventHubs,
  ...personManage,
  ...situation,
  ...sysConfig,
  ...community,
  ...patrol,
  ...carManager,
  ...realtyManager
};

export default URL;
