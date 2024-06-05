import React, {useRef, useState, useEffect} from 'react';
import {
  FlatList,
  Image,
  View,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {FILTERS} from '../utils/Filters';
import {images} from '../assets/images/image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Config, {FONT, COLOR, FONT_SIZE} from '../utils/Config';
import {Filter, FilterChain, FilterImage} from 'react-native-image-filter-kit';
import {useNavigation} from '@react-navigation/native';
import Video from 'react-native-video';

const ImageFilter = ({props, route}) => {
  console.log('params in filter', route.params);
  const {selectedImage, selectedImage2, selectedVideo} = route.params;
  const navigation = useNavigation();

  const extractedUri = useRef(selectedImage);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onExtractImage = ({nativeEvent}) => {
    console.log('Extracted URI:', nativeEvent.uri);
    extractedUri.current = nativeEvent.uri;
  };

  const onSelectFilter = index => {
    setSelectedIndex(index);
  };

  const handleNext = () => {
    navigation.navigate('EditingScreen', {
      editedImage: extractedUri.current,
      filteredImage: extractedUri.current,
      filterIndex: selectedIndex,
      filterUrl: extractedUri.current,
      selectedImage: extractedUri.current,
      editedVideo: '',
    });
  };

  const renderFilterComponent = ({item, index}) => {
    const FilterComponent = item.filterComponent;
    const image = (
      <Image
        style={styles.filterSelector}
        source={{uri: selectedImage}}
        resizeMode={'contain'}
      />
    );
    return (
      <TouchableOpacity
        onPress={() => onSelectFilter(index)}
        style={{
          width: wp(25),
          margin: 5,
          marginTop: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <FilterComponent
          image={image}
          style={{resizeMode: 'contain', width: wp(25), height: hp('10%')}}
          onExtractImage={onExtractImage}
          extractImageEnabled={true}
        />
        <Text style={styles.filterName}>{item?.title}</Text>
      </TouchableOpacity>
    );
  };

  const SelectedFilterComponent = FILTERS[selectedIndex].filterComponent;

  return (
    <>
      <SafeAreaView />
      {selectedIndex === 0 ? (
        selectedImage ? (
          <Image
            style={styles.image}
            source={{uri: selectedImage}}
            resizeMode={'contain'}
          />
        ) : (
          <Text
            style={{
              alignSelf: 'center',
              width: '100%',
              height: '45%',
              justifyContent: 'center',
              textAlign: 'center',
              marginTop: 20,
            }}>
            No image found Please Select Image
          </Text>
        )
      ) : (
        <SelectedFilterComponent
          onExtractImage={onExtractImage}
          extractImageEnabled={true}
          image={
            selectedImage ? (
              <Image
                style={styles.image}
                source={{uri: selectedImage}}
                resizeMode={'contain'}
              />
            ) : (
              <Text>No image found</Text>
            )
          }
        />
      )}

      <>
        <ImageBackground
          style={{
            width: wp('99%'),
            alignItems: 'center',
            borderRadius: 10,
            justifyContent: 'center',
            resizeMode: 'contain',
            overflow: 'hidden', // Clip the content to the borderRadius
          }}
          source={images.BG}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: wp('99%'),
              borderBottomWidth: hp('0.3%'),
              padding: hp('1%'),
            }}>
            <Text style={styles.txt}>Filters</Text>
            <TouchableOpacity
              onPress={() => handleNext()}
              style={{
                backgroundColor: '#4CBB17',
                width: wp('20%'),
                height: hp('4%'),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: hp('1.5%'),
              }}>
              <Text
                style={{
                  color: '#000',
                  fontSize: hp('2%'),
                }}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={FILTERS}
            numColumns={3}
            columnWrapperStyle={{
              columnGap: hp('1%'),
            }}
            contentContainerStyle={styles.flatListContainer}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={renderFilterComponent}
            ListFooterComponent={() => <View style={{marginBottom: hp(60)}} />}
          />
        </ImageBackground>
      </>
    </>
  );
};
export default ImageFilter;
const styles = StyleSheet.create({
  image: {
    width: wp('90%'),
    height: 400,
    position: 'relative',
    marginVertical: 15,
    alignSelf: 'center',
  },
  filterSelector: {
    width: wp('25%'),
    height: hp('10%'),
    padding: hp('1%'),
  },
  filterTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  txt: {
    color: '#000000',
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.F_23,
  },
  filterName: {
    color: '#000',
    fontSize: hp(2.3),
    marginTop: hp(0.4),
    fontWeight: '500',
  },
});
