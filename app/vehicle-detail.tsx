import { Vehicle } from '@/src/domain/entities/Vehicle';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function VehicleDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const vehicle = JSON.parse(params.vehicle as string) as Vehicle;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleBack = () => {
    router.back();
  };

  const hasValidCoordinates =
    vehicle.latitude !== null &&
    vehicle.longitude !== null &&
    !isNaN(vehicle.latitude) &&
    !isNaN(vehicle.longitude);

  return (
    <>
      <Stack.Screen 
        options={{
          title: vehicle.label || vehicle.id || 'Armada Detail',
          headerTitleStyle: {
            fontSize: 18,
          },
        }} 
      />
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#f5f5f5"
        >
        </StatusBar>
        <ScrollView style={styles.content}>
          {/* Peta Lokasi Kendaraan */}
          {hasValidCoordinates ? (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: vehicle.latitude,
                  longitude: vehicle.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: vehicle.latitude,
                    longitude: vehicle.longitude,
                  }}
                  title={vehicle.label || vehicle.id}
                  description={`Status: ${vehicle.current_status || 'Tidak tersedia'}`}
                />
              </MapView>
            </View>
          ) : (
            <View style={styles.noMapContainer}>
              <Text style={styles.noMapText}>Koordinat lokasi tidak tersedia</Text>
            </View>
          )}

          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Status:</Text>
              <Text style={styles.value}>{vehicle.current_status || 'Tidak tersedia'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Latitude:</Text>
              <Text style={styles.value}>
                {vehicle.latitude !== null ? vehicle.latitude.toFixed(6) : 'Tidak tersedia'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Longitude:</Text>
              <Text style={styles.value}>
                {vehicle.longitude !== null ? vehicle.longitude.toFixed(6) : 'Tidak tersedia'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Rute:</Text>
              <Text style={styles.value}>{vehicle.route_id || 'Tidak tersedia'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Trip:</Text>
              <Text style={styles.value}>{vehicle.trip_id || 'Tidak tersedia'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Pembaruan Terakhir:</Text>
              <Text style={styles.value}>
                {vehicle.updated_at ? formatDate(vehicle.updated_at) : 'Tidak tersedia'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'ios' ? 50 : 25, //
  },
  content: {
    flex: 1,
  },
  mapContainer: {
    height: 250,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  noMapContainer: {
    height: 150,
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMapText: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    width: '40%',
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
});
