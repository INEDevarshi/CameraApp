// {To implement filters and stickers, you need to integrate
// additional libraries or custom components that handle these features. 
//Explore libraries like react-native-image-filter-kit or implement your own custom components 
// https://instamobile.io/react-native-tutorials/instagram-photo-filters-react-native/
//for filters and stickers based on your specific requirements.}
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import { COLOR } from '../utils/Config';

const SlowMotion = ({ route }) => {
    const [capturedPhoto, setCapturedPhoto] = useState(null);

  const takePicture = async (camera) => {
    if (camera) {
      const options = { quality: 0.5, base64: true };
      const data = await camera.takePictureAsync(options);
      setCapturedPhoto(data.uri);
    }
  };
  const toggleFlash = () => {
    setFlashMode(flashMode === 'off' ? 'on' : 'off');
    console.log('flash onnn', flashMode);
  };
  const recordVideo = async (camera, isSlowMotion = false, isBoomerang = false) => {
    if (camera) {
      const quality = isSlowMotion ? 'low' : 'high'; // Adjust quality based on slow-motion
      const maxDuration = isBoomerang ? 3 : 10; // Adjust duration for boomerang effect

      const options = {
        quality,
        maxDuration,
        codec: 'mp4', // Set the desired video codec
      };

      const recording = await camera.recordAsync(options);
      console.log('Recording URI:', recording.uri);
    }
  };

  return (
    <View style={styles.container}>
              {/* <Image source={{ uri: capturedImage }} style={{ width: 200, height: 200 }} /> */}

      {capturedPhoto ? (
      <Image source={{ uri: capturedImage }} style={{ width: 200, height: 200 }} />
      ) 
      : (
        <Camera
        //   style={styles.preview}
        //   type={Camera.Constants.Type.back}
        //   flashMode={Camera.Constants.FlashMode.off}
        style={{ flex: 1, position: 'relative' }}
      //  device={device}
        isActive={true}
        ref={(ref) => {
          cameraRef.current = ref;
        }}
        onStatusChange={({ cameraStatus }) => {
          if (cameraStatus === 'READY') {
            // Start or configure the camera when it is ready
          }
        }}
       // flash // Add this line to set flash mode
        video={true} 
        audio={true}
        >
          {({ camera, status }) => {
            if (status !== 'READY') return <View />;
            return (
              <View style={styles.captureContainer}>
                <TouchableOpacity
                  onPress={() => takePicture(camera)}
                  style={styles.capture}
                />
                <TouchableOpacity
                  onPress={() => recordVideo(camera)}
                  style={styles.recordButton}
                />
                <TouchableOpacity
                  onPress={() => recordVideo(camera, true)}
                  style={styles.slowMotionButton}
                />
                <TouchableOpacity
                  onPress={() => recordVideo(camera, false, true)}
                  style={styles.boomerangButton}
                />
              </View>
            );
          }}
        </Camera>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  captureContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
  },
  capture: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  recordButton: {
    backgroundColor: 'red',
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 10,
  },
  slowMotionButton: {
    backgroundColor: 'blue',
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 10,
  },
  boomerangButton: {
    backgroundColor: COLOR.GREEN,
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 10,
  },
  previewImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default SlowMotion;
