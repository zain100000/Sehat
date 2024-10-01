import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS} from '../constants/Constants';

const {width, height} = Dimensions.get('window');

const AppUsage = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

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
          Terms of Usage
        </Text>
        <Text
          style={[
            styles.headerDescriptionText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Please read the terms below carefully.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text
          style={[
            styles.heading,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          General Terms
        </Text>
        <Text
          style={[
            styles.description,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          By using the Sehat app, you agree to the following terms and
          conditions. Please ensure that you use the app responsibly and for its
          intended purpose only.
        </Text>

        <View style={styles.bulletContainer}>
          <Feather
            name="check-circle"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            You must be 18 years or older to use the app.
          </Text>
        </View>

        <View style={styles.bulletContainer}>
          <Feather
            name="check-circle"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            The app should only be used to book legitimate appointments with
            healthcare professionals.
          </Text>
        </View>

        <View style={styles.bulletContainer}>
          <Feather
            name="check-circle"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            You agree to provide accurate information while using
            the app.
          </Text>
        </View>

        <Text
          style={[
            styles.heading,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          User Responsibilities
        </Text>
        <Text
          style={[
            styles.description,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          As a user of Sehat, you are responsible for your actions within the
          app. Misuse of the app, providing false information, or abusing its
          features could lead to suspension or termination of your account.
        </Text>

        <View style={styles.bulletContainer}>
          <Feather
            name="shield"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            Protect your account credentials and do not share them with others.
          </Text>
        </View>

        <View style={styles.bulletContainer}>
          <Feather
            name="alert-circle"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            Notify us immediately if you suspect any unauthorized access to your
            account.
          </Text>
        </View>

        <Text
          style={[
            styles.heading,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          Medical Advice Disclaimer
        </Text>
        <Text
          style={[
            styles.description,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          Sehat is a platform for booking appointments and virtual consultations
          with healthcare providers. The app is not a substitute for
          professional medical advice. Always consult your doctor for medical
          issues and treatment.
        </Text>

        <View style={styles.bulletContainer}>
          <Feather
            name="activity"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            Information provided on the app should not be used to diagnose or
            treat health problems without consulting a healthcare provider.
          </Text>
        </View>

        <View style={styles.bulletContainer}>
          <Feather
            name="help-circle"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            Always verify the information provided by medical professionals
            before acting upon it.
          </Text>
        </View>

        <Text
          style={[
            styles.heading,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          Data Privacy
        </Text>
        <Text
          style={[
            styles.description,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          Your data privacy is important to us. We collect and store data
          according to our privacy policy. You can review how we use your data
          within the app.
        </Text>

        <View style={styles.bulletContainer}>
          <Feather
            name="lock"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            We ensure the confidentiality of your personal health information.
          </Text>
        </View>

        <View style={styles.bulletContainer}>
          <Feather
            name="user-check"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            You have control over your personal data and can request its
            deletion at any time.
          </Text>
        </View>

        <Text
          style={[
            styles.heading,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          Contact Us
        </Text>
        <Text
          style={[
            styles.description,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          If you have any queries or concerns regarding these terms, feel free
          to contact us at:
        </Text>
        <View style={styles.contactContainer}>
          <Feather
            name="mail"
            size={20}
            color={COLORS.primary}
            style={styles.contactIcon}
          />
          <Text
            style={[
              styles.contactText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            sehat@gmail.com
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppUsage;

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

  scrollContainer: {
    paddingTop: height * 0.025,
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

  contentContainer: {
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.03,
    marginTop: height * 0.02,
  },

  heading: {
    fontSize: width * 0.06,
    fontFamily: FONTS.semiBold,
    marginVertical: height * 0.02,
  },

  description: {
    fontSize: width * 0.045,
    fontFamily: FONTS.regular,
    marginBottom: height * 0.02,
    lineHeight: width * 0.06,
    width:width * 0.9
  },

  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },

  bulletIcon: {
    marginRight: width * 0.025,
  },

  bulletText: {
    fontSize: width * 0.045,
    fontFamily: FONTS.regular,
    lineHeight: width * 0.06,
    width: width * 0.85
  },

  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.03,
  },

  contactIcon: {
    marginRight: width * 0.03,
  },

  contactText: {
    fontSize: width * 0.045,
    fontFamily: FONTS.regular,
    lineHeight: width * 0.06,
  },
});
