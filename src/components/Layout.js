import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, FlatList, ImageBackground } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { images } from '../assets/images/image';
const Layout = ({ route }) => {
  const selectedImage = route.params;
  const selectedImages  = route.params;

  console.log('selectedImages layot', selectedImages);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedLayout, setSelectedLayout] = useState(0);

 
  const toggleLayout = (index) => {
    setSelectedLayout(index);
  };

  const renderImage = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.imageContainer,
        selectedLayout && {
          width: `${100 / selectedLayout.columns}%`,
          height: `${100 / selectedLayout.rows}%`,
        },
      ]}
    >
      <Image source={item.source} style={styles.image} />
    </TouchableOpacity>
  );

  const images = [
    { source:selectedImages },
   
    // Add more images as needed
  ];
  const layout = [
    {
      id: 0,
      columns: 2,
      rows: 1,
    },
    {
      id: 1,
      columns: 1,
      rows: 2,
    },
    {
      id: 2,
      columns: 2,
      rows: 2,
    },
    // Add more layouts as needed
  ];

  const layouts = [
    {
      // Define layout one
      id: 0,
      content: (
        <View style={{ alignSelf: 'center', width: wp('20%'), margin: hp('1%'), height: wp('20%'), justifyContent: 'flex-start', borderWidth: hp('0.3%') }}>
          <View style={{ flex: 1, flexDirection: 'row', borderBottomWidth: hp('0.3%') }}>
            {/* First Column */}
            <View style={{ flex: 1, borderRightWidth: hp('0.3%') }}>
              {/* Content for the first cell */}
            </View>
            {/* Second Column */}
            <View style={{ flex: 1 }}>
              {/* Content for the second cell */}
            </View>
          </View>

          {/* Second Row */}
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {/* Third Column */}
            <View style={{ flex: 1, borderRightWidth: hp('0.3%') }}>
              {/* Content for the third cell */}
            </View>
            {/* Fourth Column */}
            <View style={{ flex: 1 }}>
              {/* Content for the fourth cell */}
            </View>
          </View>
        </View>
      ),
    },
    {
      // Define layout two
      id: 1,
      content: (
        <View style={{ alignSelf: 'center', width: wp('20%'), height: wp('20%'), margin: hp('1%'), justifyContent: 'flex-start', borderWidth: hp('0.3%') }}>
          <View style={{ flex: 1, flexDirection: 'row', borderBottomWidth: hp('0.3%') }}>
            {/* First Column */}

            {/* Second Column */}
            <View style={{ flex: 1 }}>
              {/* Content for the second cell */}
            </View>
          </View>

          {/* Second Row */}
          <View style={{ flex: 1, flexDirection: 'row', borderBottomWidth: hp('0.3%') }}>

            {/* Fourth Column */}
            <View style={{ flex: 1 }}>
              {/* Content for the fourth cell */}
            </View>
          </View>

          {/* Third Row */}
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {/* Fifth Column */}

            {/* Sixth Column */}
            <View style={{ flex: 1 }}>
              {/* Content for the sixth cell */}
            </View>
          </View>
        </View>
      ),
    },
    {
      // Define layout three
      id: 2,
      content: (
        <View style={{ alignSelf: 'center', width: wp('20%'), height: wp('20%'), margin: hp('1%'), justifyContent: 'flex-start', flexDirection: 'row', borderWidth: hp('0.3%') }}>
          {/* First Column */}
          <View style={{ flex: 1, borderRightWidth: hp('0.3%') }}>
            {/* Content for the first column */}
          </View>

          {/* Second Column */}
          <View style={{ flex: 1 }}>
            {/* Content for the second column */}
          </View>
        </View>
      ),
    },

    {
      // Define layout fourth
      id: 3,
      content: (
        <View style={{ alignSelf: 'center', width: wp('20%'), height: wp('20%'), margin: hp('1%'), justifyContent: 'flex-start', borderWidth: hp('0.3%') }}>
          {/* First Row */}
          <View style={{ flex: 1, flexDirection: 'row', borderBottomWidth: hp('0.3%') }}>

          </View>

          {/* Second Row */}
          <View style={{ flex: 1, flexDirection: 'row', }}>

          </View>

        </View>
      ),
    },
    {
      // Define layout Fifth
      id: 4,
      content: (
        <View style={{ alignSelf: 'center', width: wp('20%'), height: wp('20%'), margin: hp('1%'), flexDirection: 'row', borderWidth: hp('0.3%') }}>
          {/* First Column */}
          <View style={{ flex: 1, borderRightWidth: hp('0.3%') }}>
            {/* Content for the first column */}
          </View>

          {/* Second Column */}
          <View style={{ flex: 1, borderRightWidth: hp('0.3%') }}>
            {/* Content for the second column */}
          </View>
          {/* {third column} */}
          <View style={{ flex: 1, }}>
            {/* Content for the first column */}
          </View>
        </View>
      ),
    },
  ];


  return (
    <View style={styles.container} >
      <TouchableOpacity style={styles.imageContainer} onPress={() => setSelectedLayout(null)}>
        {selectedLayout ? (
          <View style={styles.selectedLayoutContainer}>
            {selectedLayout.content}
            <Image
              source={images.Girl} // Replace with your selectedImage
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
                ...selectedLayout.imageStyle // Apply additional styles from the selected layout
              }}
            />
          </View>
        ) : (
          <></>
         
        )}
      </TouchableOpacity>



      <>
        <ImageBackground
          style={{
            width: wp('99%'),
            alignItems: 'center',
            borderRadius: 10,
            justifyContent: 'center',
            resizeMode: 'contain',
            overflow: 'hidden', // Clip the content to the borderRadius
          }}
          source={images.BG}
        >
          <View style={{ alignSelf: 'flex-start', width: wp('99%'), justifyContent: 'flex-start', borderBottomWidth: hp('0.3%') }}>
            <Text style={styles.txt}>Layouts</Text>
          </View>
          <View style={styles.layoutView}>
            <FlatList
              data={layouts}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flatListContainer}
              numColumns={3} // Set the number of columns for the first row
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => toggleLayout(item)}>
                  {item.content}
                </TouchableOpacity>
              )}
            />
          </View>


        </ImageBackground>
      </>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },

  toggleButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  flatListContainer: {
    //  paddingVertical: hp('2%'),
  },
  layoutView: {
    width: wp('90%'),
    height: wp('50%'),
    margin: hp('1%'),
    justifyContent: 'flex-start',
    alignItems: 'center',
    // borderWidth: hp('0.3%'),
    overflow: 'hidden',
  },
  selectedLayoutContainer: {
    alignSelf: 'center',
    width: wp('80%'),
    height: wp('50%'),
    margin: hp('2%'),
    justifyContent: 'flex-start',
    borderWidth: hp('0.3%'),
    overflow: 'hidden',
  },
  txt: {
    color: '#000000',
    fontSize: 20,
    marginHorizontal: 10,
    margin: 10,
  },
});

export default Layout;
