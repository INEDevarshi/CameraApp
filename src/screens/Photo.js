import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, FlatList, Image,ImageBackground,TouchableWithoutFeedback, TouchableOpacity, Text } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { RadioButton, Icon, TouchableRipple } from 'react-native-paper';
import { Modal } from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { images } from '../assets/images/image';
import { COLOR } from '../utils/Config';
const Photo = ({route}) => {
  const selectedImages =route.params;
  console.log('selectedImages photos src',selectedImages);
  const [dataSource, setDataSource] = useState([]);
  const [isSecondModalVisible, setIsSecondModalVisible] = useState(false);
  //const [selectedImages, setSelectedImages] = useState([]);
  const [selectedGalary, setSelectedGalary] = useState(1);
  const [isSelectedImage, setIsSelectedImage] = useState(false);

  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    // Load initial images
    loadImages();
  }, []);

  useEffect(() => {
    const getAllPhotos = async () => {
      setHasPermission(true);
      await CameraRoll.getPhotos({
        first: 15,
        assetType: 'Photos',
      })
        .then(r => {
          console.log('gslsryphotos', JSON.stringify(r.edges));
          setPhotos(r.edges);
        })
        .catch(err => {
          console.log('error on take galary photo', err);
        });
    };

    getAllPhotos();
  }, []);

  const toggleImageSelection = imageUri => {
    const isSelected = selectedImages.includes(imageUri);
    if (isSelected) {
      setSelectedImages(prevSelected =>
        prevSelected.filter(uri => uri !== imageUri),
      );
      setIsSelectedImage(true);
      setIsSecondModalVisible(false);
      setDataSource(images.map((image, index) => ({ id: index, size: 1, src: image.path })));

    } else {
      setSelectedImages(prevSelected => [...prevSelected, imageUri]);
    }
  };

  const renderGalleryItem = ({ item }) => {
    const isSelected = selectedImages.includes(item.node.image.uri);

    return (
      <TouchableOpacity
        onPress={() => toggleImageSelection(item.node.image.uri)}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: Dimensions.get('window').width / 3 - 15,
            height: 90,
          }}>
          <Image
            source={{ uri: item.node.image.uri }}
            style={{ width: '80%', height: '80%', borderRadius: hp('1.5%') }}
          />
          <View style={{ position: 'absolute', top: 6, right: 6 }}>
            <RadioButton
              value={isSelectedImage}
              status={isSelectedImage ? 'checked' : 'unchecked'}
              onPress={() => {
                toggleImageSelection(item.node.image.uri);
                // setIsSelectedImage(!isSelectedImage); // Update the state
              }}
              uncheckedColor="#dddddd"
            />
          </View>
          {isSelected && (
            <View style={{ position: 'absolute', top: 6, right: 6 }}>
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
                <Image source={images.Done} style={{ resizeMode: 'center' }} />
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const loadImages = () => {
    let items = Array.apply(null, Array(5)).map((v, i) => {
      const size = i % 3 === 0 ? 2 : 1; // Example: every 3rd item has a larger size
      return {
        id: i,
        size: size,
        src: `https://unsplash.it/400/${size === 2 ? 800 : 400}?image=${i + 1}`,
      };
    });
    setDataSource(items);
  };

  const toggleSecondModal = () => {
    //  Alert.alert('Modal has been closed.');
    setIsModalVisible(false);
    setIsSecondModalVisible(!isSecondModalVisible);
  };

  const handleDone = async () => {
    try {
      console.log('Selected Images:', selectedImages);

      if (selectedImages.length === 1) {
        // If only one image is selected, navigate to EditingScreen
        navigation.navigate('EditingScreen', { selectedImages: selectedImages });
      } else
        if (selectedImages.length > 1) {
          // If multiple images are selected, navigate to ImageFilter
          navigation.navigate('ImageFilter', { selectedImage: selectedImage });

        }

      // Convert the selectedImages array to a JSON string
      const selectedImagesJSON = JSON.stringify(selectedImages);

      // Save the selectedImagesJSON to AsyncStorage
      await AsyncStorage.setItem('selectedImages', selectedImagesJSON);

      setIsSecondModalVisible(false);
    } catch (error) {
      console.error('Error saving selected images to AsyncStorage:', error);
    }
  };
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
    handleDone();
    // storeUserInfo();
  }, []);
const openImagePicker = () => {
  ImagePicker.openPicker({
    multiple: true,
    mediaType: 'photo',
    cropperTintColor:'#ff0000',
    cropperToolbarTitle: 'Custom Gallery Title',
    cropperToolbarColor: '#FF0000', // Background color of the toolbar
    cropperStatusBarColor: '#FF0000', // Status bar color
    cropperActiveWidgetColor: '#FF0000', // Color of the active tool in the toolbar
    cropperToolbarWidgetColor: '#FF0000', // Color of the inactive tools in the toolbar
  })
  .then((images) => {
    // Handle selected images
    console.log(images);
    // Update the data source with new images
    setDataSource(images.map((image, index) => ({ id: index, size: 1, src: image.path })));
  })
  .catch((error) => {
    console.log('ImagePicker Error: ', error);
  });
};


  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={dataSource}
        renderItem={({ item }) => (
          <View
            style={{
              flex: item.size,
              flexDirection: 'column',
              margin: 1,
            }}>
            <Image
              style={styles.imageThumbnail}
              source={{ uri: item.src }}
            />
          </View>
        )}
        // Setting the number of columns
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity onPress={openImagePicker}>
        <View style={styles.button}>
          <Text>Select Images</Text>
        </View>
      </TouchableOpacity>
      {/* <Modal
            transparent={true}
            animationType="slide"
            visible={isSecondModalVisible}
            onRequestClose={toggleSecondModal}>
            <TouchableWithoutFeedback
              onPress={() => getAllPhotos()}
            //  onPress={toggleSecondModal}
            >
              <View style={styles.modalOverlay2}>
                <ImageBackground
                  imageStyle={styles.backGroundImage}
                  style={styles.mainView}
                  source={images.BG}
                >
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
                    <FlatList
                      data={photos}
                      numColumns={3}
                      renderItem={renderGalleryItem}
                      keyExtractor={item => item.node.image.uri}
                    />
                  )}
                </ImageBackground>
              </View>
            </TouchableWithoutFeedback>
          </Modal> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  imageThumbnail: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#DDDDDD',
  },
});

export default Photo;
