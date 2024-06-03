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
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {images} from '../../../assets/images/image';
import {locations} from '../../../utils/DemoData';
import MapplsGL from 'mappls-map-react-native';
import {COLOR} from '../../../utils/Config';
import TextOverlayModal from './TextOverlayModal';
import DraggableLocation from '../DraggableLocation';

const LocationModal = props => {
  MapplsGL.setMapSDKKey('619e2f284f7f6cb4d3fb4d234cc8363a');
  MapplsGL.setRestAPIKey('619e2f284f7f6cb4d3fb4d234cc8363a'); //your restApiKey
  MapplsGL.setAtlasClientId(
    '96dHZVzsAuuSo8KYPoo9sDGXG52w2A1cHUiW7J-Bt_Qp1opkT9GU47OZqz2-0EdeAUuonKZJqlH5NDRnDloYIg==',
  ); //your atlasClientId key
  MapplsGL.setAtlasClientSecret(
    'lrFxI-iSEg9T46TDXexuvQf3eLMwgcE_6H7sme31WqZXOyN7xEmlmPS7OZ_qfLc--nEP7fLlRNmQd4pNRkpTfYjLW5_KPtiD',
  ); //your atlasClientSecret key
  const [searchQuery, setSearchQuery] = useState('india');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);
  // useEffect(() => {
  //   searchHashtags();
  // }, [searchText]);

  const toggleHashtagSelection = address => {
    const isSelected =
      props.selectedLocation &&
      props.selectedLocation?.mapplsPin === address.mapplsPin;
    props.setSelectedLocation(null);

    if (isSelected) {
      setSearchQuery('');
      props.setSelectedLocation(null);
      props.setLocationPosition([]);
    } else {
      setSearchQuery(address?.placeAddress);
      props.setLocationModalVisiable(false);
      addLocation(address?.placeName);
      // props.setSelectedLocation(address);
    }
  };

  const handleSearchChange = text => {
    setSearchQuery(text);
    setSuggestions([]);
    setError(null);

    if (text !== '') {
      fetchSuggestions(text);
    }
  };

  const fetchSuggestions = async text => {
    console.log('text', text);
    await MapplsGL.RestApi.autoSuggest({
      query: text,
    })
      .then(response => {
        console.log('response', response);
        setSuggestions(response?.suggestedLocations);
        //Handle Response
      })
      .catch(error => {
        console.log('error in autosuggest', error);
      });
  };

  const addLocation = location => {
    if (props.locationPosition?.length > 0) {
      setTimeout(() => {
        props.setDraggLocation(true);
      }, 500);
    } else {
      if (props.multipleImages?.length > 0) {
        for (let i = 0; i < props.multipleImages.length; i++) {
          const element = props.multipleImages[i];
          const newItem = {
            id: i,
            x: 113.34259033203125,
            y: 284.3129425048828,
            scale: 0,
            text: location,
          };
          props.setLocationPosition(prevItems => [...prevItems, newItem]);
        }
        props.setDraggLocation(true);
      } else {
        const newItem = {
          id: 0,
          x: 113.34259033203125,
          y: 284.3129425048828,
          scale: 0,
          text: location,
        };
        props.setLocationPosition(prevItems => [...prevItems, newItem]);
        props.setDraggLocation(true);
      }
    }
  };

  const handlePositionChange = (itemId, newPosition) => {
    console.log('newPosition', newPosition);
    props.setLocationPosition(prevItems =>
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

  const handleClose = () => {
    props.setLocationModalVisiable(false);
    props.setDraggLocation(false);
  };
  return (
    <>
      <Modal
        isVisible={props.locationModalVisiable}
        style={{margin: 0, flex: 1}}
        // animationIn={'slideInUp'}
        // swipeDirection={'down'}
        onBackButtonPress={() => props.setLocationModalVisiable(false)}
        onBackdropPress={() => props.setLocationModalVisiable(false)}
        onSwipeComplete={() => props.setLocationModalVisiable(false)}>
        <View
          // style={
          //   props.draggLocation
          //     ? {flex: 1, position: 'relative'}
          //     : {flex: 1, justifyContent: 'flex-end'}
          // }
          style={{flex: 1, justifyContent: 'flex-end'}}>
          {/* {props.draggLocation ? (
            <View style={{flex: 1}}>
              <DraggableLocation
                items={props.locationPosition}
                onPositionChange={handlePositionChange}
                handleRemoveItem={props.handleRemoveItem}
              />
            </View>
          ) : ( */}
          <ImageBackground
            source={images.BG}
            imageStyle={styles.backGroundImage}
            style={styles.mainView}>
            <View style={{padding: hp('1.5%'), maxHeight: hp(60)}}>
              {/* Done Button */}
              {props.locationPosition?.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    props.setLocationModalVisiable(false);
                    // props.setDraggLocation(true);
                  }}
                  style={{
                    backgroundColor: COLOR.GREEN,
                    width: wp(15),
                    height: hp(5),
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: hp(1.5),
                    alignSelf: 'flex-end',
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: hp(2),
                    }}>
                    Done
                  </Text>
                </TouchableOpacity>
              )}
              {/* Headding */}
              <Text style={styles.headding}>Select a Location</Text>
              {/* Search Input */}
              <View style={styles.searchView}>
                <Image
                  source={images.searchIcon}
                  style={{
                    width: wp('6%'),
                    height: wp('6%'),
                    resizeMode: 'contain',
                    tintColor: '#000',
                  }}
                />
                <TextInput
                  placeholder="Search Location....."
                  placeholderTextColor={'#000'}
                  style={styles.input}
                  value={searchQuery}
                  onChangeText={val => {
                    handleSearchChange(val);
                  }}
                />
              </View>
              {/* Buttons View */}
              <View style={[styles.btnWrapper, styles.rowView]}>
                <TouchableOpacity style={[styles.rowView, styles.btnView]}>
                  <Image source={images.HomeIcon} style={styles.icon} />
                  <Text style={styles.btnText}>Home</Text>
                </TouchableOpacity>
                <View
                  style={{
                    height: hp('7%'),
                    borderRightColor: '#000',
                    borderRightWidth: 2,
                  }}
                />
                <TouchableOpacity style={[styles.rowView, styles.btnView]}>
                  <Image source={images.HomeIcon} style={styles.icon} />
                  <Text style={styles.btnText}>Wrok</Text>
                </TouchableOpacity>
              </View>
              {/* Content View */}
              <ScrollView
                style={{
                  flexGrow: 1,
                  marginTop: hp('3%'),
                  maxHeight: hp('40%'),
                }}>
                <FlatList
                  data={suggestions}
                  renderItem={({item}) => {
                    const isSelected =
                      props.selectedLocation &&
                      props.selectedLocation.placeAddress === item.placeAddress;

                    return (
                      <TouchableOpacity
                        onPress={() => toggleHashtagSelection(item)}
                        style={{
                          borderRadius: hp('1.5%'),
                          padding: hp('1%'),
                          marginBottom: hp('1%'),
                          borderBottomColor: '#000',
                          borderBottomWidth: wp('0.2%'),
                          backgroundColor: isSelected
                            ? COLOR.GREEN
                            : 'transparent',
                          width: '100%',
                        }}>
                        <View
                          style={[
                            styles.rowView,
                            {justifyContent: 'space-between'},
                          ]}>
                          <View style={styles.rowView}>
                            <Image
                              source={images.LocationPin}
                              style={styles.icon}
                            />
                            <View style={{width: '80%'}}>
                              <Text
                                style={{
                                  fontSize: hp('2.5%'),
                                  color: isSelected ? '#fff' : '#000',
                                }}>
                                {item.placeAddress}
                              </Text>
                              <Text
                                style={{
                                  fontSize: hp('2%'),
                                  color: isSelected ? '#fff' : '#000',
                                }}>
                                {item.placeName}
                              </Text>
                            </View>
                          </View>
                          <View>
                            <Image
                              source={images.FlagIcon}
                              style={styles.icon}
                            />
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              </ScrollView>
            </View>
          </ImageBackground>
          {/* )} */}
        </View>
      </Modal>
      <TextOverlayModal
        type={'location'}
        text={props.locationPosition[0]?.text}
        NewPosition={props.locationPosition}
        NewSetPosition={props.setLocationPosition}
        currentIndex={0}
        onPositionChange={handlePositionChange}
        isDragg={props.draggLocation}
        setIsDragg={props.setDraggLocation}
        handleClose={() => props.setDraggLocation(false)}
      />
    </>
  );
};

export default LocationModal;

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#fff',
    width: '100%',
    // height: '30%',
    overflow: 'hidden',
    borderTopRightRadius: hp('2%'),
    borderTopLeftRadius: hp('2%'),
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backGroundImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  headding: {
    color: '#000',
    fontSize: hp('3.3%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: hp('2%'),
  },
  searchView: {
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: hp('1%'),
    borderRadius: hp('1.5%'),
    borderColor: '#000',
    borderWidth: hp('0.1%'),
  },
  input: {
    color: '#000',
    fontSize: hp('2.3%'),
    width: '90%',
  },
  icon: {
    width: wp('10%'),
    height: wp('10%'),
    resizeMode: 'contain',
    tintColor: '#000',
  },
  btnWrapper: {
    width: '100%',
    borderColor: '#000',
    borderWidth: wp('0.2%'),
    marginTop: hp('1.5%'),
    padding: hp('0.5%'),
    borderRadius: hp('1.5%'),
    justifyContent: 'space-around',
  },
  btnView: {
    width: wp('30%'),
    height: hp('7%'),
    justifyContent: 'center',
  },
  btnText: {
    color: '#000',
    fontSize: hp('2.5%'),
    marginLeft: hp('1%'),
  },
});
