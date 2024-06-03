import React from 'react';
import { View, Image, TouchableOpacity, Text, FlatList, Button, ImageBackground } from 'react-native';
import styles from './styles';
export const LAYOUTS = [
  {
    id: 0,
    content: (
      <View style={styles.smallView}>
        <View style={styles.mainView}>
          <View style={styles.rightBorder}>
          </View>
          <View style={{ flex: 1 }}>
          </View>
        </View>

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={styles.rightBorder}>
          </View>
          <View style={{ flex: 1 }}>
          </View>
        </View>
      </View>
    ),
  },
  {
    id: 1,
    content: (
      <View style={styles.smallView}>
        <View style={{ flex: 1, }}>
        </View>
      </View>

    ),
  },
  {
    id: 2,
    content: (
      <View style={styles.smallView2}>
        <View style={styles.rightBorder}>
        </View>
        <View style={{ flex: 1 }}>
        </View>
      </View>
    ),
  },

  {
    id: 3,
    content: (
      <View style={styles.smallView}>
        <View style={styles.mainView}>
        </View>

        <View style={{ flex: 1, flexDirection: 'row', }}>
        </View>
      </View>
    ),
  },
  {
    id: 4,
    content: (
      <View style={styles.smallView2}>
        <View style={styles.rightBorder}>
        </View>

        <View style={styles.rightBorder}>
        </View>
        <View style={{ flex: 1, }}>
        </View>
      </View>
    ),
  },
  {
    id: 5,
    content: (
      <View style={ styles.smallView}>
        <View style={styles.mainView}>
          <View style={styles.rightBorder}>
          </View>
          <View style={styles.rightBorder}>
          </View>
          <View style={{ flex: 1 }}>
          </View>
        </View>

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={styles.rightBorder}>
          </View>
          <View style={{ flex: 1, }}>
          </View>

        </View>
      </View>

    ),
  },
  {
    id: 6,
    content: (
      <View style={styles.smallView}>
        <View style={styles.mainView}>
          <View style={styles.rightBorder}>
          </View>
          <View style={{ flex: 1 }}>
          </View>
        </View>

        <View style={styles.mainView}>
          <View style={styles.rightBorder}>
          </View>
          <View style={{ flex: 1 }}>
          </View>
        </View>

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={styles.rightBorder}>
          </View>
          <View style={styles.rightBorder}>
          </View>
          <View style={styles.rightBorder}>
          </View>
          <View style={{ flex: 1 }}>
          </View>
        </View>
      </View>

    ),
  },
  {
    id: 7,
    content: (
      <View style={styles.smallView2}>
        <View style={[styles.rightBorder, { flexDirection: 'column' }]}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={styles.rightBorder}>
            </View>

            <View style={{ flex: 1 }}>
            </View>
          </View>

          <View style={styles.topBorder}>
          </View>
          <View style={styles.topBorder}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={styles.rightBorder}>
              </View>

              <View style={{ flex: 1 }}>
              </View>
            </View>
          </View>
        </View>

        <View style={{ flex: 1 }}>
        </View>
      </View>
    ),
  },
  {
    id: 8,
    content: (
      <View style={styles.layout8}>
        <View style={{ flex: 1, flexDirection: 'row', }}>
          <View style={{ flex: 2, borderWidth: 3, marginBottom: 1, }}>
          </View>
          <View style={{ flex: 1, borderWidth: 3, marginBottom: 1, marginLeft: 1 }}>
          </View>
        </View>

        <View style={{ marginTop: 1, }} />
        <View style={{ flex: 1, flexDirection: 'row', }}>
          <View style={{ flex: 1, borderWidth: 3, marginTop: 1, }}>
          </View>
          <View style={{ flex: 2, borderWidth: 3, marginTop: 1, marginLeft: 1, }}>
          </View>
        </View>
      </View>

    ),
  },
  {
    id: 9,
    content: (
      <View style={styles.layout9}>
        <View style={[styles.rightBorder, { flexDirection: 'column' }]}>
          <View style={{ flex: 2, borderBottomWidth: 3 }}>
          </View>
          <View style={{ flex: 1 }}>
          </View>
        </View>

        <View style={{ flex: 2, flexDirection: 'column' }}>
          <View style={{ flex: 1, }}>
          </View>
          <View style={styles.topBorder}>
          </View>
        </View>
      </View>
    ),
  },
  {
    id: 10,
    content: (
      <View style={styles.layout9}>
        <View style={[styles.rightBorder, { flexDirection: 'column' }]}>
          <View style={{ flex: 1 }}>
          </View>
        </View>

        <View style={{ flex: 2, flexDirection: 'column' }}>
          <View style={{ flex: 1, }}>
          </View>
          <View style={styles.topBorder}>
          </View>
        </View>
      </View>
    ),
  },
  {
    id: 11,
    content: (
      <View style={styles.layout8}>
        <View style={{ flex: 1, flexDirection: 'row', }}>
          <View style={{ flex: 1, borderWidth: 3, }}>
          </View>
          <View style={{ flex: 2, borderWidth: 3, }}>
          </View>
        </View>

      </View>


    ),
  },
 
];



