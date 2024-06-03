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
import {images} from './src/assets/images/image';
import {COLOR} from './src/utils/Config';

const DragText = ({
  isDraggable = true,
  color = 'red',
  customStyle = () => {},
  title = '',
  type = '',
}) => {
  const [baseFontSize, setBaseFontSize] = useState(20);
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
          {type == 'location' ? (
            <Animated.View
              style={[
                {
                  flexDirection: 'row',
                  padding: 25,
                },
              ]}>
              <Text
                style={[
                  {fontSize: baseFontSize * scale},
                  {
                    color: 'black',
                    width: 'auto',
                    backgroundColor: 'white',
                    padding: 4,
                    borderRadius: 8,
                  },
                ]}>
                <Image
                  source={images.LocationPin}
                  style={[
                    {
                      width: baseFontSize * scale,
                      height: baseFontSize * scale,
                    },
                    {
                      resizeMode: 'contain',
                      tintColor: COLOR.GREEN,
                    },
                  ]}
                />
                {title}
              </Text>
            </Animated.View>
          ) : (
            <Text
              style={[
                customStyle,
                {
                  color: 'white',
                },
                {fontSize: baseFontSize * scale},
              ]}>
              {type == 'hash' ? '#' : type == 'friend' ? '@' : ''}
              {title}
            </Text>
          )}
        </Animated.View>
      </Animated.View>
    </PinchGestureHandler>
  );
};

export default DragText;
