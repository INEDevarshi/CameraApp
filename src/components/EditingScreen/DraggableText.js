import React, {useState, useEffect} from 'react';
import {View, Text, PanResponder, Animated} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

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
          <Text
            style={[props.getTextStyles(), {fontSize: hp(2.5), color: '#fff'}]}>
            {props.prifix}
            {item.text}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
};

export default DraggableText;
