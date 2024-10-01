import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  useColorScheme,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS, FONTS} from '../constants/Constants';
import Home from '../screens/Home';
import Calendar from '../screens/Calendar';
import History from '../screens/History';
import Chat from '../screens/Chat';
import Account from '../screens/Account';

const Tab = createBottomTabNavigator();
const {width, height} = Dimensions.get('window');

const BottomNavigator = () => {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.lightGray,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor:
              colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
          },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({focused}) => (
            <View style={styles.imageContainer}>
              <Image
                source={
                  focused
                    ? require('../../assets/navigatorIcons/home-fill.png')
                    : require('../../assets/navigatorIcons/home.png')
                }
                style={[
                  styles.image,
                  {tintColor: focused ? COLORS.primary : COLORS.lightGray},
                ]}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={Calendar}
        options={{
          tabBarLabel: 'Calendar',
          tabBarIcon: ({focused}) => (
            <View style={styles.imageContainer}>
              <Image
                source={
                  focused
                    ? require('../../assets/navigatorIcons/calendar-fill.png')
                    : require('../../assets/navigatorIcons/calendar.png')
                }
                style={[
                  styles.image,
                  {tintColor: focused ? COLORS.primary : COLORS.lightGray},
                ]}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({focused}) => (
            <View style={styles.imageContainer}>
              <Image
                source={
                  focused
                    ? require('../../assets/navigatorIcons/history-fill.png')
                    : require('../../assets/navigatorIcons/history.png')
                }
                style={[
                  styles.image,
                  {tintColor: focused ? COLORS.primary : COLORS.lightGray},
                ]}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({focused}) => (
            <View style={styles.imageContainer}>
              <Image
                source={
                  focused
                    ? require('../../assets/navigatorIcons/chat-fill.png')
                    : require('../../assets/navigatorIcons/chat.png')
                }
                style={[
                  styles.image,
                  {tintColor: focused ? COLORS.primary : COLORS.lightGray},
                ]}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({focused}) => (
            <View style={styles.imageContainer}>
              <Image
                source={
                  focused
                    ? require('../../assets/navigatorIcons/user-fill.png')
                    : require('../../assets/navigatorIcons/user.png')
                }
                style={[
                  styles.image,
                  {tintColor: focused ? COLORS.primary : COLORS.lightGray},
                ]}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  tabBar: {
    height: height * 0.08,
    elevation: 8,
  },

  tabBarLabel: {
    fontSize: width * 0.035,
    fontFamily: FONTS.bold,
    marginBottom: height * 0.01,
  },

  imageContainer: {
    marginTop: height * 0.01,
  },

  image: {
    width: width * 0.07,
    height: height * 0.04,
    resizeMode: 'contain',
  },
});
