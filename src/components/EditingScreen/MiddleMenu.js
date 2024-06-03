import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {images} from '../../assets/images/image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../../utils/DemoData';
import TextOverlayModal from './Modals/TextOverlayModal';
import {COLOR} from '../../utils/Config';
import {Dimensions} from 'react-native';
import {ColorPicker} from 'react-native-color-picker';
import Slider from '@react-native-community/slider';

const textStyleItems = [
  // {label: 'Normal', value: 'normal', icon: images.TextBox},
  {label: 'Bold', value: 'bold', icon: images.Bold},
  {label: 'Italic', value: 'italic', icon: images.Italic},
  {label: 'Underline', value: 'underline', icon: images.Underline},
  {label: 'Uppercase', value: 'uppercase', icon: images.Uppercase},
  {label: 'Lowercase', value: 'lowercase', icon: images.Lowercase},
  {label: 'Color', value: 'colored', icon: images.Paint},
];

const MiddleMenu = props => {
  const [isColorVisible, setIsColorVisible] = useState(false);

  const applyTextStyle = (style, val) => {
    const type = {name: style, value: val};

    const updatedStyles = props.selectedTextStyle.some(
      item => item.name === type.name,
    )
      ? type.name === 'colored'
        ? [...props.selectedTextStyle, type]
        : props.selectedTextStyle.filter(item => item.name !== type.name)
      : [...props.selectedTextStyle, type];

    props.setSelectedTextStyle(updatedStyles); // Set the selected text style
    const updatedTextWithStyles = [
      ...props.textWithStyles,
      {text: props.inputText, style},
    ];
    props.setTextWithStyles(updatedTextWithStyles);
    props.setPickerVisible(false);
    // if (!props.isVideo ) {
    //   setTimeout(() => {
    //     props.handleSnapShot();
    //   }, 250);
    // }
  };
  // for Text
  const handleTextValueChange = val => {
    const newPosition = [...props.position];
    console.log('current index ', props.currentTextIndex);

    if (newPosition.length <= 0) {
      newPosition[0].text = val;
    }
    newPosition[props.currentTextIndex].text = val;
    props.setPosition(newPosition);
    console.log('new position', props.position);
  };
  const handlePositionChange = (itemId, newPosition) => {
    console.log('current index ', props.currentTextIndex);
    console.log('new position', props.position);
    console.log('id', itemId);
    if (
      newPosition.x >= 100 &&
      newPosition.x <= 300 &&
      newPosition.y >= 660 &&
      newPosition.y <= 760
    ) {
      props.setPosition(prevItems =>
        prevItems.filter(item => item.id != itemId),
      );
      props.setCurrentTextIndex(props.currentTextIndex - 1);
    } else {
      console.log('new position', newPosition);
      props.setPosition(prevItems =>
        prevItems.map(item =>
          item.id === itemId
            ? {...item, x: newPosition.x, y: newPosition.y}
            : item,
        ),
      );
    }
  };

  return (
    <View style={styles.mainView}>
      {/* Left Icons View */}
      <View style={styles.iconViewLeft}>
        <TouchableOpacity
          style={styles.iconView}
          onPress={() => props.setFriendsModalVisiable(true)}>
          <Image source={images.Atsign} style={styles.iconImg} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconView}
          onPress={() => {
            console.log('props.isVideo', props.isVideo);
            if (!props.isVideo) {
              if (props.position?.length > 0) {
                setTimeout(() => {
                  props.handleSnapShot();
                }, 250);
              }
            }
            props.setIsPreview(true);
          }}>
          <Image source={images.Eye} style={styles.iconImg} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconView}
          onPress={() => props.setLocationModalVisiable(true)}>
          <Image source={images.Worldwide} style={styles.iconImg} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconView}
          onPress={() => props.setHashtagModal(true)}>
          <Image
            source={images.Hash}
            style={{
              width: wp('7%'),
              height: hp('3%'),
              resizeMode: 'contain',
              tintColor: '#000',
            }}
          />
        </TouchableOpacity>
      </View>

      {/* Tetx input  */}
      <View style={{flex: 5, height: '100%', alignItems: 'center'}}>
        {/* <Text style={[getTextStyles(), {fontSize: hp('2.5%')}]}>
          {props.inputText}
        </Text> */}
      </View>

      {/* Right icons View */}
      <View style={styles.iconViewRight}>
        <TouchableOpacity
          style={styles.iconView}
          onPress={() => props.handleEditImage(1)}>
          <Image source={images.Group51} style={styles.iconImg} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconView}
          onPress={() => props.setRecordingIsiable(true)}>
          <Image source={images.Microphone} style={styles.iconImg} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconView}
          onPress={() => props.setPickerVisible(!props.pickerVisible)}
          // onPress={() => props.handleEditImage(2)}
        >
          <Image source={images.TextBox} style={styles.iconImg} />
        </TouchableOpacity>
      </View>

      {/* Modal textInput */}
      <Modal
        visible={props.isVisible}
        transparent
        onRequestClose={() => props.setIsVisible(false)}>
        <View
          style={{
            flex: 1,
            // justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(25,25,25,0.7)',
          }}>
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => {
              if (
                props.position[props.currentTextIndex]?.text == '' ||
                props.position[props.currentTextIndex]?.text == undefined
              ) {
              } else {
                props.addNewText(props.currentTextIndex);
              }
              props.setIsVisible(false);
              if (props.position[0]?.text !== '') {
                props.setIsDragg(true);
              }
            }}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Enter Your Text Here.."
            placeholderTextColor={'white'}
            multiline
            // value={props.position[props.currentTextIndex]?.text}
            // value=""
            style={{
              height: '80%',
              width: '80%',
              fontSize: hp('2.5%'),
              color: '#fff',
            }}
            onChangeText={val => handleTextValueChange(val)}
          />
        </View>
      </Modal>

      {/* Draggble Text View */}
      <TextOverlayModal
        type={'text'}
        isDragg={props.isDragg}
        setIsDragg={props.setIsDragg}
        text={props.inputText}
        position={props.position}
        setPosition={props.setPosition}
        getTextStyles={props.getTextStyles}
        currentIndex={props.currentIndex}
        handlePositionChange={handlePositionChange}
        handleClose={() => {
          if (!props.isVideo) {
            if (props.position?.length > 0) {
              setTimeout(() => {
                props.handleSnapShot();
              }, 250);
            }
          }
          props.setIsDragg(false);
        }}
      />

      {/* Text decoration modal */}
      <Modal
        transparent={true}
        visible={props.pickerVisible}
        onRequestClose={() => props.setPickerVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            marginBottom: hp('12%'),
          }}>
          <View
            style={{
              backgroundColor: 'transparent',
              flexDirection: 'row',
              width: wp('70%'),
            }}>
            <FlatList
              data={textStyleItems}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    if (item.value === 'colored') {
                      props.setPickerVisible(false);
                      setIsColorVisible(true);
                    } else {
                      applyTextStyle(item.value);
                    }
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    alignItems: 'flex-end',
                  }}>
                  <Image
                    source={item.icon}
                    style={{resizeMode: 'contain', marginRight: hp('1%')}}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </Modal>

      {/* Color Modal */}
      <Modal
        visible={isColorVisible}
        transparent
        onRequestClose={() => {
          setIsColorVisible(false);
          props.setPickerVisible(true);
        }}>
        {/* <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            marginBottom: hp('12%'),
          }}>
          <View style={{justifyContent: 'flex-end'}}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                height: hp(8),
                paddingHorizontal: hp(1.5),
                flexDirection: 'row',
              }}>
              {colors.map(item => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      applyTextStyle('colored', item.code);
                    }}
                    key={item.id}
                    style={{
                      backgroundColor: item.code,
                      width: wp(8),
                      height: wp(8),
                      borderRadius: hp(10),
                      marginRight: hp(1),
                    }}></TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View> */}
        <ColorPicker
          onColorSelected={color => applyTextStyle('colored', color)}
          sliderComponent={Slider}
          style={{flex: 1}}
        />
      </Modal>
    </View>
  );
};

export default MiddleMenu;

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: hp('1%'),
    marginTop: hp('15%'),
  },
  iconViewLeft: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 0.5,
  },
  iconViewRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 0.5,
  },
  iconView: {
    backgroundColor: '#4CBB17',
    width: wp(10),
    height: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(10),
    marginBottom: hp(2),
  },
  iconImg: {
    width: wp(8),
    height: wp(8),
    resizeMode: 'contain',
    tintColor: '#000',
  },
  doneBtn: {
    width: wp(20),
    height: hp(6),
    backgroundColor: COLOR.GREEN,
    borderRadius: hp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    margin: hp(2),
  },
  doneBtnText: {
    color: '#fff',
    fontSize: hp(2.5),
  },
});
