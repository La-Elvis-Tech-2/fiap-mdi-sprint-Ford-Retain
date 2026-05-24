import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius } from '../theme';

export function KpiDark({ icon, value, tagText, tagUp = true, label }) {
  return (
    <View style={styles.dark}>
      <View style={styles.darkIconWrap}>
        <Text style={styles.darkIcon}>{icon}</Text>
      </View>
      <Text style={styles.darkNum}>{value}</Text>
      <View style={styles.tagRow}>
        <View style={[styles.tag, tagUp ? styles.tagGreen : styles.tagRed]}>
          <Text style={[styles.tagText, { color: tagUp ? '#34D399' : '#F87171' }]}>{tagText}</Text>
        </View>
      </View>
      <Text style={styles.darkLabel}>{label}</Text>
    </View>
  );
}

export function KpiLight({ iconName, value, tagText, tagUp = true, label, accentColor = Colors.blue, accentBg = Colors.blueXLight, smallValue = false }) {
  return (
    <View style={styles.light}>
      <View style={[styles.lightIconWrap, { backgroundColor: accentBg }]}>
        <Text style={[styles.lightIcon, { color: accentColor }]}>{iconName}</Text>
      </View>
      <Text style={[styles.lightNum, smallValue && { fontSize: 17 }]}>{value}</Text>
      <View style={styles.tagRow}>
        <View style={[styles.tag]}>
          <Text style={[styles.tagText, { color: tagUp ? Colors.green : Colors.red }]}>{tagText}</Text>
        </View>
      </View>
      <Text style={styles.lightLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dark: {
    flex: 1,
    backgroundColor: Colors.dark,
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  darkIconWrap: {
    width: 30, height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  darkIcon: { fontSize: 16 },
  darkNum: { fontSize: 30, fontWeight: '700', color: '#fff', letterSpacing: -1 },
  darkLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 6 },
  light: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  lightIconWrap: {
    width: 30, height: 30,
    borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  lightIcon: { fontSize: 16 },
  lightNum: { fontSize: 26, fontWeight: '700', color: Colors.text, letterSpacing: -0.5 },
  lightLabel: { fontSize: 11, color: Colors.text3, marginTop: 6 },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  tagGreen: {},
  tagRed: {},
  tagText: { fontSize: 11, fontWeight: '600' },
});
