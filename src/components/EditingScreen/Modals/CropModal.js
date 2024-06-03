import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  NativeEventEmitter,
  NativeModules,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useCallback, useRef, useEffect} from 'react';
import Modal from 'react-native-modal';
import {COLOR, FONT, FONT_SIZE} from '../../../utils/Config';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {images} from '../../../assets/images/image';
import Slider from '@react-native-community/slider';
import ImageFilter from 'react-native-image-filter-kit';
import {
  contrast,
  brightness,
  ColorMatrix,
  temperature,
  concatColorMatrices,
  saturate,
  threshold,
} from 'react-native-color-matrix-image-filters';
import {captureRef} from 'react-native-view-shot';
import Video from 'react-native-video';
import {adjustVideoBrightnessContrast} from '../../Video/VideoFilter';
import {showEditor} from 'react-native-video-trim';
import RNFS from 'react-native-fs';
import FilterModalContent from '../../FilterModalContent ';
import {useNavigation} from '@react-navigation/native';

const CropModal = props => {
  const navigation = useNavigation();
  const viewRef = useRef(null);
  const videoRef = useRef(null);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [brightnessValue, setBrightnessValue] = useState(
    props.editedVideo ? 0 : 1,
  );
  const [contrastValue, setContrastValue] = useState(0.5);
  const [tempValue, setTempValue] = useState(0);
  const [sharpnessValue, setSharpnessValue] = useState(1);
  const [softnessValue, setSoftnessValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const FilterOptions = [
    {id: 1, key: 'crop', label: 'Crop', image: images.Crop},
    {id: 2, key: 'contrast', label: 'Contrast', image: images.Contrast},
    {id: 3, key: 'brightness', label: 'Brightness', image: images.Sun},
    {id: 4, key: 'temperature', label: 'Temp', image: images.Temp},
    {id: 5, key: 'sharpness', label: 'Sharpness', image: images.Sharpness}, //Saturate
    {id: 6, key: 'softness', label: 'Softness', image: images.Sharpness}, //Threshold
    {id: 7, key: 'filters', label: 'Filters', image: images.Star},
    {id: 8, key: 'stickers', label: 'Stickers', image: images.Happy},
    {id: 9, key: 'trim', label: 'Trim', image: images.Trim},
    {id: 10, key: 'pip', label: 'Pip', image: images.pip},
  ];
  // Video trim
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.VideoTrim);
    const subscription = eventEmitter.addListener('VideoTrim', event => {
      switch (event.name) {
        case 'onShow': {
          console.log('onShowListener', event);
          break;
        }
        case 'onHide': {
          console.log('onHide', event);
          break;
        }
        case 'onStartTrimming': {
          console.log('onStartTrimming', event);
          break;
        }
        case 'onFinishTrimming': {
          console.log('onFinishTrimming', event);
          saveTrimmedVideo(event.outputPath);
          break;
        }
        case 'onCancelTrimming': {
          console.log('onCancelTrimming', event);
          break;
        }
        case 'onError': {
          console.log('onError', event);
          break;
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const openFilers = () => {
    navigation.navigate('ImageFilter', {
      selectedImage: props.editedImage,
      selectedVideo: props.editedVideo,
    });
  };
  const renderFilterItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        if (
          item.id === 2 ||
          item.id === 3 ||
          item.id === 4 ||
          item.id === 5 ||
          item.id === 6
        ) {
          openFilterModal(item.id);
        } else {
          item.id === 1
            ? props.handleEditImage(3)
            : item.id === 8
            ? props.editedVideo
              ? handleAddSticker()
              : props.handleEditImage(4)
            : item.id === 9
            ? props.editedVideo
              ? handleTrimVideo()
              : Alert.alert('Info', 'only work with video')
            : item.id === 7
            ? openFilers()
            : item?.id === 10
            ? (props.setUpperImageModalVisible(true), props.setCropModal(false))
            : '';
        }
      }}
      style={{
        alignItems: 'center',
        margin: 1,
        justifyContent: 'center',
        width: wp('19%'),
      }}>
      <Image
        source={item.image}
        style={{
          width: wp('8%'),
          height: wp('8%'),
          resizeMode: 'contain',
        }}
      />
      <Text style={{color: '#fff'}}>{item.label}</Text>
    </TouchableOpacity>
  );

  const openFilterModal = itemId => {
    setSelectedItemId(itemId);
    // setSelectedFilter(filter);
    setFilterModalVisible(true);
  };

  const closeFilterModal = () => {
    setFilterModalVisible(false);
  };
  const handleDone = () => {
    if (props.editedVideo) {
      handleAdjustBrightnessContrast();
    } else {
      handleSave();
    }
  };
  // Snap-shot the image
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const capturedUri = await captureRef(viewRef, {
        result: 'tmpfile', // Specify result type as data-uri
        format: 'png', // Optionally set format (default: 'png')
        quality: 0.8, // Optionally set image quality (0-1)
      });
      console.log('capturedUri', capturedUri);
      if (capturedUri !== '') {
        setIsLoading(false);
        setFilterModalVisible(false);
        if (props.multipleImages?.length > 0) {
          let updatedImageUrls = [...props.multipleImages];
          updatedImageUrls[props.currentIndex] = capturedUri;
          props.setMultipleImages(updatedImageUrls);
        } else {
          props.setEditedImage(capturedUri);
          props.filteredImage = capturedUri;
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error capturing screenshot:', error);
    }
  };

  const handleAdjustBrightnessContrast = async () => {
    console.log('brightnessValue', brightnessValue);
    console.log('contrastValue', parseFloat(contrastValue).toFixed(2));
    setIsLoading(true);

    try {
      // Adjust video brightness and contrast
      const outputVideoPath = await adjustVideoBrightnessContrast(
        props.editedVideo,
        brightnessValue,
        contrastValue,
        tempValue,
      );
      console.log(
        'Video Processing',
        'Brightness and contrast adjustment completed successfully.',
      );
      setIsLoading(false);
      setFilterModalVisible(false);
      props.setCropModal(false);
      console.log('Output video path:', outputVideoPath);
      props.setEditedVideo(outputVideoPath);
    } catch (error) {
      setIsLoading(false);
      console.log('Video Processing Error', error);
      console.error('Video processing error:', error);
    }
  };

  // Handle the trim video functionality
  const handleTrimVideo = () => {
    console.log('trim called');
    showEditor(props.editedVideo || '', {
      maxDuration: 90,
      saveToPhoto: false,
    });
  };

  // Save trimed video to cache directory and editedVideo state
  const saveTrimmedVideo = async videoUri => {
    try {
      const cacheDirectory = RNFS.CachesDirectoryPath;
      const fileName = videoUri.substring(videoUri.lastIndexOf('/') + 1);
      const fileExists = await RNFS.exists(`${cacheDirectory}/${fileName}`);

      if (!fileExists) {
        // Copy the file to the cache directory
        await RNFS.copyFile(videoUri, `${cacheDirectory}/${fileName}`);

        // Save the cached file path
        console.log(`file://${cacheDirectory}/${fileName}`);
        props.setEditedVideo(`file://${cacheDirectory}/${fileName}`);
      } else {
        // Save the existing cached file path
        console.log(`file://${cacheDirectory}/${fileName}`);
        props.setEditedVideo(`file://${cacheDirectory}/${fileName}`);
      }

      console.log(
        'Trimmed video saved to cache:',
        `file://${cacheDirectory}/${fileName}`,
      );
    } catch (error) {
      console.error('Error saving trimmed video:', error);
    }
  };
  let filter = {brightness: 0.2, contrast: 0.3, temperature: 6500};

  const handleAddSticker = () => {
    props.setCropModal(false);
    props.setStickerVisible(true);
  };

  return (
    <Modal
      isVisible={props.cropModal}
      style={{margin: 0}}
      animationIn="slideInRight"
      animationOut="slideOutLeft"
      onBackButtonPress={() => props.setCropModal(false)}
      onBackdropPress={() => props.setCropModal(false)}
      onSwipeComplete={() => props.setCropModal(false)}>
      <View
        style={{
          flex: 1,
          alignItems: 'flex-end',
          marginBottom: hp('12%'),
          justifyContent: 'flex-end',
        }}>
        <View style={styles.listView}>
          <View style={styles.searchView}>
            <FlatList
              data={FilterOptions}
              renderItem={renderFilterItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
            <Modal
              isVisible={isFilterModalVisible}
              animationIn="slideInUp"
              animationOut="slideOutDown"
              onBackButtonPress={closeFilterModal}
              onBackdropPress={closeFilterModal}
              style={{margin: 0}}>
              <View style={styles.viewModal}>
                <View
                  style={{
                    padding: hp(1),
                    height: '100%',
                    alignItems: 'center',
                  }}>
                  {props.editedVideo ? (
                    <ColorMatrix
                      ref={viewRef}
                      matrix={concatColorMatrices(
                        brightness(brightnessValue),
                        contrast(contrastValue),
                        temperature(tempValue),
                        saturate(sharpnessValue),
                        // threshold(softnessValue),
                      )}
                      style={{
                        width: '100%',
                        height: '100%',
                      }}>
                      <Video
                        ref={videoRef}
                        source={{
                          uri: props.editedVideo,
                        }}
                        style={{flex: 1}}
                        resizeMode="cover"
                        repeat={true}
                        paused={isVideoPlaying}
                        onEnd={() => setIsVideoPlaying(true)}
                      />
                      {isVideoPlaying && (
                        <View
                          style={{
                            position: 'absolute',
                            width: '100%',
                            top: 150,
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
                    </ColorMatrix>
                  ) : (
                    <ColorMatrix
                      ref={viewRef}
                      matrix={concatColorMatrices(
                        brightness(brightnessValue),
                        contrast(contrastValue),
                        temperature(tempValue),
                        saturate(sharpnessValue),
                        // threshold(softnessValue),
                      )}
                      style={{
                        width: '100%',
                        height: '100%',
                      }}>
                      <Image
                        source={{
                          uri: props.editedImage
                            ? props.editedImage
                            : props.filteredImage
                            ? props.filteredImage
                            : props.multipleImages[props.currentIndex],
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          resizeMode: 'contain',
                        }}
                      />
                    </ColorMatrix>
                  )}
                  <View
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      height: hp(15),
                      borderRadius: hp(1.5),
                      overflow: 'hidden',
                      padding: hp(1),
                      position: 'absolute',
                      bottom: hp(5),
                      width: '100%',
                    }}>
                    {/* Button and heading */}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: '#000',
                          fontSize: hp(2.5),
                        }}>
                        {selectedItemId === 2
                          ? 'Contrast'
                          : selectedItemId === 3
                          ? 'Brightness'
                          : selectedItemId === 4
                          ? 'Temp'
                          : selectedItemId === 5
                          ? 'Sharpness'
                          : selectedItemId === 6
                          ? 'Softness'
                          : ''}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleDone()}
                        disabled={isLoading}
                        style={{
                          backgroundColor: COLOR.GREEN,
                          width: wp(15),
                          height: hp(5),
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: hp(1.5),
                        }}>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: hp(2),
                          }}>
                          Done
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Loader nad sliders */}
                    {isLoading ? (
                      <ActivityIndicator color={'#000'} size={'large'} />
                    ) : selectedItemId === 2 ? (
                      <Slider
                        value={contrastValue}
                        onValueChange={setContrastValue}
                        minimumValue={0}
                        maximumValue={2}
                        step={0.1}
                        minimumTrackTintColor="#000"
                        maximumTrackTintColor="#000"
                        style={{
                          marginTop: hp(2),
                        }}
                      />
                    ) : selectedItemId === 3 ? (
                      <Slider
                        value={brightnessValue}
                        onValueChange={setBrightnessValue}
                        minimumValue={0}
                        maximumValue={props.editedVideo ? 1 : 2}
                        step={0.1}
                        minimumTrackTintColor="#000"
                        maximumTrackTintColor="#000"
                        style={{
                          marginTop: hp(2),
                        }}
                      />
                    ) : selectedItemId === 4 ? (
                      <Slider
                        value={tempValue}
                        onValueChange={setTempValue}
                        minimumValue={0}
                        maximumValue={2}
                        step={0.1}
                        minimumTrackTintColor="#000"
                        maximumTrackTintColor="#000"
                        style={{
                          marginTop: hp(2),
                        }}
                      />
                    ) : selectedItemId === 5 ? (
                      <Slider
                        value={sharpnessValue}
                        onValueChange={setSharpnessValue}
                        minimumValue={0}
                        maximumValue={2}
                        step={0.1}
                        minimumTrackTintColor="#000"
                        maximumTrackTintColor="#000"
                        style={{
                          marginTop: hp(2),
                        }}
                      />
                    ) : selectedItemId === 6 ? (
                      <Slider
                        value={softnessValue}
                        onValueChange={setSoftnessValue}
                        minimumValue={0}
                        maximumValue={2}
                        step={0.1}
                        minimumTrackTintColor="#000"
                        maximumTrackTintColor="#000"
                        style={{
                          marginTop: hp(2),
                        }}
                      />
                    ) : null}
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CropModal;

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#fff',
    width: '100%',
    // height: '30%',
    overflow: 'hidden',
    borderTopRightRadius: hp('2%'),
    borderTopLeftRadius: hp('2%'),
  },
  viewModal: {
    flex: 1,
  },
  colorMtrix: {
    width: '100%',
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  sliderviews: {
    margin: hp('5%'),
    marginTop: hp('9%'),
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'flex-end',
  },
  listView: {
    padding: hp('0.5%'),
    width: '100%',
    alignItems: 'center',
    marginTop: 0,
    backgroundColor: '#565656',
    borderRadius: 10,
  },

  backGroundImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  headding: {
    color: '#000',
    fontSize: FONT_SIZE.F_22,
    fontWeight: 'bold',
    fontFamily: FONT.EXTRA_BOLD,
    textAlign: 'center',
    marginVertical: hp('2%'),
  },
  sliderView: {
    backgroundColor: '#fff',
    //  flexDirection: 'row',
    padding: 20,
    borderRadius: 20,
    width: '100%',
  },
  searchView: {
    width: '100%',
    //  flexDirection: 'row',
    alignItems: 'center',
    //   justifyContent:'center',
    // padding: hp('1%'),
    //  borderRadius: hp('1.5%'),
    //  borderColor: '#000',
    //  borderWidth: hp('0.1%'),
  },
  input: {
    color: '#000',
    fontSize: hp('2.3%'),
    width: '90%',
  },
});
