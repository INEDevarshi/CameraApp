import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image,  } from 'react-native';
import Video from 'react-native-video';
import ImageFilterKit, { Sharpness, Softness } from 'react-native-image-filter-kit';
import Slider from '@react-native-community/slider';
import { images } from '../assets/images/image';
import ImagePicker from 'react-native-image-crop-picker';

const Android = ({route,navigation}) => {
 // const selectedImage = route.params;
 console.log('selectedImage selectedImage selectedImage',selectedImage);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [contrast, setContrast] = useState(1.0);
  const [brightness, setBrightness] = useState(1.0);
  const [softness, setSoftness] = useState(0.0);
  const [sharpness, setSharpness] = useState(0.0);
  const [selectedImage, setSelectedImage] = useState(null);

  // const mediaList = [
  //   { id: 1, type: 'photo', uri: 'https://example.com/photo.jpg' },
  //   { id: 2, type: 'video', uri: 'https://example.com/video.mp4' },
  //   // Add more media items as needed
  // ];

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

  const pickAndCropImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,  // Set the desired width for the cropped image
        height: 400, // Set the desired height for the cropped image
        cropping: true,
      });

      setSelectedImage(image.path);
    } catch (error) {
      console.log('Image picker error:', error);
    }
  };
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
      {/* <Image  source={{ uri: selectedImage }} style={{resizeMode:'contain',width:'100%', height:'100%'}}/> */}
      <Image  source={images.Girl} style={{resizeMode:'contain',width:'90%', height:'70%'}}/>
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
      <TouchableOpacity onPress={processPhoto} style={styles.cropButton}>
        <Text style={{ color: 'black',margin:10 }}>Process Media</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={pickAndCropImage} style={styles.cropButton}>
        <Text>Pick and Crop</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
});

export default Android;
