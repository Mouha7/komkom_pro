import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { UIStateLibraryScreen } from './src/screens/Showcase/UIStateLibraryScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <UIStateLibraryScreen />
    </SafeAreaProvider>
  );
}
