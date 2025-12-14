import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const NotificationService = {
    initialize: async () => {
        // Check permissions
        const { status } = await Notifications.getPermissionsAsync();
        // If not granted, we might request it later in the UI flow using requestPermissions
        return status === 'granted';
    },

    requestPermissions: async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            console.log('Notification permission denied');
            return false;
        }
        return true;
    },

    scheduleFreeTimeReminders: async () => {
        try {
            const startHourStr = await AsyncStorage.getItem('freeTimeStartHour');
            const startMinuteStr = await AsyncStorage.getItem('freeTimeStartMinute');
            const endHourStr = await AsyncStorage.getItem('freeTimeEndHour');
            const endMinuteStr = await AsyncStorage.getItem('freeTimeEndMinute');

            const startHour = startHourStr ? parseInt(startHourStr) : 17;
            const startMinute = startMinuteStr ? parseInt(startMinuteStr) : 0;
            const endHour = endHourStr ? parseInt(endHourStr) : 22;
            const endMinute = endMinuteStr ? parseInt(endMinuteStr) : 0;

            await Notifications.cancelAllScheduledNotificationsAsync();

            // Schedule Start Reminder
            // Note: Expo Notifications scheduling is daily
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: '🚀 Free Time Started!',
                    body: 'Your productive hours have begun. Time to work on your projects!',
                    sound: true,
                    data: { type: 'free_time_start' },
                },
                trigger: {
                    hour: startHour,
                    minute: startMinute,

                    type: Notifications.SchedulableTriggerInputTypes.DAILY
                },
            });

            // Schedule End Reminder (15 mins before)
            let reminderHour = endHour;
            let reminderMinute = endMinute - 15;
            if (reminderMinute < 0) {
                reminderMinute += 60;
                reminderHour -= 1;
                if (reminderHour < 0) reminderHour = 23;
            }

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: '⏰ Free Time Ending Soon',
                    body: 'You have 15 minutes left. Wrap up your current task!',
                    sound: true,
                    data: { type: 'free_time_ending' },
                },
                trigger: {
                    hour: reminderHour,
                    minute: reminderMinute,

                    type: Notifications.SchedulableTriggerInputTypes.DAILY
                },
            });

            console.log(`🔔 Free time reminders scheduled: ${startHour}:${startMinute} - ${endHour}:${endMinute}`);
        } catch (error) {
            console.error("Error scheduling notifications:", error);
        }
    },

    showTestNotification: async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: '✅ Notifications Enabled!',
                body: 'You will receive reminders during your free time.',
                sound: true,
                data: { type: 'test' },
            },
            trigger: null, // Immediate
        });
    },

    cancelAll: async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();
    }
};
