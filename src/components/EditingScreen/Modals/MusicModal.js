import {
  ActivityIndicator,
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
import {locations} from '../../../utils/DemoData';
import {COLOR, FONT, FONT_SIZE} from '../../../utils/Config';
import axios from 'axios';
import Sound from 'react-native-sound';
import {
  getAll,
  SortSongFields,
  SortSongOrder,
} from 'react-native-get-music-files';
import {SoundContext} from '../../../context/SoundContext';

const MusicModal = props => {
  Sound.setCategory('Playback');
  const {
    sound,
    setSound,
    isPlaying,
    setIsPlaying,
    recordSound,
    setRecordSound,
    onRecordStopPlay,
  } = useContext(SoundContext);

  const [searchText, setSearchText] = useState('');
  const [filterMusic, setFilterMusic] = useState([]);
  const [allMusic, setAllMusic] = useState([]);
  const [localMusic, setLocalMusic] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [isPlaying, setIsPlaying] = useState(false);
  const [playingMusic, setPlayingMusic] = useState(null);
  const [selectedFile, setSelectedFile] = useState('');
  const [isMusicSelected, setIsMusicSelected] = useState(0);

  useEffect(() => {
    musicAPi();
    fetchMusicFromDevice();
  }, []);

  useEffect(() => {
    searchMusics();
  }, [searchText, isMusicSelected]);

  const fetchMusicFromDevice = async () => {
    const songsOrError = await getAll({
      limit: 100,
      offset: 0,
      coverQuality: 50,
      minSongDuration: 10000,
      sortBy: SortSongFields.TITLE,
      sortOrder: SortSongOrder.DESC,
    })
      .then(res => {
        // console.log('res in music', res);
        setLocalMusic(res);
      })
      .catch(error => {
        console.log('error in music', error);
      });

    // error
    if (typeof songsOrError === 'string') {
      // do something with the error
      return;
    }
  };

  const toggleMusicSelection = item => {
    const isSelected = props.selectedMusic?.title === item.title;
    console.log('isSelected', isSelected);
    if (isSelected) {
      stopMusic();
      props.setSelectedMusic([]);
    } else {
      if (isPlaying) {
        if (recordSound) {
          onRecordStopPlay();
          setRecordSound(null);
        } else {
          stopMusic();
        }
      } else {
        if (loading) {
          Alert.alert('Info', 'Please Wait Music Is Loading');
        } else {
          if (recordSound) {
            onRecordStopPlay();
            setRecordSound(null);
          } else {
            const file = isMusicSelected === 1 ? item.url : item.file;
            setSelectedFile(file);
            playMusic(file);
            props.setSelectedMusic(item);
          }
        }
      }
    }
  };

  const searchMusics = () => {
    if (isMusicSelected === 1) {
      if (searchText !== '') {
        const filtered = localMusic.filter(music =>
          music.title.toLowerCase().includes(searchText.toLowerCase()),
        );
        setFilterMusic(filtered);
      } else {
        setFilterMusic(localMusic);
      }
    } else {
      if (searchText !== '') {
        const filtered = allMusic.filter(music =>
          music.title.toLowerCase().includes(searchText.toLowerCase()),
        );
        setFilterMusic(filtered);
      } else {
        setFilterMusic(allMusic);
      }
    }
  };

  const musicAPi = () => {
    setLoading(true);
    axios
      .get(`https://socialmedia.digiatto.info/public/api/music`)
      .then(res => {
        setFilterMusic(res.data.data);
        setAllMusic(res.data.data);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.error('Error fetching data:', error);
      });
  };

  let selectedSound = null;

  const loadSound = filePath => {
    return new Promise((resolve, reject) => {
      selectedSound = new Sound(filePath, Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log('Failed to load the sound:', error);
          reject(error);
        } else {
          // setPlayingMusic(selectedSound);
          setSound(selectedSound);
          console.log('Sound loaded successfully');
          resolve();
        }
      });
    });
  };

  const playMusic = async filePath => {
    console.log('playMusic', filePath);
    try {
      setLoading(true);
      // If a sound is already loaded, release it before loading the new sound
      if (selectedSound !== null) {
        selectedSound.stop(); // Stop the currently playing sound
        selectedSound.release(); // Release resources associated with the sound
      }

      // Load the new sound

      await loadSound(filePath)
        .then(() => {
          console.log('then');
          setLoading(false);
          setIsPlaying(true);
        })
        .catch(() => {
          setLoading(false);
          setIsPlaying(false);
        });
      // Play the loaded sound
      selectedSound.play(success => {
        if (success) {
          setIsPlaying(false);
          console.log('Sound played successfully');
        } else {
          setLoading(false);
          console.error('Error playing sound');
        }
      });
    } catch (error) {
      setLoading(false);
      console.error('Error playing sound:', error);
    }
  };

  const stopMusic = async () => {
    console.log('stopMusic Called', playingMusic);
    setPlayingMusic(null);
    setIsPlaying(false);

    setSelectedFile('');
    sound.stop();
    setLoading(false);
  };

  const handleClose = () => {
    props.setMusicModalVisiable(false);
    setIsMusicSelected(0);
    // if (sound || playingMusic) {
    //   stopMusic();
    // }
  };

  return (
    <Modal
      isVisible={props.MusicModalVisiable}
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
          {isMusicSelected === 0 ? (
            <View style={{padding: hp('1.5%')}}>
              {/* Headding */}
              <Text style={styles.headding}>Insert</Text>
              <View style={styles.optionWrapper}>
                <TouchableOpacity
                  style={styles.optionBox}
                  onPress={() => setIsMusicSelected(1)}>
                  <Image source={images.Musical} style={styles.icon} />
                  <Text style={styles.btnText}>Music</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionBox}
                  onPress={() => setIsMusicSelected(2)}>
                  <Image source={images.Online} style={styles.icon} />
                  <Text style={styles.btnText}>Online</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={{padding: hp('1.5%')}}>
              {/* Headding */}
              <Text style={styles.headding}>Search Music</Text>
              {/* Search Input */}
              <View style={styles.searchView}>
                <Image
                  source={images.searchIcon}
                  style={{
                    width: wp('6%'),
                    height: wp('6%'),
                    resizeMode: 'contain',
                    tintColor: '#000',
                  }}
                />
                <TextInput
                  placeholder="Search Music....."
                  placeholderTextColor={'#000'}
                  style={styles.input}
                  value={searchText}
                  onChangeText={val => {
                    setSearchText(val);
                  }}
                />
              </View>
              {/* Content View */}
              <View
                style={{
                  marginTop: hp('3%'),
                  maxHeight: hp('40%'),
                }}>
                <FlatList
                  data={filterMusic}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item}) => {
                    const isSelected =
                      props.selectedMusic?.title === item.title;
                    const file = isMusicSelected === 1 ? item.url : item.file;
                    return (
                      <TouchableOpacity
                        onPress={() => toggleMusicSelection(item)}
                        style={{
                          borderRadius: hp('1.5%'),
                          padding: hp('1%'),
                          margin: hp('1%'),
                          borderColor: '#000',
                          borderWidth: wp('0.5%'),
                          backgroundColor: isSelected ? 'green' : 'transparent',
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
                              width: '70%',
                              fontSize: hp('2.5%'),
                              color: isSelected ? '#fff' : '#000',
                            }}>
                            {item?.title}
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              if (isPlaying) {
                                stopMusic();
                              } else {
                                setSelectedFile(file);
                                playMusic(file);
                              }
                            }}
                            disabled={loading}
                            style={styles.btnView}>
                            {file === selectedFile ? (
                              loading ? (
                                <ActivityIndicator
                                  size={'small'}
                                  color={isSelected ? '#fff' : '#000'}
                                />
                              ) : isPlaying ? (
                                <Image
                                  source={images.pause}
                                  style={[
                                    styles.icon,
                                    {tintColor: isSelected ? '#fff' : '#000'},
                                  ]}
                                />
                              ) : (
                                <Image
                                  source={images.playButton}
                                  style={[
                                    styles.icon,
                                    {tintColor: isSelected ? '#fff' : '#000'},
                                  ]}
                                />
                              )
                            ) : (
                              <Image
                                source={images.playButton}
                                style={[
                                  styles.icon,
                                  {tintColor: isSelected ? '#fff' : '#000'},
                                ]}
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </View>
          )}
        </ImageBackground>
      </View>
    </Modal>
  );
};

export default MusicModal;

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
    fontFamily: FONT.EXTRA_BOLD,
    fontSize: FONT_SIZE.F_22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: hp('2%'),
  },
  searchView: {
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: hp('1%'),
    borderRadius: hp('1.5%'),
    borderColor: '#000',
    borderWidth: hp('0.1%'),
  },
  input: {
    color: '#000',
    fontSize: hp('2.3%'),
    width: '90%',
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
    width: wp('10%'),
    //  height: hp('6%'),
    justifyContent: 'center',
    // borderColor: '#000',
    // borderWidth: wp('0.2%'),
    alignItems: 'center',
    borderRadius: hp('1.5%'),
  },
  btnText: {
    color: '#000',
    fontSize: hp('2.5%'),
  },
  optionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  optionBox: {
    width: '40%',
    height: hp(14),
    borderColor: COLOR.BLACK,
    borderWidth: hp(0.2),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(1.5),
    backgroundColor: COLOR.WHITE,
  },
});
