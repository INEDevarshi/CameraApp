import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from 'react-native';
import {images} from '../assets/images/image';

const TextModal = ({selectedImage}) => {
  const [inputText, setInputText] = useState('');
  const [selectedTextStyle, setSelectedTextStyle] = useState('normal');
  const [pickerVisible, setPickerVisible] = useState(false);

  const textStyles = {
    normal: {
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecorationLine: 'none',
      color: 'black',
    },
    bold: {
      fontWeight: 'bold',
      fontStyle: 'normal',
      textDecorationLine: 'none',
      color: 'black',
    },
    italic: {
      fontWeight: 'normal',
      fontStyle: 'italic',
      textDecorationLine: 'none',
      color: 'black',
    },
    underline: {
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecorationLine: 'underline',
      color: 'black',
    },
    lowercase: {textTransform: 'lowercase', color: 'black'},
    colored: {color: 'red'},
  };

  const textStyleItems = [
    {label: 'Normal', value: 'normal', icon: images.TextBox},
    {label: 'Bold', value: 'bold', icon: images.Bold},
    {label: 'Italic', value: 'italic', image: images.Italic},
    {label: 'Underlined', value: 'Underlined', image: images.Underline},
    {label: 'Uppercase', value: 'Uppercase', image: images.Uppercase},
    {label: 'Lowercase', value: 'Lowercase', image: images.Lowercase},
    // Add more items with images as needed
  ];
  const applyTextStyle = style => {
    setSelectedTextStyle(style);
    setPickerVisible(false); // Close the picker after selecting a style
  };

  const renderDropdownItem = ({item}) => (
    <TouchableOpacity
      onPress={() => applyTextStyle(item.value)}
      style={{flexDirection: 'row', alignItems: 'center'}}>
      <Image
        source={item.icon}
        style={{width: 20, height: 20, marginRight: 10}}
      />
      <Text style={{color: 'black'}}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity onPress={() => setPickerVisible(true)}>
        <Image
          source={images.TextBox}
          style={{width: 20, height: 20, marginRight: 10}}
        />
        <Image
          source={images.TextBox}
          style={{width: 20, height: 20, marginRight: 10}}
        />
        <Image
          source={images.TextBox}
          style={{width: 20, height: 20, marginRight: 10}}
        />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={pickerVisible}
        onRequestClose={() => setPickerVisible(false)}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{backgroundColor: 'white', padding: 20, borderRadius: 10}}>
            <FlatList
              data={textStyleItems}
              renderItem={renderDropdownItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </Modal>

      <Text style={[styles.textOverlay, textStyles[selectedTextStyle]]}>
        Your Text
      </Text>

      {/* TextInput for user input */}
      <TextInput
        style={[styles.textOverlay, styles.textInput]}
        placeholder="Type your text here"
        placeholderTextColor="#666"
        onChangeText={text => setInputText(text)}
      />
    </View>
  );
};

export default TextModal;
const styles = StyleSheet.create({
  textOverlay: {
    // Style for your text overlay
    // ...
    fontSize: 18,
    marginVertical: 10,
    color: 'white',
  },
  picker: {
    height: 40,
    width: '100%',
    marginBottom: 20,
    flexDirection: 'row',
  },
  textInput: {
    height: '30%',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    //  borderColor: 'gray',
    //borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    fontSize: 18,
  },
});
