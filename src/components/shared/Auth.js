import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import {COLORS, FONTS} from '../constants/Constants';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import CustomModal from '../utils/Modals/CustomModal';

const {width, height} = Dimensions.get('window');

const Auth = () => {
  const [showGoogleAuthModal, setShowGoogleAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '327854250979-s98li6vrke595sgnbdkdrq7gl3hck5tv.apps.googleusercontent.com',
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
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

      setLoading(false);
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
      <View style={styles.headerImageContainer}>
        <Image
          source={require('../../assets/authScreen/auth.png')}
          style={styles.headerImage}
        />
      </View>

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Si - Sehat
        </Text>
        <Text
          style={[
            styles.description,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Begin your journey to better health!
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.phoneButtonContainer,
            {
              backgroundColor:
                colorScheme === 'dark' ? COLORS.primary : COLORS.primary,
            },
          ]}
          onPress={() => navigation.navigate('Phone_Auth')}>
          <Image
            source={require('../../assets/png/phone-icon.png')}
            style={styles.icon}
          />
          <Text
            style={[
              styles.phoneButtonText,
              {color: colorScheme === 'dark' ? COLORS.white : COLORS.white},
            ]}>
            Continue with Phone Number
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.googleButtonContainer,
            {
              backgroundColor:
                colorScheme === 'dark' ? COLORS.gray : COLORS.gray,
            },
          ]}
          onPress={handleGoogleSignIn}>
          {loading ? (
            <ActivityIndicator size={25} color={COLORS.dark} />
          ) : (
            <>
              <Image
                source={require('../../assets/png/google-icon.png')}
                style={styles.icon}
              />

              <Text
                style={[
                  styles.googleButtonText,
                  {
                    color:
                      colorScheme === 'dark' ? COLORS.primary : COLORS.primary,
                  },
                ]}>
                Sign in with Google
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.extraContainer}>
        <View style={styles.signinContainer}>
          <Text
            style={{
              fontSize: width * 0.04,
              color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
              fontFamily: FONTS.semiBold,
            }}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
            <Text
              style={[
                styles.extraText,
                {
                  color:
                    colorScheme === 'dark' ? COLORS.primary : COLORS.primary,
                },
              ]}>
              Signin
            </Text>
          </TouchableOpacity>
        </View>
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
              {
                color: colorScheme === 'dark' ? COLORS.primary : COLORS.primary,
              },
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

      <CustomModal
        visible={showGoogleAuthModal}
        onClose={() => setShowGoogleAuthModal(false)}
        animationSource={require('../../assets/animations/google.json')}
        title="Trying To Login!"
        description="Please wait while we're trying to log you in with your Google account."
      />

      <CustomModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        animationSource={require('../../assets/animations/success.json')}
        title="Success!"
        description="Your account has been created successfully."
      />

      <CustomModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        animationSource={require('../../assets/animations/error.json')}
        title="Login Failed"
        description="There was an error during the login process. Please try again."
      />
    </SafeAreaView>
  );
};

export default Auth;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },

  headerImage: {
    width: '100%',
    height: height * 0.35,
    resizeMode: 'cover',
  },

  textContainer: {
    top: height * 0.02,
  },

  title: {
    fontSize: width * 0.07,
    fontFamily: FONTS.semiBold,
    left: width * 0.06,
    marginBottom: height * 0.015,
  },

  description: {
    fontSize: width * 0.035,
    left: width * 0.065,
    fontFamily: FONTS.medium,
    width: width * 0.9,
  },

  buttonContainer: {
    flexDirection: 'column',
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.08,
    gap: 20,
  },

  phoneButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: height * 0.018,
    width: '100%',
    gap: 10,
  },

  phoneButtonText: {
    fontSize: width * 0.035,
    fontFamily: FONTS.bold,
  },

  googleButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: height * 0.018,
    width: '100%',
    gap: 10,
  },

  googleButtonText: {
    fontSize: width * 0.035,
    fontFamily: FONTS.bold,
  },

  icon: {
    resizeMode: 'contain',
    width: width * 0.08,
    height: height * 0.03,
    top: 2,
  },

  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: height * 0.01,
    padding: height * 0.02,
  },

  extraText: {
    fontSize: width * 0.04,
    fontFamily: FONTS.semiBold,
  },

  policyContainer: {
    position: 'absolute',
    bottom: height * 0.01,
    marginVertical: height * 0.02,
    paddingHorizontal: width * 0.08,
    alignSelf:'center'
  },

  policyText: {
    fontSize: width * 0.04,
    fontFamily: FONTS.semiBold,
    lineHeight: height * 0.03,
    textAlign:'center'
  },

  linkText: {
    fontWeight: 'bold',
  },
});
