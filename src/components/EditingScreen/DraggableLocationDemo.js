import React, {useRef, useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Text, Image} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';

import FastImage from 'react-native-fast-image';
import {images} from '../../assets/images/image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {COLOR} from '../../utils/Config';

const DraggableLocationDemo = ({items, onPositionChange, handleRemoveItem}) => {
  const position = useSharedValue({x: items[0]?.x, y: items[0]?.y});
  const scale = useSharedValue(items[0]?.scale);
  const savedScale = useSharedValue(1);

  const updatePosition = (id, x, y) => {
    onPositionChange(id, {x, y, scale: scale.value});
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate(e => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      position.value = {x: e.translationX, y: e.translationY};
    })
    .onEnd(event => {
      const {translationX, translationY} = event;
      runOnJS(updatePosition)(0, translationX, translationY);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    flex: 1,
    transform: [
      {translateX: position.value.x},
      {translateY: position.value.y},
      {scale: scale.value},
    ],
  }));

  const composed = Gesture.Simultaneous(
    panGesture,
    Gesture.Simultaneous(pinchGesture),
  );

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.stickerContainer, animatedStyle]}>
          {/* <Image
            source={images.LocationPin}
            style={{
              width: 30,
              height: 30,
              resizeMode: 'contain',
              tintColor: COLOR.GREEN,
            }}
          /> */}
          <Text style={{fontSize: hp(2), color: '#000', width: '90%'}}>
            {items[0]?.text}
          </Text>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};
export default DraggableLocationDemo;

const styles = StyleSheet.create({
  stickerContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    padding: hp(1.4),
    borderRadius: hp(1.5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  stickerImage: {
    width: 100,
    height: 100,
  },
  deleteBtn: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    width: 20,
    height: 20,
  },
});
