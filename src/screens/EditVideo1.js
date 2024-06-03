import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { images } from '../assets/images/image';

const EditVideo1 = ({ navigation }) => {
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [cameraDevice, setCameraDevice] = useState('front');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSelectedImage, setIsSelectedImage] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [imageSource, setImageSource] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [flashMode, setFlashMode] = useState('on');
  const [isSecondModalVisible, setIsSecondModalVisible] = useState(false);
  const [isThirdModalVisible, setIsThirdModalVisible] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false)
  const cameraRef = useRef(null);
  const device = useCameraDevice(cameraDevice);
//  useEffect(() => {
//     // Simulate some loading or initialization process
//     // For example, you can use a setTimeout to navigate to the next screen after a certain time
//     const splashTimeout = setTimeout(() => {
//       // Navigate to the next screen, replace 'Home' with the screen you want to navigate to
//       navigation.replace('CameraScreen');
//     }, 3000); // 2000 milliseconds (2 seconds) - you can adjust this duration

//     // Cleanup the timeout to avoid memory leaks
//     return () => clearTimeout(splashTimeout);
//   }, [navigation]);

  useEffect(() => {
    checkCameraPermission();
  }, []);

  // useEffect(() => {
  //   return () => {
  //     if (selectedImage !== '') {
  //       navigation.navigate('EditVideo2', { selectedImage: selectedImage })
  //     }
  //     setIsSelectedImage(false)
  //   }
  // }, [isSelectedImage]);
  
  useEffect(() => {
    const checkPermission = async () => {
      const getCheckPermissionPromise = () => {
        if (Platform.Version >= 33) {
          return Promise.all([
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES),
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO),
          ]).then(
            ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
              hasReadMediaImagesPermission && hasReadMediaVideoPermission,
          );
        } else {
          return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        }
      };

      const hasPermission = await getCheckPermissionPromise();
      if (hasPermission) {
        setHasPermission(true);
      } else {
        const getRequestPermissionPromise = () => {
          if (Platform.Version >= 33) {
            return PermissionsAndroid.requestMultiple([
              PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
              PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
            ]).then(
              (statuses) =>
                statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
                PermissionsAndroid.RESULTS.GRANTED &&
                statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
                PermissionsAndroid.RESULTS.GRANTED,
            );
          } else {
            return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE).then(
              (status) => status === PermissionsAndroid.RESULTS.GRANTED,
            );
          }
        };

        const requestPermission = async () => {
          const hasPermission = await getRequestPermissionPromise();
          if (hasPermission) {
            setHasPermission(true);
          }
        };

        requestPermission();
      }
    };

    checkPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      const result = await check(PERMISSIONS.ANDROID.CAMERA);
      if (result === RESULTS.GRANTED) {
        setIsPermissionGranted(true);
      } else {
        requestCameraPermission();
      }
    } catch (error) {
      console.error('Error checking camera permission:', error);
    }
  };


  const requestCameraPermission = async () => {
    try {
      const result = await request(PERMISSIONS.ANDROID.CAMERA);
      if (result === RESULTS.GRANTED) {
        setIsPermissionGranted(true);
      } else {
        console.warn('Camera permission denied');
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
    }
  };

  // const capturePhoto = async () => {
  //   setPhotoLoading(true)
  //   setHasPermission(true)
  //   if (cameraRef.current !== null) {
  //     const file = await cameraRef.current.takePhoto()
  //     await CameraRoll.save(`file://${file.path}`, {
  //       type: 'photo',
  //       flash: flashMode, // Set flash mode here
  //     })
  //     const result = await fetch(`file://${file.path}`)
  //     const data = await result.blob();
  //     setImageSource(`file://${file.path}`);
  //     if (file.path !== '') {
  //       navigation.navigate('EditVideo2', { selectedImage: `file://${file.path}` })
  //       setPhotoLoading(false)
  //     }
  //     setShowCamera(false);
  //   }
  // };

  // const startRecording = async () => {
  //   try {
  //     await cameraRef.current?.record({
  //       quality: CameraRecordingQuality['1080p'],
  //     });
  //     setIsRecording(true);
  //   } catch (error) {
  //     console.error('Error starting recording:', error);
  //   }
  // };

  // const stopRecording = async () => {
  //   try {
  //     const { video } = await cameraRef.current?.stopRecording();
  //     setIsRecording(false);

  //     // Handle the recorded video, e.g., save it or use it in your application
  //     console.log('Recorded Video:', video);
  //   } catch (error) {
  //     console.error('Error stopping recording:', error);
  //   }
  // };

  // const toggleRecording = () => {
  //   if (isRecording) {
  //     stopRecording();
  //   } else {
  //     startRecording();
  //   }
  // };
  const renderCamera = () => {

  return (
    < >
      {/* Camera Preview */}

       {/* <Camera
        style={{ flex: 1, position: 'relative' }}
        device={device}
        isActive={true}
        ref={(ref) => {
          cameraRef.current = ref;
        }}
        onStatusChange={({ cameraStatus }) => {
          if (cameraStatus === 'READY') {
            // Start or configure the camera when it is ready
          }
        }}
        photo={true}
      //  flash={flashMode} // Add this line to set flash mode

      />
    */}
      {/* Start/Stop Recording Button */}
      <TouchableOpacity style={styles.recordButton} 
      //onPress={toggleRecording}
    //  onPress={() => capturePhoto()}
      // onPress={() => setCameraDevice(cameraDevice === 'front' ? 'back' : 'front')}
      >
       <Image source={images.Cam} style={{ width: wp('10%'), height: hp('7%'),alignSelf:'center', resizeMode:'contain' }} />

      </TouchableOpacity>
    
    </>
  );
 };
  return <View style={styles.container}>{renderCamera()}</View>;

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   // justifyContent: 'flex-end',
  //  alignItems: 'center',
    backgroundColor: Platform.OS === 'ios' ? '#333300' : '#333300',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  recordButton: {
    alignSelf: 'center',
    position:'absolute',
    justifyContent: 'flex-end',
    flex:1,
    bottom: hp('2%'),
  },
  recordIcon: {
    width: wp('15%'),
    height: hp('10%'),
    resizeMode: 'contain',
  },
});

export default EditVideo1;
