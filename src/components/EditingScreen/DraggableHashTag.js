import React, {useState} from 'react';
import {View, Text, PanResponder, Animated} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const DraggbleHashTag = props => {
  const [pan] = useState(props.NewPosition.map(() => new Animated.ValueXY()));

  const panResponder = props.NewPosition.map((item, index) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        Animated.event([null, {dx: pan[index].x, dy: pan[index].y}], {
          useNativeDriver: false,
        })(event, gesture);
      },
      onPanResponderRelease: (event, gesture) => {
        pan[index].flattenOffset();
        props.onPositionChange(item.id, {
          x: item.x + gesture.dx,
          y: item.y + gesture.dy,
        });
        // Check if gesture was released outside the view
        // if (gesture.moveX < 0 || gesture.moveY < 0) {
        //   // Call the add item function provided by the parent component
        //   onAddItem({x: item.x + gesture.dx, y: item.y + gesture.dy});
        // }
      },
    }),
  );

  return (
    <View>
      {props.NewPosition.map((item, index) => (
        <Animated.View
          key={item.id}
          style={{
            position: 'absolute',
            left: item.x,
            top: item.y,
            transform: [{translateX: pan[index].x}, {translateY: pan[index].y}],
          }}
          {...panResponder[index].panHandlers}>
          <Text
            style={[props.getTextStyles(), {fontSize: hp(2.5), color: '#fff'}]}>
            {item.text}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
};

export default DraggbleHashTag;
