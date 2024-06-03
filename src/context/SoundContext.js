// SoundContext.js
import React, {createContext, useState} from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

export const SoundContext = createContext();

const audioRecorderPlayer = new AudioRecorderPlayer();
export const SoundProvider = ({children}) => {
  const [sound, setSound] = useState(null);
  const [recordSound, setRecordSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState(null)

  const stopSound = () => {
    sound.stop();
  };

  const onRecordStopPlay = async () => {
    if (isPlaying) {
      try {
        await audioFile
          .stopPlayer()
          .then(res => {
            console.log('stop recording',res);
            setIsPlaying(false);
          })
          .catch(eror => {
            console.error(eror);
          });
      } catch (err) {
        console.error(err);
      }
    } else {
      console.warn('Audio is not playing');
    }
  };

  return (
    <SoundContext.Provider
      value={{
        sound,
        setSound,
        isPlaying,
        setIsPlaying,
        stopSound,
        recordSound,
        setRecordSound,
        onRecordStopPlay,
        setAudioFile
      }}>
      {children}
    </SoundContext.Provider>
  );
};
