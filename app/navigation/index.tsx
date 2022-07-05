/* eslint-disable camelcase */
import {
  NavigationContainer,
  DefaultTheme,
  Theme
} from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Colors, Inter, LOGIN } from 'common';

import useAppState from 'hooks/useAppState';

import * as SplashScreen from 'expo-splash-screen';

import { MaterialIcons } from '@expo/vector-icons';

import * as Font from 'expo-font';

import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black
} from '@expo-google-fonts/inter';

import { ForgotPassword, Home, Login, Signup, VerifyAccount } from 'ui';

import React from 'react';

import { View } from 'react-native';

import { StackParamList } from 'types';

const Stack = createNativeStackNavigator<StackParamList>();

const Onboarding = () => {
  const { theme } = useAppState();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: '',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme?.StartColor
        }
      }}
    >
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
      <Stack.Screen name='Signup' component={Signup} />
      <Stack.Screen name='VerifyAccount' component={VerifyAccount} />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  const { theme, signOut } = useAppState();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: theme?.TextColor,
        headerShadowVisible: false,
        headerTitle: '',
        headerTitleStyle: {
          fontFamily: Inter.Regular
        },
        headerStyle: {
          backgroundColor: theme?.MiddleColor
        }
      }}
    >
      <Stack.Screen
        options={{
          headerRight: ({ tintColor }) => (
            <MaterialIcons
              onPress={() => signOut()}
              name='logout'
              size={24}
              color={tintColor}
            />
          )
        }}
        name='Home'
        component={Home}
      />
    </Stack.Navigator>
  );
};

export const AppNavigator = () => {
  const { isLoggedIn, theme, checkStorage } = useAppState();

  const MyTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme?.StartColor || Colors.Black
    }
  };

  const [appIsReady, setAppIsReady] = React.useState(false);

  React.useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          Inter_100Thin,
          Inter_200ExtraLight,
          Inter_300Light,
          Inter_400Regular,
          Inter_500Medium,
          Inter_600SemiBold,
          Inter_700Bold,
          Inter_800ExtraBold,
          Inter_900Black
        });

        checkStorage('auth', LOGIN).catch(() => {});
      } catch (e) {
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  React.useEffect(() => {
    const hideSplash = async() => {
      if (appIsReady) {
        await SplashScreen.hideAsync();
      }
    };

    hideSplash();
  }, [appIsReady]);

  if (!appIsReady) {
    return <View />;
  }

  return (
    <NavigationContainer theme={MyTheme}>
      {isLoggedIn ? <HomeStack /> : <Onboarding />}
    </NavigationContainer>
  );
};
