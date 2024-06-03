import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Button,
  ImageBackground,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {images} from '../assets/images/image';
import {COLOR, FONT, FONT_SIZE} from '../utils/Config';
import ImagePicker from 'react-native-image-crop-picker';
import Svg, {Polygon, Defs, ClipPath} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import {LAYOUTS} from '../utils/Layouts';

const Layout = (props = ({route}) => {
  const navigation = useNavigation();
  const selectedImages = route.params;
  console.log('selectedImages', selectedImages);
  const [selectedLayoutIndex, setSelectedLayoutIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedLayoutId, setSelectedLayoutId] = useState(null);
  const [layoutData, setLayoutData] = useState([]);

  console.log('layoutDatalayoutData', layoutData);

  useEffect(() => {
    const newLayoutIndex = selectedIndex;
    setSelectedLayoutIndex(newLayoutIndex);
  }, [selectedIndex]);

  const toggleLayout = id => {
    setSelectedLayoutId(id);
  };

  const getSelectedImage = (layoutId, tabId) => {
    const layout = layoutData.find(item => item.id === layoutId);
    if (layout) {
      const image = layout.images.find(img => img.id === tabId);
      return image ? image.image : null;
    }
    return null;
  };

  const getAllSelectedImages = () => {
    const allImages = [];
    layoutData.forEach(layout => {
      layout.images.forEach(tab => {
        if (tab.image) {
          allImages.push({
            layoutId: layout.id,
            tabId: tab.id,
            image: tab.image,
          });
        }
      });
    });
    return allImages;
  };

  const handleSaveAndNavigate = () => {
    const selectedImages = getAllSelectedImages();
    console.log('Selected Images:', selectedImages);
    navigation.navigate('EditingScreen', {
      selectedLayoutImages: selectedImages,
      selectedLayoutId: selectedLayoutId,
      layoutData: layoutData,
    });
  };

  const openImagePicker = (id, tabId) => {
    ImagePicker.openPicker({})
      .then(image => {
        console.log(image);
        setLayoutImages(id, tabId, image.path);
      })
      .catch(error => {
        console.log('ImagePicker Error: ', error);
      });
  };

  const setLayoutImages = (id, tabId, image) => {
    const index = layoutData.findIndex(item => item.id === id);
    if (index !== -1) {
      setLayoutData(prevLayoutData => {
        const newData = [...prevLayoutData];
        const existingTabIndex = newData[index].images.findIndex(
          el => el.id === tabId,
        );
        if (existingTabIndex !== -1) {
          newData[index].images.splice(existingTabIndex, 1);
        }
        newData[index].images.push({
          id: tabId,
          image: image,
        });
        return newData;
      });
    } else {
      setLayoutData(prevLayoutData => [
        ...prevLayoutData,
        {
          id: id,
          images: [
            {
              id: tabId,
              image: image,
            },
          ],
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.selectedLayoutContainer}>
        {selectedLayoutId === 0 ? (
          <View style={styles.flexstart}>
            <View style={styles.mainView}>
              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 1)}
                style={styles.layout4ColView}>
                {getSelectedImage(0, 1) ? (
                  <Image
                    source={{uri: getSelectedImage(0, 1)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 2)}
                style={styles.layout4_2Col}>
                {getSelectedImage(0, 2) ? (
                  <Image
                    source={{uri: getSelectedImage(0, 2)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 3)}
                style={styles.layout4ColView}>
                {getSelectedImage(0, 3) ? (
                  <Image
                    source={{uri: getSelectedImage(0, 3)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 4)}
                style={styles.layout4_2Col}>
                {getSelectedImage(0, 4) ? (
                  <Image
                    source={{uri: getSelectedImage(0, 4)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : selectedLayoutId === 1 ? (
          <View style={styles.flexstart}>
            <TouchableOpacity
              onPress={() => openImagePicker(selectedLayoutId, 1)}
              style={styles.layout4ColView1}>
              {getSelectedImage(1, 1) ? (
                <Image
                  source={{uri: getSelectedImage(1, 1)}}
                  style={styles.ImagesView}
                />
              ) : (
                <>
                  <Text style={{fontSize: 25}}> + </Text>
                  <Text>Select Image</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : selectedLayoutId === 2 ? (
          <View style={styles.flexstart}>
            <View style={styles.flexstart}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                {/* First Column */}
                <TouchableOpacity
                  onPress={() => openImagePicker(selectedLayoutId, 1)}
                  style={styles.layout4ColView}>
                  {getSelectedImage(2, 1) ? (
                    <Image
                      source={{uri: getSelectedImage(2, 1)}}
                      style={styles.ImagesView}
                    />
                  ) : (
                    <>
                      <Text style={{fontSize: 25}}> + </Text>
                      <Text>Select Image</Text>
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => openImagePicker(selectedLayoutId, 2)}
                  style={styles.layout4_2Col}>
                  {getSelectedImage(2, 2) ? (
                    <Image
                      source={{uri: getSelectedImage(2, 2)}}
                      style={styles.ImagesView}
                    />
                  ) : (
                    <>
                      <Text style={{fontSize: 25}}> + </Text>
                      <Text>Select Image</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : selectedLayoutId === 3 ? (
          <View style={styles.flexcenter}>
            <TouchableOpacity
              onPress={() => openImagePicker(selectedLayoutId, 1)}
              style={styles.layout3View}>
              {getSelectedImage(3, 1) ? (
                <Image
                  source={{uri: getSelectedImage(3, 1)}}
                  style={styles.ImagesView}
                />
              ) : (
                <>
                  <Text style={{fontSize: 25}}> + </Text>
                  <Text>Select Image</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Second Row */}
            <TouchableOpacity
              onPress={() => openImagePicker(selectedLayoutId, 2)}
              style={styles.touchviews}>
              {getSelectedImage(3, 2) ? (
                <Image
                  source={{uri: getSelectedImage(3, 2)}}
                  style={styles.ImagesView}
                />
              ) : (
                <>
                  <Text style={{fontSize: 25}}> + </Text>
                  <Text>Select Image</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : selectedLayoutId === 4 ? (
          <View style={styles.layoutRowcenter}>
            <TouchableOpacity
              onPress={() => openImagePicker(selectedLayoutId, 1)}
              style={styles.touchView}>
              {getSelectedImage(4, 1) ? (
                <Image
                  source={{uri: getSelectedImage(4, 1)}}
                  style={styles.ImagesView}
                />
              ) : (
                <>
                  <Text style={{fontSize: 25}}> + </Text>
                  <Text>Select Image</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Second Column */}
            <TouchableOpacity
              onPress={() => openImagePicker(selectedLayoutId, 2)}
              style={styles.touchView}>
              {getSelectedImage(4, 2) ? (
                <Image
                  source={{uri: getSelectedImage(4, 2)}}
                  style={styles.ImagesView}
                />
              ) : (
                <>
                  <Text style={{fontSize: 25}}> + </Text>
                  <Text>Select Image</Text>
                </>
              )}
            </TouchableOpacity>
            {/* {third column} */}
            <TouchableOpacity
              onPress={() => openImagePicker(selectedLayoutId, 3)}
              style={[styles.imageview, {flex: 1}]}>
              {getSelectedImage(4, 3) ? (
                <Image
                  source={{uri: getSelectedImage(4, 3)}}
                  style={styles.ImagesView}
                />
              ) : (
                <>
                  <Text style={{fontSize: 25}}> + </Text>
                  <Text>Select Image</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : selectedLayoutId === 5 ? (
          <View style={styles.flexcenter}>
            <View style={styles.mainView}>
              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 1)}
                style={[styles.touchView, styles.rightBorder]}>
                {getSelectedImage(5, 1) ? (
                  <Image
                    source={{uri: getSelectedImage(5, 1)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 2)}
                style={[styles.touchView, styles.rightBorder]}>
                {getSelectedImage(5, 2) ? (
                  <Image
                    source={{uri: getSelectedImage(5, 2)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>
              {/* Third Column */}
              <TouchableOpacity
                style={[styles.imageview, {flex: 1}]}
                onPress={() => openImagePicker(selectedLayoutId, 3)}>
                {getSelectedImage(5, 3) ? (
                  <Image
                    source={{uri: getSelectedImage(5, 3)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Second Row */}
            <View style={{flex: 1, flexDirection: 'row'}}>
              {/* Fourth Column */}
              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 4)}
                style={[styles.touchView, {flex: 1}]}>
                {getSelectedImage(5, 4) ? (
                  <Image
                    source={{uri: getSelectedImage(5, 4)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>
              {/* Fifth Column */}
              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 5)}
                style={[styles.imageview, {flex: 1}]}>
                {getSelectedImage(5, 5) ? (
                  <Image
                    source={{uri: getSelectedImage(5, 5)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : selectedLayoutId === 6 ? (
          <View style={styles.flexcenter}>
            <View style={styles.mainView}>
              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 1)}
                style={[styles.imageview, styles.rightBorder]}>
                {getSelectedImage(6, 1) ? (
                  <Image
                    source={{uri: getSelectedImage(6, 1)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 2)}
                style={[styles.imageview, {flex: 1}]}>
                {getSelectedImage(6, 2) ? (
                  <Image
                    source={{uri: getSelectedImage(6, 2)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.mainView}>
              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 3)}
                style={[styles.imageview, styles.rightBorder]}>
                {getSelectedImage(6, 3) ? (
                  <Image
                    source={{uri: getSelectedImage(6, 3)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 4)}
                style={[styles.imageview, {flex: 1}]}>
                {getSelectedImage(6, 4) ? (
                  <Image
                    source={{uri: getSelectedImage(6, 4)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={{flex: 1, flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 5)}
                style={[styles.imageview, styles.rightBorder]}>
                {getSelectedImage(6, 5) ? (
                  <Image
                    source={{uri: getSelectedImage(6, 5)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>
              {/* Sixth Column */}
              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 6)}
                style={[styles.imageview, styles.rightBorder]}>
                {getSelectedImage(6, 6) ? (
                  <Image
                    source={{uri: getSelectedImage(6, 6)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>
              {/* Seventh Column */}
              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 7)}
                style={[styles.imageview, styles.rightBorder]}>
                {getSelectedImage(6, 7) ? (
                  <Image
                    source={{uri: getSelectedImage(6, 7)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>
              {/* Eighth Column */}
              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 8)}
                style={[styles.imageview, {flex: 1}]}>
                {getSelectedImage(6, 8) ? (
                  <Image
                    source={{uri: getSelectedImage(6, 8)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : selectedLayoutId === 7 ? (
          <View style={styles.layoutRowcenter}>
            {/* First Column */}
            <View style={[styles.rightBorder, {flexDirection: 'column'}]}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => openImagePicker(selectedLayoutId, 1)}
                  style={[styles.imageview, styles.rightBorder]}>
                  {getSelectedImage(7, 1) ? (
                    <Image
                      source={{uri: getSelectedImage(7, 1)}}
                      style={styles.ImagesView}
                    />
                  ) : (
                    <>
                      <Text style={{fontSize: 25}}> + </Text>
                      <Text>Select Image</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => openImagePicker(selectedLayoutId, 2)}
                  style={[styles.imageview, {flex: 1}]}>
                  {getSelectedImage(7, 2) ? (
                    <Image
                      source={{uri: getSelectedImage(7, 2)}}
                      style={styles.ImagesView}
                    />
                  ) : (
                    <>
                      <Text style={{fontSize: 25}}> + </Text>
                      <Text>Select Image</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 3)}
                style={[styles.imageview, styles.topBorder]}>
                {getSelectedImage(7, 3) ? (
                  <Image
                    source={{uri: getSelectedImage(7, 3)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>

              <View style={{flex: 1, borderTopWidth: hp('0.3%')}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => openImagePicker(selectedLayoutId, 4)}
                    style={[styles.imageview, styles.rightBorder]}>
                    {getSelectedImage(7, 4) ? (
                      <Image
                        source={{uri: getSelectedImage(7, 4)}}
                        style={styles.ImagesView}
                      />
                    ) : (
                      <>
                        <Text style={{fontSize: 25}}> + </Text>
                        <Text>Select Image</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => openImagePicker(selectedLayoutId, 5)}
                    style={[styles.imageview, {flex: 1}]}>
                    {getSelectedImage(7, 5) ? (
                      <Image
                        source={{uri: getSelectedImage(7, 5)}}
                        style={styles.ImagesView}
                      />
                    ) : (
                      <>
                        <Text style={{fontSize: 25}}> + </Text>
                        <Text>Select Image</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => openImagePicker(selectedLayoutId, 6)}
              style={[styles.imageview, {flex: 1}]}>
              {getSelectedImage(7, 6) ? (
                <Image
                  source={{uri: getSelectedImage(7, 6)}}
                  style={styles.ImagesView}
                />
              ) : (
                <>
                  <Text style={{fontSize: 25}}> + </Text>
                  <Text>Select Image</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : selectedLayoutId === 8 ? (
          <View style={styles.flexcolumn}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 1)}
                style={[
                  styles.imageview,
                  {flex: 2, borderWidth: 3, borderRadius: 5, margin: 1},
                ]}>
                {getSelectedImage(8, 1) ? (
                  <Image
                    source={{uri: getSelectedImage(8, 1)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Second Row - Small */}
              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 2)}
                style={[
                  styles.imageview,
                  {flex: 1, borderWidth: 3, borderRadius: 5, margin: 1},
                ]}>
                {getSelectedImage(8, 2) ? (
                  <Image
                    source={{uri: getSelectedImage(8, 2)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={{marginTop: 1}} />
            <View style={{flex: 1, flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 3)}
                style={[
                  styles.imageview,
                  {flex: 1, borderWidth: 3, borderRadius: 5, margin: 1},
                ]}>
                {getSelectedImage(8, 3) ? (
                  <Image
                    source={{uri: getSelectedImage(8, 3)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Second Row - Big */}
              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 4)}
                style={[
                  styles.imageview,
                  {flex: 2, borderWidth: 3, borderRadius: 5, margin: 1},
                ]}>
                {getSelectedImage(8, 4) ? (
                  <Image
                    source={{uri: getSelectedImage(8, 4)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : selectedLayoutId === 9 ? (
          <View style={styles.flexstart}>
            <View style={styles.flexRow}>
              <View style={[styles.rightBorder, {flexDirection: 'column'}]}>
                {/* First Row - Big */}
                <TouchableOpacity
                  style={[styles.imageview, {flex: 2, borderBottomWidth: 3}]}
                  onPress={() => openImagePicker(selectedLayoutId, 1)}>
                  {getSelectedImage(9, 1) ? (
                    <Image
                      source={{uri: getSelectedImage(9, 1)}}
                      style={styles.ImagesView}
                    />
                  ) : (
                    <>
                      <Text style={{fontSize: 25}}> + </Text>
                      <Text>Select Image</Text>
                    </>
                  )}
                </TouchableOpacity>
                {/* Second Row - Small */}
                <TouchableOpacity
                  style={styles.touchviews}
                  onPress={() => openImagePicker(selectedLayoutId, 2)}>
                  {getSelectedImage(9, 2) ? (
                    <Image
                      source={{uri: getSelectedImage(9, 2)}}
                      style={styles.ImagesView}
                    />
                  ) : (
                    <>
                      <Text style={{fontSize: 25}}> + </Text>
                      <Text>Select Image</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Second Row */}
              <View style={{flex: 2, flexDirection: 'column'}}>
                {/* First Row - Small */}
                <TouchableOpacity
                  style={styles.touchviews}
                  onPress={() => openImagePicker(selectedLayoutId, 3)}>
                  {getSelectedImage(9, 3) ? (
                    <Image
                      source={{uri: getSelectedImage(9, 3)}}
                      style={styles.ImagesView}
                    />
                  ) : (
                    <>
                      <Text style={{fontSize: 25}}> + </Text>
                      <Text>Select Image</Text>
                    </>
                  )}
                </TouchableOpacity>
                {/* Second Row - Big */}
                <TouchableOpacity
                  style={[styles.touchviews, {borderTopWidth: 3}]}
                  onPress={() => openImagePicker(selectedLayoutId, 4)}>
                  {getSelectedImage(9, 4) ? (
                    <Image
                      source={{uri: getSelectedImage(9, 4)}}
                      style={styles.ImagesView}
                    />
                  ) : (
                    <>
                      <Text style={{fontSize: 25}}> + </Text>
                      <Text>Select Image</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : selectedLayoutId === 10 ? (
          <View style={styles.layout10}>
            <View style={[styles.rightBorder, {flexDirection: 'column'}]}>
              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 1)}
                style={styles.touchviews}>
                {getSelectedImage(10, 1) ? (
                  <Image
                    source={{uri: getSelectedImage(10, 1)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Second Row */}
            <View style={{flex: 2, flexDirection: 'column'}}>
              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 2)}
                style={styles.touchviews}>
                {getSelectedImage(10, 2) ? (
                  <Image
                    source={{uri: getSelectedImage(10, 2)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>
              {/* Second Row - Big */}
              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 3)}
                style={[styles.touchviews, {borderTopWidth: 3}]}>
                {getSelectedImage(10, 3) ? (
                  <Image
                    source={{uri: getSelectedImage(10, 3)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : selectedLayoutId === 11 ? (
          <View style={styles.flexcolumn2}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 1)}
                style={[styles.borderwidth, {flex: 1}]}>
                {getSelectedImage(11, 1) ? (
                  <Image
                    source={{uri: getSelectedImage(11, 1)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => openImagePicker(selectedLayoutId, 2)}
                style={[styles.borderwidth, {flex: 2}]}>
                {getSelectedImage(11, 2) ? (
                  <Image
                    source={{uri: getSelectedImage(11, 2)}}
                    style={styles.ImagesView}
                  />
                ) : (
                  <>
                    <Text style={{fontSize: 25}}> + </Text>
                    <Text>Select Image</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.flexstart}></View>
        )}
      </View>
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
          source={images.BG}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                alignSelf: 'flex-start',
                width: wp('99%'),
                justifyContent: 'flex-start',
                borderBottomWidth: hp('0.3%'),
              }}>
              <Text style={styles.txt}>Layouts</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleSaveAndNavigate()}
              style={styles.nextbutn}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 18, color: 'white'}}>Next</Text>
                <Image
                  style={{width: 20, height: 20}}
                  source={images.Rightarrow}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.layoutView}>
            <FlatList
              data={LAYOUTS}
              keyExtractor={item => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flatListContainer}
              numColumns={3}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    onPress={() => toggleLayout(item.id)}
                    style={{
                      borderColor:
                        selectedLayoutId === item.id ? '#fff' : '#000',
                      backgroundColor:
                        selectedLayoutId === item.id ? COLOR.GREEN : 'transparent',
                    }}>
                    {item.content}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </ImageBackground>
      </>
    </View>
  );
});

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: hp('0.3%'),
  },
  touchviews: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rightBorder: {
    flex: 1,
    borderRightWidth: hp('0.3%'),
  },
  topBorder: {
    flex: 1,
    borderTopWidth: hp('0.3%'),
  },
  layout8: {
    alignSelf: 'center',
    height: wp('20%'),
    flexDirection: 'column',
    margin: hp('1%'),
    width: wp('20%'),
    justifyContent: 'flex-start',
  },
  layout10: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    margin: hp('1%'),
    justifyContent: 'flex-start',
  },
  layout9: {
    alignSelf: 'center',
    width: wp('20%'),
    flexDirection: 'row',
    margin: hp('1%'),
    height: wp('20%'),
    justifyContent: 'flex-start',
    borderWidth: hp('0.3%'),
  },
  layoutRowcenter: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    margin: hp('1%'),
    justifyContent: 'center',
    flexDirection: 'row',
  },
  flexcolumn: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  flexcolumn2: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    margin: hp('1%'),
    justifyContent: 'flex-start',
  },
  flexstart: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
  },
  flexcenter: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    margin: hp('1%'),
    justifyContent: 'center',
  },
  flexRow: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  layout4ColView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: hp('0.3%'),
  },
  imageview: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ImagesView: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
  },
  layout4ColView1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  nextbutn: {
    position: 'absolute',
    borderWidth: 1,
    width: '20%',
    borderRadius: 5,
    backgroundColor: COLOR.GREEN,
    alignItems: 'center',
    padding: 1,
    right: 20,
    top: 10,
  },
  diagonalLineView1: {
    marginTop: 220,
    marginBottom: -45,
    marginLeft: -80,
    width: '100%',
    borderTopWidth: 2,
    transform: [{rotate: '33deg'}],
  },
  layout4_2Col: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallView: {
    alignSelf: 'center',
    width: wp('20%'),
    height: wp('20%'),
    margin: hp('1%'),
    borderRadius: 5,
    justifyContent: 'flex-start',
    borderWidth: hp('0.3%'),
  },
  largeView: {
    alignSelf: 'center',
    width: wp('100%'),
    height: wp('100%'),
    margin: hp('1%'),
    borderRadius: 5,
    justifyContent: 'flex-start',
    borderWidth: hp('0.3%'),
  },
  smallView2: {
    alignSelf: 'center',
    width: wp('20%'),
    height: wp('20%'),
    margin: hp('1%'),
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderWidth: hp('0.3%'),
  },
  largeView2: {
    alignSelf: 'center',
    width: wp('100%'),
    height: wp('100%'),
    margin: hp('1%'),
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderWidth: hp('0.3%'),
  },
  layout3View: {
    flex: 1,
    // flexDirection: 'row',
    borderBottomWidth: hp('0.3%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchView: {
    flex: 1,
    borderRightWidth: hp('0.3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backGroundImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  imageThumbnail: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#DDDDDD',
  },
  container: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  toggleButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  imageContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
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
    width: '95%',
    height: '50%',
    margin: hp('2%'),
    marginBottom: hp('5%'),
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    borderWidth: hp('0.3%'),
    overflow: 'hidden',
  },
  plusButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    // backgroundColor: 'blue',
    //  borderRadius: 20,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusButtonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  flatListContainer: {
    // Add styling for FlatList container if needed
  },
  txt: {
    color: '#000000',
    fontFamily: FONT.EXTRA_BOLD,
    fontSize: FONT_SIZE.F_21,
    marginHorizontal: 10,
    margin: 10,
  },
  borderwidth: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Layout;
