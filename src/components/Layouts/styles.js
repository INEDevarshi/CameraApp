const {StyleSheet} = require('react-native');
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  ViewOfMainLayout: {
    borderWidth: hp('0.3%'),
    borderColor: '#ffffff',
    borderRadius: 10,
    width: '98%',
    height: '70%',
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: hp('15%'),
    overflow: 'hidden',
  },
  flexstart: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  mainView: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: hp('0.3%'),
    borderColor: '#ffffff',
  },
  touchviews: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rightBorder: {
    flex: 1,
    borderRightWidth: hp('0.3%'),
    borderColor: '#ffffff',
  },
  topBorder: {
    flex: 1,
    borderTopWidth: hp('0.3%'),
    borderColor: '#ffffff',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    // aspectRatio: 16 / 9, //  aspect ratio resolutions: 1920x1080, 3840x2160 (Full HD, 4K UHD).
    //  aspectRatio: 4 / 3, // Traditional aspect ratio used by older digital cameras and some smartphone
    // aspectRatio: 1 / 1, // Used for square photos, popularized by platforms like Instagram.
  },

  layout8: {
    alignSelf: 'center',
    height: wp('20%'),
    flexDirection: 'column',
    margin: hp('1%'),
    width: wp('20%'),
    justifyContent: 'flex-start',
  },
  layout10: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    margin: hp('1%'),
    justifyContent: 'flex-start',
  },
  layout9: {
    alignSelf: 'center',
    width: wp('20%'),
    flexDirection: 'row',
    margin: hp('1%'),
    height: wp('20%'),
    justifyContent: 'flex-start',
    borderWidth: hp('0.3%'),
  },
  layoutRowcenter: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    margin: hp('1%'),
    justifyContent: 'center',
    flexDirection: 'row',
  },
  flexcolumn: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  flexcolumn2: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    margin: hp('1%'),
    justifyContent: 'flex-start',
  },

  flexcenter: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    margin: hp('1%'),
    justifyContent: 'center',
  },
  flexRow: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  layout4ColView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: hp('0.3%'),
    borderColor: '#ffffff',
    overflow: 'hidden',
    // borderRightWidth: hp('0.3%')
  },
  imageview: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ImagesView: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    // borderRadius: 10,
  },
  layout4ColView1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: hp('0.3%'),
    borderColor: '#ffffff',
  },
  layout4_2Col: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: hp('0.3%'),
    borderColor: '#ffffff',
  },
});

export default styles;
