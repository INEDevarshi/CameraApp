import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Modal,
  PanResponder,
  StyleSheet,
  StatusBar,
  FlatList,
  Button,
  TouchableWithoutFeedback,
  Platform,
  Image,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  BackHandler,
  Linking,
} from 'react-native';
import * as Permissions from 'react-native-permissions';
import {
  Camera,
  useCameraDevice,
  CameraRecordingQuality,
  useCameraFormat,
  getCameraDevice,
} from 'react-native-vision-camera';
import Video from 'react-native-video';
import {images} from '../assets/images/image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RadioButton, Icon, TouchableRipple} from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import {COLOR, FONT} from '../utils/Config';
import {FFmpegKit, FFmpegKitConfig} from 'ffmpeg-kit-react-native';
import {handleSlowMotionVideo} from '../components/Video/SlowMotion';
import {handleBoomerangVideo} from '../components/Video/BoomerangVideo';
import RNFS from 'react-native-fs';
import ImageResizer from '@bam.tech/react-native-image-resizer';

const CameraScreen = ({props, route}) => {
  const screen = Dimensions.get('screen');

  const [cameraDevice, setCameraDevice] = useState('front');
  const [isRecording, setIsRecording] = useState(false);
  const [remainingTime, setRemainingTime] = useState(90);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSelectedImage, setIsSelectedImage] = useState(false);
  const [selectedGalary, setSelectedGalary] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [Drafts, setDrafts] = useState([]);
  const [selectedDrafts, setSelectedDrafts] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [imageSource, setImageSource] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [flashMode, setFlashMode] = useState(false);
  const [isFlashAvailable, setIsFlashAvailable] = useState(false);
  const [isSecondModalVisible, setIsSecondModalVisible] = useState(false);
  const [isThirdModalVisible, setIsThirdModalVisible] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [isSlowMotion, setIsSlowMotion] = useState(false);
  const [slowMotionLoading, setSlowMotionLoading] = useState(false);
  const [isReLoop, setIsReLoop] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const cameraRef = useRef(null);
  const navigation = useNavigation();
  //const device = 'front'; // Assuming you want to use the back camera
  const device = useCameraDevice(cameraDevice);
  const format = useCameraFormat(device, [
    {videoResolution: {width: 1820, height: 1080}},
    {photoAspectRatio: screen.height / screen.width},
    {fps: 30},
  ]);
  const aspectRatio = format ? format.photoHeight / format.photoWidth : 3 / 4;
  const device_id = DeviceInfo.getUniqueId();
  const BASE_URL = 'https://socialmedia.digiatto.info/public/api';

  const handleLogin = async () => {
    try {
      const device_id = DeviceInfo.getUniqueId();

      const response = await axios.post(`${BASE_URL}/login`, {
        device_id: '127.0.0.1',
      });
      await AsyncStorage.setItem('userdevice_id', response.data.user.device_id);
      await AsyncStorage.setItem(
        'userInfo',
        JSON.stringify(response.data.user),
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const loginUser = async () => {
      try {
        const response = await handleLogin();
      } catch (error) {
        console.error('Error during login:', error);
      }
    };

    // loginUser();
  }, []);
  useEffect(() => {
    checkFlashAvailability();
    setSelectedGalary(1);
  }, []);

  const checkFlashAvailability = async () => {
    try {
      const availableFlashModes = await Camera.getAvailableCameraDevices();
      // console.log('availableFlashModes', availableFlashModes);
      setIsFlashAvailable(availableFlashModes.length > 0);
    } catch (error) {
      console.error('Error checking flash availability:', error);
      setIsFlashAvailable(false);
    }
  };

  // For video Timmer
  useEffect(() => {
    let timer;
    if (isRecording && remainingTime > 0) {
      timer = setTimeout(() => {
        setRemainingTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      handleRecordButtonPressOut();
    }
    return () => clearTimeout(timer);
  }, [isRecording, remainingTime]);

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  useEffect(() => {
    getDrafts();
  }, [selectedGalary]);

  const galaryData = [
    {
      id: 1,
      name: 'Gallery',
      image: images.PhotoGalary,
    },
    {
      id: 2,
      name: 'Draft',
      image: images.Draft,
    },
  ];

  useEffect(() => {
    // checkCameraPermission();
    // handleDone();
    // checkPermission();
    // storeUserInfo();
    if (hasPermission) {
      getAllPhotos();
      getDrafts();
    }
  }, [hasPermission]);

  const getDrafts = () => {
    AsyncStorage.getItem('Draft')
      .then(arr => {
        fetchedArr = arr ? JSON.parse(arr) : [];
        setDrafts(fetchedArr);
      })
      .catch(e => {
        console.log('err in fetching draft:', e);
      });

    console.log('Draft:', Drafts);
  };

  const getAllPhotos = async () => {
    await CameraRoll.getPhotos({
      first: 100,
      assetType: 'All',
      // after:20,
    })
      .then(r => {
        setPhotos(r.edges);
      })
      .catch(err => {
        console.log('error on take galary photo', err);
      });
  };
  useFocusEffect(
    React.useCallback(() => {
      checkPermission(); // Call the function when the screen gains focus
    }, [navigation]),
  );

  const checkPermission = async () => {
    const atLeastAndroid13 =
      Platform.OS === 'android' && Platform.Version >= 33;
    const exitApp = () => {
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit?',
        [
          {
            text: 'Cancel',
            onPress: () => Linking.openSettings(),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              BackHandler.exitApp();
            },
          },
        ],
        {cancelable: false},
      );
    };

    try {
      const requestCameraPermission = await Permissions.request(
        Permissions.PERMISSIONS.ANDROID.CAMERA,
      );
      const requestStoragePermission = await Permissions.request(
        Permissions.PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      );
      const requestStoragePermissionVideo = await Permissions.request(
        Permissions.PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      );
      const requestStoragePermission2 = await Permissions.request(
        Permissions.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      const requestStoragePermission3 = await Permissions.request(
        Permissions.PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      );
      const requestAudioPermission = await Permissions.request(
        Permissions.PERMISSIONS.ANDROID.RECORD_AUDIO,
      );
      const requestAudioPermission1 = await Permissions.request(
        Permissions.PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
      );

      // console.log(
      //   'permission',
      //   requestCameraPermission,
      //   requestStoragePermission,
      //   requestStoragePermissionVideo,
      //   requestStoragePermission2,
      //   requestStoragePermission3,
      //   requestAudioPermission,
      //   requestAudioPermission1,
      // );
      // console.log('atLeastAndroid13', atLeastAndroid13);

      const allPermissionsGranted =
        (requestCameraPermission === 'granted' ||
          requestCameraPermission === 'limited') &&
        (requestStoragePermission === 'granted' ||
          requestStoragePermission === 'limited' ||
          requestStoragePermission === 'unavailable') &&
        (requestStoragePermissionVideo === 'granted' ||
          requestStoragePermissionVideo === 'limited' ||
          requestStoragePermissionVideo === 'unavailable') &&
        (requestAudioPermission === 'granted' ||
          requestAudioPermission === 'limited' ||
          requestAudioPermission === 'unavailable') &&
        (requestAudioPermission1 === 'granted' ||
          requestAudioPermission1 === 'limited' ||
          requestAudioPermission1 === 'unavailable');
      //   &&
      // (requestStoragePermission2 === 'granted' ||
      //   requestStoragePermission2 === 'limited' ||
      //   requestStoragePermission2 === 'unavailable');
      // console.log('allPermissionsGranted', allPermissionsGranted);
      if (allPermissionsGranted) {
        setHasPermission(true);
      } else {
        // Show custom alert if permission is not granted
        Alert.alert(
          'Permission Required',
          'Please grant all the necessary permissions to use the app.',
          [
            {
              text: 'Cancel',
              onPress: () => {
                // Handle the "Cancel" logic, for example, exit the app
                exitApp();
              },
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                // Open app settings
                Linking.openSettings();
              },
            },
          ],
        );
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };
  useEffect(() => {
    if (selectedVideo != null) {
      handleVideoDone();
    }
  }, [selectedVideo]);

  useEffect(() => {
    return () => {
      if (selectedImage !== '' || selectedImage !== null) {
        //saveData();
        // navigation.navigate('editing', {selectedImage: selectedImage});
        //navigation.navigate('ImageFilter', { selectedImage: selectedImage })
      }
      setIsSelectedImage(false);
    };
  }, [isSelectedImage]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const toggleSecondModal = () => {
    setIsModalVisible(false);
    setIsSecondModalVisible(!isSecondModalVisible);
  };
  const toggleThirdModal = () => {
    setIsModalVisible(false);
    setIsSecondModalVisible(false);
    setIsThirdModalVisible(!isThirdModalVisible);
  };
  const orientationToRotationAngle = Orientation => {
    console.log('Orientation', Orientation);
    switch (Orientation) {
      case 'portrait':
        return 90; // not tested
      case 'portrait-upside-down':
        return 180; // not tested
      case 'landscape-left':
        return 0; // tested
      case 'landscape-right':
        return 0; // tested
      default:
        // Handle unknown orientation
        return 0;
    }
  };

  const capturePhoto = async () => {
    setPhotoLoading(true);
    setHasPermission(true);
    if (cameraRef.current !== null) {
      const file = await cameraRef.current.takePhoto({
        flash: flashMode ? 'on' : 'off',
      });

      const cameras = await Camera.getAvailableCameraDevices();
      const device = cameras.filter(el => el.position === cameraDevice);

      // await CameraRoll.save(`file://${file.path}`, {
      //   type: 'photo',
      //   flash: flashMode, // Set flash mode here
      // })
      let rotationAngle = orientationToRotationAngle(device.sensorOrientation);

      // If the front camera is used, adjust the rotation accordingly
      if (cameraDevice === 'front') {
        rotationAngle = (rotationAngle + 90) % 360; // Adjusting rotation for front camera
      }

      setImageSource(`file://${file.path}`);
      if (file.path !== '') {
        await ImageResizer.createResizedImage(
          'file://' + file?.path || '',
          1200,
          720,
          'JPEG',
          90,
          // orientationToRotationAngle(device[0].sensorOrientation),
          rotationAngle,
        )
          .then(res => {
            console.log('res image', res);
            navigation.navigate('ImageFilter', {
              selectedImage: res.uri,
            });
          })
          .catch(error => {
            console.log('error in image', error);
          });
        // navigation.navigate('ImageFilter', {
        //   selectedImage: `file://${file.path}`,
        // });
        setPhotoLoading(false);
      }
      setShowCamera(false);
    } else {
      setPhotoLoading(true);
    }
  };

  const toggleImageSelection = node => {
    const isSelected = selectedImages.includes(node.image.uri);
    // console.log('imageUri', imageUri);
    const isVideo =
      node.type.toLowerCase().endsWith('/mp4') ||
      node.type.toLowerCase().endsWith('/mov') ||
      node.type.toLowerCase().endsWith('/avi');
    if (isVideo) {
      setSelectedVideo(node.image.uri);

      // navigation.navigate('EditingScreen', {selectedVideo: node.image.uri});
      setIsSecondModalVisible(false);
    } else {
      if (isSelected) {
        setSelectedImages(prevSelected =>
          prevSelected.filter(uri => uri !== node.image.uri),
        );
        setIsSelectedImage(true);
        // setIsSecondModalVisible(false);
      } else {
        setSelectedImages(prevSelected => [...prevSelected, node.image.uri]);
      }
    }
  };
  const toggleDraftSelection = item => {
    const isSelected = selectedDrafts.includes(item);

    // console.log('imageUri', imageUri);
    // const isVideo =
    //   node.type.toLowerCase().endsWith('/mp4') ||
    //   node.type.toLowerCase().endsWith('/mov') ||
    //   node.type.toLowerCase().endsWith('/avi');
    // if (isVideo) {
    //   setSelectedVideo(node.image.uri);

    //   // navigation.navigate('EditingScreen', {selectedVideo: node.image.uri});
    //   setIsSecondModalVisible(false);
    // } else {
    if (isSelected) {
      setSelectedDrafts(prevSelected => prevSelected.filter(e => e !== item));
      // setIsSelectedImage(true);
      // setIsSecondModalVisible(false);
    } else {
      setSelectedDrafts(prevSelected => [...prevSelected, item]);
    }
    // }
  };

  const renderGalleryItem = ({item}) => {
    const isSelected = selectedImages.includes(item.node.image.uri);

    const mediaType = item?.node?.type;
    const isVideo =
      mediaType.toLowerCase().endsWith('/mp4') ||
      mediaType.toLowerCase().endsWith('/mov') ||
      mediaType.toLowerCase().endsWith('/avi');
    // const isVideo =
    //   imageUri.toLowerCase().endsWith('.mp4') ||
    //   imageUri.toLowerCase().endsWith('.mov') ||
    //   imageUri.toLowerCase().endsWith('.avi');
    return (
      <TouchableOpacity onPress={() => toggleImageSelection(item.node)}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: Dimensions.get('window').width / 3 - 15,
            height: 90,
          }}>
          <Image
            source={{uri: item.node.image.uri}}
            style={{width: '80%', height: '80%', borderRadius: hp('1.5%')}}
          />
          <View style={{position: 'absolute', top: 6, right: 6}}>
            <RadioButton
              value={isSelectedImage}
              status={isSelectedImage ? 'checked' : 'unchecked'}
              onPress={() => {
                toggleImageSelection(item.node);
                // setIsSelectedImage(!isSelectedImage); // Update the state
              }}
              uncheckedColor="#dddddd"
            />
          </View>
          {isVideo && (
            <View style={{position: 'absolute'}}>
              <Image
                source={images.playButton}
                style={{
                  width: wp(10),
                  height: hp(5),
                  resizeMode: 'contain',
                }}
              />
            </View>
          )}
          {isSelected && (
            <View style={{position: 'absolute', top: 6, right: 6}}>
              <RadioButton
                value={isSelectedImage}
                status={isSelectedImage ? 'checked' : 'unchecked'}
                onPress={() => {
                  toggleImageSelection(item.node.image.uri);
                  // setIsSelectedImage(!isSelectedImage); // Update the state
                }}
                color={COLOR.GREEN} // Change the color when selected
                uncheckedColor="#dddddd"
              />
              <View
                style={{
                  position: 'absolute',
                  borderRadius: 30,
                  width: 16,
                  height: 16,
                  backgroundColor: '#4CBB17',
                  left: 10,
                  top: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation: 0,
                }}>
                <Image source={images.Done} style={{resizeMode: 'center'}} />
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderDrafts = ({item}) => {
    const isSelected = selectedDrafts.includes(item);

    return (
      <TouchableOpacity
        onPress={() => {
          handleDraft(item);
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: Dimensions.get('window').width / 3 - 15,
            height: 90,
          }}>
          <Image
            source={{uri: item.image || item?.video}}
            style={{width: '80%', height: '80%', borderRadius: hp('1.5%')}}
          />

          {item?.video && (
            <View style={{position: 'absolute'}}>
              <Image
                source={images.playButton}
                style={{
                  width: wp(10),
                  height: hp(5),
                  resizeMode: 'contain',
                }}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const handleVideoDone = async () => {
    try {
      // Close the modal and navigate to 'EditVideo2'
      setIsSecondModalVisible(false);

      // Save the file's to cache
      const cacheDirectory = RNFS.CachesDirectoryPath;

      var videPath = '';

      // for (let i = 0; i < selectedImages.length; i++) {
      const url = selectedVideo;
      try {
        const fileName = url.substring(url.lastIndexOf('/') + 1);
        const fileExists = await RNFS.exists(`${cacheDirectory}/${fileName}`);

        if (!fileExists) {
          // Copy the file to the cache directory
          await RNFS.copyFile(url, `${cacheDirectory}/${fileName}`);

          // Save the cached file path
          videPath = `file://${cacheDirectory}/${fileName}`;
        } else {
          // Save the existing cached file path
          videPath = `file://${cacheDirectory}/${fileName}`;
        }
      } catch (error) {
        console.error(`Error copying image at index ${i} to cache:`, error);
      }
      // }
      const video = {selectedVideo: videPath};
      navigation.navigate('EditingScreen', video);
    } catch (error) {
      console.error('Error saving selected images to AsyncStorage:', error);
    }
  };

  const handleDraft = item => {
    const data = {
      selectedImage: item?.image,
      draft: item,
      selectedVideo: item?.video,
    };
    setIsSecondModalVisible(false);
    navigation.navigate('EditingScreen', data);
  };

  const handleDone = async () => {
    try {
      // Close the modal and navigate to 'EditVideo2'
      setIsSecondModalVisible(false);

      // Save the file's to cache
      const cacheDirectory = RNFS.CachesDirectoryPath;

      const paths = [];

      for (let i = 0; i < selectedImages.length; i++) {
        const url = selectedImages[i];
        try {
          const fileName = url.substring(url.lastIndexOf('/') + 1);
          const fileExists = await RNFS.exists(`${cacheDirectory}/${fileName}`);

          if (!fileExists) {
            // Copy the file to the cache directory
            await RNFS.copyFile(url, `${cacheDirectory}/${fileName}`);

            // Save the cached file path
            paths.push(`file://${cacheDirectory}/${fileName}`);
          } else {
            // Save the existing cached file path
            paths.push(`file://${cacheDirectory}/${fileName}`);
          }
        } catch (error) {
          console.error(`Error copying image at index ${i} to cache:`, error);
        }
      }
      const images =
        paths?.length === 1
          ? {selectedImage: paths[0]}
          : {selectedImages: paths};
      navigation.navigate('EditingScreen', images);
    } catch (error) {
      console.error('Error saving selected images to AsyncStorage:', error);
    }
  };
  const handleRecordButtonPressIn = async () => {
    console.log('recording funcation Called');
    if (!isRecording && cameraRef.current) {
      try {
        setRemainingTime(90);
        // Start recording
        await cameraRef.current.startRecording({
          // flash: flashMode ? 'on' : 'off',
          videoStabilizationMode: 'auto',
          duration: 90000,
          onRecordingFinished: video => {
            console.log('Recording finished:', video);
            setIsRecording(false);
            setRemainingTime(90);
            if (video.path !== '') {
              if (isSlowMotion) {
                onPressSlowmotion(`file://${video.path}`);
              } else if (isReLoop) {
                onPressReLoop(`file://${video.path}`);
              } else {
                navigation.navigate('EditingScreen', {
                  selectedVideo: `file://${video.path}`,
                });
              }
            }
          },
          onRecordingError: error => {
            console.error('Recording error:', error);
            setIsRecording(false);
          },
        });
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    }
  };

  const handleRecordButtonPressOut = async () => {
    console.log('Stop recording Called');
    if (isRecording && cameraRef.current) {
      try {
        // Stop recording
        setIsRecording(false);
        const data = await cameraRef.current.stopRecording();
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }
  };

  // Conditions for record the video
  const handleButtonPress = () => {
    console.log('isRecording', isRecording);
    if (isRecording) {
      // If currently recording, stop recording
      handleRecordButtonPressOut();
    } else {
      if (isSlowMotion || isReLoop) {
        Alert.alert('Warning', 'Please hold the button for recording');
      } else {
        // If not recording, capture photo
        capturePhoto();
      }
    }
  };

  const toggleFlash = () => {
    setFlashMode(flashMode === 'off' ? 'on' : 'off');
  };

  const onPressSlowmotion = async selectedVideo => {
    setSlowMotionLoading(true);
    await handleSlowMotionVideo(selectedVideo)
      .then(outputVideoPath => {
        setSlowMotionLoading(false);
        navigation.navigate('EditingScreen', {
          selectedVideo: outputVideoPath,
        });
      })
      .catch(error => {
        setSlowMotionLoading(false);
        console.error('Error processing slow-motion video:', error);
      });
  };

  const onPressReLoop = async selectedVideo => {
    setSlowMotionLoading(true);
    await handleBoomerangVideo(selectedVideo)
      .then(outputVideoPath => {
        setSlowMotionLoading(false);
        navigation.navigate('EditingScreen', {
          selectedVideo: outputVideoPath,
        });
      })
      .catch(error => {
        setSlowMotionLoading(false);
        console.error('Boomerang conversion failed:', error);
      });
  };

  const initCallback = useCallback(() => {
    if (isInitialized) {
      setTimeout(() => {
        setIsActive(true);
      }, 150);
      setIsActive(false);
    }
    setIsInitialized(true);
  }, [isInitialized]);

  const renderCamera = () => {
    return (
      <>
        <View style={{flex: 1}}>
          <StatusBar backgroundColor="#333300" />

          {hasPermission ? (
            <Camera
              style={
                isInitialized && isActive
                  ? {aspectRatio}
                  : StyleSheet.absoluteFill
              }
              resizeMode="cover"
              device={device}
              isActive={true}
              ref={ref => {
                cameraRef.current = ref;
              }}
              onStatusChange={({cameraStatus}) => {
                if (cameraStatus === 'READY') {
                  // Start or configure the camera when it is ready
                }
              }}
              photo={true}
              video={true}
              audio={true}
              // orientation='landscape-left'
              orientation="portrait"
              format={format}
              // targetPhotoAspectRatio={screen.height / screen.width}
              enableHighQualityPhotos={true}
              isMirrored={false}
              onInitialized={initCallback}
            />
          ) : null}

          <View
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              flex: 1,
            }}>
            {/* Top View */}
            <View
              style={{
                alignItems: 'flex-start',
                margin: hp('1%'),
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: 'flex-start',
                }}
                onPress={() =>
                  isSlowMotion
                    ? setIsSlowMotion(false)
                    : isReLoop
                    ? setIsReLoop(false)
                    : navigation.navigate('EditVideo1')
                }>
                <Image
                  source={isSlowMotion || isReLoop ? images.Back : images.Close}
                  style={{
                    width: 34,
                    backgroundColor: '#4CBB17',
                    height: 34,
                    marginTop: hp('1.5%'),
                    resizeMode: 'contain',
                    tintColor: '#fff',
                    borderRadius: 30,
                    padding: 8,
                  }}
                />
              </TouchableOpacity>

              <TouchableRipple
                onPress={() => setFlashMode(!flashMode)}
                style={{
                  borderRadius: 30,
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 40,
                  height: 40,
                  backgroundColor: '#4CBB17',
                  marginTop: hp('1.5%'),
                }}>
                <Image
                  source={flashMode ? images.Lightning : images.flashOff}
                  style={{
                    resizeMode: 'contain',
                    tintColor: '#fff',
                    borderRadius: 30,
                    height: 24,
                    width: 24,
                  }}
                />
              </TouchableRipple>

              <TouchableOpacity
                onPress={toggleModal}
                style={{flex: 1, alignItems: 'flex-end'}}>
                <Image
                  source={images.ColorMode}
                  style={{
                    width: wp('10%'),
                    height: hp('5%'),
                    marginTop: hp('1.5%'),
                    resizeMode: 'contain',
                    tintColor: '#fff',
                    backgroundColor: '#4CBB17',
                    borderRadius: 30,
                  }}
                />
              </TouchableOpacity>
            </View>
            {/* Middle Menu */}
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              {isRecording && (
                <Text
                  style={{
                    fontSize: hp(5),
                    color: '#000',
                    fontWeight: 'bold',
                    backgroundColor: '#4CBB17',
                  }}>
                  {remainingTime}
                </Text>
              )}
            </View>
            {/* Bottom View */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                width: '100%',
                flex: 2,
              }}>
              {/* Select Photos from Gallery  */}
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: 'flex-start',
                }}
                onPress={toggleSecondModal}>
                {isSlowMotion || isReLoop ? null : (
                  <Image
                    source={images.Group37}
                    style={{
                      width: wp('12%'),
                      height: hp('7%'),
                      margin: hp('2%'),
                      resizeMode: 'contain',
                    }}
                  />
                )}
              </TouchableOpacity>
              {/* Capture Button */}
              {photoLoading || slowMotionLoading ? (
                <ActivityIndicator
                  size={'large'}
                  color={'#fff'}
                  style={{
                    width: wp('20%'),
                    height: hp('10%'),
                    marginTop: hp('-25%'),
                  }}
                />
              ) : (
                <TouchableOpacity
                  style={{
                    width: wp('20%'),
                    height: hp('16%'),
                    flex: 1,
                    alignItems: 'center',
                  }}
                  hitSlop={{
                    top: isRecording ? 300 : 0,
                    bottom: isRecording ? 150 : 0,
                    left: isRecording ? 50 : 0,
                    right: isRecording ? 150 : 0,
                  }}
                  onPress={handleButtonPress}
                  onLongPress={handleRecordButtonPressIn}
                  onPressOut={handleRecordButtonPressOut}>
                  <Image
                    source={
                      isRecording
                        ? images.RecordingIcon
                        : isSlowMotion
                        ? images.Slow
                        : isReLoop
                        ? images.Broom
                        : images.Group25
                    }
                    style={{
                      width: wp('20%'),
                      height: hp('10%'),
                      resizeMode: 'contain',
                    }}
                  />
                  <Text style={styles.headdingText}>
                    {isSlowMotion ? 'Slow-Motion' : isReLoop ? 'Re-Loop' : ''}
                  </Text>
                </TouchableOpacity>
              )}
              {/* Change camera (Front & Back) */}
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: 'flex-end',
                }}
                onPress={() =>
                  setCameraDevice(cameraDevice === 'front' ? 'back' : 'front')
                }>
                <Image
                  source={images.Refresh}
                  style={{
                    width: wp('12%'),
                    height: hp('7%'),
                    margin: hp('2%'),
                    resizeMode: 'contain',
                    backgroundColor: '#4CBB17',
                    borderRadius: 30,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Modal */}

          <Modal
            transparent={true}
            animationType="slide"
            visible={isModalVisible}
            onRequestClose={toggleModal}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Image source={images.Gradiant} style={styles.modalImage} />

                {/* Center */}
                <TouchableOpacity
                  style={styles.overlayContent}
                  onPress={() => {
                    setIsReLoop(true);
                    setIsSlowMotion(false);
                    setIsModalVisible(false);
                  }}>
                  <Image source={images.Group32} style={styles.overlayImage} />
                </TouchableOpacity>

                {/* Top Left */}
                <TouchableOpacity
                  style={styles.overlayContent3}
                  // onPress={toggleThirdModal}
                  onPress={() =>
                    navigation.navigate('Layout', {
                      selectedImage: selectedImage,
                    })
                  }>
                  <Image source={images.Group34} style={styles.overlayImage3} />
                </TouchableOpacity>

                {/* Top Right */}
                <TouchableOpacity
                  style={styles.overlayContent2}
                  onPress={() => {
                    setIsSlowMotion(true);
                    setIsReLoop(false);
                    setIsModalVisible(false);
                  }}>
                  <Image source={images.Group31} style={styles.overlayImage2} />
                </TouchableOpacity>

                {/* Bottom Right */}

                <TouchableOpacity
                  style={styles.overlayContent1}
                  onPress={() => {
                    if (selectedImage) {
                      navigation.navigate('ImageFilter', {
                        selectedImage: selectedImage,
                      });
                    } else {
                      Alert.alert('Warning', 'No image is selected');
                    }
                  }}>
                  <Image source={images.Group33} style={styles.overlayImage1} />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <Modal
            transparent={true}
            animationType="slide"
            visible={isSecondModalVisible}
            onRequestClose={toggleSecondModal}>
            <TouchableWithoutFeedback>
              <View style={styles.modalOverlay2}>
                <ImageBackground
                  style={{
                    width: wp('99%'),
                    alignItems: 'center',
                    borderRadius: 10,
                    justifyContent: 'center',
                    resizeMode: 'contain',
                    overflow: 'hidden',
                    maxHeight: hp(70),
                  }}
                  source={images.BG}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      width: '90%',
                      marginLeft: 80,
                      margin: 5,
                    }}>
                    <View
                      style={{
                        borderWidth: 5,
                        borderRadius: 10,
                        alignItems: 'center',
                        borderColor: '#ffffff',
                        width: '40%',
                        height: '1%',
                        marginTop: 5,
                      }}></View>
                    <TouchableOpacity onPress={handleDone}>
                      <Text
                        style={{
                          alignItems: 'flex-end',
                          borderBottomWidth: 1.5,
                          justifyContent: 'flex-end',
                          color: '#000',
                          marginTop: 5,
                          borderWidth: 1,
                          borderRadius: 5,
                          padding: 5,
                          marginLeft: 50,
                        }}>
                        Done
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                      width: '80%',
                      marginTop: 20,
                      backgroundColor: '#ffffff',
                      borderWidth: 1,
                      borderRadius: 10,
                    }}>
                    {galaryData &&
                      galaryData.map(item => {
                        return (
                          <TouchableOpacity
                            onPress={() => setSelectedGalary(item.id)}
                            key={item.id}
                            style={[
                              styles.tabButton,
                              {
                                borderColor:
                                  selectedGalary === item.id
                                    ? '#000000'
                                    : '#ffffff',
                                borderRightWidth:
                                  selectedGalary !== 2 &&
                                  selectedGalary === item.id
                                    ? 2
                                    : 0,
                                borderLeftWidth:
                                  selectedGalary !== 1 &&
                                  selectedGalary === item.id
                                    ? 2
                                    : 0,
                                borderBottomWidth:
                                  selectedGalary == 1 &&
                                  selectedGalary === item.id
                                    ? 3
                                    : 3,
                              },
                            ]}>
                            <Image
                              source={item.image}
                              style={{
                                width: hp('3%'),
                                margin: wp('1%'),
                                height: hp('3%'),
                                resizeMode: 'contain',
                              }}
                            />
                            <Text
                              style={[
                                styles.tabButtonTxt,
                                {
                                  color:
                                    selectedGalary === item.id
                                      ? '#000000'
                                      : '#000000',
                                },
                              ]}>
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                  </View>
                  {selectedGalary === 1 ? (
                    <FlatList
                      data={photos}
                      numColumns={3}
                      keyExtractor={item => item.node.image.uri}
                      renderItem={renderGalleryItem}
                    />
                  ) : (
                    <View style={styles.draftView}>
                      {Drafts.length <= 0 ? (
                        <Text>No drafts</Text>
                      ) : (
                        <FlatList
                          data={Drafts}
                          numColumns={3}
                          keyExtractor={item => item.id}
                          renderItem={renderDrafts}
                        />
                      )}
                    </View>
                  )}
                </ImageBackground>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </>
    );
  };

  return <View style={styles.container}>{renderCamera()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.OS === 'ios' ? '#f0f0f0' : '#fff',
  },
  button: {
    elevation: 4,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 18,
    marginBottom: 20,
  },

  permissionButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: Platform.OS === 'ios' ? 16 : 14,
    fontWeight: 'bold',
  },
  // buttonText: {
  //   color: '#fff',
  //   fontSize: 16,
  // },
  image: {
    width: 300,
    height: 400,
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 5,
  },
  tabView: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: hp('1.5%'),
    width: wp('70%'),
    //  marginHorizontal: hp('1.5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  // tabButton:{
  //   borderRadius:10,
  //   width:'40%',
  //   flexDirection:'row'
  // },
  // tabButtonTxt:{
  //   fontSize:15
  // },
  tabButton: {
    // backgroundColor: '#fff',
    width: '47%',
    margin: '0.4%',
    marginLeft: '1%',
    padding: '2%',
    // borderRadius: hp('1.5%'),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tabButtonTxt: {
    color: '#000000',
    fontSize: 15,
    textAlign: 'center',
    alignItems: 'center',
    margin: 5,
    fontWeight: '500',
    //  fontFamily: FONT.SEMI_BOLD,
    // fontSize: hp('1.8%'),
    // padding: hp('1.5%'),
  },
  modalOverlay: {
    flex: 1,
    //alignSelf: 'center',
    // justifyContent: 'center',
    // position:'absolute'
  },
  modalOverlay2: {
    flex: 1,
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
    // position:'absolute'
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: wp('70%'),
    height: hp('50%'),
    alignSelf: 'center',
    marginHorizontal: wp('15%'),
    marginTop: hp('5%'),
    resizeMode: 'contain',
  },
  overlayContent: {
    position: 'absolute',
    justifyContent: 'center',
    top: hp('38%'),
    alignItems: 'center',
  },
  overlayContent1: {
    position: 'absolute',
    alignSelf: 'flex-start',
    left: hp('11%'),
    bottom: hp('44%'),
  },
  overlayContent2: {
    position: 'absolute',
    alignSelf: 'flex-end',
    left: hp('21%'),
    bottom: hp('32%'),
  },
  overlayContent3: {
    position: 'absolute',
    alignSelf: 'flex-end',
    right: hp('10%'),
    bottom: hp('44%'),

    // marginRight: hp('1%'),
    //marginBottom: hp('2%'),
  },
  overlayImage: {
    width: wp('15%'),
    height: hp('5%'),
    resizeMode: 'contain',
  },
  overlayImage1: {
    width: wp('10%'),
    height: hp('6%'),
    resizeMode: 'contain',
  },
  overlayImage2: {
    width: wp('20%'),
    height: hp('10%'),
    resizeMode: 'contain',
  },
  overlayImage3: {
    width: wp('12%'),
    height: hp('6%'),
    resizeMode: 'contain',
  },
  overlayText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
    // Add more styling properties as needed
  },
  headdingText: {
    color: '#fff',
    fontSize: hp(2.5),
    fontFamily: FONT.BOLD,
  },
  draftView: {
    padding: hp(4),
  },
});

export default CameraScreen;
