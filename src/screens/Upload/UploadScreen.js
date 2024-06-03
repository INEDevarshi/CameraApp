import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import styles from './Styles';
import {images} from '../../assets/images/image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLOR } from '../../utils/Config';

const DATA = [
  {
    id: 1,
    title: 'Family',
    image: images.family,
  },
  {
    id: 2,
    title: 'Close Friends',
    image: images.Friends,
  },
  {
    id: 3,
    title: 'Followers',
    image: images.Followers,
  },
  {
    id: 4,
    title: 'Following',
    image: images.following,
  },
  {
    id: 5,
    title: 'Anyone',
    image: images.planet,
  },
  {
    id: 6,
    title: 'Message',
    image: images.message,
  },
  {
    id: 7,
    title: 'Only Me',
    image: images.Account,
  },
];

const UploadScreen = ({navigation}) => {
  const [uploadType, setUploadType] = useState(1);
  const [selectedShareOption, setSelectedShareOption] = useState([]);

  const handleShareOptionSelction = id => {
    const isSelected = selectedShareOption.includes(id);
    if (isSelected) {
      const filterData = selectedShareOption.filter(el => el !== id);
      setSelectedShareOption(filterData);
    } else {
      const data = [...selectedShareOption, id];
      setSelectedShareOption(data);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor={'#000'} barStyle={'light-content'} />
      <View style={{paddingHorizontal: hp(1)}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={images.Back} style={styles.iconImg} />
        </TouchableOpacity>
      </View>
      <Text style={styles.headdingText}>Share</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: hp(3),
          paddingHorizontal: hp(1),
        }}>
        <TouchableOpacity
          style={[
            styles.roundedView,
            {
              borderColor: uploadType === 1 ? COLOR.GREEN : '#fff',
            },
          ]}
          onPress={() => setUploadType(uploadType === 2 ? 1 : 1)}>
          <Text style={styles.headdingText}>Your Story</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.roundedView,
            {
              borderColor: uploadType === 2 ? COLOR.GREEN : '#fff',
            },
          ]}
          onPress={() => setUploadType(uploadType === 1 ? 2 : 1)}>
          <Text style={styles.headdingText}>Short Video</Text>
        </TouchableOpacity>
      </View>
      <View style={{paddingHorizontal: hp(1), marginVertical: hp(3)}}>
        <FlatList
          data={DATA}
          renderItem={({item}) => {
            const isSelected = selectedShareOption.includes(item.id);
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: hp(1),
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={item.image}
                    style={[styles.iconImg, {marginRight: hp(2)}]}
                  />
                  <Text style={styles.headdingText}>{item.title}</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    {
                      backgroundColor: isSelected ? COLOR.GREEN : 'transparent',
                    },
                  ]}
                  onPress={() => handleShareOptionSelction(item.id)}>
                  <Text></Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity style={styles.uploadBtn}>
          <Text style={styles.headdingText}>Upload</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UploadScreen;
