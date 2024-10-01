import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  useColorScheme,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS} from '../constants/Constants';
import auth from '@react-native-firebase/auth';

const {width, height} = Dimensions.get('window');

const Splash = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setTimeout(() => {
          navigation.replace('Main');
        }, 2000);
      } else {
        setTimeout(() => {
          navigation.replace('onBoard');
        }, 2000);
      }
    });

    return unsubscribe;
  }, [navigation]);

  const dynamicStyles = styles(colorScheme);

  return (
    <SafeAreaView style={dynamicStyles.primaryContainer}>
      <View style={dynamicStyles.secondaryContainer}>
        <View style={dynamicStyles.imgContainer}>
          <Animatable.Image
            source={require('../../assets/splashScreen/splash-logo.png')}
            animation={'fadeIn'}
            duration={1500}
            style={dynamicStyles.Img}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Splash;

const styles = colorScheme =>
  StyleSheet.create({
    primaryContainer: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
    },

    secondaryContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    Img: {
      width: width * 0.3,
      height: width * 0.25,
      resizeMode: 'contain',
      aspectRatio: '2/3',
    },
  });
