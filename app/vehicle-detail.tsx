import { Vehicle } from '@/src/domain/entities/Vehicle';
import { useRoute } from '@/src/presentation/hooks/useRoute';
import { useTrip } from '@/src/presentation/hooks/useTrip';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Platform, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function VehicleDetailScreen() {
  const params = useLocalSearchParams();
  const vehicle = JSON.parse(params.vehicle as string) as Vehicle;

  const {
    route,
    loading: routeLoading,
    error: routeError
  } = useRoute(vehicle.route_id);

  const {
    trip,
    loading: tripLoading,
    error: tripError
  } = useTrip(vehicle.trip_id);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
                  description={`Status: ${vehicle.current_status || 'Not available'}`}
                />
              </MapView>
            </View>
          ) : (
            <View style={styles.noMapContainer}>
              <Text style={styles.noMapText}>Location Cordinat Not available</Text>
            </View>
          )}

          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Status:</Text>
              <Text style={styles.value}>{vehicle.current_status || 'Not available'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Latitude:</Text>
              <Text style={styles.value}>
                {vehicle.latitude !== null ? vehicle.latitude.toFixed(6) : 'Not available'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Longitude:</Text>
              <Text style={styles.value}>
                {vehicle.longitude !== null ? vehicle.longitude.toFixed(6) : 'Not available'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Route:</Text>
              {routeLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#0066cc" />
                  <Text style={styles.loadingText}>Fetching route data...</Text>
                </View>
              ) : routeError ? (
                <Text style={styles.value}>{vehicle.route_id || 'Not available'}</Text>
              ) : route ? (
                <Text style={styles.value}>{route.long_name || route.id}</Text>
              ) : (
                <Text style={styles.value}>{vehicle.route_id || 'Not available'}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Trip:</Text>
              {tripLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#0066cc" />
                  <Text style={styles.loadingText}>Fetching trip data...</Text>
                </View>
              ) : tripError ? (
                <Text style={styles.value}>{vehicle.trip_id || 'Not available'}</Text>
              ) : trip ? (
                <Text style={styles.value}>{trip.headsign || trip.id}</Text>
              ) : (
                <Text style={styles.value}>{vehicle.trip_id || 'Not available'}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Last Updated:</Text>
              <Text style={styles.value}>
                {vehicle.updated_at ? formatDate(vehicle.updated_at) : 'Not available'}
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
});
