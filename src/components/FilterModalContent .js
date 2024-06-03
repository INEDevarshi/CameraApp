import React, { useState } from 'react';
import { View, Text, Slider, TouchableOpacity } from 'react-native';

const FilterModalContent = ({ selectedFunctionality, updateContrast, updateBrightness, closeFilterModal }) => {
    const [contrastValue, setContrastValue] = useState(1);
    const [brightnessValue, setBrightnessValue] = useState(1);

  const renderSlider = () => {
    if (selectedFunctionality === 'contrast') {
      return (
        <>
          <Slider
            style={{ width: '90%', height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={contrastValue}
            onValueChange={(value) => updateContrast(value)}
          />
          <Text style={{ marginTop: 5 }}>Adjust contrast: {contrastValue}</Text>
        </>
      );
    } else if (selectedFunctionality === 'brightness') {
      
      return (
        <>
          <Slider
            style={{ width: '90%', height: 40 }}
            minimumValue={0}
            maximumValue={5}
            value={brightnessValue}
            onValueChange={(value) => updateBrightness(value)}
          />
          <Text style={{ marginTop: 5 }}>Adjust brightness: {brightnessValue}</Text>
        </>
      );

      } else if (selectedFunctionality === 'brightness') {
      
      return (
        <>
          <Slider
            style={{ width: '90%', height: 40 }}
            minimumValue={0}
            maximumValue={5}
            value={brightnessValue}
            onValueChange={(value) => updateBrightness(value)}
          />
          <Text style={{ marginTop: 5 }}>Adjust brightness: {brightnessValue}</Text>
        </>
      );
    }

    return null; // If no functionality is selected, return null (no slider)
  };

  return (
    <View style={{ marginTop: 10, width: '90%', backgroundColor: '#fff', borderRadius: 10, alignItems: 'center' }}>
      {renderSlider()}
      <TouchableOpacity onPress={closeFilterModal} style={{ marginTop: 10 }}>
        <Text style={{ color: 'blue' }}> Save </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FilterModalContent;
