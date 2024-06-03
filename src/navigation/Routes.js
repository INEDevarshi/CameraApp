import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import CameraScreen from '../screens/CameraScreen';
// import EditVideo from './EditVideo';
import EditVideo1 from '../screens/EditVideo1';
import EditVideo2 from '../screens/EditVideo2';
import Loop from '../screens/Loop';
import SlowMotion from '../screens/SlowMotion';
import ImageFilter from '../screens/ImageFilter';
import Layout from '../screens/Layout';
import Android from '../screens/Android';
import Photo from '../screens/Photo';
import EditingScreen from '../screens/Editing/EditingScreen';
import UploadScreen from '../screens/Upload/UploadScreen';
import Demo from '../screens/Demo';
// import Trial from './Trial';

const Stack = createNativeStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        // initialRouteName="demo"
      >
        <Stack.Screen name={'CameraScreen'} component={CameraScreen} />
        <Stack.Screen name={'Photo'} component={Photo} />

        <Stack.Screen name={'EditingScreen'} component={EditingScreen} />
        <Stack.Screen name={'EditVideo2'} component={EditVideo2} />
        <Stack.Screen name={'SlowMotion'} component={SlowMotion} />
        <Stack.Screen name={'EditVideo1'} component={EditVideo1} />
        <Stack.Screen name={'Loop'} component={Loop} />
        <Stack.Screen name={'ImageFilter'} component={ImageFilter} />
        <Stack.Screen name={'Layout'} component={Layout} />
        <Stack.Screen name={'Android'} component={Android} />
        <Stack.Screen name={'upload'} component={UploadScreen} />
        <Stack.Screen name={'demo'} component={Demo} />

        {/* <Stack.Screen name={'EditVideo1'} component={EditVideo1} />
          <Stack.Screen name={'EditVideo'} component={EditVideo} />
          <Stack.Screen name={'Trial'} component={Trial} />

          <Stack.Screen name={'Android'} component={Android} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default Routes;
