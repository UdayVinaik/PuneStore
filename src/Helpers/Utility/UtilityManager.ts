import AsyncStorage from "@react-native-async-storage/async-storage";

export function validateName(name: string) {
    // Regular expression to match alphabets, spaces, hyphens, and apostrophes
    const regex = /^[a-zA-Z'-]+(?:\s+[a-zA-Z'-]+)*$/;
    
    return regex.test(name);
}

export function isPositiveInteger(number: number) {
    // Check if the number is a finite number
    if (!Number.isFinite(number)) {
      return false;
    }
  
    // Check if the number is greater than zero and an integer
    return number > 0 && Number.isInteger(number);
}

export function isPositive(number: number) {
    return number > 0;
}

export function isNonEmpty(value: any) {
    // Check if the value is not null, undefined, an empty string, or an empty array
    return value !== null && value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0);
}

export const storeDataInAsyncStorage = async (key: string, value: any) => {
    try {
        if (typeof value === 'object') {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue)
        }
        else {
            await AsyncStorage.setItem(key, value);
        }
    } catch(error) {
        console.log('Error =', error);
    }
}

export const getDataFromAsyncStorage = async (key: string, isJsonData?: boolean) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null && !isJsonData) {
            return value;
        }
        else if (isJsonData && value !== null) {
            return JSON.parse(value);
        }
        else return null;

    } catch(error) {
        console.log('Error =', error);
    }
}

export function validateUid(input: string) {
    // Check if input is a string
    if (typeof input !== 'string') {
        return false;
    }

    // Check if the length is 16 characters
    if (input.length !== 16) {
        return false;
    }

    // Check if the first 3 characters are alphabets
    if (!/^[a-zA-Z]{3}/.test(input)) {
        return false;
    }

    // Check if the rest 13 characters are numbers
    if (!/^\d{13}$/.test(input.substr(3))) {
        return false;
    }

    // If all conditions pass, return true
    return true;
}

  