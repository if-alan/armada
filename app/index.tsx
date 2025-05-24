import { useRoutes } from '@/src/presentation/hooks/useRoutes';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { VehicleCard } from '../src/presentation/components/vehicle/VehicleCard';
import { useVehicles } from '../src/presentation/hooks/useVehicles';

export default function HomeScreen() {
    const [showRouteFilter, setShowRouteFilter] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        routes,
        selectedRoutes,
        setSelectedRoutes,
        handleRouteSelect,
        handleClearRouteFilters,
    } = useRoutes(setError);

    const {
        vehicles,
        loading,
        refreshing,
        loadingMore,
        onRefresh,
        loadMoreVehicles,
        handleApplyFilter,
        handleClearAllFilters,
    } = useVehicles(
        showRouteFilter,
        setShowRouteFilter,
        selectedRoutes,
        setSelectedRoutes,
        setError
    );

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

    return (
        <View style={styles.container}>
            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Armada</Text>
                        <View style={styles.filterButtons}>
                            <TouchableOpacity
                                style={[styles.filterButton]}
                                onPress={() => { setShowRouteFilter(true) }}
                            >
                                <Text style={styles.filterButtonText}>Route Filter</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {selectedRoutes.length > 0 && (
                        <View style={styles.activeFilterContainer}>
                            <Text style={styles.activeFilterText}>
                                `Active Filter: {selectedRoutes.length} Route`
                            </Text>
                            <TouchableOpacity onPress={handleClearAllFilters}>
                                <Text style={styles.clearFilterText}>Delete All</Text>
                            </TouchableOpacity>
                        </View>
                    )}

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
                        ListEmptyComponent={!refreshing ?
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No vehicles available</Text>
                            </View> : null
                        }
                        onEndReached={loadMoreVehicles}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={renderFooter}
                    />

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
                                    <Text style={styles.modalTitle}>Route Option</Text>
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
                </View>
            )}
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
});
