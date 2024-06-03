const {StyleSheet, Dimensions} = require('react-native');

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainImageView: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000',
  },

  image: {
    width: screenWidth,
    height: screenHeight,
    resizeMode: 'contain',
    // aspectRatio: 16 / 9, //  aspect ratio resolutions: 1920x1080, 3840x2160 (Full HD, 4K UHD).
    //  aspectRatio: 4 / 3, // Traditional aspect ratio used by older digital cameras and some smartphone
    // aspectRatio: 1 / 1, // Used for square photos, popularized by platforms like Instagram.
  },
  allMenuView: {
    position: 'absolute',
    width: screenWidth,
    height: screenHeight,
    flex: 1,
  },
  modalOverlay2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textDragView: {
    width: screenWidth,
    height: screenHeight,
    position: 'absolute',
  },
  locationText: {
    color: 'white',
    // fontWeight: '600',
    fontSize: 14,
  },
  locationDiv: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
  },
  hashtagDiv: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
  },
  display: {
    position: 'absolute',
    bottom: 100,
    left: 10,
    width: '100%',
  },
});

export default styles;
