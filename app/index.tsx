import { Vehicle } from '@/src/domain/entities/Vehicle';
import { useRoutes } from '@/src/presentation/hooks/useRoutes';
import { useTrips } from '@/src/presentation/hooks/useTrips';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    FlatList,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { VehicleCard } from '../src/presentation/components/vehicle/VehicleCard';
import { useVehicles } from '../src/presentation/hooks/useVehicles';

export default function HomeScreen() {
    const router = useRouter();
    const [showRouteFilter, setShowRouteFilter] = useState(false);
    const [showTripFilter, setShowTripFilter] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [toastRouteError, setToastRouteError] = useState<string | null>(null);
    const [toastTripError, setToastTripError] = useState<string | null>(null);
    const toastOpacity = useRef(new Animated.Value(0)).current;

    const showToastError = () => {
        Animated.timing(toastOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        setTimeout(() => {
            Animated.timing(toastOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setToastRouteError(null)
                setToastTripError(null)
            });
        }, 3000);
    };

    const {
        routes,
        fetchRoutes,
        selectedRoutes,
        setSelectedRoutes,
        handleRouteSelect,
        handleClearRouteFilters,
    } = useRoutes(setToastRouteError);

    const {
        trips,
        selectedTrips,
        setSelectedTrips,
        fetchTrips,
        handleTripSelect,
        handleClearTripFilters,
    } = useTrips(setToastTripError, selectedRoutes);

    const {
        vehicles,
        fetchVehicles,
        loading,
        refreshing,
        loadingMore,
        loadMoreVehicles,
        handleApplyFilter,
        activeFilterType,
        handleClearAllFilters,
    } = useVehicles(
        fetchTrips,
        showRouteFilter,
        setShowRouteFilter,
        showTripFilter,
        setShowTripFilter,
        selectedTrips,
        setSelectedTrips,
        selectedRoutes,
        setSelectedRoutes,
        setError
    );

    const onRefresh = useCallback(() => {
        fetchVehicles(
            true,
            selectedRoutes.map(item => item).join(','),
            selectedTrips.map(item => item).join(',')
        );
        fetchRoutes();
        if (selectedRoutes.length > 0) {
            fetchTrips();
        }
    }, []);

    const renderFooter = () => {
        if (!loadingMore) return null;

        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" />
            </View>
        );
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const handleVehiclePress = (vehicle: Vehicle) => {
        router.push({
            pathname: '/vehicle-detail',
            params: { vehicle: JSON.stringify(vehicle) }
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.container}>
                {/* Toast Error Message */}
                {(toastRouteError || toastTripError) && (
                    <Animated.View style={[styles.toastContainer, { opacity: toastOpacity }]}>
                        <View style={styles.toastContent}>
                            <Text style={styles.toastText}>{toastRouteError || toastTripError}</Text>
                        </View>
                    </Animated.View>
                )}

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Armada</Text>
                    <View style={styles.filterButtons}>
                        <TouchableOpacity
                            style={[styles.filterButton, activeFilterType === 'route' && styles.activeFilterButton]}
                            onPress={() => {
                                if (toastRouteError) {
                                    showToastError();
                                } else {
                                    setShowRouteFilter(true);
                                }
                            }}
                        >
                            <Text style={styles.filterButtonText}>Route Filter</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.filterButton,
                                activeFilterType === 'trip' && styles.activeFilterButton,
                                { marginLeft: 8 },
                                selectedRoutes.length === 0 && styles.disabledFilterButton
                            ]}
                            onPress={() => {
                                if (selectedRoutes.length > 0) {
                                    if (toastTripError) {
                                        showToastError();
                                    } else {
                                        setShowTripFilter(true);
                                    }
                                }
                            }}
                        >
                            <Text style={styles.filterButtonText}>Trip Filter</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {selectedRoutes.length > 0 && (
                    <View style={styles.activeFilterContainer}>
                        <Text style={styles.activeFilterText}>
                            {activeFilterType === 'route' && `Active Filter: ${selectedRoutes.length} Route`}
                            {activeFilterType === 'trip' && `Active Filter: ${selectedTrips.length} Trip`}
                        </Text>
                        <TouchableOpacity onPress={handleClearAllFilters}>
                            <Text style={styles.clearFilterText}>Delete All</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {error && (!toastRouteError || !toastTripError) ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : (
                    <FlatList
                        data={vehicles}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <VehicleCard
                                vehicle={item}
                                onPress={handleVehiclePress}
                            />
                        )}
                        contentContainerStyle={styles.listContent}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        ListEmptyComponent={!refreshing ?
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No vehicles available</Text>
                            </View> : null
                        }
                        onEndReached={loadMoreVehicles}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={renderFooter}
                    />
                )}

                {/* Modal Route Filter */}
                <Modal
                    visible={showRouteFilter}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowRouteFilter(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Chooe Route</Text>
                                <View style={styles.modalHeaderRight}>
                                    <TouchableOpacity onPress={handleClearRouteFilters} style={styles.clearAllButton}>
                                        <Text style={styles.clearAllText}>Delete All</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setShowRouteFilter(false)}>
                                        <Text style={styles.closeButton}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <ScrollView style={styles.routeList}>
                                {routes.map(route => (
                                    <TouchableOpacity
                                        key={route.id}
                                        style={[
                                            styles.routeItem,
                                            selectedRoutes.includes(route.id) && styles.selectedRouteItem
                                        ]}
                                        onPress={() => handleRouteSelect(route.id)}
                                    >
                                        <View style={styles.routeItemContent}>
                                            <View style={[
                                                styles.routeColor,
                                                { backgroundColor: `#${route.color}` }
                                            ]} />
                                            <Text style={styles.routeText}>
                                                {route.long_name}
                                                {route.short_name ? ` (${route.short_name})` : ''}
                                            </Text>
                                        </View>

                                        {selectedRoutes.includes(route.id) && (
                                            <Text style={styles.checkmark}>✓</Text>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <View style={styles.modalFooter}>
                                <TouchableOpacity
                                    style={styles.applyButton}
                                    onPress={handleApplyFilter}
                                >
                                    <Text style={styles.applyButtonText}>Apply Filter</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Modal Filter Trip */}
                <Modal
                    visible={showTripFilter}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowTripFilter(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>
                                    Choose Trip {selectedRoutes.length > 0 ? `(${selectedRoutes.length} Route)` : ''}
                                </Text>
                                <View style={styles.modalHeaderRight}>
                                    <TouchableOpacity onPress={handleClearTripFilters} style={styles.clearAllButton}>
                                        <Text style={styles.clearAllText}>Delete All</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setShowTripFilter(false)}>
                                        <Text style={styles.closeButton}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <ScrollView style={styles.routeList}>
                                {trips.length === 0 ? (
                                    <View style={styles.emptyListContainer}>
                                        <Text style={styles.emptyListText}>
                                            {'Fetch trip data...'}
                                        </Text>
                                    </View>
                                ) : (
                                    trips.map(trip => (
                                        <TouchableOpacity
                                            key={trip.id}
                                            style={[
                                                styles.routeItem,
                                                selectedTrips.includes(trip.id) && styles.selectedRouteItem
                                            ]}
                                            onPress={() => handleTripSelect(trip.id)}
                                        >
                                            <View style={styles.tripItemContent}>
                                                <Text style={styles.tripText}>
                                                    {trip?.headsign}
                                                </Text>
                                                <Text style={styles.tripIdText}>
                                                    ID: {trip.id || 'Unknown'}
                                                </Text>
                                            </View>

                                            {selectedTrips.includes(trip.id) && (
                                                <Text style={styles.checkmark}>✓</Text>
                                            )}
                                        </TouchableOpacity>
                                    ))
                                )}
                            </ScrollView>

                            <View style={styles.modalFooter}>
                                <TouchableOpacity
                                    style={styles.applyButton}
                                    onPress={handleApplyFilter}
                                >
                                    <Text style={styles.applyButtonText}>Terapkan Filter</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    filterButtons: {
        flexDirection: 'row',
    },
    filterButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    activeFilterButton: {
        backgroundColor: '#004C99',
    },
    disabledFilterButton: {
        backgroundColor: '#CCCCCC',
    },
    filterButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    activeFilterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 8,
        backgroundColor: '#E1F5FE',
    },
    activeFilterText: {
        fontSize: 14,
        color: '#0277BD',
    },
    clearFilterText: {
        fontSize: 14,
        color: '#0277BD',
        fontWeight: 'bold',
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
    emptyListContainer: {
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyListText: {
        fontSize: 16,
        color: '#666',
        fontStyle: 'italic',
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
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    clearAllButton: {
        marginRight: 16,
    },
    clearAllText: {
        color: '#007AFF',
        fontSize: 14,
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        fontSize: 18,
        color: '#666',
    },
    routeList: {
        padding: 16,
    },
    routeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    routeItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    selectedRouteItem: {
        backgroundColor: '#f0f0f0',
    },
    routeColor: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 8,
    },
    routeText: {
        fontSize: 16,
    },
    tripText: {
        fontSize: 16,
        fontWeight: '500',
    },
    tripIdText: {
        fontSize: 10,
        color: '#999',
        marginTop: 2,
    },
    tripItemContent: {
        flexDirection: 'column',
        flex: 1,
    },
    checkmark: {
        fontSize: 18,
        color: '#007AFF',
        fontWeight: 'bold',
    },
    modalFooter: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    applyButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    applyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    toastContainer: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        zIndex: 9999,
        alignItems: 'center',
    },
    toastContent: {
        backgroundColor: 'rgba(255, 59, 48, 0.9)',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    toastText: {
        color: 'white',
        fontWeight: '600',
    },
});
