import { Vehicle } from '@/src/domain/entities/Vehicle';
import { useRoute } from '@/src/presentation/hooks/useRoute';
import { useTrip } from '@/src/presentation/hooks/useTrip';
import * as Location from 'expo-location';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getVehicleStatusColor, getVehicleStatusLabel } from '../src/utils/VehicleStatusUtils';

export default function VehicleDetailScreen() {
  const params = useLocalSearchParams();
  const vehicle = JSON.parse(params.vehicle as string) as Vehicle;
  const [locationName, setLocationName] = useState<string>('Fetching location...');

  const statusLabel = getVehicleStatusLabel(vehicle.current_status);
  const statusColor = getVehicleStatusColor(vehicle.current_status);

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

  useEffect(() => {
    if (hasValidCoordinates) {
      (async () => {
        try {
          const reverseGeocode = await Location.reverseGeocodeAsync({
            latitude: vehicle.latitude,
            longitude: vehicle.longitude
          });

          if (reverseGeocode && reverseGeocode.length > 0) {
            const location = reverseGeocode[0];
            const address = [
              location.name,
              location.street,
              location.district,
              location.city,
              location.region,
              location.country
            ].filter(Boolean).join(', ');

            setLocationName(address || 'Location name not available');
          } else {
            setLocationName('Location name not available');
          }
        } catch (error) {
          console.warn('Reverse geocoding error:', error);
          setLocationName('Error fetching location name');
        }
      })();
    } else {
      setLocationName('Location coordinates not available');
    }
  }, [vehicle.latitude, vehicle.longitude, hasValidCoordinates]);

  return (
    <>
      <Stack.Screen
        options={{
          title: vehicle.label ?
            `Bus ${vehicle.label}` :
            vehicle.id || 'Vehicle Detail',
          headerTitleStyle: {
            fontSize: 18,
            color: '#0d4c82',
          },
          headerBackTitle: ""
        }}
      />
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#0d4c82"
        >
        </StatusBar>
        <ScrollView style={styles.content}>
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
                  title={vehicle.label}
                  description={`Status: ${statusLabel}`}
                  pinColor="#0d4c82"
                />
              </MapView>
            </View>
          ) : (
            <View style={styles.noMapContainer}>
              <Text style={styles.noMapText}>Location Coordinates Not Available</Text>
            </View>
          )}

          <View style={styles.card}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Vehicle Status</Text>
              <View style={styles.status}>
                <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                  <Text style={styles.statusText}>{statusLabel}</Text>
                </View>
                <Text style={styles.lastUpdated}>
                  Last updated: {vehicle.updated_at ? formatDate(vehicle.updated_at) : 'Not available'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Location Information</Text>
              <View style={styles.locationContainer}>
                <Text style={styles.locationName}>{locationName !== null ? locationName : 'Not available'}</Text>
                <View style={styles.coordinatesContainer}>
                  <View style={styles.coordinateItem}>
                    <Text style={styles.coordinateLabel}>Latitude</Text>
                    <Text style={styles.coordinateValue}>
                      {vehicle.latitude !== null ? vehicle.latitude.toFixed(6) : 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.coordinateItem}>
                    <Text style={styles.coordinateLabel}>Longitude</Text>
                    <Text style={styles.coordinateValue}>
                      {vehicle.longitude !== null ? vehicle.longitude.toFixed(6) : 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Journey Information</Text>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Route:</Text>
                {routeLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#0d4c82" />
                    <Text style={styles.loadingText}>Fetching route data...</Text>
                  </View>
                ) : routeError ? (
                  <Text style={styles.infoValue}>{vehicle.route_id || 'Not available'}</Text>
                ) : route ? (
                  <Text style={styles.infoValue}>{route.long_name || route.id}</Text>
                ) : (
                  <Text style={styles.infoValue}>{vehicle.route_id || 'Not available'}</Text>
                )}
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Destination:</Text>
                {tripLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#0d4c82" />
                    <Text style={styles.loadingText}>Fetching trip data...</Text>
                  </View>
                ) : tripError ? (
                  <Text style={styles.infoValue}>{vehicle.trip_id || 'Not available'}</Text>
                ) : trip ? (
                  <Text style={styles.infoValue}>{trip.headsign || trip.id}</Text>
                ) : (
                  <Text style={styles.infoValue}>{vehicle.trip_id || 'Not available'}</Text>
                )}
              </View>
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
  },
  content: {
    flex: 1,
  },
  mapContainer: {
    height: 250,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#0d4c82',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#b3d9ff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  noMapContainer: {
    height: 150,
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#cce6ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#99ccff',
  },
  noMapText: {
    fontSize: 16,
    color: '#0d4c82',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#0d4c82',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#d9e9ff',
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d4c82',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#b3d9ff',
    marginVertical: 16,
  },
  status: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#4d88c4',
    marginTop: 4,
  },
  locationContainer: {
    marginBottom: 8,
  },
  locationName: {
    fontSize: 16,
    color: '#0d4c82',
    marginBottom: 12,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coordinateItem: {
    flex: 1,
    backgroundColor: '#e6f2ff',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#b3d9ff',
  },
  coordinateLabel: {
    fontSize: 12,
    color: '#4d88c4',
    marginBottom: 4,
  },
  coordinateValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0d4c82',
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4d88c4',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#0d4c82',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#4d88c4',
    marginLeft: 8,
  },
});
