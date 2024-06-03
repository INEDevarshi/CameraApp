import {images} from '../assets/images/image';
import {Image, View, TouchableOpacity, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const hashtags = [
  {
    id: 1,
    title: 'trysomething',
  },
  {
    id: 2,
    title: 'anotherhashtag',
  },
  {
    id: 3,
    title: 'explore',
  },
  {
    id: 4,
    title: 'codinglife',
  },
  {
    id: 5,
    title: 'reactnative',
  },
  {
    id: 6,
    title: 'webdevelopment',
  },
  {
    id: 7,
    title: 'design',
  },
  {
    id: 8,
    title: 'creative',
  },
  {
    id: 9,
    title: 'inspiration',
  },
  {
    id: 10,
    title: 'learnandgrow',
  },
  {
    id: 11,
    title: 'innovation',
  },
  {
    id: 12,
    title: 'productivity',
  },
  {
    id: 13,
    title: 'challengeaccepted',
  },
  {
    id: 14,
    title: 'motivation',
  },
  {
    id: 15,
    title: 'digitalart',
  },
  {
    id: 16,
    title: 'photography',
  },
  {
    id: 17,
    title: 'healthyliving',
  },
  {
    id: 18,
    title: 'traveltheworld',
  },
  {
    id: 19,
    title: 'mindfulness',
  },
  {
    id: 20,
    title: 'nevergiveup',
  },
];

export const locations = [
  {
    id: 1,
    title: 'Satellite',
    location: 'Ahmedabad, India',
  },
  {
    id: 2,
    title: 'Maninagar',
    location: 'Ahmedabad, India',
  },
  {
    id: 3,
    title: 'SG Highway',
    location: 'Ahmedabad, India',
  },
  {
    id: 4,
    title: 'Nehru Nagar',
    location: 'Ahmedabad, India',
  },
  {
    id: 5,
    title: 'Gandhinagar',
    location: 'Ahmedabad, India',
  },
  {
    id: 6,
    title: 'Vastrapur',
    location: 'Ahmedabad, India',
  },
  {
    id: 7,
    title: 'Chandkheda',
    location: 'Ahmedabad, India',
  },
  {
    id: 8,
    title: 'Prahlad Nagar',
    location: 'Ahmedabad, India',
  },
  {
    id: 9,
    title: 'Navrangpura',
    location: 'Ahmedabad, India',
  },
  {
    id: 10,
    title: 'Vadaj',
    location: 'Ahmedabad, India',
  },
];

export const friendsData = [
  {
    id: 1,
    name: 'Sonam Patel',
  },
  {
    id: 2,
    name: 'Rahul Kumar',
  },
  {
    id: 3,
    name: 'Pooja Sharma',
  },
  {
    id: 4,
    name: 'Amit Singh',
  },
  {
    id: 5,
    name: 'Divya Gupta',
  },
  {
    id: 6,
    name: 'Sandeep Verma',
  },
  {
    id: 7,
    name: 'Neha Kapoor',
  },
  {
    id: 8,
    name: 'Rajat Malhotra',
  },
  {
    id: 9,
    name: 'Priya Choudhary',
  },
  {
    id: 10,
    name: 'Vikas Reddy',
  },
];

export const colors = [
  // {id: 1, code: '#ffeeee'},
  // {id: 2, code: '#ffddee'},
  // {id: 3, code: '#ffccdd'},
  // {id: 4, code: '#ffbbcc'},
  // {id: 5, code: '#ffaacb'},
  // {id: 6, code: '#ff99ba'},
  // {id: 7, code: '#ff88a9'},
  // {id: 8, code: '#ff7798'},
  // {id: 9, code: '#ff6687'},
  // {id: 10, code: '#ff5576'},
  // {id: 11, code: '#ff4465'},
  // {id: 12, code: '#ff3354'},
  // {id: 13, code: '#ff2243'},
  // {id: 14, code: '#ff1132'},
  // {id: 15, code: '#dd0000'},
  // {id: 16, code: '#bb0000'},
  // {id: 17, code: '#990000'},
  // {id: 18, code: '#770000'},
  // {id: 19, code: '#550000'},
  // {id: 20, code: '#330000'},
  // {id: 21, code: '#110000'},
  {id: 22, code: '#ff0000'},
  {id: 23, code: '#00ff00'},
  {id: 24, code: '#0000ff'},
  {id: 25, code: '#00ffff'},
  {id: 26, code: '#ff00ff'},
  {id: 27, code: '#ffff00'},
  {id: 28, code: '#000000'},
  {id: 29, code: '#ffffff'},
  {id: 30, code: '#808080'},
  {id: 31, code: '#a52a2a'},
  {id: 32, code: '#ffA500'},
  {id: 33, code: '#ffc0cb'},
  {id: 34, code: '#800080'},
  {id: 35, code: '#8B0000'},
  {id: 37, code: '#FF8C00'},
  {id: 38, code: '#40E0D0'},
  {id: 40, code: '#98FF98'},
  {id: 41, code: '#FA8072'},
];

export const stickers = [
  'sticker1',
  'sticker2',
  'sticker3',
  'sticker4',
  'sticker5',
  'sticker6',
  'sticker7',
  'sticker8',
  'sticker9',
  'sticker10',
  'sticker11',
  'sticker12',
  'sticker13',
  'sticker14',
  'sticker15',
  'sticker16',
  'sticker17',
  'sticker18',
  'sticker19',
  'sticker20',
  'sticker21',
  'sticker22',
  'sticker23',
  'sticker24',
  'sticker25',
  'sticker26',
];

export const stickersData = [
  {
    identifier: 'custom_sticker_AUTUMN',
    name: 'AUTUMN_10',
    stickerURI:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJTMXKDa-8tDhXyxwLEeVn5_ud4wksuIR4_yIqcV8-_KeHEtXOsIm_bEXXCcGfLqpGzJY&usqp=CAU',
  },
  {
    identifier: 'custom_sticker_AUTUMN',
    name: 'AUTUMN_13',
    stickerURI:
      'https://socialmedia.digiatto.info/public/Stickers/AUTUMN_13.png',
  },
  {
    identifier: 'custom_sticker_AUTUMN',
    name: 'AUTUMN_7',
    stickerURI:
      'https://socialmedia.digiatto.info/public/Stickers/AUTUMN_7.png',
  },
  {
    identifier: 'custom_sticker_AUTUMN',
    name: 'AUTUMN_9',
    stickerURI:
      'https://socialmedia.digiatto.info/public/Stickers/AUTUMN_9.png',
  },
  {
    identifier: 'custom_sticker_AUTUMN',
    name: 'LOL_1',
    stickerURI: 'https://socialmedia.digiatto.info/public/Stickers/LOL_1.png',
  },
  {
    identifier: 'custom_sticker_AUTUMN',
    name: 'LOL_10',
    stickerURI: 'https://socialmedia.digiatto.info/public/Stickers/LOL_10.png',
  },
  {
    identifier: 'custom_sticker_AUTUMN',
    name: 'LOL_11',
    stickerURI: 'https://socialmedia.digiatto.info/public/Stickers/LOL_11.png',
  },
  {
    identifier: 'custom_sticker_AUTUMN',
    name: 'LOL_15',
    stickerURI: 'https://socialmedia.digiatto.info/public/Stickers/LOL_15.png',
  },
  {
    identifier: 'custom_sticker_AUTUMN',
    name: 'LOL_5',
    stickerURI: 'https://socialmedia.digiatto.info/public/Stickers/LOL_5.png',
  },
  {
    identifier: 'custom_sticker_AUTUMN',
    name: 'LOL_6',
    stickerURI: 'https://socialmedia.digiatto.info/public/Stickers/LOL_6.png',
  },
  {
    identifier: 'custom_sticker_AUTUMN',
    name: 'LOL_7',
    stickerURI: 'https://socialmedia.digiatto.info/public/Stickers/LOL_7.png',
  },
  {
    identifier: 'custom_sticker_AUTUMN',
    name: 'LOL_8',
    stickerURI: 'https://socialmedia.digiatto.info/public/Stickers/LOL_8.png',
  },
  {
    identifier: 'custom_sticker_AUTUMN',
    name: 'LOL_9',
    stickerURI: 'https://socialmedia.digiatto.info/public/Stickers/LOL_9.png',
  },
  {
    identifier: 'custom_sticker_SPRING_1',
    name: 'SPRING_1',
    stickerURI:
      'https://socialmedia.digiatto.info/public/Stickers/SPRING_1.png',
  },
];

export const musicData = [
  {
    identifier: 'elsewhere',
    audioURI:
      'https://socialmedia.digiatto.info/public/Music/bensound-dreams.mp3',
  },
  {
    identifier: 'elsewhere',
    audioURI:
      'https://socialmedia.digiatto.info/public/Music/bensound-happyrock.mp3',
  },
  {
    identifier: 'elsewhere',
    audioURI:
      'https://socialmedia.digiatto.info/public/Music/bensound-actionable.mp3',
  },
  {
    identifier: 'elsewhere',
    audioURI:
      'https://socialmedia.digiatto.info/public/Music/bensound-allthat.mp3',
  },
  {
    identifier: 'elsewhere',
    audioURI:
      'https://socialmedia.digiatto.info/public/Music/bensound-anewbeginning.mp3',
  },
  {
    identifier: 'elsewhere',
    audioURI:
      'https://socialmedia.digiatto.info/public/Music/bensound-dance.mp3',
  },
  {
    identifier: 'elsewhere',
    audioURI:
      'https://socialmedia.digiatto.info/public/Music/bensound-love.mp3',
  },
  {
    identifier: 'elsewhere',
    audioURI:
      'https://socialmedia.digiatto.info/public/Music/bensound-romantic.mp3',
  },
];

export const modes = [
  {id: 1, title: 'draw', Controls: ['save', 'crop', 'sticker', 'text']},
  {id: 2, title: 'text', Controls: ['save', 'crop', 'sticker', 'draw']},
  {id: 3, title: 'crop', Controls: ['save', 'sticker', 'text', 'draw']},
  {id: 4, title: 'stickers', Controls: ['save', 'crop', 'text', 'draw']},
];

export const textStyles = {
  normal: {
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecorationLine: 'none',
    color: 'white',
  },
  bold: {
    fontWeight: 'bold',
    fontStyle: 'normal',
    textDecorationLine: 'none',
    color: 'white',
  },
  italic: {
    fontWeight: 'normal',
    fontStyle: 'italic',
    textDecorationLine: 'none',
    color: 'white',
  },
  underline: {
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecorationLine: 'underline',
    color: 'white',
  },

  colored: {color: '#ff1253'},
  uppercase: {
    textTransform: 'uppercase',
    color: 'white',
    textDecorationLine: 'none',
  },
  lowercase: {
    textTransform: 'lowercase',
    color: 'white',
    textDecorationLine: 'none',
  },
};
