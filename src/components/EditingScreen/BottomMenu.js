import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {images} from '../../assets/images/image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const BottomMenu = props => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <TouchableOpacity>
        <Image
          source={images.Group37}
          style={{
            width: wp('12%'),
            height: hp('7%'),
            margin: hp('2%'),
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.setCropModal(true)}>
        <Image
          source={images.Group57}
          style={{
            width: wp('10%'),
            height: hp('7%'),
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.onPressSend()}>
        <Image
          source={images.Group23}
          style={{
            width: wp('12%'),
            height: hp('7%'),
            margin: hp('2%'),
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BottomMenu;

const styles = StyleSheet.create({});
