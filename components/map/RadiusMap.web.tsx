import React from 'react';
import { StyleSheet, View } from 'react-native';
import GoogleMapReact from 'google-map-react';
import { UserProfile, Place } from '@/types';
import Colors from '@/constants/Colors';

interface MarkerProps {
  lat: number;
  lng: number;
  color: string;
  label: string;
}

const Marker = ({ color, label }: MarkerProps) => (
  <View style={[styles.marker, { backgroundColor: color }]}>
    <View style={styles.markerInner} />
  </View>
);

interface RadiusMapProps {
  userLocation: {
    latitude: number;
    longitude: number;
  };
  radius: number;
  users?: UserProfile[];
  places?: Place[];
  onUserPress?: (user: UserProfile) => void;
  onPlacePress?: (place: Place) => void;
}

export default function RadiusMap({ 
  userLocation, 
  radius, 
  users = [], 
  places = [], 
  onUserPress, 
  onPlacePress 
}: RadiusMapProps) {
  return (
    <View style={styles.container}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyBafJwGgZ9B10l6cH5x9wfJLv5ye6lTDMw' }}
        defaultCenter={{
          lat: userLocation.latitude,
          lng: userLocation.longitude
        }}
        defaultZoom={14}
        options={{
          fullscreenControl: false
        }}
      >
        {/* User location marker */}
        <Marker
          lat={userLocation.latitude}
          lng={userLocation.longitude}
          color={Colors.light.tint}
          label="You"
        />

        {/* User markers */}
        {users.map((user) => (
          <Marker
            key={user.id}
            lat={user.location.latitude}
            lng={user.location.longitude}
            color={Colors.light.success}
            label={user.name}
          />
        ))}

        {/* Place markers */}
        {places.map((place) => (
          <Marker
            key={place.id}
            lat={place.location.latitude}
            lng={place.location.longitude}
            color={Colors.light.warning}
            label={place.name}
          />
        ))}
      </GoogleMapReact>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  marker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    transform: [{ translate: [-10, -10] }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
});