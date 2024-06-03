const {StyleSheet} = require('react-native');
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLOR } from './Config';

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: hp('0.3%'),
      },
      touchviews: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      },
    
      rightBorder: {
        flex: 1,
        borderRightWidth: hp('0.3%')
      },
      topBorder: {
        flex: 1,
        borderTopWidth: hp('0.3%')
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
        borderWidth: hp('0.3%')
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
      flexstart: {
        alignSelf: 'center',
        width: '100%',
        height: '100%',
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
        borderRightWidth: hp('0.3%')
      },
      imageview: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      ImagesView: {
        width: '100%',
        height: '100%',
        flex: 1,
        resizeMode: 'cover'
      },
      layout4ColView1: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      smallView: {
        alignSelf: 'center',
        width: wp('20%'), height: wp('20%'),
        margin: hp('1%'),
        borderRadius: 5,
        justifyContent: 'flex-start',
        borderWidth: hp('0.3%'),
      },
      largeView: {
        alignSelf: 'center',
        width: wp('100%'), height: wp('100%'),
        margin: hp('1%'),
        borderRadius: 5,
        justifyContent: 'flex-start',
        borderWidth: hp('0.3%'),
      },
      smallView2: {
        alignSelf: 'center',
        width: wp('20%'), height: wp('20%'),
        margin: hp('1%'),
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        borderWidth: hp('0.3%'),
      },
      largeView2: {
        alignSelf: 'center',
        width: wp('100%'), height: wp('100%'),
        margin: hp('1%'),
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        borderWidth: hp('0.3%'),
      },
      layout3View: {
        flex: 1,
        // flexDirection: 'row', 
        borderBottomWidth: hp('0.3%'),
        alignItems: 'center',
        justifyContent: 'center'
      },
      touchView: {
        flex: 1,
        borderRightWidth: hp('0.3%'),
        justifyContent: 'center',
        alignItems: 'center'
      },
      backGroundImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
      },
      imageThumbnail: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
      },
      button: {
        marginTop: 10,
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#DDDDDD',
      },
      nextbutn: {
        position: 'absolute',
        borderWidth: 1,
        width: '20%',
        borderRadius: 5,
        backgroundColor: COLOR.GREEN,
        alignItems: 'center',
        padding: 1,
        right: 20,
        top: 495
      },
});

export default styles;
