import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  PanResponder,
  Animated,
  StyleSheet,
  Image,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {images} from '../../assets/images/image';
import {COLOR} from '../../utils/Config';

const DraggableText = props => {
  // Initialize pan state for each item
  const [pan, setPan] = useState(
    props.NewPosition.map(() => new Animated.ValueXY()),
  );

  useEffect(() => {
    // Initialize pan values based on NewPosition
    props.NewPosition.forEach((item, index) => {
      pan[index].setValue({x: item.x, y: item.y});
      pan[index].setOffset({x: 0, y: 0});
    });
  }, [props.NewPosition]);

  const createPanResponder = index =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan[index].setOffset({
          x: pan[index].x._value,
          y: pan[index].y._value,
        });
        pan[index].setValue({x: 0, y: 0}); // Reset pan values to zero
      },
      onPanResponderMove: Animated.event(
        [null, {dx: pan[index].x, dy: pan[index].y}],
        {
          useNativeDriver: false,
        },
      ),
      onPanResponderRelease: (event, gesture) => {
        pan[index].flattenOffset();

        const newX = pan[index].x._value;
        const newY = pan[index].y._value;

        props.onPositionChange(
          props.NewPosition[index].id,
          {
            x: newX,
            y: newY,
          },
          console.log('on function', newX, newY),
        );

        // Update initial position for the next drag
        pan[index].setValue({x: newX, y: newY});
        pan[index].setOffset({x: 0, y: 0});
      },
    });

  const panResponders = pan.map((_, index) => createPanResponder(index));

  return (
    <View>
      {props.NewPosition.map((item, index) => (
        <Animated.View
          key={item.id}
          style={{
            position: 'absolute',
            transform: [{translateX: pan[index].x}, {translateY: pan[index].y}],
          }}
          {...panResponders[index].panHandlers}>
          <Animated.View
            style={[
              {
                flexDirection: 'row',
                padding: 25,
              },
            ]}>
            <Text
              style={[
                // {fontSize: baseFontSize * Scale},
                {
                  color: 'black',
                  width: 'auto',
                  backgroundColor: 'white',
                  borderRadius: 8,
                  fontSize: 18,
                  // borderWidth: 2,
                  padding: 4,
                  verticalAlign: 'middle',
                },
              ]}>
              <Image
                source={images.LocationPin}
                style={[
                  {
                    width: 18,
                    height: 18,
                  },
                  {
                    resizeMode: 'contain',
                    tintColor: COLOR.GREEN,
                  },
                ]}
              />
              {item.text}
            </Text>
          </Animated.View>
        </Animated.View>
      ))}
    </View>
  );
};

export default DraggableText;

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
