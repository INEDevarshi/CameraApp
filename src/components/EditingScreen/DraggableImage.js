import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  Pressable,
  Text,
  Image,
} from 'react-native';
import {PinchGestureHandler, State} from 'react-native-gesture-handler';

const DraggableImage = ({path = '', changeUpperImageLocation = () => {}}) => {
  console.log('path in drage', path[0]);
  const [baseFontSize, setBaseFontSize] = useState(200);
  const [scale, setScale] = useState(1);
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        changeUpperImageLocation({x: pan.x._value, y: pan.y._value});
      },
    }),
  ).current;

  const onPinchGestureEventHashTag = event => {
    setScale(event.nativeEvent.scale);
  };

  const onPinchHandlerStateChangeHashTag = event => {
    if (event.nativeEvent.state === State.END) {
      setBaseFontSize(baseFontSize * scale);
      setScale(1);
    }
  };

  return (
    <PinchGestureHandler
      onGestureEvent={onPinchGestureEventHashTag}
      onHandlerStateChange={onPinchHandlerStateChangeHashTag}>
      <Animated.View style={{flex: 1}}>
        <Animated.View
          style={[
            {
              // borderWidth: 1,
              position: 'absolute',
              transform: [{translateX: pan.x}, {translateY: pan.y}],
            },
          ]}
          {...panResponder.panHandlers}>
          <Image
            source={{uri: path[0]}}
            style={[
              {
                width: baseFontSize * scale,
                height: baseFontSize * scale,
                // borderRadius: scale + 10,
              },
            ]}
          />
        </Animated.View>
      </Animated.View>
    </PinchGestureHandler>
  );
};

export default DraggableImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', // To align squares horizontally
  },
  square: {
    height: 200,
    width: 150,
    borderRadius: 5,
    margin: 10,
  },
  pressable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
  },
});
