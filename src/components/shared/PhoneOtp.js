import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {COLORS, FONTS} from '../constants/Constants';
import CustomModal from '../utils/Modals/CustomModal';

const {width, height} = Dimensions.get('window');

const PhoneOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [verificationCode, setVerificationCode] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedInputIndex, setFocusedInputIndex] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();
  const timerRef = useRef(null);
  const textInputRefs = useRef([]);

  const colorScheme = useColorScheme();

  const phoneNumber = route.params?.phoneNumber || 'Not Provided';
  const confirmation = route.params?.confirmation;

  useEffect(() => {
    if (confirmation) {
      setVerificationCode(confirmation);
    }
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [confirmation]);

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${
      remainingSeconds < 10 ? '0' : ''
    }${remainingSeconds}`;
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      const nextInput = textInputRefs.current[index + 1];
      if (nextInput) nextInput.focus();
    }

    setIsOtpValid(newOtp.every(digit => digit.length === 1));
  };

  const handleSubmitOtp = async () => {
    const otpCode = otp.join('');
    setLoading(true);
    try {
      await verificationCode.confirm(otpCode);
      setLoading(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.navigate('Main');
      }, 2000);
    } catch (error) {
      setLoading(false);
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 2000);
    }
  };

  const handleResendOtp = () => {
    if (requestCount < 3) {
      setRequestCount(prev => prev + 1);
      setTimer(59);
      setCanResend(false);
      startTimer();
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
              colorScheme === 'dark' ? COLORS.black : COLORS.white,
            borderBottomColor:
              colorScheme === 'dark' ? COLORS.grayDark : COLORS.gray,
          },
        ]}>
        <TouchableOpacity onPress={() => navigation.goBack('Phone_Auth')}>
          <Feather
            name="chevron-left"
            size={30}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text
          style={[
            styles.title,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Send OTP Code
        </Text>
        <Text
          style={[
            styles.description,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Enter the 6-digit code sent via the phone number {phoneNumber}
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={[
                styles.otpInput,
                {
                  borderColor:
                    focusedInputIndex === index
                      ? COLORS.primary
                      : colorScheme === 'dark'
                      ? COLORS.white
                      : COLORS.dark,
                  backgroundColor:
                    colorScheme === 'dark' ? COLORS.grayDark : COLORS.white,
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              secureTextEntry={true}
              onChangeText={text => handleOtpChange(text, index)}
              ref={el => (textInputRefs.current[index] = el)}
              onFocus={() => setFocusedInputIndex(index)}
              onBlur={() => setFocusedInputIndex(null)}
            />
          ))}
        </View>

        <View style={styles.timerContainer}>
          {canResend ? null : (
            <View style={styles.timerIconContainer}>
              <View style={styles.timerIcon}>
                <Feather name="clock" size={24} color={COLORS.primary} />
              </View>
              <Text
                style={[
                  styles.timerText,
                  {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
                ]}>
                {formatTime(timer)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.resendOtpButtonContainer}>
          <TouchableOpacity onPress={handleResendOtp}>
            <Text style={styles.resendOtpButtonText}>Resend Code</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.submitButtonContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              {
                backgroundColor: isOtpValid ? COLORS.primary : COLORS.gray,
              },
            ]}
            onPress={handleSubmitOtp}
            disabled={!isOtpValid}>
            {loading ? (
              <ActivityIndicator color={COLORS.white} size={25} />
            ) : (
              <Text style={styles.submitButtonText}>Continue</Text>
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
            <Text style={styles.linkText}>Privacy Policy</Text> and{' '}
            <Text style={styles.linkText}>Terms & Conditions</Text>.
          </Text>
        </View>
      </View>

      <CustomModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        animationSource={require('../../assets/animations/success.json')}
        title="OTP Verified!"
        description="Your OTP has been successfully verified."
      />

      <CustomModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        animationSource={require('../../assets/animations/error.json')}
        title="Verification Failed"
        description="The OTP you entered is incorrect. Please try again."
      />
    </SafeAreaView>
  );
};

export default PhoneOtp;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },

  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingHorizontal: width * 0.02,
    paddingVertical: width * 0.05,
    borderBottomWidth: 2,
  },

  contentContainer: {
    marginTop: height * 0.1,
    marginLeft: width * 0.05,
  },

  title: {
    fontSize: width * 0.09,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
  },

  description: {
    fontSize: width * 0.042,
    fontFamily: FONTS.medium,
    marginTop: height * 0.02,
    marginLeft: height * 0.008,
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.9,
    marginTop: height * 0.09,
    gap: 20,
  },

  otpInput: {
    width: width * 0.125,
    height: height * 0.06,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: width * 0.06,
    textAlign: 'center',
  },

  timerContainer: {
    marginLeft: width * 0.004,
    marginTop: width * 0.05,
  },

  timerText: {
    fontSize: width * 0.04,
    fontFamily: FONTS.medium,
  },

  timerIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  timerIcon: {
    top: 1,
  },

  resendOtpButtonContainer: {
    position: 'absolute',
    top: height * 0.6,
    alignSelf: 'center',
  },

  resendOtpButtonText: {
    color: COLORS.primary,
    fontSize: width * 0.045,
    fontFamily: FONTS.bold,
  },

  submitButtonContainer: {
    top: height * 0.67,
    width: width * 0.9,
    position: 'absolute',
  },

  submitButton: {
    borderRadius: 10,
    padding: height * 0.015,
    alignItems: 'center',
    justifyContent: 'center',
  },

  submitButtonText: {
    color: COLORS.white,
    fontSize: width * 0.045,
    fontFamily: FONTS.bold,
  },

  policyContainer: {
    position: 'absolute',
    top: height * 0.75,
    marginVertical: height * 0.02,
    textAlign: 'center',
    left: width * 0.03,
  },

  policyText: {
    fontSize: width * 0.04,
    fontFamily: FONTS.semiBold,
    textAlign: 'center',
    lineHeight: height * 0.03,
  },

  linkText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
