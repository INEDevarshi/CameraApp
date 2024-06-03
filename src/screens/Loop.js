import React, { useState,useRef, useEffect } from 'react';
import { View, Image, Text,TouchableOpacity, StatusBar, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { images } from '../assets/images/image';
// import { CameraRuntimeError, PhotoFile, useCameraDevice, useCameraFormat, useFrameProcessor, VideoFile } from 'react-native-vision-camera'
import { CameraRuntimeError, PhotoFile, useCameraDevice, useCameraFormat, useFrameProcessor, VideoFile, RNCamera } from 'react-native-vision-camera';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';

const Loop = props => {
  const navigation = useNavigation();
  
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

  const capturePhoto = async () => {
    setPhotoLoading(true)
    setHasPermission(true)
    if (cameraRef.current !== null) {
      const file = await cameraRef.current.takePhoto()
      await CameraRoll.save(`file://${file.path}`, {
        type: 'photo',
        flash: flashMode, // Set flash mode here
      })
      const result = await fetch(`file://${file.path}`)
      const data = await result.blob();
      setImageSource(`file://${file.path}`);
      if (file.path !== '') {
        navigation.navigate('EditVideo2', { selectedImage: `file://${file.path}` })
        setPhotoLoading(false)
      }
      setShowCamera(false);
    }
  };

 

  const pickImage = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      multiple: true
    })
      .then(image => {
        console.log(image);
        setSelectedImage({ uri: image.path, mime: image.mime, source: 'gallery' });
        navigation.navigate('EditVideo2', { selectedImage: { uri: image.path, mime: image.mime, source: 'camera' } });
        navigation.goBack();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const takePhoto = () => {
    ImageCropPicker.openCamera({
      cropping: true,
    //  mediaType: 'video',
  //  cameraProps:true

    })
      .then(image => {
        console.log(image);
        setSelectedImage({ uri: image.path, mime: image.mime, source: 'camera' });
        navigation.navigate('EditVideo2', { selectedImage: { uri: image.path, mime: image.mime, source: 'camera' } });
        // navigation.goBack(); // Consider removing this line if you want to keep the camera open after taking a photo
      })
      .catch(error => {
        console.log(error);
      });
  };

  const onCloseButtonPress = () => {
    navigation.navigate('EditVideo1');
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const device = useCameraDevice('back')
  if (device == null) return <NoCameraErrorView />

  useEffect(() => {
    // Call takePhoto when the component mounts (screen is opened)
  // takePhoto();
  }, []);
  const renderCamera = () => {

  return (
    <LinearGradient colors={['#333300', '#000000']} style={styles.container}>
    <StatusBar backgroundColor="#333300" />

    <View style={{ alignItems: 'flex-start', margin: hp('1%'), justifyContent: 'space-between', flexDirection: 'row' }}>
            
         <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={images.Back} style={{ width: wp('8%'), height: hp('7%'), resizeMode: 'contain' }} />
        </TouchableOpacity>

      <TouchableOpacity onPress={pickImage}>
        <Image source={images.Lightning} style={{ width: wp('7%'), height: hp('5%'), marginTop: hp('1.5%'), resizeMode: 'contain' }} />
      </TouchableOpacity>
    
       <TouchableOpacity onPress={toggleModal}>
        <Image source={images.ColorMode} style={{ width: wp('10%'), height: hp('7%'), resizeMode: 'contain' }} />
     </TouchableOpacity>
    </View>

    


    <View style={{ alignItems: 'flex-end', justifyContent: 'center', flexDirection: 'row', marginTop: hp('80%') }}>
      {/* <TouchableOpacity onPress={pickImage}>
        <Image source={images.Group37} style={{ width: wp('12%'), height: hp('7%'), margin: hp('2%'), resizeMode: 'contain' }} />
      </TouchableOpacity> */}
   
      <TouchableOpacity onPress={()=>navigation.navigate('EditVideo2')} style={styles.takebutton}>
        <Image source={images.Broom} style={{ width: wp('20%'), height: hp('10%'), marginTop: hp('-7%'), resizeMode: 'contain' }} />
        <Text style={{color:'#fff',margin:hp('1%'),marginLeft:hp('-1%'),textAlign:'center',fontSize:18}}> Boomerang</Text>
     </TouchableOpacity>
     <TouchableOpacity onPress={()=>navigation.navigate('CameraScreen')} >
        <Image source={images.Refresh} style={{ width: wp('12%'), height: hp('7%'), marginLeft: hp('7%'), resizeMode: 'contain' }} />
      </TouchableOpacity>
      
    </View>

    {/* Modal */}
    <Modal transparent={true} animationType="slide" visible={isModalVisible} onRequestClose={toggleModal}>
      <TouchableWithoutFeedback onPress={()=>navigation.navigate('CameraScreen')}>
        <View style={styles.modalOverlay}>
          <Image source={images.Frame15} style={{ width: wp('70%'), height: hp('50%'), marginTop: hp('-5%'), resizeMode: 'contain' }} />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  </LinearGradient>
  );
};
return <View style={styles.container}>{renderCamera()}</View>;
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  takebutton: {
   alignSelf: 'center',
   marginLeft:hp('15%')
  },
  imageContainer: {
    alignItems: 'center',
    
  },
  image: {
    width: 300,
    height: 400,
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#333300',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:1,borderRadius:5,
    backgroundColor:'#fff'
  },
  camera: {
    flex: 1,
    width: '100%',
  },
});

export default Loop;
