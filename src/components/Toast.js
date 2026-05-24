import React, { useImperativeHandle, forwardRef, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Icon from './Icon';
import { Colors, Radius } from '../theme';

const Toast = forwardRef((_, ref) => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success');
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useImperativeHandle(ref, () => ({
    show(msg, t = 'success') {
      setMessage(msg);
      setType(t);
      Animated.parallel([
        Animated.spring(opacity, { toValue: 1, useNativeDriver: true, speed: 20 }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, speed: 20 }),
      ]).start(() => {
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: 16, duration: 220, useNativeDriver: true }),
          ]).start();
        }, 2500);
      });
    },
  }));

  const config = {
    success: { icon: 'check-circle', color: '#34D399' },
    error:   { icon: 'alert-circle', color: '#F87171' },
    warning: { icon: 'alert-triangle', color: '#FCD34D' },
  };
  const { icon, color } = config[type] || config.success;

  return (
    <Animated.View style={[styles.toast, { opacity, transform: [{ translateY }] }]}>
      <Icon name={icon} size={18} color={color} strokeWidth={2} />
      <Text style={styles.msg}>{message}</Text>
    </Animated.View>
  );
});

export default Toast;

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: Colors.dark,
    borderRadius: Radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  msg: { color: Colors.white, fontSize: 13, fontWeight: '500', flex: 1, lineHeight: 18 },
});
