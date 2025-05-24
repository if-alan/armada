import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { VehicleRepositoryImpl } from '../src/data/repositories/VehicleRepositoryImpl';
import { Vehicle } from '../src/domain/entities/Vehicle';
import { GetVehiclesUseCase } from '../src/domain/usecases/vehicle/GetVehiclesUseCase';
import { VehicleCard } from '../src/presentation/components/vehicle/VehicleCard';

export default function HomeScreen() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pageOffset, setPageOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const vehicleRepository = new VehicleRepositoryImpl();
    const getVehiclesUseCase = new GetVehiclesUseCase(vehicleRepository);

    const fetchVehicles = async (refresh = false) => {
        try {
            if (refresh) {
                setPageOffset(0);
                setHasMore(true);
            }

            const currentOffset = refresh ? 0 : pageOffset;

            const response = await getVehiclesUseCase.execute(currentOffset);

            setVehicles(refresh ? response.data : [...vehicles, ...response.data]);
            setHasMore(response.hasMore);
            setPageOffset(currentOffset + response.data.length);
            setError(null);
        } catch (err) {
            console.error('Error fetching vehicles:', err);
            setError('Failed to load data. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
            setLoadingMore(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchVehicles(true);
    };

    const loadMoreVehicles = () => {
        if (!hasMore || loadingMore || refreshing) {
            console.log('No more data or loading in progress', hasMore, loadingMore, refreshing);
            return;
        }

        console.log('Loading more vehicles...', hasMore, loadingMore, refreshing);
        setLoadingMore(true);
        fetchVehicles();
    };

    const renderFooter = () => {
        if (!loadingMore) return null;

        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" />
            </View>
        );
    };

    useEffect(() => {
        fetchVehicles(true);
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
            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={vehicles}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <VehicleCard vehicle={item} />}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No vehicles available</Text>
                        </View>
                    }
                    onEndReached={loadMoreVehicles}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                />
            )}
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
        padding: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});
