import {
  NavigationContainer,
  DefaultTheme,
  Theme,
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
  Inter_900Black,
} from '@expo-google-fonts/inter';

import {
  ForgotPassword,
  Home,
  Login,
  Message,
  Signup,
  VerifyAccount,
} from 'ui';

import React from 'react';

import { View } from 'react-native';

import { StackParamList, User } from 'types';

import { MainStack } from 'navigation/main';

import io from 'socket.io-client';

import { SOCKET_HOST } from '@env';

const Stack = createNativeStackNavigator<StackParamList>();

const Onboarding = () => {
  const { theme } = useAppState();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: '',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme?.StartColor,
        },
      }}
    >
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
      <Stack.Screen name='Signup' component={Signup} />
      <Stack.Screen name='VerifyAccount' component={VerifyAccount} />
    </Stack.Navigator>
  );
};

export const AppNavigator = () => {
  const {
    isLoggedIn,
    theme,
    checkStorage,
    setSocket,
    updateUsers,
    updateRooms,
    setSocketId,
  } = useAppState();

  const MyTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme?.StartColor || Colors.Black,
    },
  };

  const [appIsReady, setAppIsReady] = React.useState(false);

  React.useEffect(() => {
    const socket = io(SOCKET_HOST, {
      autoConnect: false,
    });

    socket.connect();
    socket.on('new_user', (_users: User[]) => {
      updateUsers(_users);
    });

    socket.on('joined_room', (room: string) => {
        updateRooms(room);
    });

    socket.on('my_socket', (socketId) => {
      setSocketId(socketId);
    });

    setSocket(socket);
  }, []);

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
          Inter_900Black,
        });

        checkStorage('auth', LOGIN).catch(() => {
          /*  */
        });
      } catch (e) {
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  React.useEffect(() => {
    const hideSplash = async () => {
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
      {isLoggedIn ? <MainStack /> : <Onboarding />}
    </NavigationContainer>
  );
};
