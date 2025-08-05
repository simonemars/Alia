import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { User, Settings } from 'lucide-react-native';

import Colors from '@/constants/Colors';
import { spacing, fontSizes, fontWeights } from '@/constants/Styles';
import RadiusMap from '@/components/map/RadiusMap';
import { useUserStore } from '@/store/useUserStore';
import { useLocation } from '@/hooks/useLocation';
import Button from '@/components/common/Button';
import RangeSlider from '@/components/common/RangeSlider';

export default function MapScreen() {
  const { location, errorMsg } = useLocation();
  const searchRadius = useUserStore(state => state.searchRadius);
  const updateSearchRadius = useUserStore(state => state.updateSearchRadius);
  const { nearbyUsers, fetchNearbyUsers } = useUserStore();
  
  useEffect(() => {
    if (location) {
      fetchNearbyUsers(location.coords.latitude, location.coords.longitude);
    }
  }, [location, searchRadius]);

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <Button 
            title="Request Location Permission"
            onPress={() => {/* Implement permission request */}}
            type="outline"
          />
        </View>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Getting your location...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color={Colors.light.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <View style={styles.mapContainer}>
          <RadiusMap
            userLocation={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            radius={searchRadius}
            users={nearbyUsers}
          />
        </View>
        
        <View style={styles.bottomSheet}>
          <View style={styles.radiusControl}>
            <RangeSlider
              min={1}
              max={5}
              step={1}
              value={searchRadius}
              onChange={updateSearchRadius}
              label="Search Radius"
              valueLabel="km"
              width={280}
            />
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <User size={20} color={Colors.light.tint} />
              <Text style={styles.statNumber}>{nearbyUsers.length}</Text>
              <Text style={styles.statLabel}>People</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.radiusIcon}>
                <Text style={styles.radiusIconText}>{searchRadius}</Text>
              </View>
              <Text style={styles.statNumber}>km</Text>
              <Text style={styles.statLabel}>Radius</Text>
            </View>
          </View>
        </View>
      </View>
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
  },
  headerTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold as '700',
  },
  settingsButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: spacing.lg,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  radiusControl: {
    alignItems: 'center',
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.lg,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    padding: spacing.md,
    borderRadius: 12,
    width: '45%',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold as '700',
    marginVertical: spacing.xs,
  },
  statLabel: {
    fontSize: fontSizes.xs,
    color: Colors.light.secondaryText,
  },
  radiusIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.tint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radiusIconText: {
    color: 'white',
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold as '700',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    color: Colors.light.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});