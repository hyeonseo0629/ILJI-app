import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Base URL for your backend
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for your backend
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.error('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projects: https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-project-id
    token = (await Notifications.getExpoPushTokenAsync({ projectId: '3fe826ef-7486-4776-9466-f7b2709be4ab' })).data;
    console.log(token);

  return token;
}

async function sendTokenToBackend(token: string) {
    try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) {
            console.log('No auth token found, skipping sending FCM token.');
            return;
        }

        await axios.post(`${API_BASE_URL}/api/user/fcm-token`, {
            fcmToken: token,
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        console.log('FCM token sent to backend successfully.');
    } catch (error) {
        console.error('Error sending FCM token to backend:', error);
    }
}

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
        if (token) {
            setExpoPushToken(token);
            sendTokenToBackend(token);
        }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
      // Handle notification tap event here
      const url = response.notification.request.content.data.url as string;
      if (url) {
        // Example: navigate to a screen based on the URL
        // You might need to use expo-router's router for this
      }
    });

    return () => {
        if (notificationListener.current) {
            Notifications.removeNotificationSubscription(notificationListener.current);
        }
        if (responseListener.current) {
            Notifications.removeNotificationSubscription(responseListener.current);
        }
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
}
