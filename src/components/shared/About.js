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

const About = () => {
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
          About Sehat
        </Text>
        <Text
          style={[
            styles.headerDescriptionText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Your trusted healthcare assistant.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text
          style={[
            styles.heading,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          What We Offer
        </Text>
        <Text
          style={[
            styles.description,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          Sehat makes healthcare easier and more accessible. With just a few
          taps, you can:
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
            Book appointments with specialists in seconds
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
            Receive reminders and notifications for upcoming appointments
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
            Access virtual consultations from the comfort of your home
          </Text>
        </View>

        <Text
          style={[
            styles.heading,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          Key Features
        </Text>
        <View style={styles.bulletContainer}>
          <Feather
            name="calendar"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            Easy appointment scheduling
          </Text>
        </View>
        <View style={styles.bulletContainer}>
          <Feather
            name="bell"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            Notifications to keep you on track
          </Text>
        </View>
        <View style={styles.bulletContainer}>
          <Feather
            name="video"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            Secure video consultations
          </Text>
        </View>
        <View style={styles.bulletContainer}>
          <Feather
            name="clipboard"
            size={20}
            color={COLORS.primary}
            style={styles.bulletIcon}
          />
          <Text
            style={[
              styles.bulletText,
              {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
            ]}>
            Manage your medical records
          </Text>
        </View>

        <Text
          style={[
            styles.heading,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          Our Commitment
        </Text>
        <Text
          style={[
            styles.description,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          At Sehat, we are committed to providing quality healthcare access for
          everyone. Our goal is to ensure you get the care you need when you
          need it, with minimal hassle.
        </Text>
        <Text
          style={[
            styles.description,
            {color: colorScheme === 'dark' ? COLORS.lightGray : COLORS.dark},
          ]}>
          Thank you for choosing Sehat to assist you on your healthcare journey.
          We’re here to support you every step of the way.
        </Text>

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
          If you have any queries or need further assistance, feel free to
          contact us at:
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

export default About;

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
  },

  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },

  bulletIcon: {
    marginRight: width * 0.03,
  },

  bulletText: {
    fontSize: width * 0.045,
    fontFamily: FONTS.regular,
    lineHeight: width * 0.06,
  },

  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.01,
    marginBottom: height * 0.05,
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
