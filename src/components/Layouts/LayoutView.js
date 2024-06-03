import React from 'react';
import { View, Image } from 'react-native';
import styles from './styles';

const LayoutView = ({ layoutData, selectedLayoutId, getSelectedImage }) => {
  let layoutToRender;
  switch (selectedLayoutId) {
    case 0:
      layoutToRender = (
        <View style={styles.ViewOfMainLayout}>
          {layoutData
            .filter(layout => layout.id === selectedLayoutId)
            .map(layout => (
              <View key={layout.id} style={styles.flexstart}>
                <View style={styles.mainView}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.layout4ColView}>
                      <Image
                        source={{ uri: getSelectedImage(layout.id, 1) }}
                        style={styles.ImagesView}
                      />
                    </View>
                    <View style={styles.layout4_2Col}>
                      <Image
                        source={{ uri: getSelectedImage(layout.id, 2) }}
                        style={styles.ImagesView}
                      />
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.layout4ColView}>
                      <Image
                        source={{ uri: getSelectedImage(layout.id, 3) }}
                        style={styles.ImagesView}
                      />
                    </View>
                    <View style={styles.layout4_2Col}>
                      <Image
                        source={{ uri: getSelectedImage(layout.id, 4) }}
                        style={styles.ImagesView}
                      />
                    </View>
                  </View>
                </View>
              </View>
            ))}
        </View>
      );
      break;
    case 1:
      layoutToRender = (
        <View style={styles.ViewOfMainLayout}>
          {layoutData
            .filter(layout => layout.id === selectedLayoutId)
            .map(layout => (
              <View key={layout.id} style={styles.flexstart}>
                <View style={{ flex: 1, }}>
                  <Image
                    source={{ uri: getSelectedImage(layout.id, 1) }}
                    style={styles.ImagesView}
                  />
                </View>
              </View>
            ))}
        </View>
      );
      break;
    case 2:
      layoutToRender = (
        <View style={styles.ViewOfMainLayout}>
          {layoutData
            .filter(layout => layout.id === selectedLayoutId)
            .map(layout => (
              <View key={layout.id} style={styles.flexstart}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  {/* First Image */}
                  <View style={styles.layout4ColView}>
                    <Image
                      source={{ uri: getSelectedImage(layout.id, 1) }}
                      style={styles.ImagesView}
                    />
                  </View>
                  {/* Second Image */}
                  <View style={styles.layout4_2Col}>
                    <Image
                      source={{ uri: getSelectedImage(layout.id, 2) }}
                      style={styles.ImagesView}
                    />
                  </View>
                </View>
              </View>
            ))}
        </View>
      );

      break;
    case 3:
      layoutToRender = (
        <View style={styles.ViewOfMainLayout}>
          {layoutData
            .filter(layout => layout.id === selectedLayoutId)
            .map(layout => (
              <View key={layout.id} style={styles.flexstart}>
                <View style={styles.mainView}>
                  <Image
                    source={{ uri: getSelectedImage(layout.id, 1) }}
                    style={styles.ImagesView}
                  />
                </View>
                <View style={{ flex: 1, flexDirection: 'row', }}>
                  <Image
                    source={{ uri: getSelectedImage(layout.id, 2) }}
                    style={styles.ImagesView}
                  />
                </View>
              </View>
            ))}
        </View>
      );
      break;
    case 4:
      layoutToRender = (
        <View style={styles.ViewOfMainLayout}>
           {layoutData
        .filter(layout => layout.id === selectedLayoutId)
        .map(layout => (
          <View key={layout.id} style={styles.flexstart}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={styles.layout4ColView}>
                <Image
                  source={{ uri: getSelectedImage(layout.id, 1) }}
                  style={styles.ImagesView}
                />
              </View>
              <View style={styles.layout4_2Col}>
                <Image
                  source={{ uri: getSelectedImage(layout.id, 2) }}
                  style={styles.ImagesView}
                />
              </View>
              <View style={{ flex: 1, }}>
              <Image
                  source={{ uri: getSelectedImage(layout.id, 3) }}
                  style={styles.ImagesView}
                />
             </View>
            </View>
          </View>
        ))}
        </View>
      );
    break;
    case 5:
      layoutToRender = (
        <View style={styles.ViewOfMainLayout}>
           {layoutData
                .filter(layout => layout.id === selectedLayoutId)
                .map(layout => (
                    <View key={layout.id} style={styles.flexstart}>
                                              <View style={{ flex: 1,  }}>

                      <View style={styles.mainView}>

                                <View style={styles.layout4ColView}>
                                    <Image
                                        source={{ uri: getSelectedImage(layout.id, 1) }}
                                        style={styles.ImagesView}
                                    />
                                </View>
                                <View style={styles.layout4_2Col}>
                                    <Image
                                        source={{ uri: getSelectedImage(layout.id, 2) }}
                                        style={styles.ImagesView}
                                    />
                                </View>
                                <View style={styles.layout4ColView}>
                                    <Image
                                        source={{ uri: getSelectedImage(layout.id, 3) }}
                                        style={styles.ImagesView}
                                    />
                                </View>
                                </View>
                                <View style={{ flex: 1,flexDirection:'row'  }}>
                                <View style={styles.layout4ColView}>
                                    <Image
                                        source={{ uri: getSelectedImage(layout.id, 4) }}
                                        style={styles.ImagesView}
                                    />
                                </View>
                                <View style={styles.layout4_2Col}>
                                    <Image
                                        source={{ uri: getSelectedImage(layout.id, 5) }}
                                        style={styles.ImagesView}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
        </View>
      );
    break;
    case 6:
      layoutToRender = (
        <View style={styles.ViewOfMainLayout}>
            {layoutData
                .filter(layout => layout.id === selectedLayoutId)
                .map(layout => (
                    <View key={layout.id} style={styles.flexstart}>
                        <View style={{ flex: 1, }}>
                            <View style={styles.mainView}>
                                <View style={{ flex: 1 }}>
                                    <View style={styles.layout4ColView}>
                                        <Image
                                            source={{ uri: getSelectedImage(layout.id, 1) }}
                                            style={styles.ImagesView}
                                        />
                                    </View>
                                    <View style={styles.layout4ColView}>
                                        <Image
                                            source={{ uri: getSelectedImage(layout.id, 2) }}
                                            style={styles.ImagesView}
                                        />
                                    </View>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={styles.layout4ColView}>
                                        <Image
                                            source={{ uri: getSelectedImage(layout.id, 3) }}
                                            style={styles.ImagesView}
                                        />
                                    </View>
                                    <View style={styles.layout4ColView}>
                                        <Image
                                            source={{ uri: getSelectedImage(layout.id, 4) }}
                                            style={styles.ImagesView}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={styles.layout4_2Col}>
                                    <Image
                                        source={{ uri: getSelectedImage(layout.id, 5) }}
                                        style={styles.ImagesView}
                                    />
                                </View>
                                <View style={styles.layout4_2Col}>
                                    <Image
                                        source={{ uri: getSelectedImage(layout.id, 6) }}
                                        style={styles.ImagesView}
                                    />
                                </View>
                                <View style={styles.layout4_2Col}>
                                    <Image
                                        source={{ uri: getSelectedImage(layout.id, 7) }}
                                        style={styles.ImagesView}
                                    />
                                </View>
                                <View style={styles.layout4_2Col}>
                                    <Image
                                        source={{ uri: getSelectedImage(layout.id, 8) }}
                                        style={styles.ImagesView}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
        </View>
      );
    break;
    case 7:
      layoutToRender = (
        <View style={styles.ViewOfMainLayout}>
              {layoutData
                .filter(layout => layout.id === selectedLayoutId)
                .map(layout => (
                    <View key={layout.id} style={styles.flexstart}>
                        <View style={styles.layoutRowcenter}>
                          <View style={[styles.rightBorder, { flexDirection: 'column' }]}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={styles.layout4ColView}>
                                        <Image
                                            source={{ uri: getSelectedImage(layout.id, 1) }}
                                            style={styles.ImagesView}
                                        />
                                    </View>
                                    <View style={styles.layout4ColView}>
                                        <Image
                                            source={{ uri: getSelectedImage(layout.id, 2) }}
                                            style={styles.ImagesView}
                                        />
                                    </View>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={styles.layout4ColView}>
                                        <Image
                                            source={{ uri: getSelectedImage(layout.id, 3) }}
                                            style={styles.ImagesView}
                                        />
                                    </View>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={styles.layout4ColView}>
                                        <Image
                                            source={{ uri: getSelectedImage(layout.id, 4) }}
                                            style={styles.ImagesView}
                                        />
                                    </View>
                                    <View style={styles.layout4ColView}>
                                        <Image
                                            source={{ uri: getSelectedImage(layout.id, 5) }}
                                            style={styles.ImagesView}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={styles.layout4_2Col}>
                                    <Image
                                        source={{ uri: getSelectedImage(layout.id,6) }}
                                        style={styles.ImagesView}
                                    />
                                </View>
                                                          
                            </View>
                        </View>
                    </View>
                ))}
        </View>
      );
    break;
    case 8:
      layoutToRender = (
        <View style={styles.ViewOfMainLayout}>
             {layoutData
                .filter(layout => layout.id === selectedLayoutId)
                .map(layout => (
                    <View key={layout.id} style={styles.flexstart}>
                        <View style={styles.mainView}>
                        <View style={{ flex: 1 }}>
                                <View
                                    style={[styles.imageview, { flex: 1, borderWidth: hp(0.3), borderColor: '#fff', borderRadius: 5, margin: 1, }]}>
                                    <Image
                                        source={{ uri: getSelectedImage(layout.id, 1) }}
                                        style={styles.ImagesView}
                                    />
                                </View>
                                <View
                                    style={[styles.imageview, { flex: 2, borderWidth: hp(0.3), borderColor: '#fff', borderRadius: 5, margin: 1, }]}>

                                    <Image
                                        source={{ uri: getSelectedImage(layout.id, 2) }}
                                        style={styles.ImagesView}
                                    />
                                </View>
                            </View>

                            <View style={{ flex: 1 }}>
                                <View
                                    style={[styles.imageview, { flex: 2, borderWidth: hp(0.3), borderColor: '#fff', borderRadius: 5, margin: 1, }]}>
                                    <Image
                                        source={{ uri: getSelectedImage(layout.id, 3) }}
                                        style={styles.ImagesView}
                                    />
                                </View>
                                <View
                                    style={[styles.imageview, { flex: 1, borderWidth: hp(0.3), borderColor: '#fff', borderRadius: 5, margin: 1, }]}>
                                    <Image
                                        source={{ uri: getSelectedImage(layout.id, 4) }}
                                        style={styles.ImagesView}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
        </View>
      );
    break;
    case 9:
      layoutToRender = (
        <View style={styles.ViewOfMainLayout}>
            {layoutData
                .filter(layout => layout.id === selectedLayoutId)
                .map(layout => (
                    <View key={layout.id} style={styles.flexstart}>
                        <View style={styles.flexRow}>
                            <View style={[styles.mainView, { flexDirection: 'column' }]}>
                                <View
                                    style={[styles.imageview, { flex: 2,  borderWidth: hp(0.3),borderColor:'#fff' }]}>
                                    <Image
                                        source={{ uri: getSelectedImage(layout.id, 1) }}
                                        style={styles.ImagesView}
                                    />
                                </View>
                                <View
                                    style={[styles.touchviews,{  borderWidth: hp(0.3),borderColor:'#fff'}]}>
                                    <Image
                                        source={{ uri: getSelectedImage(layout.id, 2) }}
                                        style={styles.ImagesView}
                                    />
                                </View>
                            </View>

                            <View style={{ flex: 2, flexDirection: 'column', }}>
                                <View
                                    style={styles.touchviews}>
                                    <Image
                                        source={{ uri: getSelectedImage(layout.id, 3) }}
                                        style={styles.ImagesView}
                                    />
                                </View>
                                <View
                                    style={[styles.touchviews, { borderWidth: hp(0.3),borderColor:'#fff' }]}>
                                    <Image
                                        source={{ uri: getSelectedImage(layout.id, 4) }}
                                        style={styles.ImagesView}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
        </View>
      );
    break;
    case 10:
      layoutToRender = (
        <View style={styles.ViewOfMainLayout}>
              {layoutData
                .filter(layout => layout.id === selectedLayoutId)
                .map(layout => (
                    <View key={layout.id} style={styles.flexstart}>
                        <View style={styles.flexRow}>
                            <View style={[styles.mainView, { flexDirection: 'column' }]}>
                                <View
                                    style={[styles.imageview, { flex: 2,  borderWidth: hp(0.3),borderColor:'#fff' }]}>
                                    <Image
                                        source={{ uri: getSelectedImage(layout.id, 1) }}
                                        style={styles.ImagesView}
                                    />
                                </View>
                              
                            </View>

                            <View style={{ flex: 2, flexDirection: 'column', }}>
                                <View
                                    style={[styles.touchviews,{ borderWidth: hp(0.3),borderColor:'#fff'}]}>
                                    <Image
                                        source={{ uri: getSelectedImage(layout.id, 2) }}
                                        style={styles.ImagesView}
                                    />
                                </View>
                                <View
                                    style={[styles.touchviews, { borderWidth: hp(0.3),borderColor:'#fff' }]}>
                                    <Image
                                        source={{ uri: getSelectedImage(layout.id, 3) }}
                                        style={styles.ImagesView}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
        </View>
      );
    break;
    case 11:
      layoutToRender = (
        <View style={styles.ViewOfMainLayout}>
           {layoutData
                .filter(layout => layout.id === selectedLayoutId)
                .map(layout => (
                    <View key={layout.id} style={styles.flexstart}>
                        <View style={styles.flexRow}>
                            <View style={[styles.mainView, { flexDirection: 'column' }]}>
                                <View
                                    style={[styles.imageview, { flex: 2,  borderWidth: hp(0.3),borderColor:'#fff' }]}>
                                    <Image
                                        source={{ uri: getSelectedImage(layout.id, 1) }}
                                        style={styles.ImagesView}
                                    />
                                </View>
                              
                            </View>

                            <View style={{ flex: 2, flexDirection: 'column', }}>
                                <View
                                    style={[styles.touchviews,{ borderWidth: hp(0.3),borderColor:'#fff'}]}>
                                    <Image
                                        source={{ uri: getSelectedImage(layout.id, 2) }}
                                        style={styles.ImagesView}
                                    />
                                </View>
                              
                            </View>
                        </View>
                    </View>
                ))}
        </View>
      );
    break;

    default:
      // Define default layout or handle other cases
      break;
  }

  return layoutToRender;
};

export default LayoutView;
