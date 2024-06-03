import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image,  } from 'react-native';
import Video from 'react-native-video';
import ImageFilterKit, { Sharpness, Softness } from 'react-native-image-filter-kit';
import Slider from '@react-native-community/slider';
const ImageCrop = ({route,navigation}) => {
  const selectedImage = route.params;

  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [contrast, setContrast] = useState(1.0);
  const [brightness, setBrightness] = useState(1.0);
  const [softness, setSoftness] = useState(0.0);
  const [sharpness, setSharpness] = useState(0.0);

  const mediaList = [
    { id: 1, type: 'photo', uri: 'https://example.com/photo.jpg' },
    { id: 2, type: 'video', uri: 'https://example.com/video.mp4' },
    // Add more media items as needed
  ];

  const cameraRef = useRef(null);

  const takePicture = async (camera) => {
    if (camera) {
      const options = { quality: 0.5, base64: true };
      const data = await camera.takePictureAsync(options);
      setCapturedPhoto(data.uri);
      setSelectedMedia(null); // Reset selected media when taking a new picture
    }
  };

  const selectMedia = (item) => {
    setCapturedPhoto(null);
    setSelectedMedia(item);
  };

  const renderMediaItem = ({ item }) => (
    <TouchableOpacity onPress={() => selectMedia(item)} style={styles.mediaItem}>
      {item.type === 'photo' ? (
        <Text style={styles.mediaTypeText}>Photo</Text>
      ) : (
        <Text style={styles.mediaTypeText}>Video</Text>
      )}
    </TouchableOpacity>
  );

  const processPhoto = async () => {
    if (capturedPhoto) {
      try {
        const adjustedPhotoUri = await ImageFilterKit.filterImage(
          capturedPhoto,
          'CONTRAST',
          contrast
        );
        const contrastAndBrightnessPhotoUri = await ImageFilterKit.filterImage(
          adjustedPhotoUri,
          'BRIGHTNESS',
          brightness
        );
        const finalPhotoUri = await ImageFilterKit.filterImage(
          contrastAndBrightnessPhotoUri,
          'SOFTNESS',
          softness
        );
        const finalPhotoUriWithSharpness = await ImageFilterKit.filterImage(
          finalPhotoUri,
          'SHARPNESS',
          sharpness
        );

        // Use the final processed photo URI as needed
        console.log('Processed Photo URI:', finalPhotoUriWithSharpness);
      } catch (error) {
        console.error('Photo processing error:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mediaListContainer}>
        <Image source={images.Girl} />
      </View>

      <View style={styles.speedControlContainer}>

      </View>
      <View style={styles.adjustmentControlsContainer}>
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>Contrast:</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={2.0}
            value={contrast}
            onValueChange={(value) => setContrast(value)}
          />
        </View>
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>Brightness:</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={2.0}
            value={brightness}
            onValueChange={(value) => setBrightness(value)}
          />
        </View>
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>Softness:</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.0}
            maximumValue={2.0}
            value={softness}
            onValueChange={(value) => setSoftness(value)}
          />
        </View>
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>Sharpness:</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.0}
            maximumValue={2.0}
            value={sharpness}
            onValueChange={(value) => setSharpness(value)}
          />
        </View>
      </View>
      <TouchableOpacity onPress={processPhoto} style={styles.processButton}>
        <Text style={{ color: 'white' }}>Process Media</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
});

export default ImageCrop;
