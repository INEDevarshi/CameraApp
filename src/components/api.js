// api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

const BASE_URL = 'https://socialmedia.digiatto.info/public/api';

const device_id = DeviceInfo.getUniqueId();
console.log('device_id in api',device_id);

export const loginUser = async (device_id) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        device_id: '127.0.0.1',
      });
  
      // Save response data in AsyncStorage
      await AsyncStorage.setItem('userdevice_id', response.data.device_id);
      console.log('success logging in userToken:', userdevice_id);

      // Return the response data
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
};

// Function to get stored user token from AsyncStorage
export const getUserToken = async () => {
    try {
      const userdevice_id = await AsyncStorage.getItem('userdevice_id');
      return userdevice_id;
    } catch (error) {
      console.error('Error getting user token:', error);
      throw error;
    }
  };
  
  // Function to clear user token from AsyncStorage (logout)
  export const clearUserToken = async () => {
    try {
      await AsyncStorage.removeItem('userdevice_id');
    } catch (error) {
      console.error('Error clearing user token:', error);
      throw error;
    }
  };

export default api;
// Add more API functions as needed
