import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, PermissionsAndroid, Alert } from 'react-native';
import * as Permissions from 'react-native-permissions';
import RNFS from 'react-native-fs';
import { Button } from 'react-native-paper';

const MusicList = () => {
  const [musicFiles, setMusicFiles] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const requestStoragePermission = async () => {
      try {
       
        const granted = await Permissions.request(
          Permissions.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your storage to list music files.',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasPermission(true);

          loadMusicFiles(); // Load music files if permission is granted
        } else {
          // Handle permission denial
          Alert.alert(
            'Permission Denied',
            'Without storage permission, the app cannot list music files.',
            [{ text: 'OK', onPress: () => console.log('Permission denied') }]
          );
        }
      } catch (err) {
        console.error('Error requesting storage permission:', err);
      }
    };

    const loadMusicFiles = async () => {
      try {
        const musicDirectory = RNFS.DocumentDirectoryPath + '/Music';
        const files = await RNFS.readDir(musicDirectory);
        const musicFiles = files.filter(file => file.isFile() && file.name.endsWith('.mp3'));
        setMusicFiles(musicFiles);
      } catch (error) {
        console.error('Error reading music files:', error);
        // Handle error while reading music files
        Alert.alert(
          'Error',
          'An error occurred while reading music files. Please try again later.',
          [{ text: 'OK', onPress: () => console.log('Error reading music files') }]
        );
      }
    };

    requestStoragePermission();
  }, []);

  const renderMusicItem = ({ item }) => (
    <View>
      <Button title="play" />
      <Text>{item.name}</Text>
    </View>
  );

  return (
    <FlatList
      data={musicFiles}
      keyExtractor={(item) => item.path}
      renderItem={renderMusicItem}
    />
  );
};

export default MusicList;
