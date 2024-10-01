import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS} from '../constants/Constants';
import CustomModal from '../utils/Modals/CustomModal';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const {width, height} = Dimensions.get('window');

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [hidePassword1, setHidePassword1] = useState(true);
  const [nameBorderColor, setNameBorderColor] = useState(COLORS.dark);
  const [emailBorderColor, setEmailBorderColor] = useState(COLORS.dark);
  const [passwordBorderColor, setPasswordBorderColor] = useState(COLORS.dark);
  const [confirmPasswordBorderColor, setConfirmPasswordBorderColor] = useState(
    COLORS.dark,
  );
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordStrengthColor, setPasswordStrengthColor] = useState(
    COLORS.dark,
  );
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserExistsModal, setShowUserExistsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  useEffect(() => {
    setIsButtonEnabled(isValidInput());
  }, [fullName, email, password, confirmPassword]);

  const isValidInput = () => {
    const fullNamePattern = /^[a-zA-Z\s]*$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;

    const isFullNameValid = fullNamePattern.test(fullName);
    const isEmailValid = emailPattern.test(email);
    const isPasswordValid = passwordPattern.test(password);
    const isConfirmPasswordValid = password === confirmPassword;

    return (
      isFullNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    );
  };

  const handleFullNameChange = value => {
    setFullName(value);
    setNameBorderColor(COLORS.dark);
  };

  const handleEmailChange = value => {
    setEmail(value);
    setEmailBorderColor(COLORS.dark);
  };

  const handlePasswordChange = value => {
    setPassword(value);
    setPasswordBorderColor(COLORS.dark);
    checkPasswordStrength(value);
  };

  const checkPasswordStrength = password => {
    const strongPasswordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    const averagePasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (strongPasswordRegex.test(password)) {
      setPasswordStrength('Strong');
      setPasswordStrengthColor(COLORS.strongColor);
    } else if (averagePasswordRegex.test(password)) {
      setPasswordStrength('Normal');
      setPasswordStrengthColor(COLORS.averageColor);
    } else {
      setPasswordStrength('Weak');
      setPasswordStrengthColor(COLORS.weakColor);
    }
  };

  const handleConfirmPasswordChange = value => {
    setConfirmPassword(value);
    setConfirmPasswordBorderColor(COLORS.dark);
  };

  const validateFullName = () => {
    const regex = /^[a-zA-Z\s]+$/;
    if (!fullName || !regex.test(fullName)) {
      return 'Please Enter Your Name';
    }
    return '';
  };

  const validateEmail = () => {
    if (!email) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Error email format';
    }
    return '';
  };

  const validatePassword = () => {
    if (!password) {
      return 'Password is required';
    }
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return 'Password Must Be 8 Characters Long';
    }
    return '';
  };

  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      return 'Please confirm your password';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return '';
  };

  const fullNameError = submitted ? validateFullName() : '';
  const emailError = submitted ? validateEmail() : '';
  const passwordError = submitted ? validatePassword() : '';
  const confirmPasswordError = submitted ? validateConfirmPassword() : '';

  const handleRegister = async () => {
    setSubmitted(true);

    if (isValidInput()) {
      setLoading(true);
      setShowAuthModal(true);

      try {
        const methods = await auth().fetchSignInMethodsForEmail(email);

        if (methods.length !== 0) {
          setShowAuthModal(false);
          setShowUserExistsModal(true);

          setTimeout(() => {
            setShowUserExistsModal(false);
          }, 3000);

          setLoading(false);
          return;
        }

        const {user} = await auth().createUserWithEmailAndPassword(
          email,
          password,
        );

        const appUser = {
          uid: user.uid,
          name: fullName,
          email: email,
          createdAt: Date.now(),
        };

        await user.updateProfile({displayName: fullName});
        await firestore().collection('app_users').doc(user.uid).set(appUser);

        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setSubmitted(false);

        setShowAuthModal(false);
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.replace('Signin');
        }, 3000);
      } catch (error) {
        setShowAuthModal(false);

        if (error.code === 'auth/email-already-in-use') {
          setShowUserExistsModal(true);

          setTimeout(() => {
            setShowUserExistsModal(false);
          }, 3000);
        } else {
          setShowErrorModal(true);
        }
      } finally {
        setLoading(false);
      }
    } else {
      if (validateFullName()) {
        setNameBorderColor(COLORS.errorColor);
      }

      if (validateEmail()) {
        setEmailBorderColor(COLORS.errorColor);
      }

      if (validatePassword()) {
        setPasswordBorderColor(COLORS.errorColor);
      }

      if (validateConfirmPassword()) {
        setConfirmPasswordBorderColor(COLORS.errorColor);
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
          Please enter a form to continue the register.
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.nameContainer}>
          <Text
            style={[
              styles.label,
              {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
            ]}>
            Email
          </Text>
          <TextInput
            style={[
              styles.inputField,
              {
                borderColor: nameBorderColor,
                color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
              },
            ]}
            placeholder="Enter Your Full Name"
            placeholderTextColor={
              colorScheme === 'dark' ? COLORS.gray : COLORS.dark
            }
            keyboardType="name-phone-pad"
            value={fullName}
            onFocus={() => setNameBorderColor(COLORS.primary)}
            onBlur={() => {
              if (submitted && validateFullName()) {
                setNameBorderColor(COLORS.errorColor);
              } else {
                setNameBorderColor(COLORS.dark);
              }
            }}
            onChangeText={handleFullNameChange}
          />
          {submitted && fullNameError ? (
            <Text style={styles.errorText}>{fullNameError}</Text>
          ) : null}
        </View>

        <View style={styles.emailContainer}>
          <Text
            style={[
              styles.label,
              {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
            ]}>
            Email
          </Text>
          <TextInput
            style={[
              styles.inputField,
              {
                borderColor: emailBorderColor,
                color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
              },
            ]}
            placeholder="Enter Your Email"
            placeholderTextColor={
              colorScheme === 'dark' ? COLORS.gray : COLORS.dark
            }
            keyboardType="email-address"
            value={email}
            onFocus={() => setEmailBorderColor(COLORS.primary)}
            onBlur={() => {
              if (submitted && validateEmail()) {
                setEmailBorderColor(COLORS.errorColor);
              } else {
                setEmailBorderColor(COLORS.dark);
              }
            }}
            onChangeText={handleEmailChange}
          />
          {submitted && emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
        </View>

        <View style={styles.passwordContainer}>
          <Text
            style={[
              styles.label,
              {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
            ]}>
            Password
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={[
                styles.inputField,
                {
                  flex: 1,
                  paddingRight: 40,
                  borderColor: passwordBorderColor,
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholder="Enter Your Password"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.dark
              }
              value={password}
              secureTextEntry={hidePassword}
              onChangeText={handlePasswordChange}
              onFocus={() => setPasswordBorderColor(COLORS.primary)}
              onBlur={() => {
                if (submitted && validatePassword()) {
                  setPasswordBorderColor(COLORS.errorColor);
                } else {
                  setPasswordBorderColor(COLORS.dark);
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
          {submitted && passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
        </View>

        <View style={styles.confirmPasswordContainer}>
          <Text
            style={[
              styles.label,
              {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
            ]}>
            Confirm Password
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={[
                styles.inputField,
                {
                  flex: 1,
                  paddingRight: 40,
                  borderColor: confirmPasswordBorderColor,
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholder="Confirm Your Password"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.dark
              }
              value={confirmPassword}
              secureTextEntry={hidePassword1}
              onChangeText={handleConfirmPasswordChange}
              onFocus={() => setConfirmPasswordBorderColor(COLORS.primary)}
              onBlur={() => {
                if (submitted && validatePassword()) {
                  setConfirmPasswordBorderColor(COLORS.errorColor);
                } else {
                  setConfirmPasswordBorderColor(COLORS.dark);
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
          {submitted && confirmPasswordError ? (
            <Text style={styles.errorText}>{confirmPasswordError}</Text>
          ) : null}
        </View>

        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={[
              styles.signupBtn,
              {
                backgroundColor: isButtonEnabled ? COLORS.primary : COLORS.gray,
              },
            ]}
            onPress={handleRegister}
            disabled={!isButtonEnabled}>
            <Text style={styles.signupText}>
              {loading ? (
                <ActivityIndicator color={COLORS.white} size={25} />
              ) : (
                'Sign up'
              )}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.extraContainer}>
          <Text
            style={{
              fontSize: width * 0.04,
              color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
              fontFamily: FONTS.bold,
            }}>
            I have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
            <Text style={styles.extraText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>

      <CustomModal
        visible={showAuthModal}
        title="Working!"
        description="Please Wait While Creating Your Account."
        animationSource={require('../../assets/animations/email.json')}
        onClose={() => setShowAuthModal(false)}
      />

      <CustomModal
        visible={showUserExistsModal}
        title="Email Occupied!"
        description="User is already exists within this email"
        animationSource={require('../../assets/animations/alert.json')}
        onClose={() => setShowUserExistsModal(false)}
      />

      <CustomModal
        visible={showSuccessModal}
        title="Success!"
        description="Your Account Has Been Created Successfully"
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

export default Signup;

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
    left: width * 0.01,
  },

  formContainer: {
    marginTop: height * 0.02,
    marginHorizontal: width * 0.05,
    gap: 30,
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
    bottom: 60,
    width: '100%',
  },

  signupBtn: {
    width: '100%',
    alignItems: 'center',
    padding: height * 0.015,
    top: height * 0.035,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },

  signupText: {
    fontSize: width * 0.045,
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
  },

  extraContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    top: height * 0.08,
    padding: height * 0.05,
  },

  extraText: {
    fontSize: width * 0.045,
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },

  errorText: {
    position: 'absolute',
    bottom: -25,
    fontSize: width * 0.04,
    color: COLORS.errorColor,
    fontFamily: FONTS.regular,
    paddingHorizontal: 5,
  },
});
