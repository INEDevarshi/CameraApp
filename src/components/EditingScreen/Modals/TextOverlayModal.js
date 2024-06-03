import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DraggableText from '../DraggableText';
import DraggableLocation from '../DraggableLocation';
import {COLOR} from '../../../utils/Config';
import DraggableLocationDemo from '../DraggableLocationDemo';
import FastImage from 'react-native-fast-image';
import {images} from '../../../assets/images/image';

const TextOverlayModal = props => {
  const handleClode = () => {
    props.handleClose();
  };
  return (
    <Modal
      isVisible={props.isDragg}
      // backdropOpacity={0}
      onBackButtonPress={() => handleClode()}
      // onBackdropPress={() => handleClode()}
      style={{margin: 0}}>
      <Text style={{color: 'white', position: 'absolute', top: 50, left: 10}}>
        Drag text to chnage position
      </Text>
      <View style={styles.container}>
        {props.type === 'location' ? (
          <DraggableLocation
            text={props.text}
            NewPosition={props.NewPosition}
            NewSetPosition={props.NewSetPosition}
            currentIndex={0}
            onPositionChange={props.onPositionChange}
          />
        ) : props.type === 'hashtag' ? (
          (console.log('whiting hash'),
          (
            <DraggableText
              prifix={'#'}
              NewPosition={props.NewPosition}
              NewSetPosition={props.NewSetPosition}
              getTextStyles={() => {}}
              currentIndex={props.currentIndex}
              onPositionChange={props.onPositionChange}
            />
          ))
        ) : props.type === 'friends' ? (
          (console.log('whiting friends'),
          (
            <DraggableText
              prifix={'@'}
              NewPosition={props.NewPosition}
              NewSetPosition={props.NewSetPosition}
              getTextStyles={() => {}}
              currentIndex={props.currentIndex}
              onPositionChange={props.onPositionChange}
            />
          ))
        ) : (
          <DraggableText
            text={props.position[props.currentIndex]?.text}
            NewPosition={props.position}
            NewSetPosition={props.setPosition}
            getTextStyles={props.getTextStyles}
            currentIndex={props.currentIndex}
            onPositionChange={props.handlePositionChange}
          />
        )}
        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => props.handleClose()}>
          <Text style={styles.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </View>
      {props.type == 'text' ? (
        <TouchableOpacity
          // onPress={() => onPressRemove(item.id)}
          style={styles.deleteBtn}>
          <Image
            style={styles.deleteIcon}
            source={images.bin}
            resizeMode={FastImage.resizeMode.contain}
            tintColor={'white'}
          />
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </Modal>
  );
};

export default TextOverlayModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  deleteIcon: {
    height: 30,
    width: 30,
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
});
