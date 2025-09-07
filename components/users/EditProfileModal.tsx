import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';

import Colors from '@/constants/Colors';
import { spacing, fontSizes, fontWeights } from '@/constants/Styles';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { UserProfile } from '@/types';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (profile: Partial<UserProfile>) => Promise<void>;
  profile: UserProfile;
  isLoading?: boolean;
}

export default function EditProfileModal({
  visible,
  onClose,
  onSave,
  profile,
  isLoading = false,
}: EditProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [hobbies, setHobbies] = useState(profile.hobbies.join(', '));
  const [sports, setSports] = useState(profile.sports.join(', '));
  const [error, setError] = useState('');

  const handleSave = async () => {
    // Basic validation
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      const updatedProfile: Partial<UserProfile> = {
        name: name.trim(),
        bio: bio.trim(),
        hobbies: hobbies.split(',').map(hobby => hobby.trim()).filter(hobby => hobby),
        sports: sports.split(',').map(sport => sport.trim()).filter(sport => sport),
      };

      await onSave(updatedProfile);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.light.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <Input
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                error={error && !name.trim() ? error : ''}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>About Me</Text>
              <Input
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={4}
                style={styles.bioInput}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Hobbies</Text>
              <Text style={styles.hint}>Separate with commas</Text>
              <Input
                value={hobbies}
                onChangeText={setHobbies}
                placeholder="e.g., Photography, Reading, Cooking"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Sports</Text>
              <Text style={styles.hint}>Separate with commas</Text>
              <Input
                value={sports}
                onChangeText={setSports}
                placeholder="e.g., Tennis, Running, Basketball"
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Cancel"
            onPress={onClose}
            type="outline"
            style={styles.footerButton}
          />
          <Button
            title={isLoading ? "Saving..." : "Save Changes"}
            onPress={handleSave}
            style={styles.footerButton}
            disabled={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold as '700',
  },
  closeButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium as '500',
    marginBottom: spacing.xs,
  },
  hint: {
    fontSize: fontSizes.sm,
    color: Colors.light.secondaryText,
    marginBottom: spacing.xs,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
});