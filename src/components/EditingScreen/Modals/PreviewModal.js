import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {images} from '../../../assets/images/image';
import Video from 'react-native-video';

const PreviewModal = props => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const hnadleClose = () => {
    props.setIsPreview(false)
    props.setSnapShotImg('')
  }
  return (
    <Modal
      isVisible={props.isPreview}
      backdropOpacity={0}
      onBackButtonPress={() => hnadleClose()}
      onBackdropPress={() => hnadleClose()}>
      <View style={styles.container}>
        <ImageBackground
          source={images.BG}
          imageStyle={styles.BgImage}
          style={styles.bgView}>
          <Text style={styles.headdingText}>
            {props.editedVideo !== '' ? 'Preview Video' : 'Preview Image'}
          </Text>
          <View style={styles.VideoView}>
            {props.editedVideo !== '' ? (
              <Video
                source={{uri: props.editedVideo ? props.editedVideo : ''}}
                style={{
                  width: '90%',
                  height: hp(60),
                }}
                resizeMode="cover"
                repeat={false}
                paused={isVideoPlaying}
                onEnd={() => setIsVideoPlaying(true)}
              />
            ) : (
              <Image
                source={{uri: props.imageUrl}}
                style={{width: '90%', height: hp(60), resizeMode: 'contain'}}
              />
            )}
          </View>

          <View style={{alignItems: 'center'}}>
            {props.editedVideo !== '' && (
              <View>
                {isVideoPlaying ? (
                  <TouchableOpacity onPress={() => setIsVideoPlaying(false)}>
                    <Image
                      source={images.playButton}
                      style={styles.playButton}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => setIsVideoPlaying(true)}>
                    <Image source={images.pause} style={styles.playButton} />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </ImageBackground>
      </View>
    </Modal>
  );
};

export default PreviewModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  BgImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: hp(1.5),
    overflow: 'hidden',
  },
  bgView: {
    width: '100%',
    // height: hp(30),
    borderRadius: hp(1.5),
    overflow: 'hidden',
  },
  headdingText: {
    color: '#000',
    fontSize: hp(3),
    textAlign: 'center',
    marginVertical: hp(2),
  },
  VideoView: {
    justifyContent: 'center',
    marginVertical: hp(2),
    alignItems: 'center',
  },
  playButton: {
    width: wp(13),
    height: hp(8),
    resizeMode: 'contain',
  },
});
