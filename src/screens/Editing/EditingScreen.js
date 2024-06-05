import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  PanResponder,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import styles from './Styles';
import {images} from '../../assets/images/image';
import TopMenu from '../../components/EditingScreen/TopMenu';
import BottomMenu from '../../components/EditingScreen/BottomMenu';
import MiddleMenu from '../../components/EditingScreen/MiddleMenu';
import HashtagModal from '../../components/EditingScreen/Modals/HashtagModal';
import CropModal from '../../components/EditingScreen/Modals/CropModal';
import LocationModal from '../../components/EditingScreen/Modals/LocationModal';
import FriendsModal from '../../components/EditingScreen/Modals/FriendsModal';
import MusicModal from '../../components/EditingScreen/Modals/MusicModal';
import Video from 'react-native-video';
import {FILTERS} from '../../utils/Filters';
import RNFS from 'react-native-fs';
import PhotoEditor from 'react-native-photo-editor';
import {
  friendsData,
  hashtags,
  modes,
  musicData,
  stickers,
  stickersData,
} from '../../utils/DemoData';
import LayoutView from '../../components/Layouts/LayoutView';
import {captureRef} from 'react-native-view-shot';
import PreviewModal from '../../components/EditingScreen/Modals/PreviewModal';
import StickersModal from '../../components/EditingScreen/Modals/StickersModal';
import FastImage from 'react-native-fast-image';
import {addOverlay} from '../../components/Video/VideoOverlay';
import {cropVideo} from '../../components/Video/CropVideo';
import {COLOR} from '../../utils/Config';
import ImagePicker from 'react-native-image-crop-picker';
import RecordingModal from '../../components/EditingScreen/Modals/RecordingModal';
import {
  PinchGestureHandler,
  State,
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {Modal, RadioButton} from 'react-native-paper';
import Drag from '../../../Drag';
import {useFocusEffect} from '@react-navigation/native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import DraggableImage from '../../components/EditingScreen/DraggableImage';
import DragText from '../../../DragText';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditingScreen = ({navigation, route}) => {
  const [baseHashFontSize, setBaseHashFontSize] = useState(20);
  const [baseLocationFontSize, setBaseLocationFontSize] = useState(20);
  const [baseFriendFontSize, setBaseFriendFontSize] = useState(20);

  const [hashScale, setHashScale] = useState(1);
  const [friendScale, setFriendScale] = useState(1);
  const [locationScale, setLocationScale] = useState(1);

  const onPinchGestureEventHashTag = event => {
    setHashScale(event.nativeEvent.scale);
  };

  const onPinchHandlerStateChangeHashTag = event => {
    if (event.nativeEvent.state === State.END) {
      setBaseHashFontSize(baseHashFontSize * hashScale);
      setHashScale(1);
    }
  };

  const onPinchGestureEventLocation = event => {
    setLocationScale(event.nativeEvent.scale);
  };

  const onPinchHandlerStateChangeLocation = event => {
    if (event.nativeEvent.state === State.END) {
      setBaseLocationFontSize(baseLocationFontSize * locationScale);
      setLocationScale(1);
    }
  };
  const onPinchGestureEventFriend = event => {
    setFriendScale(event.nativeEvent.scale);
  };

  const onPinchHandlerStateChangeFriend = event => {
    if (event.nativeEvent.state === State.END) {
      setBaseFriendFontSize(baseFriendFontSize * friendScale);
      setFriendScale(1);
    }
  };

  const [textAngle, setTextAngle] = useState(0);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const {selectedImage} = route.params || '';
  const {selectedImages = []} = route.params;
  const {selectedVideo} = route.params;
  const {
    selectedLayoutImages,
    selectedLayoutId,
    layoutData = [],
  } = route.params;
  const {filteredImage = editedImage, filterIndex} = route.params;

  console.log('params', route.params);
  console.log('filterd:', filteredImage);
  useEffect(() => {
    setMultipleImages(selectedImages ?? []);
    // setEditedImage(route.params.filteredImage ?? '');
    if (selectedLayoutImages?.length > 0) {
      editedImage ? null : handleSave();
    }
  }, [route.params, selectedLayoutImages]);

  // to fetch the hashtag title from the selected hashtag ids
  useEffect(() => {
    const mapped = hashtags.filter(item => selectedHashtags.includes(item.id));
    setSelctedHashName(mapped);
  }, [selectedHashtags]);

  useEffect(() => {
    console.log('new text', position);
  }, [position]);
  useEffect(() => {
    // setLocationName(selectedLocation);
    console.log('selected Location', locationPosition);
  }, [locationPosition]);

  useEffect(() => {
    console.log('selected', selectedFriends);
  }, [selectedFriends]);

  const extractedUri = useRef(
    'https://www.hyundai.com/content/hyundai/ww/data/news/data/2021/0000016609/image/newsroom-0112-photo-1-2021elantranline-1120x745.jpg',
  );
  const viewRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTextStyle, setSelectedTextStyle] = useState([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [textWithStyles, setTextWithStyles] = useState([]);
  const [selectedHashtags, setSelectedHashtags] = useState(
    route.params?.draft?.hashtags || [],
  );
  const [hashtagModal, setHashtagModal] = useState(false);
  const [cropModal, setCropModal] = useState(false);
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [locationModalVisiable, setLocationModalVisiable] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [FriendsModalVisiable, setFriendsModalVisiable] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState(
    route.params?.draft?.friends || [],
  );
  const [MusicModalVisiable, setMusicModalVisiable] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState([]);
  const [recordingIsiable, setRecordingIsiable] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [editedImage, setEditedImage] = useState(
    route.params.selectedImage ? route.params.selectedImage : '',
  );
  const [editedVideo, setEditedVideo] = useState(route.params.selectedVideo);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(
    route.params?.draft?.text.length - 1 || 0,
  );

  const [multipleImages, setMultipleImages] = useState([]);
  // Postion State
  const [isPreview, setIsPreview] = useState(false);
  const [position, setPosition] = useState(route.params?.draft?.text || []);
  const TextPosition = useRef(new Animated.ValueXY()).current;
  const [stickersPosition, setStickersPosition] = useState(
    route.params?.draft?.sticker || [],
  );
  const [locationPosition, setLocationPosition] = useState(
    route.params?.draft?.location || [],
  );
  const [inputText, setInputText] = useState('');
  // draggable
  const [isDragg, setIsDragg] = useState(false);
  const [stickerVisible, setStickerVisible] = useState(false);
  const [draggLocation, setDraggLocation] = useState(false);
  const [draggHash, setDraggHash] = useState(false);
  const [dragFriend, setDraggFriend] = useState(false);
  const [upperImages, setUpperImages] = useState([]);
  const [upperImageModalVisible, setUpperImageModalVisible] = useState(false);
  const [snapShotImg, setSnapShotImg] = useState('');
  const [selctedHashName, setSelctedHashName] = useState([]);
  const [locationName, setLocationName] = useState('');
  const [friendsName, setFriendsName] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [isSelectedUpperImage, setIsSelectedUpperImage] = useState(false);
  const [upperImagePath, setUpperImagePath] = useState(
    route.params?.draft?.uperImage,
  );
  const [finalImage, setFinalImage] = useState(null);
  const [finalVideo, setfinalVideo] = useState(null);
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
  const [selectedGalary, setSelectedGalary] = useState(1);
  const [photos, setPhotos] = useState([]);

  // useEffect(() => {
  // checkCameraPermission();
  // handleDone();
  // checkPermission();
  // storeUserInfo();
  //   if (hasPermission) {
  //     getAllPhotos();
  //   }
  // }, []);

  useEffect(() => {
    setFinalImage(selectedImage);
  }, [selectedImage]);
  useEffect(() => {
    setFinalImage(filteredImage);
  }, [filteredImage]);
  useEffect(() => {
    setFinalImage(editedImage);
  }, [editedImage]);
  useEffect(() => {
    setfinalVideo(selectedVideo);
  }, [selectedVideo]);
  useEffect(() => {
    setfinalVideo(editedVideo);
    console.log('new edited Video:======', editedVideo);
  }, [editedVideo]);

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
      // checkPermission(); // Call the function when the screen gains focus
      getAllPhotos();
    }, [navigation]),
  );

  const toggleImageSelection = node => {
    const isSelected = upperImages.includes(node.image.uri);
    // console.log('imageUri', imageUri);
    const isVideo =
      node.type.toLowerCase().endsWith('/mp4') ||
      node.type.toLowerCase().endsWith('/mov') ||
      node.type.toLowerCase().endsWith('/avi');
    // if (isVideo) {
    //   navigation.navigate('EditingScreen', {selectedVideo: node.image.uri});
    //   setIsSecondModalVisible(false);
    // } else {
    if (isSelected) {
      setUpperImages(prevSelected =>
        prevSelected.filter(uri => uri !== node.image.uri),
      );
      setIsSelectedUpperImage(true);
      // setIsSecondModalVisible(false);
    } else {
      setUpperImages(prevSelected => [...prevSelected, node.image.uri]);
    }
    // }
  };

  const renderGalleryItem = ({item}) => {
    const isSelected = upperImages.includes(item.node.image.uri);

    const mediaType = item?.node?.type;
    const isVideo =
      mediaType.toLowerCase().endsWith('/mp4') ||
      mediaType.toLowerCase().endsWith('/mov') ||
      mediaType.toLowerCase().endsWith('/avi');
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
              value={isSelectedUpperImage}
              status={isSelectedUpperImage ? 'checked' : 'unchecked'}
              onPress={() => {
                toggleImageSelection(item.node);
                // setIsSelectedImage(!isSelectedImage); // Update the state
              }}
              // uncheckedColor="#dddddd"
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
                value={isSelectedUpperImage}
                status={isSelectedUpperImage ? 'checked' : 'unchecked'}
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

  const handleDone = async () => {
    try {
      // Close the modal and navigate to 'EditVideo2'
      setUpperImageModalVisible(false);

      // Save the file's to cache
      const cacheDirectory = RNFS.CachesDirectoryPath;

      const paths = [];

      for (let i = 0; i < upperImages.length; i++) {
        const url = upperImages[i];
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
      console.log('paths for upper image:', paths);
      // setUpperImagePath(prevItems => [...prevItems, paths]);
      setUpperImagePath(paths);
    } catch (error) {
      console.error('Error saving selected images to AsyncStorage:', error);
    }
  };

  console.log('selectedMusic', selectedMusic);

  const SelectedFilterComponent = FILTERS[filterIndex]?.filterComponent;

  const getSelectedImage = (layoutId, tabId) => {
    const selectedImage = selectedLayoutImages.find(
      image => image.layoutId === layoutId && image.tabId === tabId,
    );
    return selectedImage ? selectedImage.image : null;
  };

  const onExtractImage = ({nativeEvent}) => {
    // console.log('Extracted URI:', nativeEvent.uri);
    extractedUri.current = nativeEvent.uri;
  };

  const onPressSave = async (localFilePath, fileType, isEdited = false) => {
    try {
      // Ensure the file path starts with 'file://'
      const file = localFilePath.startsWith('file://')
        ? localFilePath
        : `file://${localFilePath}`;

      // Check the file type
      const isVideo =
        file.toLowerCase().endsWith('.mp4') ||
        file.toLowerCase().endsWith('.mov') ||
        file.toLowerCase().endsWith('.avi');

      const downloadFolder = RNFS.DownloadDirectoryPath;
      const appName = 'cameraapp';
      const currentDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[-T]/g, ''); // Format: YYYY_MM_DD_HH_mm_ss
      const fileExtension = isVideo ? 'mp4' : 'png';
      const prefix = isEdited ? 'edited_' : ''; // Add a prefix for edited images
      const fileName = `${prefix}${appName}_${currentDate}.${fileExtension}`;
      const filePath = `${downloadFolder}/${fileName.replace(/:/g, '_')}`;

      const fileExists = await RNFS.exists(filePath);

      if (fileExists) {
        Alert.alert('Error', 'File already saved');
      } else {
        await RNFS.moveFile(file, filePath);
        Alert.alert('Info', 'File saved successfully');
        console.log('Download Folder Path:', downloadFolder);
        console.log('File Path:', filePath);
        if (multipleImages?.length > 0) {
          let updatedImageUrls = [...multipleImages];
          updatedImageUrls[currentIndex] = `file://${filePath}`;
          setMultipleImages(updatedImageUrls);
        } else {
          setEditedImage(`file://${filePath}`);
        }
      }
    } catch (error) {
      console.error('Error saving file:', error);
      Alert.alert('Error', 'Error saving file');
    }
  };

  const handleEditImage = async id => {
    if (selectedVideo) {
      // onPressCropVideo();
      // Alert.alert('Info', 'This SDK only work with Image');
    } else {
      if (id === 3) {
        let imagePath = editedImage
          ? editedImage
          : filteredImage
          ? extractedUri.current
          : multipleImages[currentIndex];
        ImagePicker.openCropper({
          path: imagePath,
          freeStyleCropEnabled: true,
        }).then(image => {
          setEditedImage(image.path);
          console.log(image);
        });
      } else {
        const controls = modes.find(el => el.id === id);
        try {
          let imagePath = editedImage
            ? editedImage
            : filteredImage
            ? extractedUri.current
            : multipleImages[currentIndex];
          // Remove everything after the '?' character
          const index = imagePath.indexOf('?');
          if (index !== -1) {
            imagePath = imagePath.substring(0, index);
          } else {
            imagePath = imagePath;
          }
          console.log('imagePath', imagePath);
          await PhotoEditor.Edit({
            path: imagePath.startsWith('file://')
              ? imagePath.split('://')[1]
              : imagePath,
            // path: editedImage.split('://')[1],
            onDone: onDone,
            hiddenControls: controls ? controls.Controls : [],
            stickers: stickers,
          });
        } catch (error) {
          console.error('Error while editing image', error);
        }
      }
    }
  };

  const onDone = path => {
    if (multipleImages?.length > 0) {
      const uri = path.startsWith('content')
        ? `${path}?${new Date().getTime()}`
        : `file://${path}?${new Date().getTime()}`;

      let updatedImageUrls = [...multipleImages];
      updatedImageUrls[currentIndex] = uri;
      setMultipleImages(updatedImageUrls);
    } else {
      setEditedImage(
        path.startsWith('content')
          ? `${path}?${new Date().getTime()}`
          : `file://${path}?${new Date().getTime()}`,
      );
    }
  };

  const saveDraft = () => {
    const draftData = {
      id: Date.now(),
      image: finalImage,
      text: position,
      friends: selectedFriends,
      location: locationPosition,
      hashtags: selectedHashtags,
      sticker: stickersPosition,
      video: finalVideo,
      uperImage: upperImagePath,
    };
    AsyncStorage.getItem('Draft')
      .then(jsonArray => {
        // Parse the JSON string into an array or initialize an empty array
        const storedArray = jsonArray ? JSON.parse(jsonArray) : [];
        storedArray.push(draftData);

        // Store the modified array back into AsyncStorage
        return AsyncStorage.setItem('Draft', JSON.stringify(storedArray));
      })
      .then(() => {
        Alert.alert('Draft Saved succesfully');
        navigation.goBack();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  // Snap-shot the image
  const handleSave = async type => {
    try {
      const capturedUri = await captureRef(viewRef, {
        result: 'tmpfile', // Specify result type as data-uri
        format: 'png', // Optionally set format (default: 'png')
        quality: 0.8, // Optionally set image quality (0-1)
      });
      console.log('capturedUri', capturedUri);
      if (capturedUri !== '') {
        type === 'textImg'
          ? onPressSave(capturedUri, 'image')
          : position?.length > 0
          ? setSnapShotImg(capturedUri)
          : selectedLayoutImages?.length > 0
          ? setEditedImage(capturedUri)
          : onPressSave(capturedUri, 'image');
      }
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
  };

  const onPressSend = () => {
    navigation.navigate('upload');
  };

  const getTextStyles = () => {
    return selectedTextStyle.reduce((styles, style) => {
      console.log('style.value', style.value);
      switch (style.name) {
        case 'bold':
          return {...styles, fontWeight: 'bold'};
        case 'italic':
          return {...styles, fontStyle: 'italic'};
        case 'underline':
          return {...styles, textDecorationLine: 'underline'};
        case 'uppercase':
          return {...styles, textTransform: 'uppercase'};
        case 'lowercase':
          return {...styles, textTransform: 'lowercase'};
        case 'colored':
          return {...styles, color: `${style.value}`};
        default:
          return styles;
      }
    }, {});
  };

  const handleOverlayVideo = () => {
    addOverlay(
      editedVideo,
      stickersPosition,
      inputText,
      `x=${position.x}:y=${position.y}`,
    )
      .then(outputVideoPath => {
        console.log('Success', 'Overlay added successfully!', outputVideoPath);
        onPressSave(outputVideoPath);
      })
      .catch(error => {
        console.error('Error adding overlay:', error);
        console.log('Error', 'Failed to add overlay');
      });
  };

  const newText = id => {
    const newItem = {
      id: Date.now(), // Generate a unique ID
      x: 113.34259033203125,
      y: 284.3129425048828,
      text: '',
    };
    setCurrentTextIndex(id + 1);
    setPosition(prevItems => [...prevItems, newItem]);
  };

  const handleAddText = () => {
    if (position?.length > 0) {
      setIsVisible(true);
    } else {
      if (multipleImages?.length > 0) {
        for (let i = 0; i < multipleImages.length; i++) {
          const element = multipleImages[i];
          const newItem = {
            id: i, // Generate a unique ID
            x: 113.34259033203125,
            y: 284.3129425048828,
            text: '',
          };
          setPosition(prevItems => [...prevItems, newItem]);
        }
        setIsVisible(true);
      } else {
        const newItem = {
          id: 0,
          x: 113.34259033203125,
          y: 284.3129425048828,

          text: '',
        };
        setPosition(prevItems => [...prevItems, newItem]);
        setIsVisible(true);
      }
    }
  };

  const onPressCropVideo = async () => {
    cropVideo(editedVideo, '3:2')
      .then(outputVideoPath => {
        console.log(
          'Success',
          'cropVideo added successfully!',
          outputVideoPath,
        );
        setEditedVideo(`file://${outputVideoPath}`);
      })
      .catch(error => {
        console.error('Error adding CropVideo:', error);
        console.log('Error', 'Failed to add CropVideo');
      });
  };

  const handlePositionChange = (itemId, newPosition) => {
    setLocationPosition(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? {
              ...item,
              x: newPosition.x,
              y: newPosition.y,
              scale: newPosition.scale,
            }
          : item,
      ),
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      {/* Main IMage View */}
      <View style={styles.mainImageView} ref={viewRef}>
        {selectedVideo || editedVideo ? (
          <Video
            source={{
              uri: editedVideo ? editedVideo : selectedVideo,
            }}
            // source={{
            //   uri: 'file:///data/user/0/com.cameraapp/cache/output_1709630815152.mp4',
            // }}

            style={{flex: 1}}
            resizeMode="contain"
            repeat={cropModal || isPreview ? false : true}
            paused={isVideoPlaying}
            onEnd={() => setIsVideoPlaying(true)}
          />
        ) : filteredImage ? (
          <SelectedFilterComponent
            onExtractImage={onExtractImage}
            extractImageEnabled={true}
            image={<Image style={styles.image} source={{uri: filteredImage}} />}
          />
        ) : editedImage ? (
          <Image source={{uri: `file://${editedImage}`}} style={styles.image} />
        ) : selectedImage ? (
          <Image source={{uri: selectedImage}} style={styles.image} />
        ) : selectedLayoutImages ? (
          <View
            // ref={viewRef}
            style={{backgroundColor: '#000', width: '100%', height: '100%'}}>
            <LayoutView
              layoutData={layoutData}
              selectedLayoutId={selectedLayoutId}
              getSelectedImage={getSelectedImage}
            />
          </View>
        ) : multipleImages?.length > 0 ? (
          <View style={{flex: 1}}>
            <FlatList
              data={multipleImages}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              numColumns={1}
              scrollEventThrottle={16}
              initialScrollIndex={currentIndex}
              onScroll={({nativeEvent}) => {
                // Calculate current index based on scroll position
                const index = Math.floor(
                  nativeEvent.contentOffset.x / screenWidth,
                );
                setCurrentIndex(index);
              }}
              renderItem={({item, index}) => {
                return (
                  <Image
                    source={{
                      uri: item.startsWith('file://') ? item : `file://${item}`,
                    }}
                    style={{
                      width: screenWidth,
                      height: screenHeight,
                      resizeMode: 'contain',
                    }}
                  />
                );
              }}
            />
          </View>
        ) : (
          <Text
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              fontSize: 20,
            }}>
            No images selected.
          </Text>
        )}
        {/* Text Animated View */}
        {isDragg
          ? null
          : position.map((item, index) => {
              return (
                <Animated.View
                  key={item.id}
                  style={{
                    position: 'absolute',
                    left: position[index]?.x,
                    top: position[index]?.y,
                  }}>
                  <Text style={[getTextStyles(), {fontSize: hp('2.6%')}]}>
                    {position[index]?.text ?? ''}
                  </Text>
                </Animated.View>
              );
            })}
        {/* Stickers Animated View */}
        {stickerVisible
          ? null
          : stickersPosition.map((item, index) => {
              return (
                <Animated.View
                  key={item.id}
                  style={{
                    position: 'absolute',
                    transform: [
                      {translateX: item.x},
                      {translateY: item.y},
                      {scale: item.scale},
                    ],
                  }}>
                  <FastImage
                    style={{width: wp(25), height: hp(15), margin: hp(1)}}
                    source={{
                      uri: item.imageUrl,
                      priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </Animated.View>
              );
            })}
        {/* code for pip */}

        {/* Location Animated View */}
        {draggLocation
          ? null
          : locationPosition.map((item, index) => {
              return (
                <Animated.View
                  key={item.id}
                  style={{
                    position: 'absolute',
                    transform: [{translateX: item.x}, {translateY: item.y}],
                  }}>
                  <PinchGestureHandler
                    onGestureEvent={onPinchGestureEventLocation}
                    onHandlerStateChange={onPinchHandlerStateChangeLocation}>
                    <Animated.View
                      style={[
                        {
                          flexDirection: 'row',
                          padding: 25,
                        },
                      ]}>
                      <Text
                        style={[
                          {fontSize: baseLocationFontSize * locationScale},
                          {
                            color: 'black',
                            width: 'auto',
                            backgroundColor: 'white',
                            padding: 4,
                            borderRadius: 8,
                          },
                        ]}>
                        <Image
                          source={images.LocationPin}
                          style={[
                            {
                              width: baseLocationFontSize * locationScale,
                              height: baseLocationFontSize * locationScale,
                            },
                            {
                              resizeMode: 'contain',
                              tintColor: COLOR.GREEN,
                            },
                          ]}
                        />
                        {item.text}
                      </Text>
                    </Animated.View>
                  </PinchGestureHandler>
                </Animated.View>
              );
            })}

        {selectedFriends.length > 0
          ? selectedFriends?.map((item, index) => {
              return (
                <Animated.View
                  key={item.id}
                  style={{
                    position: 'absolute',
                    transform: [
                      {translateX: item.x - 25},
                      {translateY: item.y - 25},
                    ],
                  }}>
                  <PinchGestureHandler
                    onGestureEvent={onPinchGestureEventFriend}
                    onHandlerStateChange={onPinchHandlerStateChangeFriend}>
                    <Animated.View
                      style={{
                        position: 'absolute',
                        padding: 25,
                      }}>
                      <Text
                        style={[
                          {
                            color: 'white',
                          },
                          {fontSize: baseFriendFontSize * friendScale},
                        ]}>
                        {'@'}
                        {item?.text}
                      </Text>
                    </Animated.View>
                  </PinchGestureHandler>
                </Animated.View>
              );
            })
          : null}

        {selectedHashtags.length > 0
          ? selectedHashtags?.map((item, index) => {
              return (
                <Animated.View
                  key={item.id}
                  style={{
                    position: 'absolute',
                    transform: [
                      {translateX: item.x - 20},
                      {translateY: item.y - 20},
                    ],
                  }}>
                  <PinchGestureHandler
                    onGestureEvent={onPinchGestureEventHashTag}
                    onHandlerStateChange={onPinchHandlerStateChangeHashTag}>
                    <Animated.View
                      style={{
                        position: 'absolute',
                        padding: 20,

                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={[
                          {
                            color: 'white',
                          },
                          {fontSize: baseHashFontSize * hashScale},
                        ]}>
                        {'#'}
                        {item?.text}
                      </Text>
                    </Animated.View>
                  </PinchGestureHandler>
                </Animated.View>
              );
            })
          : null}

        {/* <Text style={{color: 'white', position: 'absolute'}}>hi dev</Text> */}

        {/* <Image
          source={{uri: upperImages[0]}}
          style={{position: 'absolute', height: 200, width: 200}}
        /> */}
      </View>

      {/* Postion all Menu View */}
      <View style={styles.allMenuView}>
        {/* Top Menu */}
        <View style={{flex: 0.5}}>
          <TopMenu
            onPressBack={() => navigation.goBack()}
            onPressSave={() => {
              // snapshot (screenshot) the image
              if (selectedLayoutImages && editedImage === '') {
                handleSave();
              } else {
                // Overlay the video
                if (stickersPosition?.length > 0) {
                  handleOverlayVideo();
                } else {
                  if (
                    position?.length > 0 &&
                    (editedVideo === '' || editedVideo === undefined)
                  ) {
                    handleSave('textImg');
                  } else {
                    // Simple save the video and image

                    onPressSave(
                      editedImage
                        ? editedImage
                        : selectedImage
                        ? selectedImage
                        : editedVideo
                        ? editedVideo
                        : selectedVideo
                        ? selectedVideo
                        : filteredImage
                        ? extractedUri.current
                        : multipleImages?.length > 0
                        ? multipleImages[currentIndex]
                        : '',
                      selectedImage || filteredImage || editedImage
                        ? 'image'
                        : 'video',
                    );
                  }
                }
              }
            }}
            saveDraft={saveDraft}
            MusicModalVisiable={MusicModalVisiable}
            setMusicModalVisiable={setMusicModalVisiable}
          />
        </View>

        {/* Middle Menu */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handleAddText()}
          style={{
            flex: 1,
            // position: 'absolute',
            // width: '100%',
            // bottom: 300,
            // borderWidth: 2,
            height: '100%',
          }}>
          <MiddleMenu
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            selectedTextStyle={selectedTextStyle}
            setSelectedTextStyle={setSelectedTextStyle}
            filteredImage={extractedUri.current}
            pickerVisible={pickerVisible}
            setPickerVisible={setPickerVisible}
            textWithStyles={textWithStyles}
            setTextWithStyles={setTextWithStyles}
            setHashtagModal={setHashtagModal}
            setLocationModalVisiable={setLocationModalVisiable}
            setFriendsModalVisiable={setFriendsModalVisiable}
            handleEditImage={handleEditImage}
            setIsPreview={setIsPreview}
            inputText={inputText}
            setInputText={setInputText}
            position={position}
            setPosition={setPosition}
            getTextStyles={getTextStyles}
            isDragg={isDragg}
            setIsDragg={setIsDragg}
            stickerVisible={stickerVisible}
            setStickerVisible={setStickerVisible}
            stickersPosition={stickersPosition}
            setStickersPosition={setStickersPosition}
            currentIndex={multipleImages?.length > 0 ? currentIndex : 0}
            recordingIsiable={recordingIsiable}
            setRecordingIsiable={setRecordingIsiable}
            handleSnapShot={handleSave}
            currentTextIndex={currentTextIndex}
            setCurrentTextIndex={setCurrentTextIndex}
            addNewText={newText}
            isVideo={
              editedVideo === '' || editedVideo === undefined ? false : true
            }
          />
          {isVideoPlaying && (
            <View
              style={{
                position: 'absolute',
                width: '100%',
                top: 250,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => setIsVideoPlaying(!isVideoPlaying)}>
                <Image
                  source={images.playButton}
                  style={{
                    width: wp('20%'),
                    height: hp('10%'),
                    resizeMode: 'contain',
                    tintColor: '#fff',
                  }}
                />
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>

        <DraggableImage path={upperImagePath} />

        <View
          style={{
            // flex: 1,
            justifyContent: 'flex-end',
            height: 80,
            bottom: 0,
            position: 'absolute',
            width: '100%',
          }}>
          <BottomMenu
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            setCropModal={() => {
              setCropModal(true);
              // if (layoutData?.length > 0) {
              //   Alert.alert('Info', 'This only work with single photo & Video');
              // } else {
              //   setCropModal(true);
              // }
            }}
            onPressSend={onPressSend}
          />
        </View>
      </View>
      {/* <View style={{position: 'absolute'}}> */}
      {/* {selectedFriends.length > 0
          ? selectedFriends?.map((item, index) => {
              return <Drag title={item?.text} type="friend" />;
            })
          : null}
        {selectedHashtags.length > 0
          ? selectedHashtags?.map((item, index) => {
              return <Drag title={item?.text} type="hash" />;
            })
          : null}
        {position.length > 0
          ? position.map((item, index) => {
              return (
                <DragText title={item?.text} customStyle={getTextStyles()} />
              );
            })
          : null}
        {locationPosition?.length > 0
          ? locationPosition?.map((item, index) => {
              return <DragText title={item?.text} type="location" />;
            })
          : null}
      </View> */}
      {/* HashTag Modal */}
      <HashtagModal
        selectedHashtags={selectedHashtags}
        setSelectedHashtags={setSelectedHashtags}
        hashtagModal={hashtagModal}
        setHashtagModal={setHashtagModal}
        dragHash={draggHash}
        setDraggHash={setDraggHash}
      />
      {/* Location Modal */}
      <LocationModal
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        locationModalVisiable={locationModalVisiable}
        setLocationModalVisiable={setLocationModalVisiable}
        locationPosition={locationPosition}
        setLocationPosition={setLocationPosition}
        multipleImages={multipleImages}
        draggLocation={draggLocation}
        setDraggLocation={setDraggLocation}
      />
      {/* Friends Modal */}
      <FriendsModal
        selectedFriends={selectedFriends}
        setSelectedFriends={setSelectedFriends}
        FriendsModalVisiable={FriendsModalVisiable}
        setFriendsModalVisiable={setFriendsModalVisiable}
        dragFriend={dragFriend}
        setDragFriend={setDraggFriend}
      />
      {/* {Music Modal} */}
      <MusicModal
        selectedMusic={selectedMusic}
        setSelectedMusic={setSelectedMusic}
        MusicModalVisiable={MusicModalVisiable}
        setMusicModalVisiable={setMusicModalVisiable}
      />
      {/* Crop Modal */}
      <CropModal
        filteredImage={extractedUri.current}
        selectedVideo={selectedVideo}
        selectedImage={selectedImage}
        selectedCrops={selectedCrops}
        multipleImages={multipleImages}
        setMultipleImages={setMultipleImages}
        currentIndex={currentIndex}
        setSelectedCrops={setSelectedCrops}
        cropModal={cropModal}
        setCropModal={setCropModal}
        handleEditImage={handleEditImage}
        editedImage={editedImage}
        setEditedImage={setEditedImage}
        editedVideo={editedVideo}
        setEditedVideo={setEditedVideo}
        stickerVisible={stickerVisible}
        setStickerVisible={setStickerVisible}
        setIsVisible={setIsVisible}
        upperImages={upperImages}
        setUpperImages={setUpperImages}
        upperImageModalVisible={upperImageModalVisible}
        setUpperImageModalVisible={setUpperImageModalVisible}
      />

      {/* Preview Modal */}
      <PreviewModal
        editedVideo={editedVideo ? editedVideo : ''}
        setEditedVideo={setEditedVideo}
        isPreview={isPreview}
        setSnapShotImg={setSnapShotImg}
        setIsPreview={setIsPreview}
        imageUrl={
          snapShotImg === ''
            ? editedImage
              ? editedImage
              : filteredImage
              ? extractedUri.current
              : multipleImages[currentIndex]
            : snapShotImg
        }
      />

      {/* Sticker Modal */}
      <StickersModal
        stickerVisible={stickerVisible}
        setStickerVisible={setStickerVisible}
        stickersPosition={stickersPosition}
        setStickersPosition={setStickersPosition}
        NewPosition={locationPosition}
      />

      {/* Recording Modal */}
      <RecordingModal
        recordingIsiable={recordingIsiable}
        setRecordingIsiable={setRecordingIsiable}
        selectedMusic={selectedMusic}
        setSelectedMusic={setSelectedMusic}
      />
      {/* modal for add images from gallary for Pip feature */}

      {/*  */}
      {/* <LocationOverlayModal
        isDragg={draggLocation}
        setIsDragg={setDraggLocation}
        NewPosition={locationPosition}
        onPositionChange={handlePositionChange}
        handleRemoveItem={() => console.log('remove Callled')}
      /> */}

      <Modal
        transparent={true}
        animationType="slide"
        visible={upperImageModalVisible}
        style={{position: 'absolute', bottom: -240}}
        onRequestClose={() => setUpperImageModalVisible(false)}>
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
                position: 'absolute',
              }}
              source={images.BG}>
              {/* <Text style={{color: 'white'}}>hi dev</Text> */}
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

              {/* <View
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
                              selectedGalary !== 2 && selectedGalary === item.id
                                ? 2
                                : 0,
                            borderLeftWidth:
                              selectedGalary !== 1 && selectedGalary === item.id
                                ? 2
                                : 0,
                            borderBottomWidth:
                              selectedGalary == 1 && selectedGalary === item.id
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
              </View> */}
              <FlatList
                data={photos}
                numColumns={3}
                keyExtractor={item => item.node.image.uri}
                renderItem={renderGalleryItem}
              />
              {/* {selectedGalary === 1 ? (
              ) : (
                <View style={styles.draftView}>
                  <Text style={styles.tabButtonTxt}>Not Found</Text>
                </View>
              )} */}
            </ImageBackground>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default EditingScreen;
