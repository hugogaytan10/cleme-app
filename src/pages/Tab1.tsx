import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonList, IonPage, IonPopover, IonRefresher, IonRefresherContent, IonRow, IonSegment, IonSegmentButton, IonSelect, IonTitle, IonToast, IonToolbar, RefresherEventDetail } from '@ionic/react';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { isPlatform } from '@ionic/react';
import { Network } from '@capacitor/network';
import './Tab1.css';
interface CatImage {
  height: number;
  id: string;
  url: string;
  width: number;
}
const Tab1: React.FC = () => {
  const [cats, setCats] = useState<CatImage[]>();
  const [selectedSegment, setSelectedSegment] = useState('default');
  const [isOpen, setIsOpen] = useState(false);
  const [net, setNet] = useState(true);
  const popover = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const openPopover = (e: any) => {
    popover.current!.event = e;
    setPopoverOpen(true);
  };
  const GetData = async () => {
    try {
      const url = 'https://api.thecatapi.com/v1/images/search?limit=10';
      const peticion = await fetch(url);
      const response = await peticion.json();
      setCats(response);
      setSelectedSegment('default');
    } catch (error: any) { console.log(error) }
  }
  const GetDataDogs = async () => {
    try {
      const url = 'https://api.thedogapi.com/v1/images/search?limit=10';
      const peticion = await fetch(url);
      const response = await peticion.json();
      setCats(response);
      setSelectedSegment('segment');
    } catch (error: any) { console.log(error) }
  }
  const saveImageToDevice = async (url: string, fileName: string): Promise<void> => {
    try {
      let base64Data: string;
      if (isPlatform('hybrid')) {
        const file = await Filesystem.readFile({
          path: url!,
        });
        base64Data = file.data;
      } else {
        base64Data = await base64FromPath(url!);
      }
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data,
      });

      setIsOpen(true);

    } catch (error) {
      console.error('Error al guardar la imagen:', error);
    }
  }
  async function base64FromPath(path: string): Promise<string> {
    const response = await fetch(path);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject('method did not return a string');
        }
      };
      reader.readAsDataURL(blob);
    });
  }
  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      // Any calls to load data go here
      GetData();
      event.detail.complete();
    }, 2000);
  }
  Network.addListener('networkStatusChange', status => {
    status.connected ? setNet(true) : setNet(false);
    console.log(status)
  });
  useEffect(() => {
    GetData();
  }, [])
  useEffect(() => {
    console.log(net);
    GetData();
  }, [net])
  return (
    <IonPage>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle>Gatitos y Perritos</IonTitle>
        </IonToolbar>
      </IonHeader>
      {
        net
          ?
          <IonContent className="ion-padding">
            <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
              <IonRefresherContent></IonRefresherContent>
            </IonRefresher>
            <IonSegment value={selectedSegment}>
              <IonSegmentButton value="default" onClick={() => { GetData() }}>
                <IonLabel>Gatos</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="segment" onClick={() => { GetDataDogs() }}>
                <IonLabel>Perros</IonLabel>
              </IonSegmentButton>
            </IonSegment>
            <IonGrid>
              <IonRow className="ion-justify-content-center ion-align-items-center">
                {
                  cats != undefined &&
                  cats.map((cat, idx) => {
                    return (
                      <IonCol key={idx} size='12' sizeXl='3' sizeMd='4'>
                        <IonCard style={{ minWidth: '95%' }}>
                          <div style={{ display: 'flex', justifyContent: 'center' }} onClick={()=>{setPopoverOpen(true)}}>
                            <img alt="Silhouette of mountains" src={cat.url} style={{ width: '100%', height: '250px', objectFit: 'contain' }} />
                          </div>
                          <IonCardContent >
                            <IonButton style={{ margin: 'auto', display: 'block' }} onClick={() => { saveImageToDevice(cat.url, cat.id) }}>Guardar</IonButton>
                            <IonToast
                              isOpen={isOpen}
                              message="Ya se guardó, bato"
                              onDidDismiss={() => setIsOpen(false)}
                              duration={5000}
                            ></IonToast>
                            <IonPopover ref={popover} isOpen={popoverOpen} onDidDismiss={() => setPopoverOpen(false)}>
                              <IonContent class="ion-padding">hola!</IonContent>
                            </IonPopover>
                          </IonCardContent>
                        </IonCard>
                      </IonCol>
                    )
                  })
                }
              </IonRow>
            </IonGrid>
          </IonContent>
          :
          <IonContent>
            <IonItem>No hay net :c</IonItem>
          </IonContent>
      }

    </IonPage>
  );
};


export default Tab1;
