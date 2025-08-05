import React from 'react';
import { StyleSheet, View, Text, TextInput, TextInputProps, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';
import { spacing, fontSizes } from '@/constants/Styles';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export default function Input({ label, error, style, containerStyle, ...rest }: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={Colors.light.darkGrey}
        {...rest}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSizes.sm,
    marginBottom: spacing.xs,
    color: Colors.light.secondaryText,
  },
  input: {
    backgroundColor: Colors.light.lightGrey,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: spacing.md,
    fontSize: fontSizes.md,
  },
  inputError: {
    borderColor: Colors.light.error,
  },
  errorText: {
    color: Colors.light.error,
    fontSize: fontSizes.xs,
    marginTop: spacing.xs,
  },
});