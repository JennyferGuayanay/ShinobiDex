
import { onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';

export function configurarRed() {
  onlineManager.setEventListener((setOnline) => {
    let inicializado = false;

    const suscripcion = Network.addNetworkStateListener((estado) => {
      inicializado = true;
      setOnline(!!estado.isConnected);
      console.log('[RED]', new Date().toISOString(), estado.isConnected);
    });

    Network.getNetworkStateAsync()
      .then((estado) => {
        if (!inicializado) {
          setOnline(!!estado.isConnected);
        }
      })
      .catch((error) => {
        console.warn('[RED] No se pudo consultar:', error);
      });

    return () => suscripcion.remove();
  });
}
