import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import CountryPicker from 'react-native-country-picker-modal';
import {COLORS, FONTS} from '../constants/Constants';
import auth from '@react-native-firebase/auth';

const {width, height} = Dimensions.get('window');

const PhoneAuth = () => {
  const [countryCode, setCountryCode] = useState('PK');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const handleSelectCountry = country => {
    setCountryCode(country.cca2);
    validatePhoneNumber(phoneNumber, country.cca2);
  };

  const validatePhoneNumber = (number, code) => {
    const minLength = getMinPhoneNumberLength(code);
    const maxLength = getMaxPhoneNumberLength(code);
    const length = number.length;
    const isValid = length >= minLength && length <= maxLength;
    setIsValidPhoneNumber(isValid);
  };

  const getCountryCallingCode = countryCode => {
    const callingCodes = {
      US: '+1',
      AF: '+93',
      PK: '+92',
    };
    return callingCodes[countryCode] || '';
  };

  const getMinPhoneNumberLength = countryCode => {
    const minLengths = {
      US: 10,
      PK: 10,
    };
    return minLengths[countryCode] || 10;
  };

  const getMaxPhoneNumberLength = countryCode => {
    const maxLengths = {
      US: 10,
      PK: 11,
    };
    return maxLengths[countryCode] || 11;
  };

  const handleContinue = async () => {
    if (isValidPhoneNumber) {
      const fullPhoneNumber = `${getCountryCallingCode(
        countryCode,
      )}${phoneNumber}`;

      try {
        setLoading(true);
        const confirmation = await auth().signInWithPhoneNumber(
          fullPhoneNumber,
        );
        navigation.navigate('Phone_Otp', {
          phoneNumber: fullPhoneNumber,
          confirmation,
        });

        setPhoneNumber('');
      } catch (error) {
        console.error('Error during phone authentication:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.primaryContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
        },
      ]}>
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor:
              colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
          },
        ]}>
        <TouchableOpacity onPress={() => navigation.goBack('Auth')}>
          <Feather
            name="chevron-left"
            size={30}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.welcomeContainer}>
        <Text
          style={[
            styles.welcomeTitleText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Register
        </Text>
        <Text
          style={[
            styles.welcomeDescriptionText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Please enter your number to continue your registration.
        </Text>
      </View>

      <View style={styles.phoneInputContainer}>
        <Text
          style={[
            styles.phoneInputText,
            {
              color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
            },
          ]}>
          Phone Number
        </Text>
        <View
          style={[
            styles.inputContainer,
            {
              borderColor: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
            },
          ]}>
          <CountryPicker
            withFilter
            withFlag
            withAlphaFilter
            withCallingCode
            countryCode={countryCode}
            onSelect={handleSelectCountry}
            containerButtonStyle={styles.countryPickerButton}
          />
          <TextInput
            style={styles.phoneNumberInput}
            placeholder="Enter your phone number"
            placeholderTextColor={
              colorScheme === 'dark' ? COLORS.white : COLORS.dark
            }
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={text => {
              setPhoneNumber(text);
              validatePhoneNumber(text, countryCode);
            }}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButtonContainer,
            {
              backgroundColor: isValidPhoneNumber
                ? COLORS.primary
                : COLORS.gray,
            },
          ]}
          onPress={handleContinue}
          disabled={!isValidPhoneNumber}>
          {loading ? (
            <ActivityIndicator size={25} color={COLORS.white} />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.policyContainer}>
        <Text
          style={[
            styles.policyText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          By signing up or logging in, I accept the app{' '}
          <Text
            onPress={() => navigation.navigate('Privacy_Policy')}
            style={[
              styles.linkText,
              {color: colorScheme === 'dark' ? COLORS.primary : COLORS.primary},
            ]}>
            Privacy Policy
          </Text>{' '}
          and{' '}
          <Text
            onPress={() => navigation.navigate('Terms')}
            style={[
              styles.linkText,
              {color: colorScheme === 'dark' ? COLORS.primary : COLORS.primary},
            ]}>
            Terms & Conditions
          </Text>
          .
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default PhoneAuth;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: width * 0.02,
    paddingVertical: width * 0.05,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gray,
  },

  welcomeContainer: {
    marginTop: height * 0.1,
    marginLeft: width * 0.05,
  },

  welcomeTitleText: {
    fontSize: width * 0.09,
    color: COLORS.dark,
    fontFamily: FONTS.bold,
  },

  welcomeDescriptionText: {
    color: COLORS.dark,
    fontSize: width * 0.042,
    fontFamily: FONTS.medium,
  },

  phoneInputContainer: {
    marginTop: height * 0.05,
    marginLeft: width * 0.05,
  },

  phoneInputText: {
    fontSize: width * 0.05,
    color: COLORS.dark,
    fontFamily: FONTS.semiBold,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.dark,
    borderRadius: width * 0.03,
    paddingHorizontal: width * 0.02,
    backgroundColor: COLORS.lightGray,
    marginTop: height * 0.02,
    marginRight: height * 0.02,
  },

  countryPickerButton: {
    flex: 1,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.02,
    borderRightWidth: 1,
    borderRightColor: COLORS.gray,
  },

  phoneNumberInput: {
    flex: 1,
    fontSize: width * 0.045,
    color: COLORS.dark,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: width * 0.03,
  },

  buttonContainer: {
    position: 'absolute',
    bottom: height * 0.12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: width * 0.05,
    gap: width * 0.03,
  },

  continueButtonContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: height * 0.018,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.9,
  },

  continueButtonText: {
    color: COLORS.white,
    fontSize: width * 0.045,
    fontFamily: FONTS.bold,
  },

  policyContainer: {
    position: 'absolute',
    bottom: height * 0.01,
    marginVertical: height * 0.02,
    paddingHorizontal: width * 0.08,
    alignSelf: 'center',
  },

  policyText: {
    fontSize: width * 0.04,
    fontFamily: FONTS.semiBold,
    lineHeight: height * 0.03,
    textAlign: 'center',
  },

  linkText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
