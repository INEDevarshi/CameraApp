import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {images} from '../../../assets/images/image';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVModeIOSOption,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
} from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import {SoundContext} from '../../../context/SoundContext';
const audioRecorderPlayer = new AudioRecorderPlayer();

const RecordingModal = props => {
  const {
    sound,
    setSound,
    isPlaying,
    setIsPlaying,
    stopSound,
    recordSound,
    setRecordSound,
    setAudioFile
  } = useContext(SoundContext);
  const [selected, setSelected] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  // const [isPlay, setIsPlay] = useState(false);
  const [timmer, setTimmer] = useState(0);
  const [audioUrl, setAudioUrl] = useState('');
  const [allRecording, setAllRecording] = useState([]);

  useEffect(() => {
    fetchAudioFiles();
  }, []);

  const startRecording = async () => {
    const timestamp = new Date().getTime();
    const defaultFileName = `Socialrecording${timestamp}`;
    const outputFileName = defaultFileName;

    let path = `${RNFS.DownloadDirectoryPath}/${outputFileName}.aac`;
    // Set up the audio settings for our recording adventure
    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVModeIOS: AVModeIOSOption.measurement,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    const meteringEnabled = false;

    try {
      // Start the recording and get the audio URI
      const uri = await audioRecorderPlayer.startRecorder(
        path,
        audioSet,
        meteringEnabled,
      );
      setIsRecording(true);
      audioRecorderPlayer.addRecordBackListener(e => {
        setTimmer(e.currentPosition);
        return;
      });
      // setAudio
      console.log('uri', uri);
    } catch (error) {
      setIsRecording(false);
      console.log('Uh-oh! Failed to start recording:', error);
    }
  };
  const stopRecording = async () => {
    try {
      // Stop the recording and see what we've got
      setIsRecording(false);
      const result = await audioRecorderPlayer.stopRecorder();
      setAudioUrl(result);
      console.log('result', result);
      audioRecorderPlayer.removeRecordBackListener();
      setTimmer(0);
    } catch (error) {
      setIsRecording(false);
      console.log('Oops! Failed to stop recording:', error);
    }
  };

  const onStartPlay = async (file, e) => {
    console.log('file', file);
    console.log('audioUrl', audioUrl);
    try {
      setIsPlaying(true);
      console.log('onStartPlay');
      const path = file ? file : audioUrl;
      const msg = await audioRecorderPlayer.startPlayer(path);
      audioRecorderPlayer.addPlayBackListener(e => {
        setTimmer(e.currentPosition);
        return;
      });
      console.log(msg);
    } catch (error) {
      setIsPlaying(false);
      console.log('error play', error);
    }
  };

  const onStopPlay = async () => {
    if (isPlaying) {
      try {
        await audioRecorderPlayer
          .stopPlayer()
          .then(res => {
            console.log(res);
            setIsPlaying(false);
          })
          .catch(eror => {
            console.error(eror);
          });
        audioRecorderPlayer.removePlayBackListener();
        setTimmer(0);
      } catch (err) {
        setIsRecording(false);
        console.error(err);
      }
    } else {
      console.warn('Audio is not playing');
    }
  };

  const fetchAudioFiles = async () => {
    try {
      const directory = RNFS.DownloadDirectoryPath;
      const files = await RNFS.readdir(directory);
      const audioFiles = files
        .filter(file => file.includes('Socialrecording')) // Filter for mp3 files
        .map(file => ({
          name: file,
          path: `file://${directory}/${file}`, // Construct the full file path
        }));
      setAllRecording(audioFiles);
    } catch (error) {
      console.error('Error reading audio files: ', error);
    }
  };

  const toggleMusicSelection = item => {
    const isSelected = props.selectedMusic?.title === item.name;
    console.log('isSelected', props.selectedMusic?.length);
    if (isSelected) {
      props.setSelectedMusic([]);
      onStopPlay();
    } else {
      if (isPlaying) {
        onStopPlay();
        setRecordSound(null)
      } else {
        if (sound) {
          setSound(null);
          setRecordSound(null);
          stopSound();
        } else {
          onStartPlay(item.path);
          const data = {
            title: item.name,
            path: item.path,
          };
          props.setSelectedMusic(data);
          setRecordSound(data)
        }
      }
    }
  };

  const handleClose = () => {
    props.setRecordingIsiable(false);
    // if (isPlaying) {
    //   setIsPlaying(false);
    //   onStopPlay();
    // }
    if(recordSound){
      setAudioFile(audioRecorderPlayer)
    }
  };

  return (
    <>
      <Modal
        isVisible={props.recordingIsiable}
        style={{margin: 0}}
        animationIn={'slideInUp'}
        swipeDirection={'down'}
        onBackButtonPress={() => handleClose()}
        onBackdropPress={() => handleClose()}
        onSwipeComplete={() => handleClose()}>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <ImageBackground
            source={images.BG}
            imageStyle={styles.backGroundImage}
            style={styles.mainView}>
            <View style={{padding: hp('1.5%'), minHeight: hp(60)}}>
              {/* Buttons View */}
              <View style={[styles.btnWrapper, styles.rowView]}>
                <TouchableOpacity
                  onPress={() => setSelected(1)}
                  style={[
                    styles.rowView,
                    styles.btnView,
                    {borderBottomWidth: selected === 1 ? hp(0.5) : 0},
                  ]}>
                  <Image source={images.Microphone1} style={styles.icon} />
                  <Text style={styles.btnText}>Record</Text>
                </TouchableOpacity>
                <View
                  style={{
                    height: hp('7%'),
                    borderRightColor: '#000',
                    borderRightWidth: 2,
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    setSelected(2), fetchAudioFiles();
                  }}
                  style={[
                    styles.rowView,
                    styles.btnView,
                    {borderBottomWidth: selected === 2 ? hp(0.5) : 0},
                  ]}>
                  <Image source={images.Microphone2} style={styles.icon} />
                  <Text style={styles.btnText}>Recordings</Text>
                </TouchableOpacity>
              </View>

              {selected === 1 ? (
                // Recording and play recorded audio
                <View style={{alignItems: 'center', marginVertical: hp(2)}}>
                  {isRecording ? (
                    <TouchableOpacity onPress={() => stopRecording()}>
                      <Image
                        source={images.RecordingIcon}
                        style={styles.recordIcon}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => startRecording()}>
                      <Image source={images.Mike} style={styles.recordIcon} />
                    </TouchableOpacity>
                  )}

                  <View style={{marginTop: hp(2), alignItems: 'center'}}>
                    <Image
                      source={images.AudioProgress}
                      style={styles.recordTimeLine}
                    />
                    <Text style={styles.timmerText}>
                      {audioRecorderPlayer.mmssss(Math.floor(timmer))}
                    </Text>

                    {isPlaying ? (
                      <TouchableOpacity onPress={() => onStopPlay()}>
                        <Image
                          source={images.pause}
                          style={styles.playPuseIcon}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          if (audioUrl === '') {
                            Alert.alert(
                              'Info',
                              'Please record the audio first',
                            );
                          } else {
                            onStartPlay();
                          }
                        }}>
                        <Image
                          source={images.playButton}
                          style={styles.playPuseIcon}
                        />
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.saveBtnView}>
                      <Text style={styles.saveBtnTExt}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View>
                  <FlatList
                    data={allRecording}
                    renderItem={({item}) => {
                      const isSelected =
                        props.selectedMusic?.title === item.name;
                      const selectedPath = props.selectedMusic?.path
                        ? props.selectedMusic?.path
                        : audioUrl;

                      return (
                        <TouchableOpacity
                          onPress={() => toggleMusicSelection(item)}
                          style={{
                            borderRadius: hp('1.5%'),
                            padding: hp('1%'),
                            margin: hp('1%'),
                            borderColor: '#000',
                            borderWidth: wp('0.5%'),
                            backgroundColor: isSelected
                              ? 'green'
                              : 'transparent',
                          }}>
                          <View
                            style={[
                              styles.rowView,
                              {justifyContent: 'space-between'},
                            ]}>
                            <View style={styles.rowView}>
                              <Image
                                source={images.Musical}
                                style={[
                                  styles.icon,
                                  {tintColor: isSelected ? '#fff' : '#000'},
                                ]}
                              />
                            </View>
                            <Text
                              style={{
                                fontSize: hp('2.5%'),
                                color: isSelected ? '#fff' : '#000',
                              }}>
                              {`${item?.name?.substring(0, 20)}...`}
                            </Text>
                            {item.path === selectedPath ? (
                              isPlaying ? (
                                <TouchableOpacity onPress={() => onStopPlay()}>
                                  <Image
                                    source={images.pause}
                                    style={[
                                      styles.icon,
                                      {tintColor: isSelected ? '#fff' : '#000'},
                                    ]}
                                  />
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity
                                  onPress={() => {
                                    onStartPlay(item.path);
                                  }}>
                                  <Image
                                    source={images.playButton}
                                    style={[
                                      styles.icon,
                                      {tintColor: isSelected ? '#fff' : '#000'},
                                    ]}
                                  />
                                </TouchableOpacity>
                              )
                            ) : (
                              <TouchableOpacity
                                onPress={() => {
                                  if (isPlaying) {
                                    onStopPlay();
                                  } else {
                                    onStartPlay(item.path);
                                  }
                                }}>
                                <Image
                                  source={images.playButton}
                                  style={[
                                    styles.icon,
                                    {tintColor: isSelected ? '#fff' : '#000'},
                                  ]}
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              )}
            </View>
          </ImageBackground>
        </View>
      </Modal>
    </>
  );
};

export default RecordingModal;

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#fff',
    width: '100%',
    // height: '30%',
    overflow: 'hidden',
    borderTopRightRadius: hp('2%'),
    borderTopLeftRadius: hp('2%'),
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backGroundImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  headding: {
    color: '#000',
    fontSize: hp('3.3%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: hp('2%'),
  },
  icon: {
    width: wp('10%'),
    height: wp('10%'),
    resizeMode: 'contain',
    tintColor: '#000',
  },
  btnWrapper: {
    width: '100%',
    borderColor: '#000',
    borderWidth: wp('0.2%'),
    marginTop: hp('1.5%'),
    padding: hp('0.5%'),
    borderRadius: hp('1.5%'),
    justifyContent: 'space-around',
  },
  btnView: {
    width: wp('40%'),
    height: hp('7%'),
    justifyContent: 'center',
    borderBottomColor: '#000',
  },
  btnText: {
    color: '#000',
    fontSize: hp('2.5%'),
    marginLeft: hp('1%'),
  },
  recordIcon: {
    width: wp(30),
    height: wp(30),
    resizeMode: 'contain',
  },
  recordTimeLine: {
    width: wp(60),
    height: hp(10),
    resizeMode: 'contain',
  },
  timmerText: {
    color: '#000',
    fontSize: hp(3),
    fontWeight: 'bold',
    marginBottom: hp(2),
  },
  playPuseIcon: {
    width: wp(20),
    height: wp(20),
    resizeMode: 'contain',
  },
  saveBtnView: {
    borderColor: '#000',
    borderWidth: hp(0.2),
    width: wp(25),
    marginVertical: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
    padding: hp(1),
    borderRadius: hp(1),
  },
  saveBtnTExt: {
    color: '#000',
    fontSize: hp(2.5),
  },
});
