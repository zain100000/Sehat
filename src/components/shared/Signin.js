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
  Image,
  useColorScheme,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS} from '../constants/Constants';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import CustomModal from '../utils/Modals/CustomModal';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const {width, height} = Dimensions.get('window');

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [emailBorderColor, setEmailBorderColor] = useState(COLORS.dark);
  const [passwordBorderColor, setPasswordBorderColor] = useState(COLORS.dark);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showGoogleAuthModal, setShowGoogleAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  useEffect(() => {
    setIsButtonEnabled(isValidInput());
  }, [email, password]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '327854250979-s98li6vrke595sgnbdkdrq7gl3hck5tv.apps.googleusercontent.com',
    });
  }, []);

  const isValidInput = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;

    const isEmailValid = emailPattern.test(email);
    const isPasswordValid = passwordPattern.test(password);

    return isEmailValid && isPasswordValid;
  };

  const handleEmailChange = value => {
    setEmail(value);
    setEmailBorderColor(COLORS.dark);
  };

  const handlePasswordChange = value => {
    setPassword(value);
    setPasswordBorderColor(COLORS.dark);
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

  const emailError = submitted ? validateEmail() : '';
  const passwordError = submitted ? validatePassword() : '';

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setShowGoogleAuthModal(true);
      await GoogleSignin.signOut();

      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const result = await auth().signInWithCredential(googleCredential);

      const user = result.user;

      const userRef = firestore().collection('app_users').doc(user.uid);
      const doc = await userRef.get();

      if (!doc.exists) {
        await userRef.set({
          name: user.displayName,
          email: user.email,
          createdAt: Date.now(),
        });
      }

      setShowGoogleAuthModal(false);

      setTimeout(() => {
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.replace('Main');
        }, 2000);
      }, 500);
    } catch (error) {
      console.log(error);
      setShowGoogleAuthModal(false);
      setShowErrorModal(true);

      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setGoogleLoading(false); // Ensure to stop loading
    }
  };

  const handleLogin = async () => {
    setSubmitted(true);

    if (isValidInput()) {
      setLoading(true);
      setShowAuthModal(true);

      try {
        await auth().signInWithEmailAndPassword(email, password);

        setEmail('');
        setPassword('');
        setSubmitted(false);

        setShowAuthModal(false);
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.replace('Main');
        }, 3000);
      } catch (error) {
        setShowAuthModal(false);

        if (error.code === 'auth/user-not-found') {
          setShowErrorModal(true);

          setTimeout(() => {
            setShowErrorModal(false);
          }, 3000);
        } else if (error.code === 'auth/wrong-password') {
          setShowErrorModal(true);

          setTimeout(() => {
            setShowErrorModal(false);
          }, 3000);
        } else {
          setShowErrorModal(true);
        }
      } finally {
        setLoading(false); // Ensure to stop loading
      }
    } else {
      if (validateEmail()) {
        setEmailBorderColor(COLORS.errorColor);
      }

      if (validatePassword()) {
        setPasswordBorderColor(COLORS.errorColor);
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
          Welcome Back
        </Text>
        <Text
          style={[
            styles.welcomeDescriptionText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Please enter a form to login this app.
        </Text>
      </View>

      <View style={styles.formContainer}>
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
              colorScheme === 'dark' ? COLORS.white : COLORS.dark
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
                colorScheme === 'dark' ? COLORS.white : COLORS.dark
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

        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Forgot_Password')}>
            <Text
              style={[
                styles.forgotPasswordText,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.primary},
              ]}>
              Forgot Password
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.authButtonContainer}>
          <TouchableOpacity
            style={styles.phoneButtonContainer}
            onPress={() => navigation.navigate('Phone_Auth')}>
            <Image
              source={require('../../assets/png/phone-icon.png')}
              style={styles.icon}
            />
            <Text style={styles.phoneButtonText}>
              Continue with Phone Number
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.googleButtonContainer}
            onPress={handleGoogleSignIn}
            disabled={googleLoading}>
            {googleLoading ? (
              <ActivityIndicator
                size={25}
                color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
              />
            ) : (
              <>
                <Image
                  source={require('../../assets/png/google-icon.png')}
                  style={styles.icon}
                />
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={[
              styles.signinBtn,
              {
                backgroundColor: isButtonEnabled ? COLORS.primary : COLORS.gray,
              },
            ]}
            onPress={handleLogin}
            disabled={!isButtonEnabled}>
            <Text style={styles.signinText}>
              {loading ? (
                <ActivityIndicator color={COLORS.white} size={25} />
              ) : (
                'Sign In'
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
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.extraText}>Sign Up</Text>
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
        visible={showGoogleAuthModal}
        onClose={() => setShowGoogleAuthModal(false)}
        animationSource={require('../../assets/animations/google.json')}
        title="Trying To Login!"
        description="Please Wait while we're trying to login with your Google account."
      />

      <CustomModal
        visible={showSuccessModal}
        title="Success!"
        description="Login Successfully"
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

export default Signin;

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

  forgotPasswordContainer: {
    top: height * 0.02,
  },

  forgotPasswordText: {
    fontSize: width * 0.035,
    textAlign: 'right',
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
  },

  authButtonContainer: {
    flexDirection: 'column',
    paddingHorizontal: width * 0.02,
    gap: height * 0.02,
    marginTop: height * 0.02,
  },

  phoneButtonContainer: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: height * 0.018,
    width: '100%',
    gap: 10,
  },

  phoneButtonText: {
    color: COLORS.white,
    fontSize: width * 0.035,
    fontFamily: FONTS.bold,
  },

  googleButtonContainer: {
    backgroundColor: COLORS.gray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: height * 0.018,
    width: '100%',
    gap: 10,
  },

  googleButtonText: {
    color: COLORS.primary,
    fontSize: width * 0.035,
    fontFamily: FONTS.bold,
  },

  icon: {
    resizeMode: 'contain',
    width: width * 0.08,
    height: height * 0.03,
    top: 2,
  },

  btnContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
  },

  signinBtn: {
    width: '100%',
    alignItems: 'center',
    padding: height * 0.015,
    top: height * 0.035,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },

  signinText: {
    fontSize: width * 0.045,
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
  },

  extraContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    top: height * 0.085,
    padding: height * 0.05,
    gap: 20,
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
