import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import DraggableSticker from '../DraggableSticker';
import {COLOR, FONT} from '../../../utils/Config';

const StickersModal = props => {
  const [allStickers, setAllStickers] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    fetchStickers();

    return () => {};
  }, []);

  const fetchStickers = async () => {
    await axios
      .get('https://socialmedia.digiatto.info/public/api/sticker')
      .then(response => {
        setAllStickers(response.data.data);
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  const handleClose = () => {
    setIsVisible(false);
    props.setStickerVisible(false);
  };

  const handleSelectStickers = data => {
    setIsVisible(true);
    handleAddItem(data.stickerURI, data.name);
  };
  // for sticker
  const handleAddItem = (url,id) => {
    const newItem = {
      id: Math.random().toString(16).slice(2), 
      x: 113.34259033203125,
      y: 284.3129425048828,
      scale: 1,
      imageUrl: url ? url : '',
    };
    props.setStickersPosition(prevItems => [...prevItems, newItem]);
  };

  const handlePositionChange = (itemId, newPosition) => {
    props.setStickersPosition(prevItems =>
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

  const handleRemoveItem = itemId => {
    
    props.setStickersPosition(prevItems =>
      prevItems.filter(item => item.id !== itemId),
    );
    setIsVisible(false)
  };

  return (
    <Modal
      isVisible={props.stickerVisible}
      onBackButtonPress={() => handleClose()}
      onBackdropPress={() => handleClose()}
      style={{
        margin: 0,
      }}
      >
      <View style={styles.container}>
        {!isVisible ? (
          <FlatList
            data={allStickers}
            numColumns={3}
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
              flexGrow: 1,
            }}
            renderItem={({item}) => {
              return (
                <TouchableOpacity onPress={() => handleSelectStickers(item)}>
                  <FastImage
                    style={{width: wp(25), height: hp(15), margin: hp(1)}}
                    source={{
                      uri: item.stickerURI,
                      priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={() => (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: hp(3),
                  }}>
                  Stickers Not Found
                </Text>
                <TouchableOpacity
                  style={styles.retryBtn}
                  onPress={() => fetchStickers()}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: hp(2.5),
                    }}>
                    Retry
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <View style={{flex: 1}}>
          <DraggableSticker
            items={props.stickersPosition ?? []}
            onPositionChange={handlePositionChange}
            handleRemoveItem={handleRemoveItem}
          />
          </View>
        )}

        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => {
            if (isVisible) {
              setIsVisible(false);
              props.setStickerVisible(false);
            } else {
              setIsVisible(true);
            }
          }}>
          <Text style={styles.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default StickersModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  doneBtn: {
    width: wp(20),
    height: hp(6),
    backgroundColor: COLOR.GREEN,
    borderRadius: hp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    margin: hp(1),
  },
  doneBtnText: {
    color: '#fff',
    fontSize: hp(2.5),
  },
  retryBtn: {
    backgroundColor: COLOR.GREEN,
    width: wp(30),
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: hp(1.5),
    marginTop: hp(2),
  },
});
