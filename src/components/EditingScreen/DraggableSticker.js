// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   PanResponder,
//   Animated,
//   Button,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';

// import FastImage from 'react-native-fast-image';
// import {images} from '../../assets/images/image';

// const DraggableSticker = ({items, onPositionChange, handleRemoveItem}) => {
//   console.log('DraggableSticker', items);
//   const [pan] = useState(items.map(() => new Animated.ValueXY()));

//   const panResponder = items.map((item, index) =>
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onPanResponderMove: (event, gesture) => {
//         Animated.event([null, {dx: pan[index].x, dy: pan[index].y}], {
//           useNativeDriver: false,
//         })(event, gesture);
//       },
//       onPanResponderRelease: (event, gesture) => {
//         pan[index].flattenOffset();
// onPositionChange(item.id, {
//   x: item.x + gesture.dx,
//   y: item.y + gesture.dy,
// });
//         // Check if gesture was released outside the view
//         // if (gesture.moveX < 0 || gesture.moveY < 0) {
//         //   // Call the add item function provided by the parent component
//         //   onAddItem({x: item.x + gesture.dx, y: item.y + gesture.dy});
//         // }
//       },
//     }),
//   );

//   return (
//     <View>
//       {items.map((item, index) => (
//         <Animated.View
//           key={item.id}
//           style={{
//             width: wp(30),
//             height: hp(16),
//             borderColor: '#fff',
//             borderWidth: hp(0.2),
//             position: 'absolute',
//             left: item.x,
//             top: item.y,
//             transform: [{translateX: pan[index].x}, {translateY: pan[index].y}],
//           }}
//           {...panResponder[index].panHandlers}>
//           <FastImage
//             style={{width: wp(25), height: hp(15), margin: hp(1)}}
//             source={{
//               uri: item.imageUrl,
//               priority: FastImage.priority.normal,
//             }}
//             resizeMode={FastImage.resizeMode.contain}
//           />
//           <TouchableOpacity
//             onPress={() => handleRemoveItem(item.id)}
//             style={styles.deleteBtn}>
//             <FastImage
//               style={{width: wp(5), height: wp(5)}}
//               source={images.bin}
//               resizeMode={FastImage.resizeMode.contain}
//             />
//           </TouchableOpacity>
//         </Animated.View>
//       ))}
//     </View>
//   );
// };

// export default DraggableSticker;

// const styles = StyleSheet.create({
//   deleteBtn: {
//     position: 'absolute',
//     top: hp(-2),
//     right: hp(-1),
//     backgroundColor: '#fff',
//     width: wp(8.5),
//     height: wp(8.5),
//     borderRadius: hp(10),
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
import React, {useRef, useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
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

const DraggableSticker = ({items, onPositionChange, handleRemoveItem}) => {
  let position = useRef({});
  let positions = position.current ?? {};
  const scales = {};
  items?.map(item => {
    positions[item.id] = useSharedValue({x: item.x ?? 0, y: item.y ?? 0});
    scales[item.id] = useSharedValue(item.scale ?? 0);
  });

  const updatePosition = (id, x, y, index) => {
    onPositionChange(id, {x, y, scale: scales[id].value});
    positions[id].value = {
      x: x,
      y: y,
    };
  };

  const panGestures = items.map((item, index) =>
    Gesture.Pan()
      .averageTouches(true)
      .onStart(event => {
        event.translationX = positions[item.id].value.x;
        event.translationY = positions[item.id].value.y;
      })
      .onUpdate(event => {
        positions[item.id].value = {
          x: event.translationX,
          y: event.translationY,
        };
      })
      .onEnd(event => {
        const {translationX, translationY} = event;
        runOnJS(updatePosition)(item.id, translationX, translationY, index);
        positions[item.id].value = {
          x: event.translationX,
          y: event.translationY,
        };
      }),
  );

  const pinchGestures = items.map((item, index) =>
    Gesture.Pinch().onUpdate(event => {
      scales[item.id].value = event.scale;
    }),
  );

  const animatedStyles = items.map((item, index) =>
    useAnimatedStyle(() => ({
      transform: [
        {translateX: positions[item.id].value.x},
        {translateY: positions[item.id].value.y},
        {scale: scales[item.id].value},
      ],
    })),
  );

  const composedGestures = items.map((item, index) =>
    Gesture.Simultaneous(panGestures[index], pinchGestures[index]),
  );

  // Remove the Stickers
  const onPressRemove = id => {
    // Call handleRemoveItem to remove the item from items array
    // const updatedObject = { ...position.current };
    // delete updatedObject[id];
    // position.current = updatedObject;

    handleRemoveItem(id);
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      {items.map((item, index) => (
        <GestureDetector key={index} gesture={composedGestures[index]}>
          <Animated.View
            style={[styles.stickerContainer, animatedStyles[index]]}>
            {/* Sticker Content */}
            <FastImage
              style={styles.stickerImage}
              source={{
                uri: item.imageUrl,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <TouchableOpacity
              onPress={() => onPressRemove(item.id)}
              style={styles.deleteBtn}>
              <FastImage
                style={styles.deleteIcon}
                source={images.bin}
                resizeMode={FastImage.resizeMode.contain}
              />
            </TouchableOpacity>
          </Animated.View>
        </GestureDetector>
      ))}
    </GestureHandlerRootView>
  );
};
export default DraggableSticker;

const styles = StyleSheet.create({
  stickerContainer: {
    position: 'absolute',
    borderColor: '#fff',
    borderWidth: 2,
    height: 120,
    width: 120,
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
