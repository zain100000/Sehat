import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Splash from './src/components/shared/Splash';
import Onboarding from './src/components/shared/onBoarding';
import Auth from './src/components/shared/Auth';
import PhoneAuth from './src/components/shared/PhoneAuth';
import PhoneOtp from './src/components/shared/PhoneOtp';
import Signup from './src/components/shared/Signup';
import Signin from './src/components/shared/Signin';
import ForgotPassword from './src/components/shared/ForgotPassword';
import ChangePassword from './src/components/shared/ChangePassword';
import About from './src/components/shared/About';
import AppUsage from './src/components/shared/AppUsage';
import PrivacyPolicy from './src/components/shared/PrivacyPolicy';
import BottomNavigator from './src/components/navigation/BottomNavigator';

/* Features Navigators Imports */
import AppointmentBooking from './src/components/OtherComponents/AppointmentBooking/AppointmentBooking';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Splash">
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="onBoard" component={Onboarding} />
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Phone_Auth" component={PhoneAuth} />
        <Stack.Screen name="Phone_Otp" component={PhoneOtp} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Signin" component={Signin} />
        <Stack.Screen name="Change_Password" component={ChangePassword} />
        <Stack.Screen name="Forgot_Password" component={ForgotPassword} />
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="Terms" component={AppUsage} />
        <Stack.Screen name="Privacy_Policy" component={PrivacyPolicy} />
        <Stack.Screen name="Main" component={BottomNavigator} />

        {/* Features Navigators */}
        <Stack.Screen
          name="Appointment_Booking"
          component={AppointmentBooking}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
