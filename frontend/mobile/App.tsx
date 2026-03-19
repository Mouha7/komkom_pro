import { StatusBar } from 'expo-status-bar';

import { UIStateLibraryScreen } from './src/screens/Showcase/UIStateLibraryScreen';

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <UIStateLibraryScreen />
    </>
  );
}
