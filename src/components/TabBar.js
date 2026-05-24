import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from './Icon';
import { Colors, Radius } from '../theme';

const TABS = [
  { key: 'home',      icon: 'home',      label: 'Início'    },
  { key: 'compare',   icon: 'bar-chart', label: 'Comparar'  },
  { key: 'schedule',  icon: 'calendar',  label: 'Agendar'   }, 
  { key: 'vehicle',   icon: 'car',       label: 'Veículo'   }, 
];

export default function TabBar({ activeTab, onTabPress }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.wrap, { paddingBottom: insets.bottom || 8 }]}>
      {TABS.map(tab => {
        const active = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={s.item}
            activeOpacity={0.7}
            onPress={() => onTabPress(tab.key)}
          >
            <View style={[s.iconWrap, active && s.iconWrapActive]}>
              <Icon
                name={tab.icon}
                size={active ? 20 : 18}
                color={active ? Colors.blue : Colors.text3}
                strokeWidth={active ? 2.5 : 1.75}
              />
            </View>
            <Text style={[s.label, active && s.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  iconWrap: {
    width: 36,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
  },
  label: {
    fontSize: 9,
    fontWeight: '500',
    color: Colors.text3,
  },
  labelActive: {
    color: Colors.blue,
    fontWeight: '700',
  },
});