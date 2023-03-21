import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';

import MusicPlayer from './src/page/MusicPlayer';

function App() {
  return (
    <SafeAreaView style={styles.container}>
      <MusicPlayer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

export default App;
