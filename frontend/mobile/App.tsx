import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorBoundary } from './src/components';
import { AuthProvider } from './src/context/AuthContext';
import { ToastProvider } from './src/context/ToastContext';
import { useAuth } from './src/hooks/useAuth';
import { AppNavigator } from './src/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore startup race conditions in development.
});

SplashScreen.setOptions({
  duration: 450,
  fade: true,
});

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const prepare = async (): Promise<void> => {
      try {
        const warehouseSource = Image.resolveAssetSource(require('./assets/warehouse_shelves.png'));
        const logoSource = Image.resolveAssetSource(require('./assets/splash-icon.png'));

        const preloadTasks: Promise<boolean>[] = [];

        if (warehouseSource?.uri) {
          preloadTasks.push(Image.prefetch(warehouseSource.uri));
        }
        if (logoSource?.uri) {
          preloadTasks.push(Image.prefetch(logoSource.uri));
        }

        await Promise.all(preloadTasks);
      } finally {
        if (isMounted) {
          setIsAppReady(true);
        }
      }
    };

    prepare();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isAppReady) {
      return;
    }

    SplashScreen.hideAsync().catch(() => {
      // Keep app resilient in case splash was already hidden.
    });
  }, [isAppReady]);

  if (!isAppReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" animated />
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider>
            <AppBootstrappedNavigator />
          </ToastProvider>
        </AuthProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

function AppBootstrappedNavigator() {
  const { isReady, restoreSession } = useAuth();

  useEffect(() => {
    restoreSession().catch(() => {
      // Keep startup resilient while auth backend is not wired yet.
    });
  }, [restoreSession]);

  if (!isReady) {
    return null;
  }

  return <AppNavigator />;
}
