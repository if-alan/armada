import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    View
} from 'react-native';
import { VehicleCard } from './components/VehicleCard';
import { Vehicle, VehicleResponse } from './model/vehicle';

const ITEMS_PER_PAGE = 10;
const API_BASE_URL = 'https://api-v3.mbta.com/vehicles';

// Konfigurasi axios
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default function HomeScreen() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get<VehicleResponse>(`?page[limit]=${ITEMS_PER_PAGE}`);
            setVehicles(response.data.data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            setError('Failed to load vehicles. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchVehicles();
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    if (loading && !refreshing) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={vehicles}
                renderItem={({ item }) => <VehicleCard vehicle={item} />}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    error ? (
                        <View style={styles.centered}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingVertical: 12,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        margin: 20,
    },
});
