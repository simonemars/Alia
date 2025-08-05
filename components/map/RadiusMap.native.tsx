import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import MapView, { Circle, Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps';
import { MapPin } from 'lucide-react-native';
import { UserProfile } from '@/types';
import Colors from '@/constants/Colors';
import { fontSizes, fontWeights } from '@/constants/Styles';

interface RadiusMapProps {
  userLocation: {
    latitude: number;
    longitude: number;
  };
  radius: number;
  users?: UserProfile[];
  onUserPress?: (user: UserProfile) => void;
}

const RadiusMap = React.forwardRef<MapView, RadiusMapProps>(({ 
  userLocation, 
  radius, 
  users = [], 
  onUserPress
}, ref) => {
  const mapRef = useRef<MapView>(null);
  
  useEffect(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: radius * 0.022,
        longitudeDelta: radius * 0.022,
      });
    }
  }, [userLocation, radius]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Current user's location */}
        <Marker
          coordinate={userLocation}
        >
          <View style={[styles.markerContainer, styles.currentUserMarker]}>
            <MapPin size={20} color={Colors.light.background} />
          </View>
          <Callout>
            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>Your Location</Text>
            </View>
          </Callout>
        </Marker>
        
        {/* Search radius circle */}
        <Circle
          center={userLocation}
          radius={radius * 1000}
          strokeWidth={1}
          strokeColor={Colors.light.tint}
          fillColor={`${Colors.light.tint}20`}
        />
        
        {/* Other users */}
        {users.map((user) => (
          <Marker
            key={user.id}
            coordinate={user.location}
            onPress={() => onUserPress?.(user)}
          >
            <View style={styles.markerContainer}>
              <View style={styles.userPin}>
                <MapPin size={20} color={Colors.light.tint} />
              </View>
            </View>
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>Someone Nearby</Text>
                <Text style={styles.calloutSubtitle}>Tap to learn more</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
});

RadiusMap.displayName = 'RadiusMap';

export default RadiusMap;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    alignItems: 'center',
  },
  currentUserMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.tint,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  userPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  callout: {
    padding: 8,
    minWidth: 120,
  },
  calloutTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold as '700',
    marginBottom: 2,
  },
  calloutSubtitle: {
    fontSize: fontSizes.sm,
    color: Colors.light.secondaryText,
    marginBottom: 2,
  },
});