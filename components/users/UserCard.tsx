import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { UserProfile } from '@/types';
import Colors from '@/constants/Colors';
import { spacing, fontSizes, fontWeights } from '@/constants/Styles';
import Badge from '@/components/common/Badge';
import StarRating from '@/components/common/StarRating';
import Button from '@/components/common/Button';

interface UserCardProps {
  user: UserProfile;
  similarityScore?: number;
  onPress: (user: UserProfile) => void;
  onCheckIn?: (user: UserProfile) => void;
}

export default function UserCard({ 
  user, 
  similarityScore, 
  onPress,
  onCheckIn
}: UserCardProps) {
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onPress(user)}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <Image source={{ uri: user.image }} style={styles.image} />
        <View style={styles.details}>
          <View style={styles.header}>
            <Text style={styles.name}>{user.name}, {user.age}</Text>
            {similarityScore !== undefined && (
              <Badge 
                label={`${Math.round(similarityScore * 100)}% Match`}
                type={similarityScore > 0.7 ? 'success' : similarityScore > 0.4 ? 'primary' : 'secondary'}
              />
            )}
          </View>
          <View style={styles.interestContainer}>
            {user.hobbies.slice(0, 3).map((hobby, index) => (
              <Badge
                key={index}
                label={hobby}
                type="secondary"
                style={styles.hobby}
              />
            ))}
          </View>
          <StarRating rating={user.rating.average} size={18} showRating />
          <View style={styles.footer}>
            <Text style={styles.lastSeen}>Active {getTimeAgo(user.lastActive)}</Text>
            {onCheckIn && (
              <Button
                title="Check In"
                size="small"
                onPress={() => onCheckIn(user)}
              />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Helper function to format time ago
function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  image: {
    width: 100,
    height: 120,
    borderRadius: 12,
  },
  details: {
    flex: 1,
    marginLeft: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold as '700',
  },
  match: {
    fontSize: fontSizes.xs,
    color: Colors.light.success,
  },
  interestContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: spacing.xs,
  },
  hobby: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  lastSeen: {
    fontSize: fontSizes.xs,
    color: Colors.light.secondaryText,
  },
});