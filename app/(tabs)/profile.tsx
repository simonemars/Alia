import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CircleUser as UserCircle, Settings, LogOut, Bell, MapPin, Moon, ChevronRight, Shield } from 'lucide-react-native';

import Colors from '@/constants/Colors';
import { spacing, fontSizes, fontWeights } from '@/constants/Styles';
import { useAuthStore } from '@/store/useAuthStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useCheckInStore } from '@/store/useCheckInStore';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import RangeSlider from '@/components/common/RangeSlider';
import Badge from '@/components/common/Badge';
import StarRating from '@/components/common/StarRating';

export default function ProfileScreen() {
  const router = useRouter();
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);
  const { settings, updateSettings, toggleDarkMode } = useSettingsStore();
  const { checkIns, fetchCheckIns } = useCheckInStore();
  
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);
  
  // Mock user data
  const userProfile = {
    name: 'Alex Johnson',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    bio: 'Hiking enthusiast and amateur photographer',
    hobbies: ['Photography', 'Hiking', 'Reading'],
    sports: ['Tennis', 'Running'],
    rating: { average: 4.8, count: 25 },
  };
  
  // Handle logout confirmation
  const handleLogout = () => {
    logout();
    router.replace('/welcome');
  };
  
  const updateSearchRadius = (value: number) => {
    updateSettings({ searchRadius: value });
  };
  
  // Show settings modal
  const openSettings = () => {
    setSettingsModalVisible(true);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={openSettings}>
          <Settings size={24} color={Colors.light.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileHeader}>
          <Avatar size={100} source={userProfile.image} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userProfile.name}</Text>
            <View style={styles.ratingContainer}>
              <StarRating rating={userProfile.rating.average} size={16} showRating />
              <Text style={styles.ratingCount}>
                ({userProfile.rating.count})
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.bioContainer}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bioText}>{userProfile.bio}</Text>
        </View>
        
        <View style={styles.interestsContainer}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.badgeContainer}>
            {userProfile.hobbies.map((hobby, index) => (
              <Badge
                key={index}
                label={hobby}
                type="primary"
                size="medium"
                style={styles.badge}
              />
            ))}
          </View>
        </View>
        
        <View style={styles.interestsContainer}>
          <Text style={styles.sectionTitle}>Sports</Text>
          <View style={styles.badgeContainer}>
            {userProfile.sports.map((sport, index) => (
              <Badge
                key={index}
                label={sport}
                type="secondary"
                size="medium"
                style={styles.badge}
              />
            ))}
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <Button
            title="Edit Profile"
            onPress={() => console.log('Edit profile')}
            style={styles.editButton}
          />
          
          <Button
            title="Log Out"
            type="outline"
            onPress={() => setLogoutConfirmVisible(true)}
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
      
      {/* Settings Modal */}
      <Modal
        visible={settingsModalVisible}
        animationType="slide"
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSettingsModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Settings</Text>
            <View style={{ width: 50 }} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.settingSection}>
              <Text style={styles.settingSectionTitle}>General</Text>
              
              <View style={styles.settingRow}>
                <View style={styles.settingLabelContainer}>
                  <Bell size={20} color={Colors.light.text} style={styles.settingIcon} />
                  <Text style={styles.settingLabel}>Notifications</Text>
                </View>
                <Switch
                  value={settings.showNotifications}
                  onValueChange={(value) => updateSettings({ showNotifications: value })}
                  trackColor={{ false: Colors.light.grey, true: `${Colors.light.tint}80` }}
                  thumbColor={settings.showNotifications ? Colors.light.tint : Colors.light.lightGrey}
                />
              </View>
              
              <View style={styles.settingRow}>
                <View style={styles.settingLabelContainer}>
                  <MapPin size={20} color={Colors.light.text} style={styles.settingIcon} />
                  <Text style={styles.settingLabel}>Location Sharing</Text>
                </View>
                <Switch
                  value={settings.allowLocationSharing}
                  onValueChange={(value) => updateSettings({ allowLocationSharing: value })}
                  trackColor={{ false: Colors.light.grey, true: `${Colors.light.tint}80` }}
                  thumbColor={settings.allowLocationSharing ? Colors.light.tint : Colors.light.lightGrey}
                />
              </View>
              
              <View style={styles.settingRow}>
                <View style={styles.settingLabelContainer}>
                  <Moon size={20} color={Colors.light.text} style={styles.settingIcon} />
                  <Text style={styles.settingLabel}>Dark Mode</Text>
                </View>
                <Switch
                  value={settings.darkMode}
                  onValueChange={toggleDarkMode}
                  trackColor={{ false: Colors.light.grey, true: `${Colors.light.tint}80` }}
                  thumbColor={settings.darkMode ? Colors.light.tint : Colors.light.lightGrey}
                />
              </View>
            </View>
            
            <View style={styles.settingSection}>
              <Text style={styles.settingSectionTitle}>Discovery</Text>
              
              <View style={styles.radiusContainer}>
                <Text style={styles.radiusLabel}>Search Radius: {settings.searchRadius} km</Text>
                <RangeSlider
                  min={1}
                  max={20}
                  value={settings.searchRadius}
                  onChange={updateSearchRadius}
                  valueLabel="km"
                  width={300}
                />
              </View>
            </View>
            
            <View style={styles.settingSection}>
              <Text style={styles.settingSectionTitle}>Account</Text>
              
              <TouchableOpacity style={styles.accountRow} onPress={() => console.log('Change Password')}>
                <Text style={styles.accountOption}>Change Password</Text>
                <ChevronRight size={20} color={Colors.light.secondaryText} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.accountRow} onPress={() => console.log('Privacy Policy')}>
                <Text style={styles.accountOption}>Privacy Policy</Text>
                <ChevronRight size={20} color={Colors.light.secondaryText} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.accountRow} onPress={() => console.log('Terms of Service')}>
                <Text style={styles.accountOption}>Terms of Service</Text>
                <ChevronRight size={20} color={Colors.light.secondaryText} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.accountRow, styles.dangerRow]} 
                onPress={() => console.log('Delete Account')}
              >
                <Text style={styles.dangerText}>Delete Account</Text>
                <ChevronRight size={20} color={Colors.light.error} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
      
      {/* Logout Confirmation Modal */}
      <Modal
        visible={logoutConfirmVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setLogoutConfirmVisible(false)}
      >
        <View style={styles.confirmModalOverlay}>
          <View style={styles.confirmModalContent}>
            <Shield size={48} color={Colors.light.tint} style={styles.confirmIcon} />
            <Text style={styles.confirmTitle}>Log Out</Text>
            <Text style={styles.confirmText}>
              Are you sure you want to log out of your account?
            </Text>
            
            <View style={styles.confirmButtons}>
              <Button
                title="Cancel"
                type="outline"
                onPress={() => setLogoutConfirmVisible(false)}
                style={styles.confirmButton}
              />
              <Button
                title="Log Out"
                onPress={handleLogout}
                style={[styles.confirmButton, { backgroundColor: Colors.light.error }]}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.md,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold as '700',
  },
  settingsButton: {
    padding: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  avatar: {
    marginRight: spacing.lg,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold as '700',
    marginBottom: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingCount: {
    fontSize: fontSizes.sm,
    color: Colors.light.secondaryText,
    marginLeft: spacing.xs,
  },
  bioContainer: {
    padding: spacing.lg,
    paddingTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  sectionTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium as '500',
    color: Colors.light.secondaryText,
    marginBottom: spacing.sm,
  },
  bioText: {
    fontSize: fontSizes.md,
    lineHeight: 24,
  },
  interestsContainer: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  actionsContainer: {
    padding: spacing.lg,
  },
  editButton: {
    marginBottom: spacing.md,
  },
  logoutButton: {
    borderColor: Colors.light.error,
  },
  // Settings Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.md,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold as '700',
  },
  closeButton: {
    fontSize: fontSizes.md,
    color: Colors.light.tint,
  },
  modalContent: {
    flex: 1,
  },
  settingSection: {
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  settingSectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold as '700',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: spacing.md,
  },
  settingLabel: {
    fontSize: fontSizes.md,
  },
  radiusContainer: {
    paddingHorizontal: spacing.lg,
  },
  radiusLabel: {
    fontSize: fontSizes.md,
    marginBottom: spacing.md,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  accountOption: {
    fontSize: fontSizes.md,
  },
  dangerRow: {
    marginTop: spacing.md,
  },
  dangerText: {
    color: Colors.light.error,
    fontSize: fontSizes.md,
  },
  // Logout Confirmation Modal
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  confirmModalContent: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: spacing.lg,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  confirmIcon: {
    marginBottom: spacing.md,
  },
  confirmTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold as '700',
    marginBottom: spacing.sm,
  },
  confirmText: {
    fontSize: fontSizes.md,
    textAlign: 'center',
    marginBottom: spacing.xl,
    color: Colors.light.secondaryText,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
});