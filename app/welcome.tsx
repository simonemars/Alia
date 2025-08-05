import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Smile } from 'lucide-react-native';

import Colors from '@/constants/Colors';
import { spacing, fontSizes, fontWeights } from '@/constants/Styles';
import Button from '@/components/common/Button';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={[styles.overlay, { backgroundColor: Colors.light.background }]}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Smile size={64} color={Colors.light.tint} />
            </View>
            <Text style={styles.appName}>Alia</Text>
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Welcome</Text>
            <View style={styles.buttonContainer}>
              <Button 
                title="Create Account" 
                onPress={() => router.push('/auth/register')}
                size="large"
                style={styles.button}
              />
              <Button 
                title="Sign In" 
                onPress={() => router.push('/auth/login')}
                type="outline"
                size="large"
                style={styles.button}
                textStyle={styles.signInText}
              />
            </View>
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    padding: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  appName: {
    fontSize: 42,
    fontWeight: fontWeights.bold as '700',
    color: Colors.light.tint, // Dark blue
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -spacing.xxl, // Move content up
  },
  title: {
    fontSize: 36,
    fontWeight: fontWeights.bold as '700',
    color: Colors.light.tint, // Dark blue
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSizes.lg,
    color: Colors.light.tint, // Dark blue
    textAlign: 'center',
    marginBottom: spacing.xl,
    opacity: 0.9,
  },
  buttonContainer: {
    marginTop: spacing.xl,
  },
  button: {
    marginBottom: spacing.md,
  },
  signInText: {
    color: Colors.light.tint, // Dark blue
  }
});