import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import Routes from './src/navigation/Routes';
import {FFmpegKitConfig} from 'ffmpeg-kit-react-native';
import {SoundProvider} from './src/context/SoundContext';
import Drag from './Drag';

const App = () => {
  // useEffect(() => {
  //   setTimeout(() => {
  //     SplashScreen.hide();
  //   }, 250);
  // }, []);
  FFmpegKitConfig.enableRedirection();
  FFmpegKitConfig.enableStatistics();

  return (
    // <Provider store={store}>
    <GestureHandlerRootView style={{flex: 1}}>
      <SoundProvider>
        <Routes />
        {/* <Drag /> */}
      </SoundProvider>
    </GestureHandlerRootView>
    // </Provider>
  );
};

export default App;
