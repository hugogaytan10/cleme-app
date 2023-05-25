import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonItem, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';
import { Device } from '@capacitor/device';

const Tab2: React.FC = () => {
  const [info,setInfo]=useState(0);
  const [device,setDevice]=useState("");


const logDeviceInfo = async () => {
  const info = await Device.getInfo();

  let divais ="Modelo: "+info.model+" Sistema operativo: "+info.operatingSystem+" Version: "+info.osVersion;
  setDevice(divais);
  
}
const logBatteryInfo = async () => {
  const infoo = await Device.getBatteryInfo();
  setInfo(infoo.batteryLevel || -1);
}
useEffect(()=>{
  logBatteryInfo()
  logDeviceInfo()
},[])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
       <IonItem>
        Bateria: {info*100}%
       </IonItem>
       <IonItem>
        {device}
       </IonItem>
      </IonContent>
    </IonPage>
  );
};


export default Tab2;
