import React, { useState } from 'react';
import { IonButton, IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';
import { Browser } from '@capacitor/browser';
import { Clipboard } from '@capacitor/clipboard';
import './Tab3.css';

const Tab3: React.FC = () => {
  const [location, setLocation] = useState("Click para ubicacion");
  const [input, setInput] = useState("");
  const printCurrentPosition = async () => {
    const coordinates = await Geolocation.getCurrentPosition();
    return coordinates;
  };
  const openSite = async () => {
    await Browser.open({ url: 'https://www.facebook.com/' });
  };
  async function writeToClipboard(text:string){
    console.log(text)
  await Clipboard.write({
    string: text
  });
}
  return (
    <IonPage>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle>Plugins a lo buey</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

        <div style={{ display: 'flex', justifyContent: "space-between" }}>
          <IonInput placeholder={location} ></IonInput>
          <IonButton onClick={async () => { setLocation(await printCurrentPosition().then(pos => { return pos.coords.longitude + " " + pos.coords.latitude; })) }}>Ubicación</IonButton>
        </div>
        <IonButton onClick={() => { openSite() }}>Open Site</IonButton>
        <div style={{display: 'flex',  justifyContent: "space-between"}}>
        <IonInput placeholder='escribe algo...' onIonChange={(e)=>{if(e.target.value != undefined) setInput(e.target.value.toString())}}></IonInput>
        <IonButton onClick={()=>{writeToClipboard(input)}}>COPIAR</IonButton>
       </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
