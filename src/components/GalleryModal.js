// GalleryModal.js

import React, { useState } from 'react';
import { Modal, TouchableOpacity, TouchableWithoutFeedback, Text, View, FlatList, ImageBackground, Image } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { images } from '../assets/images/image';
import FastImage from 'react-native-fast-image'

const GalleryModal = ({ isModalVisible, isSecondModalVisible, toggleSecondModal, getAllPhotos, toggleModal, photos, handleGalleryImageSelect }) => {
  const [selectedImage, setSelectedImage] = useState(false);
  const [selectedGalary, setSelectedGalary] = useState(1);


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
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isSecondModalVisible}
      onRequestClose={toggleSecondModal}
    >
      <TouchableWithoutFeedback
        onPress={getAllPhotos}
      //  onPress={toggleSecondModal}
      >
        <View style={styles.modalOverlay2}>

          <ImageBackground
            style={{
              width: wp('99%'),
              alignItems: 'center',
              borderRadius: 10,
              justifyContent: 'center',
              resizeMode: 'contain',
              overflow: 'hidden', // Clip the content to the borderRadius
            }} source={images.BG}
          >
            <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: '90%', marginLeft: 80, margin: 1, }}>
              <View
                style={{
                  borderWidth: 5, borderRadius: 10,
                  alignItems: 'center', borderColor: '#ffffff', width: '40%', height: '1%', marginTop: 5,
                }}>

              </View>
              <Text style={{ alignItems: 'flex-end', borderBottomWidth: 1.5, justifyContent: 'flex-end', color: '#000', margin: 1, marginLeft: 50 }}
                onPress={toggleSecondModal}>Done</Text>

            </View>

            <View
              style={
                {
                  alignItems: 'center', flexDirection: 'row', width: '80%', marginTop: 20, backgroundColor: '#ffffff',
                  borderWidth: 1, borderRadius: 10
                }
              }
            >
              {galaryData &&
                galaryData.map(item => {
                  return (
                    <TouchableOpacity
                      onPress={() => setSelectedGalary(item.id)}
                      key={item.id}
                      style={[
                        styles.tabButton,
                        {
                          borderColor: selectedGalary === item.id ? '#000000' : '#ffffff',
                          borderRightWidth:
                            selectedGalary !== 2 && selectedGalary === item.id ? 2 : 0,
                          borderBottomWidth:
                            selectedGalary !== 2 && selectedGalary === item.id ? 3 : 0,
                        },
                      ]}>
                      <Image source={item.image} style={{ width: hp('3%'), margin: wp('1%'), height: hp('3%'), resizeMode: 'contain' }} />
                      <Text style={[styles.tabButtonTxt, {
                        color:
                          selectedGalary === item.id
                            ? '#000000'
                            : '#000000',
                      },]}>{item.name}</Text>
                    </TouchableOpacity>

                  );
                })}
            </View>
            {selectedGalary === 1 ? (

              <FlatList
                data={photos}
                numColumns={3}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => handleGalleryImageSelect(item.node.image.uri)}
                    >
                      <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: Dimensions.get('window').width / 3 - 15,
                        height: 90,
                        //    margin: hp('0.4%')
                      }}>
                        <FastImage
                          source={{
                            uri: item.node.image.uri,
                            priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.contain}

                          style={{ width: '80%', height: '80%', borderRadius: hp('1.5%'), }}
                        />
                        <View style={{ position: 'absolute', top: 5, right: 6 }}>
                          <RadioButton
                            value={isSelectedImage}
                            status={isSelectedImage ? 'checked' : 'unchecked'}
                            onPress={() => {
                              handleGalleryImageSelect(item.node.image.uri);
                              setIsSelectedImage(!isSelectedImage); // Update the state
                            }}
                            uncheckedColor="#dddddd"
                            color="#dddddd"
                            uncheckedIcon={<Icon name="square-o" size={20} />}
                            checkedIcon={<Icon name="check" size={10} />}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>

                  )
                }}
              />
            )
              :
              <FlatList
                data={photos}
                numColumns={3}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => handleGalleryImageSelect(item.node.image.uri)}
                    >
                      <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: Dimensions.get('window').width / 3 - 20,
                        height: 90,
                        //    margin: hp('0.4%')
                      }}>
                        <Image
                          source={{ uri: item.node.image.uri }}
                          style={{ width: '80%', height: '80%', borderRadius: hp('1.5%'), }}
                        />
                        <View style={{ position: 'absolute', top: 5, right: 6 }}>
                          <RadioButton
                            value={isSelectedImage}
                            status={isSelectedImage ? 'checked' : 'unchecked'}
                            onPress={() => {
                              handleGalleryImageSelect(item.node.image.uri);
                              setIsSelectedImage(!isSelectedImage); // Update the state
                            }}
                            uncheckedColor="#dddddd"
                            color="#dddddd"
                            uncheckedIcon={<Icon name="square-o" size={20} />}
                            checkedIcon={<Icon name="check" size={10} />}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>

                  )
                }}
              />
            }
          </ImageBackground>

        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = {
  modalOverlay2: {
    flex: 1,
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
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
  galleryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('33%'),
    height: 90,
    margin: 1,
  },
  galleryImage: {
    width: '80%',
    height: '80%',
    borderRadius: hp('1.5%'),
  },
  radioButtonContainer: {
    position: 'absolute',
    top: 5,
    right: 6,
  },
};

export default GalleryModal;
