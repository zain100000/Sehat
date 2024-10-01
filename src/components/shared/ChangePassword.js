import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS} from '../constants/Constants';
import auth from '@react-native-firebase/auth';
import CustomModal from '../utils/Modals/CustomModal';

const {width, height} = Dimensions.get('window');

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [hidePassword1, setHidePassword1] = useState(true);
  const [currentPasswordBorderColor, setCurrentPasswordBorderColor] = useState(
    COLORS.dark,
  );
  const [newPasswordBorderColor, setNewPasswordBorderColor] = useState(
    COLORS.dark,
  );
  const [submitted, setSubmitted] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  useEffect(() => {
    setIsButtonEnabled(isValidInput());
  }, [currentPassword, newPassword]);

  const isValidInput = () => {
    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;

    const isCurrentPasswordValid = passwordPattern.test(currentPassword);
    const isNewPasswordValid = passwordPattern.test(newPassword);

    return isCurrentPasswordValid && isNewPasswordValid;
  };

  const handleCurrentPasswordChange = value => {
    setCurrentPassword(value);
    setCurrentPasswordBorderColor(COLORS.dark);
  };

  const handleNewPasswordChange = value => {
    setNewPassword(value);
    setNewPasswordBorderColor(COLORS.dark);
  };

  const validateCurrentPassword = () => {
    if (!currentPassword) {
      return 'Current Password is required';
    }
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(currentPassword)) {
      return 'Current Password Must Be 6 Characters Long';
    }
    return '';
  };

  const validateNewPassword = () => {
    if (!newPassword) {
      return 'Current Password is required';
    }
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return 'New Password Must Be 6 Characters Long';
    }
    return '';
  };

  const currentPasswordError = submitted ? validateCurrentPassword() : '';
  const newPasswordError = submitted ? validateNewPassword() : '';

  const reauthenticate = currentPassword => {
    const user = auth().currentUser;
    const cred = auth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  };

  const handleChangePassword = async () => {
    setSubmitted(true);

    if (isValidInput()) {
      setLoading(true);
      setShowAuthModal(true);

      try {
        await reauthenticate(currentPassword);

        const user = auth().currentUser;
        await user.updatePassword(newPassword);

        setCurrentPassword('');
        setNewPassword('');
        setSubmitted(false);

        setShowAuthModal(false);
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
          console.log('Success modal hidden');
        }, 3000);
      } catch (error) {
        setShowAuthModal(false);
        console.error('Error occurred:', error);

        if (error.code === 'auth/wrong-password') {
          console.log('Wrong password error');
          setShowErrorModal(true);

          setTimeout(() => {
            setShowErrorModal(false);
          }, 3000);
        } else {
          setShowErrorModal(true);

          setTimeout(() => {
            setShowErrorModal(false);
          }, 3000);
        }
      } finally {
        setLoading(false);
      }
    } else {
      if (!validateCurrentPassword()) {
        setCurrentPasswordBorderColor(COLORS.errorColor);
      }

      if (!validateNewPassword()) {
        setNewPasswordBorderColor(COLORS.errorColor);
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
        <TouchableOpacity onPress={() => navigation.goBack('Home')}>
          <Feather
            name="chevron-left"
            size={30}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.headerTextContainer}>
        <Text
          style={[
            styles.headerTitleText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Change Password
        </Text>
        <Text
          style={[
            styles.headerDescriptionText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Change your account password from here.
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.PasswordContainer}>
          <Text
            style={[
              styles.label,
              {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
            ]}>
            Current Password
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={[
                styles.inputField,
                {
                  flex: 1,
                  paddingRight: 40,
                  borderColor: currentPasswordBorderColor,
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholder="Enter Your Current Password"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.white : COLORS.dark
              }
              value={currentPassword}
              secureTextEntry={hidePassword}
              onChangeText={handleCurrentPasswordChange}
              onFocus={() => setCurrentPasswordBorderColor(COLORS.primary)}
              onBlur={() => {
                if (submitted && validateCurrentPassword()) {
                  setCurrentPasswordBorderColor(COLORS.errorColor);
                } else {
                  setCurrentPasswordBorderColor(COLORS.dark);
                }
              }}
            />
            <TouchableOpacity
              style={styles.eyeIconContainer}
              onPress={() => setHidePassword(!hidePassword)}>
              <Feather
                name={hidePassword ? 'eye-off' : 'eye'}
                size={25}
                color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
              />
            </TouchableOpacity>
          </View>
          {submitted && currentPasswordError ? (
            <Text style={styles.errorText}>{currentPasswordError}</Text>
          ) : null}
        </View>

        <View style={styles.passwordContainer}>
          <Text
            style={[
              styles.label,
              {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
            ]}>
            New Password
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={[
                styles.inputField,
                {
                  flex: 1,
                  paddingRight: 40,
                  borderColor: newPasswordBorderColor,
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholder="Enter Your New Password"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.white : COLORS.dark
              }
              value={newPassword}
              secureTextEntry={hidePassword}
              onChangeText={handleNewPasswordChange}
              onFocus={() => setNewPasswordBorderColor(COLORS.primary)}
              onBlur={() => {
                if (submitted && validateCurrentPassword()) {
                  setNewPasswordBorderColor(COLORS.errorColor);
                } else {
                  setNewPasswordBorderColor(COLORS.dark);
                }
              }}
            />
            <TouchableOpacity
              style={styles.eyeIconContainer}
              onPress={() => setHidePassword1(!hidePassword1)}>
              <Feather
                name={hidePassword1 ? 'eye-off' : 'eye'}
                size={25}
                color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
              />
            </TouchableOpacity>
          </View>
          {submitted && newPasswordError ? (
            <Text style={styles.errorText}>{newPasswordError}</Text>
          ) : null}
        </View>

        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={[
              styles.changePasswordBtn,
              {
                backgroundColor: isButtonEnabled ? COLORS.primary : COLORS.gray,
              },
            ]}
            onPress={handleChangePassword}
            disabled={!isButtonEnabled}>
            <Text style={styles.ChangePasswordText}>
              {loading ? (
                <ActivityIndicator color={COLORS.white} size={25} />
              ) : (
                'Change Password'
              )}
            </Text>
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
              style={[
                styles.linkText,
                {
                  color:
                    colorScheme === 'dark' ? COLORS.primary : COLORS.primary,
                },
              ]}>
              Privacy Policy
            </Text>{' '}
            and{' '}
            <Text
              style={[
                styles.linkText,
                {
                  color:
                    colorScheme === 'dark' ? COLORS.primary : COLORS.primary,
                },
              ]}>
              Terms & Conditions
            </Text>
            .
          </Text>
        </View>
      </View>

      <CustomModal
        visible={showAuthModal}
        title="Working!"
        description="Please Wait While We're Changing Your Account Password."
        animationSource={require('../../assets/animations/email.json')}
        onClose={() => setShowAuthModal(false)}
      />

      <CustomModal
        visible={showSuccessModal}
        title="Success!"
        description="Your Account Password Has Been Changed Successfully Next Time Login With Your New Password"
        animationSource={require('../../assets/animations/success.json')}
        onClose={() => setShowSuccessModal(false)}
      />

      <CustomModal
        visible={showErrorModal}
        title="Failure!"
        description="Something Went Wrong"
        animationSource={require('../../assets/animations/error.json')}
        onClose={() => setShowErrorModal(false)}
      />
    </SafeAreaView>
  );
};

export default ChangePassword;

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

  headerTextContainer: {
    marginTop: height * 0.1,
    marginLeft: width * 0.05,
  },

  headerTitleText: {
    fontSize: width * 0.09,
    color: COLORS.dark,
    fontFamily: FONTS.bold,
  },

  headerDescriptionText: {
    color: COLORS.dark,
    fontSize: width * 0.042,
    fontFamily: FONTS.medium,
    left: width * 0.01,
  },

  formContainer: {
    marginTop: height * 0.05,
    marginHorizontal: width * 0.05,
    gap: 35,
  },

  label: {
    fontSize: width * 0.045,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
    marginBottom: height * 0.01,
  },

  inputField: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: width * 0.03,
    fontSize: width * 0.045,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
  },

  eyeIconContainer: {
    position: 'absolute',
    right: width * 0.03,
  },

  btnContainer: {
    position: 'absolute',
    top: height * 0.3,
    width: '100%',
  },

  changePasswordBtn: {
    width: '100%',
    alignItems: 'center',
    padding: height * 0.015,
    top: height * 0.035,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },

  ChangePasswordText: {
    fontSize: width * 0.045,
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
  },

  errorText: {
    position: 'absolute',
    bottom: -25,
    fontSize: width * 0.04,
    color: COLORS.errorColor,
    fontFamily: FONTS.regular,
    paddingHorizontal: 5,
  },

  policyContainer: {
    position: 'absolute',
    top: height * 0.6,
    marginVertical: height * 0.02,
    alignSelf: 'center',
  },

  policyText: {
    fontSize: width * 0.04,
    fontFamily: FONTS.semiBold,
    textAlign: 'center',
    lineHeight: height * 0.03,
  },

  linkText: {
    fontWeight: 'bold',
  },
});
