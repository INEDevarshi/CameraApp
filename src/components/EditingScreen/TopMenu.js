import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {images} from '../../assets/images/image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';

const TopMenu = props => {
  const [isSaveVisible, setIsSaveVisible] = useState(false);
  return (
    <View style={styles.topIconContainer}>
      <TouchableOpacity onPress={() => props.onPressBack()}>
        <Image source={images.Back} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.setMusicModalVisiable(true)}>
        <Image source={images.Musical} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsSaveVisible(!isSaveVisible)}>
        <Image source={images.Downloading} style={styles.icon} />
      </TouchableOpacity>

      <Modal
        isVisible={isSaveVisible}
        onBackButtonPress={() => setIsSaveVisible(false)}
        onBackdropPress={() => setIsSaveVisible(false)}
        backdropOpacity={0}
        style={{margin: 0}}
        animationIn={'slideInDown'}
        animationOut={'slideOutUp'}>
        <View style={styles.downloadModalView}>
          <ImageBackground source={images.BG} style={styles.downloadModalImage}>
            <TouchableOpacity
              onPress={() => {
                setIsSaveVisible(false);
                props.onPressSave();
              }}
              style={{borderBottomColor: '#000', borderBottomWidth: hp(0.2)}}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsSaveVisible(false);
                props.saveDraft();
              }}>
              <Text style={styles.saveText}>Draft</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </Modal>
    </View>
  );
};

export default TopMenu;

const styles = StyleSheet.create({
  topIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  downloadModalView: {
    flex: 1,
    alignItems: 'flex-end',
    top: hp(5),
    paddingRight: hp(1),
  },
  downloadModalImage: {
    width: wp('33%'),
    borderRadius: hp(1.5),
    overflow: 'hidden',
  },
  saveText: {
    color: '#000',
    fontSize: hp(2.5),
    padding: hp(0.5),
    marginLeft: hp(1),
  },
});
