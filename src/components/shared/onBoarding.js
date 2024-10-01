import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  useColorScheme, // Import the useColorScheme hook
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS} from '../constants/Constants';

const {width, height} = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Welcome!',
    description:
      'We will assist you in efficiently and easily scheduling appointments with doctors.',
    description2: "Let's get started!",
    headerImage: require('../../assets/onBoardScreen/onBoard-1.png'),
  },
  {
    key: '2',
    title: 'Choose Specialization',
    description:
      'Select the medical specialization you need so we can tailor your experience.',
    headerImage: require('../../assets/onBoardScreen/onBoard-2.png'),
  },
  {
    key: '3',
    title: 'Schedule Your First Appointment',
    description:
      'Choose a suitable time and date to meet your preferred doctor. Begin your journey to better health!',
    headerImage: require('../../assets/onBoardScreen/onBoard-3.png'),
  },
];

const OnBoarding = () => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);
  const colorScheme = useColorScheme(); // Detect light or dark mode

  const handleOnComplete = () => {
    navigation.replace('Auth');
  };

  const handleSlideChange = index => {
    setActiveIndex(index);
  };

  const goToNextSlide = () => {
    if (sliderRef.current && activeIndex < slides.length - 1) {
      const nextIndex = activeIndex + 1;
      sliderRef.current.goToSlide(nextIndex);
      setActiveIndex(nextIndex);
    } else {
      handleOnComplete();
    }
  };

  const renderItem = ({item, index}) => (
    <SafeAreaView
      style={[
        styles.primaryContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
        },
      ]}>
      <View style={styles.headerImageContainer}>
        <Image source={item.headerImage} style={styles.headerImage} />
      </View>
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          {item.title}
        </Text>
        <Text
          style={[
            styles.description,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          {item.description}
        </Text>
        {item.description2 && (
          <Text
            style={[
              styles.description,
              {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
            ]}>
            {item.description2}
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {index === slides.length - 1 ? (
          <TouchableOpacity
            style={[
              styles.getStartedButtonContainer,
              {
                backgroundColor:
                  colorScheme === 'dark' ? COLORS.primary : COLORS.primary,
              },
            ]}
            onPress={handleOnComplete}>
            <Text
              style={[
                styles.getStartedButtonText,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.white},
              ]}>
              Get Started!
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={[
                styles.skipButtonContainer,
                {
                  backgroundColor:
                    colorScheme === 'dark' ? COLORS.dark : COLORS.gray,
                },
              ]}
              onPress={handleOnComplete}>
              <Text
                style={[
                  styles.skipButtonText,
                  {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
                ]}>
                Skip
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.nextButtonContainer,
                {
                  backgroundColor:
                    colorScheme === 'dark' ? COLORS.primary : COLORS.primary,
                },
              ]}
              onPress={goToNextSlide}>
              <Text
                style={[
                  styles.nextButtonText,
                  {
                    color: colorScheme === 'dark' ? COLORS.white : COLORS.white,
                  },
                ]}>
                Next
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor:
                index === activeIndex ? COLORS.primary : COLORS.gray,
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <>
      <AppIntroSlider
        ref={sliderRef}
        renderItem={renderItem}
        data={slides}
        onSlideChange={handleSlideChange}
        renderPagination={renderPagination}
        showSkipButton={false}
        showDoneButton={false}
        showNextButton={false}
      />
    </>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },

  headerImage: {
    width: '100%',
    height: height * 0.55,
    resizeMode: 'cover',
  },

  textContainer: {
    top: height * 0.09,
  },

  title: {
    fontSize: width * 0.07,
    width: width * 0.8,
    fontFamily: FONTS.semiBold,
    left: width * 0.07,
    marginBottom: height * 0.015,
  },

  description: {
    fontSize: width * 0.035,
    left: width * 0.075,
    fontFamily: FONTS.medium,
    lineHeight: height * 0.03,
    width: width * 0.9,
  },

  buttonContainer: {
    position: 'absolute',
    bottom: height * 0.03,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: width * 0.05,
    gap: width * 0.03,
  },

  skipButtonContainer: {
    borderRadius: 10,
    padding: height * 0.018,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.45,
  },

  nextButtonContainer: {
    borderRadius: 10,
    padding: height * 0.018,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.45,
  },

  skipButtonText: {
    fontSize: width * 0.045,
    fontFamily: FONTS.bold,
  },

  nextButtonText: {
    fontSize: width * 0.045,
    fontFamily: FONTS.bold,
  },

  getStartedButtonContainer: {
    borderRadius: 10,
    padding: height * 0.018,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.9,
  },

  getStartedButtonText: {
    fontSize: width * 0.045,
    fontFamily: FONTS.bold,
  },

  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: height * 0.40,
    left: width * 0.05,
    width: '100%',
    gap: 5,
  },

  dot: {
    width: width * 0.18,
    height: width * 0.02,
    margin: width * 0.01,
    borderRadius: width * 0.02,
  },
});
