import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, StyleSheet, Dimensions, TextInput, Keyboard, ImageBackground, FlatList, Modal, TouchableWithoutFeedback } from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { Picker } from '@react-native-picker/picker';
import { images } from '../assets/images/image';
import { Platform, PermissionsAndroid } from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
//import AudioRecord from 'react-native-audio-record';
import Sound from 'react-native-sound';
import { RadioButton, Icon, TouchableRipple } from 'react-native-paper';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

import RNFS from 'react-native-fs';
import {
  Grayscale,
  Sepia,
  Tint,
  ColorMatrix,
  concatColorMatrices,
  invert,
  contrast,
  saturate
} from 'react-native-color-matrix-image-filters'
// import App from '../../App';
import TextModal from '../components/TextModal';
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";

const EditVideo2 = ({ props, route }) => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const { selectedImage } = route.params;
  const { selectedImages } = route.params;
  console.log('Received Images:', selectedImages);

  const { filteredImage, filterIndex } = route.params;
  useEffect(() => {
    console.log('selectedImages selectedImages:', selectedImages);
    console.log('Filtered Image URI filteredImage in video2 screen:', filteredImage);

  }, [filteredImage, filterIndex]);

  console.log('selectedImage', selectedImage);
  const navigation = useNavigation();
  const [inputText, setInputText] = useState([]);
  const [selectedImages3, setSelectedImages] = useState([]);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [selectedTextStyle, setSelectedTextStyle] = useState([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [textWithStyles, setTextWithStyles] = useState([]);
  const [isSelectedImage, setIsSelectedImage] = useState(false);
  const [selectedImage2, setSelectedImage2] = useState(null);
  const [selectedImage3, setSelectedImage] = useState(null);
 const [isSelectedGalry,setIsSelectedGalry]=useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [isSecondModalVisible, setIsSecondModalVisible] = useState(false);
  const [isThirdModalVisible, setIsThirdModalVisible] = useState(false);
  const [isFourthModalVisible, setIsFourthModalVisible] = useState(false);
  const [isFifthModalVisible, setIsFifthModalVisible] = useState(false);
  const [isSixModalVisible, setIsSixModalVisible] = useState(false);
  const [isSevenModalVisible, setIsSevenModalVisible] = useState(false);
  const [isEightModalVisible, setIsEightModalVisible] = useState(false);
  const [selectedGalary, setSelectedGalary] = useState(1);
  const [selectedRecording, setSelectedRecording] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPath, setAudioPath] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(true);
  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener(
  //     'keyboardDidShow',
  //     () => setKeyboardVisible(true)
  //   );
  //   const keyboardDidHideListener = Keyboard.addListener(
  //     'keyboardDidHide',
  //     () => setKeyboardVisible(false)
  //   );

  //   // Cleanup function to remove the event listeners
  //   return () => {
  //     keyboardDidShowListener.remove();
  //     keyboardDidHideListener.remove();
  //   };
  // }, []);

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
  useEffect(() => {
    checkCameraPermission();
    //handleDone();
    // animate();
    // storeUserInfo();
  }, []);

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

  console.log('selectedRecording:', selectedRecording);
  console.log('audioPath:', audioPath);

  const textStyles = {
    normal: { fontWeight: 'normal', fontStyle: 'normal', textDecorationLine: 'none', color: 'white' },
    bold: { fontWeight: 'bold', fontStyle: 'normal', textDecorationLine: 'none', color: 'white' },
    italic: { fontWeight: 'normal', fontStyle: 'italic', textDecorationLine: 'none', color: 'red' },
    underline: {
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecorationLine: 'underline', // 'underline' is the correct value for textDecorationLine to apply underlining
      color: 'black',
    },

    colored: { color: '#ff1253' },
    // uppercase: { textTransform: 'uppercase', color: 'black',textDecorationLine: 'none', },
    // lowercase: { textTransform: 'lowercase', color: 'black' ,textDecorationLine: 'none',},
  };

  const textStyleItems = [
    { label: 'Normal', value: 'normal', icon: images.TextBox },
    { label: 'Bold', value: 'bold', icon: images.Bold },
    { label: 'Italic', value: 'italic', icon: images.Italic },
    { label: 'Underline', value: 'underline', icon: images.Underline },
    { label: 'Uppercase', value: 'normal', icon: images.Uppercase },
    { label: 'Lowercase', value: 'normal', icon: images.Lowercase },
    { label: 'Color', value: 'colored', icon: images.Paint },
  ];


  const saveTextToStorage = async () => {
    try {
      const serializedTextWithStyles = JSON.stringify(textWithStyles);
      await AsyncStorage.setItem('formattedText', serializedTextWithStyles);
      console.log('Text with styles saved to AsyncStorage');
    } catch (error) {
      console.error('Error saving text to AsyncStorage:', error);
    }
  };

  const loadTextFromStorage = async () => {
    try {
      const serializedTextWithStyles = await AsyncStorage.getItem('formattedText');
      if (serializedTextWithStyles) {
        const loadedTextWithStyles = JSON.parse(serializedTextWithStyles);
        setTextWithStyles(loadedTextWithStyles);
      }
    } catch (error) {
      console.error('Error loading text from AsyncStorage:', error);
    }
  };

  const applyTextStyle = (style) => {
    setSelectedTextStyle(style); // Set the selected text style
    const updatedTextWithStyles = [...textWithStyles, { text: inputText, style }];
    setTextWithStyles(updatedTextWithStyles);
    // setInputText(''); // Clear the input after applying styles
    setPickerVisible(false);
  };

  // Call this function in a useEffect or when your component mounts
  useEffect(() => {

    saveTextToStorage();
    loadTextFromStorage();
  }, []);


  Sound.setCategory('Playback');


  // useEffect(() => {
  //   const getAllPhotos = async () => {
  //     setHasPermission(true)
  //     await CameraRoll.getPhotos({
  //       first: 15,
  //       assetType: 'Photos',
  //     })
  //       .then(r => {
  //         console.log('gslsryphotos', JSON.stringify(r.edges));
  //         setPhotos(r.edges);
  //       })
  //       .catch((err) => {
  //         console.log('error on take galary photo', err);
  //       })
  //   };

  //   getAllPhotos();
  // }, []);


  // const toggleImageSelection = (imageUri) => {
  //   const isSelected = selectedImages?.includes(imageUri);
  
  //   if (isSelected) {
  //     setSelectedImages((prevSelected) =>
  //       prevSelected?.filter((uri) => uri !== imageUri) || []
  //     );
  //     setIsSelectedImage(true);
  //     setIsSecondModalVisible(false);
  //   } else {
  //     setSelectedImages((prevSelected) => [...(prevSelected || []), imageUri]);
  //   }
  // };
  


//   const renderGalleryItem = ({ item }) => {

//     const isSelectedGalry = selectedImages && selectedImages.includes(item.node.image.uri);
  
//     return (
//       <TouchableOpacity onPress={() => toggleImageSelection(item.node.image.uri)}>
//         <View
//           style={{
//             alignItems: 'center',
//             justifyContent: 'center',
//             width: Dimensions.get('window').width / 3 - 15,
//             height: 90,
//           }}
//         >
//           <Image
//             source={{ uri: item.node.image.uri }}
//             style={{ width: '80%', height: '80%', borderRadius: hp('1.5%') }}
//           />
//           <View style={{ position: 'absolute', top: 6, right: 6 }}>
//             <RadioButton
//               value={isSelectedGalry}
//               status={isSelectedGalry ? 'checked' : 'unchecked'}
//               onPress={() => {
//                 toggleImageSelection(item.node.image.uri);
//                 // Update the state based on the current isSelected value
//                 setIsSelectedImage(!isSelectedGalry);
//               }}
//               uncheckedColor="#dddddd"
//             />
//           </View>
//           {isSelectedGalry && (
//   <View style={{ position: 'absolute', top: 0, right: 6 }}>
//     <RadioButton
//       value={isSelectedGalry}
//       status={isSelectedGalry ? 'checked' : 'unchecked'}
//       onPress={() => {
//         toggleImageSelection(item.node.image.uri);
//         // Update the state based on the current isSelected value
//         setIsSelectedGalry(!isSelectedGalry);
//       }}
//       color="green" // Change the color when selected
//       uncheckedColor="#dddddd"
//     />
//     <View
//       style={{
//         position: 'absolute',
//         borderRadius: 30,
//         width: 16,
//         height: 16,
//         backgroundColor: '#4CBB17',
//         left: 10,
//         top: 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//         elevation: 0,
//       }}
//     >
//       <Image source={images.Done} style={{ resizeMode: 'center' }} />
//     </View>
//   </View>
// )}

//         </View>
//       </TouchableOpacity>
//     );
//   };
  
//   const handleDone = async () => {
//     try {
//       console.log('Selected Images:', selectedImages);

//      // const selectedImagesJSON = JSON.stringify(selectedImages);

//      // await AsyncStorage.setItem('selectedImages', selectedImagesJSON);

//       // Close the modal and navigate to 'EditVideo2'
//       setIsSecondModalVisible(false);
//       navigation.navigate('EditVideo2', { selectedImages: selectedImages });
//     } catch (error) {
//       //console.error('Error saving selected images to AsyncStorage:', error);
//     }
//   };

  

  const galaryData = [
    {
      id: 1,
      name: 'Gallery',
      image: images.PhotoGalary
    },
    {
      id: 2,
      name: 'Draft',
      image: images.Draft

    },
  ];

  const recordingData = [
    {
      id: 1,
      name: 'Record',
      image: images.Record2
    },
    {
      id: 2,
      name: 'Recording',
      image: images.PlayRecord

    },
  ];

  const handleClosePicker = () => {
    setPickerVisible(false);
  };


  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const toggleModal2 = () => {
    setIsModalVisible(false);
    setIsModalVisible2(!isModalVisible2);
  };

  const toggleSecondModal = () => {
    //  Alert.alert('Modal has been closed.');
    setIsModalVisible(false);
    setIsSecondModalVisible(!isSecondModalVisible);
  }
  const toggleThirdModal = () => {
    //  Alert.alert('Modal has been closed.');
    setIsModalVisible(false);
    setIsSecondModalVisible(false);
    setIsThirdModalVisible(!isThirdModalVisible);
  };
  const toggleFourthModal = () => {
    //  Alert.alert('Modal has been closed.');
    setIsModalVisible(false);
    setIsSecondModalVisible(false);
    setIsThirdModalVisible(false);
    setIsFourthModalVisible(!isFourthModalVisible);

  };
  const toggleFifthModal = () => {
    setIsModalVisible(false);
    setIsSecondModalVisible(false);
    setIsFourthModalVisible(false);
    setIsThirdModalVisible(false);
    setIsFifthModalVisible(!isFifthModalVisible);
  };
  const toggleSixModal = () => {
    setIsModalVisible(false);
    setIsSecondModalVisible(false);
    setIsFourthModalVisible(false);
    setIsThirdModalVisible(false);
    setIsFifthModalVisible(false);
    setIsSixModalVisible(!isSixModalVisible);

  };
  const toggleSevenModal = () => {
    setIsModalVisible(false);
    setIsSecondModalVisible(false);
    setIsFourthModalVisible(false);
    setIsThirdModalVisible(false);
    setIsFifthModalVisible(false);
    setIsSixModalVisible(false);
    setIsSevenModalVisible(!isSevenModalVisible);
  };

  const toggleEightModal = () => {
    setIsModalVisible(false);
    setIsSecondModalVisible(false);
    setIsFourthModalVisible(false);
    setIsThirdModalVisible(false);
    setIsFifthModalVisible(false);
    setIsSixModalVisible(false);
    setIsSevenModalVisible(false);
    setIsEightModalVisible(!isEightModalVisible);
  };

  const handleCloseButtonPress = () => {
    setPickerVisible(false);
  };
  // const applyTextStyle = (style) => {
  //   const updatedTextWithStyles = [...textWithStyles, { text: inputText, style }];
  //   setTextWithStyles(updatedTextWithStyles);
  //   setInputText(''); // Clear the input after applying styles
  //   setPickerVisible(false);
  // };


  const renderDropdownItem = ({ item }) => (
    <TouchableOpacity onPress={() => applyTextStyle(item.value)} style={{ backgroundColor: 'transparent', alignItems: 'flex-end' }}>
      <Image source={item.icon} style={{ resizeMode: 'contain', marginRight: 10 }} />
    </TouchableOpacity>
  );


  useEffect(() => {
    AsyncStorage.setItem('selectedStyles', JSON.stringify(selectedStyles));
  }, [selectedStyles]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#333300" />
      {selectedImage2 ? (
        <Image source={{ uri: selectedImage2 }} style={styles.image} />
      ) : selectedImage ? (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      ) : filteredImage ? (
        <Image source={{ uri: filteredImage }} style={styles.image} />
        ) : selectedImages?.length > 0 ? (

        <View style={{ flex: 1 }}>
        <FlatList
          data={selectedImages}
          contentContainerStyle={{flexGrow:1,}}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          numColumns={1}
          scrollEventThrottle={16}
          renderItem={({ item, index }) => (
            <Image
            source={{ uri: item }}
            style={{
              width: screenWidth,
              height: screenHeight,
              resizeMode: 'cover', // Adjust the resizeMode based on your requirements
              alignSelf: 'center',
              justifyContent: 'center',
             // borderRadius:10,
             // padding: 5,
            }}
          />
          )}
        />
        </View>
      ) : (
        <Text style={{alignItems:'center',justifyContent:'center',textAlign:'center', fontSize:20}}>No images selected.</Text>
      )}

      {/* Icon View */}
      <View style={styles.iconContainer}>

        {/* Top container Icon's */}
        <View style={styles.topIconContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={images.Back} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleSixModal}>
            <Image source={images.Musical} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleModal}>
            <Image source={images.Downloading} style={styles.icon} />
          </TouchableOpacity>
        </View>

       
        <View style={[styles.textContainer]}>
            {pickerVisible ? (
              <Text style={[styles.textOverlay, styles.textInput, textStyles[selectedTextStyle]]}>{inputText}</Text>
            ) :
            (
              <TextInput
              style={[styles.textOverlay, styles.textInput, textStyles[selectedTextStyle]]}
              placeholder="Type your text here"
              multiline={true}
              value={inputText}
              placeholderTextColor="transparent"
              onChangeText={(text) => setInputText(text)}
              onFocus={() => setPickerVisible(false)}
              onBlur={() => {
                setTimeout(() => {
                  setPickerVisible(false);
                }, 200); 
              }}    >
            
            </TextInput>
            ) }
            
          </View>

        {/* Middle container Icon's */}
        <View style={{ alignSelf: 'center', flex: 2, justifyContent: 'center', marginTop: hp('15%'), flexDirection: 'row' }}>
          <View style={{ alignItems: 'flex-start', flex: 2, margin: hp('2.5%'), justifyContent: 'center', flexDirection: 'column' }}>
            <TouchableOpacity onPress={toggleFourthModal}>
              <Image source={images.Atsign} style={{ width: wp('8%'), height: hp('7%'), resizeMode: 'contain' }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleFifthModal}>
              <Image source={images.Eye} style={{ width: wp('8%'), height: hp('7%'), resizeMode: 'contain' }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleThirdModal} >
              <Image source={images.Worldwide} style={{ width: wp('8%'), height: hp('7%'), resizeMode: 'contain' }} />
            </TouchableOpacity>
            <TouchableOpacity
            // onPress={toggleSecondModal} 
            >
              <Image source={images.Hash} style={{ width: wp('7%'), height: hp('3%'), marginLeft: hp('0.2%'), marginTop: hp('2%'), resizeMode: 'contain' }} />
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: 'flex-end', flex: 2, margin: hp('1.5%'), justifyContent: 'center', flexDirection: 'column' }}>
            <TouchableOpacity >
              <Image source={images.Group51} style={{ width: wp('8%'), height: hp('7%'), resizeMode: 'contain' }} />
            </TouchableOpacity>
            <TouchableOpacity
            //  onPress={toggleSevenModal}
            >
              <Image source={images.Microphone} style={{ width: wp('8%'), height: hp('7%'), resizeMode: 'contain' }} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setPickerVisible(true)}>
              <Image source={images.TextBox} style={{ width: wp('8%'), height: hp('7%'), resizeMode: 'contain' }} />
            </TouchableOpacity>

            {/* <TextModal/> */}

            <Modal transparent={true} visible={pickerVisible} onRequestClose={() => setPickerVisible(false)}>
              <View style={{ flex: 1, width: '50%', justifyContent: 'center', alignItems: 'center', marginLeft: hp('19%'), marginTop: hp('45%') }}>
                <View style={{ backgroundColor: 'transparent', flexDirection: 'row', width: wp('70%'), }}>
               
                  <FlatList
                    data={textStyleItems}
                    renderItem={renderDropdownItem}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>

              </View>
            </Modal>

          </View>

        </View>

        {/* Bottom icon's */}
        <View style={{ alignItems: 'flex-end', justifyContent: 'space-between', flexDirection: 'row', marginTop: hp('20%'), }}>

          <TouchableOpacity
          // onPress={toggleSecondModal}
            style={{ alignSelf: 'center' }}>
            <Image source={images.Group37} style={{ width: wp('12%'), height: hp('7%'), margin: hp('2%'), resizeMode: 'contain' }} />
          </TouchableOpacity>

          <TouchableOpacity
          // onPress={takePhoto}
          >
            <Image source={images.Group57} style={{ width: wp('10%'), height: hp('7%'), marginTop: hp('-10%'), resizeMode: 'contain' }} />
          </TouchableOpacity>
          <TouchableOpacity
         //  onPress={() => navigation.navigate('Android',{selectedImage:selectedImage})}
          >
            <Image source={images.Group23} style={{ width: wp('12%'), height: hp('7%'), margin: hp('2%'), resizeMode: 'contain' }} />
          </TouchableOpacity>
        </View>
      </View>
      {/* First Modal */}
      <Modal transparent={true} animationType="slide" visible={isModalVisible} onRequestClose={toggleModal}>
        <TouchableWithoutFeedback style={styles.modalOverlay}>
          <Image
            source={images.Save}
            style={{ width: wp('25%'), height: hp('10%'), marginTop: hp('5%'), marginLeft: hp('35%'), resizeMode: 'contain' }}
          />
        </TouchableWithoutFeedback>
      </Modal>

     

      {/* Third Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isThirdModalVisible}
        onRequestClose={toggleThirdModal}
      >
        <TouchableWithoutFeedback onPress={toggleThirdModal}>
          <View style={styles.modalOverlay2}>
            <Image
              source={images.Location}
              style={{ width: wp('100%'), height: hp('70%'), marginTop: hp('30%'), resizeMode: 'contain' }}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Fourth Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isFourthModalVisible}
        onRequestClose={toggleFourthModal}
      >
        <TouchableWithoutFeedback onPress={toggleFourthModal}>
          <View style={styles.modalOverlay2}>
            {/* Content of the second set of modals */}
            <Image
              source={images.Mention}
              style={{ width: wp('100%'), height: hp('70%'), marginTop: hp('30%'), resizeMode: 'contain' }}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Fifth Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isFifthModalVisible}
        onRequestClose={toggleFifthModal}
      >
        <TouchableWithoutFeedback onPress={toggleFifthModal}>
          <View style={styles.modalOverlay2}>
            {/* Content of the second set of modals */}
            <Image
              source={images.Frame8}
              style={{ width: wp('100%'), height: hp('70%'), marginTop: hp('30%'), resizeMode: 'contain' }}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {/* Sixth Modal */}

      <Modal
        transparent={true}
        animationType="slide"
        visible={isSixModalVisible}
        onRequestClose={toggleSixModal}
      >
        <TouchableWithoutFeedback onPress={toggleSixModal}>
          <View style={styles.modalOverlay2}>
            {/* Content of the second set of modals */}
            <Image
              source={images.Frame16}
              style={{ width: wp('100%'), height: hp('70%'), marginTop: hp('51%'), resizeMode: 'contain' }}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
    fontWeight: '500'
    //  fontFamily: FONT.SEMI_BOLD,
    // fontSize: hp('1.8%'),
    // padding: hp('1.5%'),
  },
  boldText: {
    fontWeight: 'bold',
  },
  italicText: {
    fontStyle: 'italic',
  },
  underlinedText: {
    textDecorationLine: 'underline',
    borderBottomWidth: 1, borderColor: 'black'
  },
  lowercaseText: {
    textTransform: 'lowercase',
  },

  textOverlay: {
    width: '50%', // Lowercase 'width'
    height: '100%', // Lowercase 'height'
    position: 'absolute', // Use 'position: absolute' to overlay the text on the image
    alignSelf: 'flex-start',
    //  justifyContent: 'center',
    fontSize: 18,
    // margin: hp('5%'),
    left: hp('5%'),
    backgroundColor:'transparent'
  },
  picker: {
    height: 40,
    width: '100%',
    marginBottom: 20,
    flexDirection: 'row'
  },
  textInput: {

    // width: '50%', // Lowercase 'width'
    // height: '100%', // Lowercase 'height'
    position: 'absolute', // Use 'position: absolute' to overlay the text on the image
    alignSelf: 'flex-start',
    justifyContent: 'center',
    fontSize: 20,
   // backgroundColor:'#f5f5f5',
   // borderWidth:1,
   // borderColor:'grey',
    margin: hp('1%'),
    left: hp('10%'),
    bottom: 20,
    top:20
  },
  recordingItem: {
    padding: 50,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  recordingItemText: {
    fontSize: 16,
    color: '#000',
  },
  recordButton: {
    // position: 'absolute',
    // bottom: hp('10%'),
    alignSelf: 'center',
  },
  recordButtonIcon: {
    width: wp('15%'),
    height: hp('15%'),
    resizeMode: 'contain',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  image22: {
    width: '100%',
    height: '100%',
    resizeMode: 'center',
  },
  iconContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  textContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start'
    // flex:1
  },
  closeIcon: {
    width: '10%',
    height: '10%',
  },
  topIconContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    margin: hp('1%'),
  },
  middleIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('10%'),
  },
  bottomIconContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: hp('20%'),
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: wp('12%'),
    height: hp('7%'),
    margin: hp('2%'),
    resizeMode: 'contain',
  },
  modalOverlay: {
    flex: 1,
    //  alignItems: 'center',
    //justifyContent: 'center',
  },
  modalOverlay2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay22: {
    flex: 1,
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
    // position:'absolute'
  },
  modalOverlay3: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  modalImage: {
    width: wp('22%'),
    height: hp('10%'),
    marginTop: hp('7%'),
    margin: hp('1%'),
    resizeMode: 'contain',
  },
});

export default EditVideo2;
