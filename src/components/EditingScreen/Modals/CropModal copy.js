import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import Modal from 'react-native-modal';
import {FONT, FONT_SIZE} from '../../../utils/Config';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {images} from '../../../assets/images/image';
import Slider from '@react-native-community/slider';
import ImageFilterKit from 'react-native-image-filter-kit';
import {
  contrast,
  brightness,
  ColorMatrix,
  temperature,
  sharpness,
} from 'react-native-color-matrix-image-filters';
import ColorMatrixImageFilters from 'react-native-color-matrix-image-filters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Video from 'react-native-video';
import Sticker from '../../Sticker';
const CropModal = props => {
  const navigation = useNavigation();

  const [filteredImage, setFilteredImage] = useState(imageUri);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [imageUri, setImageUri] = useState(props.selectedImage);
  const [videoUri, setVideoUri] = useState(props.selectedVideo); // Replace with your image URI
  const [appliedImageUri, setAppliedImageUri] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [sliderValue, setSliderValue] = useState(1);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [contrastValue, setContrastValue] = useState(0); // Initial contrast value
  const [brightnessValue, setBrightnessValue] = useState(1); // Initial brightness value
  const [softnessValue, setSoftnessValue] = useState(1); // Initial softness value
  const [sharpnessValue, setSharpnessValue] = useState(1); // Initial sharpness value
  const [temperatureValue, setTemperatureValue] = useState(0); // Initial temperature value
  const [isContrastSelected, setIsContrastSelected] = useState(true);
  const [isBrightnessSelected, setIsBrightnessSelected] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const FilterOptions = [
    {id: 1, key: 'crop', label: 'Crop', image: images.Crop},
    {id: 2, key: 'contrast', label: 'Contrast', image: images.Contrast},
    {id: 3, key: 'brightness', label: 'Brightness', image: images.Sun},
    {id: 4, key: 'temperature', label: 'Temp', image: images.Temp},
    {id: 5, key: 'sharpness', label: 'Sharpness', image: images.Sharpness},
    {id: 6, key: 'softness', label: 'Softness', image: images.Sharpness},
    {id: 7, key: 'filters', label: 'Filters', image: images.Star},
    {id: 8, key: 'stickers', label: 'Stickers', image: images.Happy},
    {id: 9, key: 'trim', label: 'Trim', image: images.Trim},
    {id: 10, key: 'pip', label: 'Pip', image: images.pip},
  ];

  const updateContrast = value => {
    setContrastValue(value);
    setSelectedFilter('contrast');
  };

  const updateBrightness = value => {
    setBrightnessValue(value);
    setSelectedFilter('brightness');
    console.log('Brightness Value:', value);
  };

  const updateSoftness = value => {
    setSoftnessValue(value);
  };

  const updateSharpness = value => {
    setSharpnessValue(value);
  };

  const updateTemperature = value => {
    setTemperatureValue(value);
  };

  const renderFilterItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        if (props.multipleImages?.length > 0) {
        } else {
          if (
            item.id !== 1 &&
            item.id !== 7 &&
            item.id !== 8 &&
            item.id !== 9 &&
            item.id !== 10
          ) {
            openFilterModal(item.id);
          } else {
            console.log('not show modal');
          }
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
    setSliderValue(1);
    setSelectedItemId(itemId);
    // setSelectedFilter(filter);
    setFilterModalVisible(true);
  };

  const applyFilter = useCallback(async () => {
    // const filteredImageUri = await sliderValue(selectedItemId);
    setAppliedImageUri(selectedItemId);
    await AsyncStorage.setItem('filteredImageURI', appliedImageUri);
  }, [selectedItemId]);

  const handleApplyFilter = () => {
    const filteredImageWithContrast = applyContrast(
      props.filteredImage,
      contrastValue,
    );
    setFilterModalVisible(false);
    navigation.navigate('EditingScreen', {
      selectedItemId: selectedItemId,
      filteredImageURI: filteredImageWithContrast,
      contrastValue: contrastValue,
    });
  };
  const handleBrightFilter = () => {
    const filteredImageWithBrightness = applyBrightness(
      props.filteredImage,
      brightnessValue,
    );
    setFilterModalVisible(false);
    navigation.navigate('EditingScreen', {
      selectedItemId: selectedItemId,
      filteredBrightnessImageURI: filteredImageWithBrightness,
      brightnessValue: brightnessValue,
    });
  };

  const handleTempFilter = () => {
    const filteredImageWithTemp = applyTemp(
      props.filteredImage,
      temperatureValue,
    );
    setFilterModalVisible(false);
    navigation.navigate('EditingScreen', {
      selectedItemId: selectedItemId,
      filteredImageWithTemp: filteredImageWithTemp,
      temperatureValue: temperatureValue,
    });
  };

  const handleSharpnessFilter = () => {
    const filteredImageWithSharp = applySharp(
      props.filteredImage,
      sharpnessValue,
    );
    setFilterModalVisible(false);
    navigation.navigate('EditingScreen', {
      selectedItemId: selectedItemId,
      filteredImageWithSharp: filteredImageWithSharp,
      sharpnessValue: sharpnessValue,
    });
  };

  const handleSoftnessFilter = () => {
    const filteredImageWithSoft = applySoft(props.filteredImage, softnessValue);
    setFilterModalVisible(false);
    navigation.navigate('EditingScreen', {
      selectedItemId: selectedItemId,
      filteredImageWithSoft: filteredImageWithSoft,
      softnessValue: softnessValue,
    });
  };

  const applyContrast = (imageUri, contrast) => {
    return imageUri;
  };
  const applyBrightness = (imageUri, brightness) => {
    return imageUri;
  };

  const applyTemp = (imageUri, temperature) => {
    return imageUri;
  };

  const applySharp = (imageUri, sharpen) => {
    return imageUri;
  };

  const applySoft = (imageUri, blur) => {
    return imageUri;
  };

  const closeFilterModal = () => {
    setFilterModalVisible(false);
    navigation.navigate('EditingScreen', {
      selectedItemId: selectedItemId,
      filteredImageURI: appliedImageUri,
    });
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
              animationIn="slideInRight"
              animationOut="slideOutLeft"
              onBackButtonPress={closeFilterModal}
              onBackdropPress={closeFilterModal}>
              <View style={styles.viewModal}>
                {selectedItemId === 2 ? (
                  <>
                    <ColorMatrix
                      style={styles.colorMtrix}
                      matrix={[
                        contrastValue,
                        0,
                        0,
                        0,
                        0,
                        0,
                        contrastValue,
                        0,
                        0,
                        0,
                        0,
                        0,
                        contrastValue,
                        0,
                        0,
                        0,
                        0,
                        0,
                        1,
                        0,
                      ]}>
                      {props.selectedImage ? (
                        <Image
                          source={{uri: imageUri}}
                          style={{
                            width: '100%',
                            marginTop: hp('5%'),
                            height: 500,
                            borderRadius: 10,
                            marginBottom: 10,
                            resizeMode: 'contain',
                          }}
                        />
                      ) : props.filteredImage ? (
                        <Image
                          source={{uri: props.filteredImage}}
                          style={{
                            width: '100%',
                            marginTop: hp('5%'),
                            height: 500,
                            borderRadius: 10,
                            marginBottom: 10,
                            resizeMode: 'contain',
                          }}
                        />
                      ) : props.selectedVideo ? (
                        <Video
                          source={{uri: props.selectedVideo}}
                          style={{flex: 1}}
                          resizeMode="contain"
                        />
                      ) : props.getSelectedImage ? (
                        <Image
                          source={{uri: props.filteredImage}}
                          style={{
                            width: '100%',
                            marginTop: hp('5%'),
                            height: 500,
                            marginBottom: 10,
                            resizeMode: 'contain',
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </ColorMatrix>
                    <View style={styles.sliderviews}>
                      <TouchableOpacity
                        onPress={handleApplyFilter}
                        style={{margin: hp('1%')}}>
                        <Image
                          source={images.Done1}
                          style={{resizeMode: 'contain', width: 15, height: 15}}
                        />
                      </TouchableOpacity>
                      <View style={styles.sliderView}>
                        <Slider
                          style={{width: '80%', height: 40, margin: hp('0.5%')}}
                          minimumValue={-2}
                          maximumValue={2}
                          value={contrastValue}
                          onValueChange={value => updateContrast(value)}
                          // onSlidingComplete={handleApplyFilter}
                        />
                        <Text style={{margin: hp('0.5%')}}>
                          Adjust Contrast: {contrastValue}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : selectedItemId === 3 ? (
                  <>
                    <ColorMatrix
                      style={styles.colorMtrix}
                      matrix={[
                        brightnessValue,
                        0,
                        0,
                        0,
                        0,
                        0,
                        brightnessValue,
                        0,
                        0,
                        0,
                        0,
                        0,
                        brightnessValue,
                        0,
                        0,
                        0,
                        0,
                        0,
                        1,
                        0,
                      ]}>
                      {props.selectedImage ? (
                        <Image
                          source={{uri: imageUri}}
                          style={{
                            width: '100%',
                            marginTop: hp('5%'),
                            height: 500,
                            borderRadius: 10,
                            marginBottom: 10,
                            resizeMode: 'contain',
                          }}
                        />
                      ) : props.filteredImage ? (
                        <Image
                          source={{uri: props.filteredImage}}
                          style={{
                            width: '100%',
                            marginTop: hp('5%'),
                            height: 500,
                            borderRadius: 10,
                            marginBottom: 10,
                            resizeMode: 'contain',
                          }}
                        />
                      ) : props.selectedVideo ? (
                        <Video
                          source={{uri: props.selectedVideo}}
                          style={{flex: 1}}
                          resizeMode="contain"
                        />
                      ) : props.getSelectedImage ? (
                        <Image
                          source={{uri: props.filteredImage}}
                          style={{
                            width: '100%',
                            marginTop: hp('5%'),
                            height: 500,
                            borderRadius: 10,
                            marginBottom: 10,
                            resizeMode: 'contain',
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </ColorMatrix>

                    <View style={styles.sliderviews}>
                      <TouchableOpacity
                        onPress={handleBrightFilter}
                        style={{margin: hp('1%')}}>
                        <Image
                          source={images.Done1}
                          style={{resizeMode: 'contain', width: 15, height: 15}}
                        />
                      </TouchableOpacity>
                      <View style={styles.sliderView}>
                        <Slider
                          style={{width: '80%', height: 40, margin: hp('0.5%')}}
                          minimumValue={1}
                          maximumValue={5}
                          value={brightnessValue}
                          onValueChange={value => updateBrightness(value)}
                          // onSlidingComplete={handleBrightFilter}
                        />
                        <Text style={{margin: hp('0.5%')}}>
                          {' '}
                          Adjust brightness: {brightnessValue}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : selectedItemId === 4 ? (
                  <>
                    <ColorMatrix
                      style={styles.colorMtrix}
                      matrix={[
                        1.2,
                        0,
                        0,
                        0,
                        0, // Red channel
                        0,
                        1.25,
                        0,
                        0,
                        0, // Green channel (adjust for warmth)
                        0,
                        0,
                        1.5,
                        0,
                        0, // Blue channel (adjust for warmth)
                        0,
                        0,
                        0,
                        1,
                        0, // Alpha channel (no change)
                      ]}
                      temperature={temperatureValue}>
                      {props.selectedImage ? (
                        <Image
                          source={{uri: imageUri}}
                          style={{
                            width: '100%',
                            marginTop: hp('5%'),
                            height: 500,
                            borderRadius: 10,
                            marginBottom: 10,
                            resizeMode: 'contain',
                          }}
                        />
                      ) : props.filteredImage ? (
                        <Image
                          source={{uri: props.filteredImage}}
                          style={{
                            width: '100%',
                            marginTop: hp('5%'),
                            height: 500,
                            borderRadius: 10,
                            marginBottom: 10,
                            resizeMode: 'contain',
                          }}
                        />
                      ) : props.selectedVideo ? (
                        <Video
                          source={{uri: props.selectedVideo}}
                          style={{flex: 1}}
                          resizeMode="contain"
                        />
                      ) : props.getSelectedImage ? (
                        <Image
                          source={{uri: props.filteredImage}}
                          style={{
                            width: '100%',
                            marginTop: hp('5%'),
                            height: 500,
                            borderRadius: 10,
                            marginBottom: 10,
                            resizeMode: 'contain',
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </ColorMatrix>
                    <View style={styles.sliderviews}>
                      <TouchableOpacity
                        onPress={handleTempFilter}
                        style={{margin: hp('1%')}}>
                        <Image
                          source={images.Done1}
                          style={{resizeMode: 'contain', width: 15, height: 15}}
                        />
                      </TouchableOpacity>
                      <View style={styles.sliderView}>
                        <Slider
                          style={{width: '80%', height: 40, margin: hp('0.5%')}}
                          minimumValue={-100}
                          maximumValue={100}
                          value={temperatureValue}
                          onValueChange={value => updateTemperature(value)}
                          //  onSlidingComplete={handleTempFilter}
                        />
                        <Text style={{margin: hp('0.5%')}}>
                          Adjust Temperature: {temperatureValue}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : selectedItemId === 5 ? (
                  <>
                    <ColorMatrix
                      style={styles.colorMtrix}
                      matrix={[
                        0, -1, 0, 0, 0, 0, 5, 1, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0,
                        1, 0,
                      ]}
                      sharpen={sharpnessValue}>
                      {props.selectedImage ? (
                        <Image
                          source={{uri: imageUri}}
                          style={{
                            width: '100%',
                            marginTop: hp('5%'),
                            height: 500,
                            borderRadius: 10,
                            marginBottom: 10,
                            resizeMode: 'contain',
                          }}
                        />
                      ) : props.filteredImage ? (
                        <Image
                          source={{uri: props.filteredImage}}
                          style={{
                            width: '100%',
                            marginTop: hp('5%'),
                            height: 500,
                            borderRadius: 10,
                            marginBottom: 10,
                            resizeMode: 'contain',
                          }}
                        />
                      ) : props.selectedVideo ? (
                        <Video
                          source={{uri: props.selectedVideo}}
                          style={{flex: 1}}
                          resizeMode="contain"
                        />
                      ) : props.getSelectedImage ? (
                        <Image
                          source={{uri: props.filteredImage}}
                          style={{
                            width: '100%',
                            marginTop: hp('5%'),
                            height: 500,
                            borderRadius: 10,
                            marginBottom: 10,
                            resizeMode: 'contain',
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </ColorMatrix>
                    <View style={styles.sliderviews}>
                      <TouchableOpacity
                        onPress={handleSharpnessFilter}
                        style={{margin: hp('1%')}}>
                        <Image
                          source={images.Done1}
                          style={{resizeMode: 'contain', width: 15, height: 15}}
                        />
                      </TouchableOpacity>
                      <View style={styles.sliderView}>
                        <Slider
                          style={{width: '80%', height: 40, margin: hp('0.5%')}}
                          minimumValue={-50}
                          maximumValue={50}
                          value={sharpnessValue}
                          onValueChange={value => updateSharpness(value)}
                          // onSlidingComplete={handleSharpnessFilter}
                        />
                        <Text style={{margin: hp('0.5%')}}>
                          Adjust Sharpness: {sharpnessValue}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : selectedItemId === 6 ? (
                  <>
                    <ColorMatrix
                      style={styles.colorMtrix}
                      matrix={[
                        1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
                        0,
                      ]}
                      // brightness={brightnessValue}
                      blur={softnessValue}>
                      {props.selectedImage ? (
                        <Image
                          source={{uri: imageUri}}
                          style={{
                            width: '100%',
                            marginTop: hp('5%'),
                            height: 500,
                            borderRadius: 10,
                            marginBottom: 10,
                            resizeMode: 'contain',
                          }}
                        />
                      ) : props.filteredImage ? (
                        <Image
                          source={{uri: props.filteredImage}}
                          style={{
                            width: '100%',
                            marginTop: hp('5%'),
                            height: 500,
                            borderRadius: 10,
                            marginBottom: 10,
                            resizeMode: 'contain',
                          }}
                        />
                      ) : props.selectedVideo ? (
                        <Video
                          source={{uri: props.selectedVideo}}
                          style={{flex: 1}}
                          resizeMode="contain"
                        />
                      ) : props.getSelectedImage ? (
                        <Image
                          source={{uri: props.filteredImage}}
                          style={{
                            width: '100%',
                            marginTop: hp('5%'),
                            height: 500,
                            borderRadius: 10,
                            marginBottom: 10,
                            resizeMode: 'contain',
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </ColorMatrix>
                    <View style={styles.sliderviews}>
                      <TouchableOpacity
                        onPress={handleSoftnessFilter}
                        style={{margin: hp('1%')}}>
                        <Image
                          source={images.Done1}
                          style={{resizeMode: 'contain', width: 15, height: 15}}
                        />
                      </TouchableOpacity>
                      <View style={styles.sliderView}>
                        <Slider
                          style={{width: '80%', height: 40, margin: hp('0.5%')}}
                          minimumValue={0}
                          maximumValue={10}
                          value={softnessValue}
                          onValueChange={value => updateSoftness(value)}
                          // onSlidingComplete={handleSoftnessFilter}
                        />

                        <Text style={{margin: hp('0.5%')}}>
                          Adjust softnessValue: {softnessValue}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <></>
                )}
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
    alignItems: 'center',
    margin: hp('1%'),
    justifyContent: 'center',
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
