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
import {friendsData, locations} from '../../../utils/DemoData';
import {COLOR} from '../../../utils/Config';
import TextOverlayModal from './TextOverlayModal';

const FriendsModal = props => {
  const [searchText, setSearchText] = useState('');
  const [filterFriends, setFilterFriends] = useState(friendsData);

  useEffect(() => {
    searchHashtags();
  }, [searchText]);

  const toggleHashtagSelection = item => {
    const newItem = {
      id: item?.id,
      x: 113.34259033203125,
      y: 284.3129425048828,
      scale: 1,
      text: item?.name,
    };

    const isSelected = props.selectedFriends.some(
      hashtag => hashtag.text === newItem.text,
    );

    if (isSelected) {
      props.setSelectedFriends(prevSelected =>
        prevSelected.filter(selectedId => selectedId?.text !== newItem?.text),
      );
    } else {
      props.setSelectedFriends(prevSelected => [...prevSelected, newItem]);
    }
  };

  const searchHashtags = () => {
    if (searchText !== '') {
      const filtered = friendsData.filter(friends =>
        friends.name.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilterFriends(filtered);
    } else {
      setFilterFriends(friendsData);
    }
  };
  const handlePositionChange = (itemId, newPosition) => {
    console.log('newPosition', newPosition);
    props.setSelectedFriends(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? {
              ...item,
              x: newPosition.x,
              y: newPosition.y,
              // scale: newPosition.scale,
            }
          : item,
      ),
    );
  };

  return (
    <>
      <Modal
        isVisible={props.FriendsModalVisiable}
        style={{margin: 0}}
        animationIn={'slideInUp'}
        swipeDirection={'down'}
        onBackButtonPress={() => props.setFriendsModalVisiable(false)}
        onBackdropPress={() => props.setFriendsModalVisiable(false)}
        onSwipeComplete={() => props.setFriendsModalVisiable(false)}>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <ImageBackground
            source={images.BG}
            imageStyle={styles.backGroundImage}
            style={styles.mainView}>
            <View style={{padding: hp('1.5%')}}>
              {/* Done Button for close the model */}
              {props.selectedFriends?.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    props.setFriendsModalVisiable(false),
                      props.setDragFriend(true);
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
              <Text style={styles.headding}>Plug-In Friends</Text>
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
                  placeholder="Search Friends....."
                  placeholderTextColor={'#000'}
                  style={styles.input}
                  value={searchText}
                  onChangeText={val => {
                    setSearchText(val);
                  }}
                />
              </View>
              {/* Content View */}
              <ScrollView
                style={{
                  flexGrow: 1,
                  marginTop: hp('3%'),
                  maxHeight: hp('40%'),
                }}>
                <FlatList
                  data={filterFriends}
                  renderItem={({item}) => {
                    // const isSelected = props.selectedFriends.includes(item);
                    const isSelected = props.selectedFriends.some(
                      hashtag => hashtag.text === item.name,
                    );

                    return (
                      <TouchableOpacity
                        style={{
                          borderRadius: hp('1.5%'),
                          padding: hp('1%'),
                          marginBottom: hp('1%'),
                          borderBottomColor: '#000',
                          borderBottomWidth: wp('0.2%'),
                        }}>
                        <View
                          style={[
                            styles.rowView,
                            {justifyContent: 'space-between'},
                          ]}>
                          <View style={styles.rowView}>
                            <Image
                              source={images.Account}
                              style={styles.icon}
                            />
                            <Text style={{fontSize: hp('2.5%'), color: '#000'}}>
                              {item.name}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => toggleHashtagSelection(item)}
                            style={[
                              styles.btnView,
                              {
                                backgroundColor: isSelected
                                  ? COLOR.GREEN
                                  : 'transparent',
                              },
                            ]}>
                            <Text
                              style={[
                                styles.btnText,
                                {color: isSelected ? '#fff' : '#000'},
                              ]}>
                              Add
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              </ScrollView>
            </View>
          </ImageBackground>
        </View>
      </Modal>
      <TextOverlayModal
        type={'friends'}
        NewPosition={props.selectedFriends}
        NewSetPosition={props.setSelectedFriends}
        currentIndex={0}
        onPositionChange={handlePositionChange}
        isDragg={props.dragFriend}
        setIsDragg={props.setDragFriend}
        handleClose={() => props.setDragFriend(false)}
      />
    </>
  );
};

export default FriendsModal;

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
    width: wp('20%'),
    height: hp('6%'),
    justifyContent: 'center',
    borderColor: '#000',
    borderWidth: wp('0.2%'),
    alignItems: 'center',
    borderRadius: hp('1.5%'),
  },
  btnText: {
    color: '#000',
    fontSize: hp('2.5%'),
  },
});
