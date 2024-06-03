import {
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

const LocationOverlayModal = props => {
  console.log('location overlay');
  const handleClode = () => {
    props.setIsDragg(false);
  };
  return (
    <Modal
      isVisible={props.isDragg}
      // backdropOpacity={0}
      onBackButtonPress={() => handleClode()}
      onBackdropPress={() => handleClode()}
      style={{margin: 0}}>
      <View style={styles.container}>
        {/* // <DraggableLocation
          //   text={props.text}
          //   NewPosition={props.NewPosition}
          //   NewSetPosition={props.NewSetPosition}
          //   currentIndex={0}
          //   onPositionChange={props.onPositionChange}
          // /> */}
        <View style={{flex: 1,}}>
          <DraggableLocation
            items={props.NewPosition}
            onPositionChange={props.onPositionChange}
            handleRemoveItem={props.handleRemoveItem}
          />
        </View>
        <TouchableOpacity style={styles.doneBtn} onPress={() => handleClode()}>
          <Text style={styles.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default LocationOverlayModal;

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
});
