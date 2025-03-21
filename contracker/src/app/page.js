'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const LoginPortals = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col h-[81vh] p-4 pt-14">
      <div className="flex flex-1 gap-4">
        <div
          className="flex flex-1 flex-col items-center justify-center p-6 bg-green-600 text-white rounded-lg cursor-pointer"
          onClick={() => router.push('/contractor-sec')}
        >
          <div className="text-4xl mb-2">👷</div>
          <h2 className="text-lg font-bold">Contractor</h2>
          <p>Contractor login</p>
        </div>
        <div
          className="flex flex-1 flex-col items-center justify-center p-6 bg-blue-600 text-white rounded-lg cursor-pointer"
          onClick={() => router.push('/public-sec')}
        >
          <div className="text-4xl mb-2">👥</div>
          <h2 className="text-lg font-bold">People</h2>
          <p>People Login</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center mt-4">
        <div
          className="w-11/12 flex flex-col items-center justify-center p-6 bg-gray-700 text-white rounded-lg cursor-pointer"
          onClick={() => router.push('/gov-sec')}
        >
          <div className="text-4xl mb-2">🏛️</div>
          <h2 className="text-lg font-bold">Government</h2>
          <p>Government login</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPortals;

/*
Original React Native Code:

import * as React from 'react';
import { Card, Text, Avatar, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { View, StyleSheet } from 'react-native';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#16a085',
    accent: '#16a085',
  },
};

const LoginPortals = () => (
  <PaperProvider theme={theme}>
    <View style={styles.container}>
      <View style={styles.topHalf}>
        <Card onPress={() => router.push('/contractBottom')} style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Avatar.Icon size={48} icon="account" style={styles.icon} color="white" />
            <Text variant="titleLarge" style={styles.cardText}>Contractor</Text>
            <Text variant="bodyMedium" style={styles.cardText}>Contractor login</Text>
          </Card.Content>
        </Card>
        <Card onPress={() => router.push('/peopleBottom')} style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Avatar.Icon size={48} icon="account-group" style={styles.icon} color="white" />
            <Text variant="titleLarge" style={styles.cardText}>People</Text>
            <Text variant="bodyMedium" style={styles.cardText}>People Login</Text>
          </Card.Content>
        </Card>
      </View>
      <View style={styles.bottomHalf}>
        <Card onPress={() => router.push('/gov')} style={styles.fullWidthCard}>
          <Card.Content style={styles.cardContent}>
            <Avatar.Icon size={48} icon="city" style={styles.icon} color="white" />
            <Text variant="titleLarge" style={styles.cardText}>Government</Text>
            <Text variant="bodyMedium" style={styles.cardText}>Government login</Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  </PaperProvider>
);
*/
