import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radius, Shadow } from '../theme';

export default function Card({ children, style, dark = false, padding = 16, radius = Radius.xl }) {
  return (
    <View style={[styles.card, { backgroundColor: dark ? Colors.dark : Colors.card, borderRadius: radius, padding }, Shadow.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
});
