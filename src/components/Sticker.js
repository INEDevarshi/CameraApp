import React from 'react';
import { View, Image } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import { Filter } from 'react-native-image-filter-kit';

const StickerExample = () => {
  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
       // type={Camera.Constants.Type.back}
        //audio={false}
      >
        {({ camera, status }) => {
          if (status !== 'READY') return null;

          return (
            <View style={{ flex: 1 }}>
              <Filter
                image={{ uri: 'path/to/your/image.jpg' }} // Your original image
                filter={{
                  name: 'hue',
                  input: {
                    rotation: 180,
                  },
                }}
                onDrawCanvas={(canvas) => {
                  // You can manually draw stickers on the canvas here
                  const image = new Image();
                  image.src = 'path/to/your/sticker.png';
                  image.onload = () => {
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(image, 50, 50, 100, 100); // Adjust position and size
                  };
                }}
              />
            </View>
          );
        }}
      </Camera>
    </View>
  );
};

export default StickerExample;
