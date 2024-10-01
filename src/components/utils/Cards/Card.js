import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
} from 'react-native';
import {COLORS, FONTS} from '../../constants/Constants';

const {width} = Dimensions.get('window');

const Card = ({title, description, imageSource, backgroundColor}) => {
  return (
    <SafeAreaView>
      <View style={[styles.card, {backgroundColor}]}>
        <View style={styles.imageContainer}>
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.42,
    height: width * 0.42,
    borderRadius: 15,
    padding: width * 0.04,
    justifyContent: 'center',
    margin: width * 0.03,
  },

  imageContainer: {
    width: width * 0.15,
    height: width * 0.15,
  },

  image: {
    width: width * 0.1,
  },

  infoContainer: {
    flexDirection: 'column',
    gap: width * 0.015,
  },

  title: {
    fontSize: width * 0.04,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
  },

  description: {
    fontSize: width * 0.032,
    fontFamily: FONTS.bold,
    color: COLORS.lightDark,
  },
});

export default Card;
