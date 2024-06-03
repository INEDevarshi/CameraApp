const {StyleSheet} = require('react-native');
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  iconImg: {
    width: wp(10),
    height: hp(7),
    tintColor: '#fff',
    resizeMode: 'contain',
  },
  headdingText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: hp(3.2),
    fontWeight: 'bold',
  },
  roundedView: {
    width: wp(30),
    height: wp(30),
    borderRadius: hp(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#fff',
    borderWidth: hp(0.5),
    backgroundColor: 'gray',
  },
  radioButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: hp(2),
    borderColor: '#fff',
    borderWidth: hp(0.4),
  },
  uploadBtn: {
    width: wp(30),
    height: wp(10),
    borderRadius: hp(1),
    borderColor: '#fff',
    borderWidth: hp(0.2),

    backgroundColor: 'gray',
  },
});

export default styles;
