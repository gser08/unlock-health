import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

const DONATION_KEY = '@unlock_health_last_donation';

// List of dummy brands for the October month simulation
const OCTOBER_BRANDS = [
  "Fundayuda Directo", "Coca-Cola", "Nike Solidario", "Banco General", "Copa Airlines", 
  "Nestlé", "Tigo", "Samsung", "Cochez", "Super 99", "Rey", "McDonald's", "Doit Center",
  "Naturgy", "TBA", "TBA", "TBA", "TBA", "TBA", "TBA", "TBA", "TBA", "TBA", "TBA", "TBA",
  "TBA", "TBA", "TBA", "TBA", "TBA", "Fundayuda Cierre"
];

export const isOctober = () => {
  const currentMonth = new Date().getMonth();
  return currentMonth === 9; // 0-indexed, so 9 is October
};

export const getBrandForToday = () => {
  const dayOfMonth = new Date().getDate(); // 1-31
  return OCTOBER_BRANDS[dayOfMonth - 1] || "Solidarity Partner";
};

// Use Android ID or iOS Vendor ID to have a stable Device token
export const getDeviceId = async () => {
  if (Platform.OS === 'android') {
    return Application.getAndroidId();
  } else {
    return await Application.getIosIdForVendorAsync();
  }
};

export const checkCanDonateToday = async (): Promise<boolean> => {
  if (!isOctober()) {
    // For V1, the app only does donations in October
    return false;
  }
  
  try {
    const lastDonationDateString = await AsyncStorage.getItem(DONATION_KEY);
    if (!lastDonationDateString) return true;

    const todayString = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    return lastDonationDateString !== todayString;
    
  } catch (e) {
    console.error("Failed to read donation status", e);
    return false;
  }
};

export const registerDonation = async (): Promise<boolean> => {
  try {
    const todayString = new Date().toISOString().split('T')[0];
    await AsyncStorage.setItem(DONATION_KEY, todayString);
    // In a real app we would fire an API request to the backend with getDeviceId() 
    return true;
  } catch (e) {
    console.error("Failed to register donation", e);
    return false;
  }
};
