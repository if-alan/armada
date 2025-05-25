import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Vehicle } from '../../../domain/entities/Vehicle';
import { getVehicleStatusLabel, getVehicleStatusColor } from '../../../utils/VehicleStatusUtils';

interface VehicleCardProps {
    vehicle: Vehicle;
    onPress: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onPress }) => {

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const statusLabel = getVehicleStatusLabel(vehicle.current_status);
    const statusColor = getVehicleStatusColor(vehicle.current_status);

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress(vehicle)}
        >
            <Text style={styles.label}>🚎 {vehicle.label}</Text>
            <View style={styles.statusContainer}>
                <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
                <Text style={styles.status}>Status: {statusLabel}</Text>
            </View>

            <Text style={styles.coordinates}>
                Lat: {vehicle.latitude}{"\n"}Lon: {vehicle.longitude}
            </Text>

            <Text style={styles.updated}>
                Last Updated: {formatDate(vehicle.updated_at)}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#0a4c82',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#d9e9ff',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#0a4c82',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6,
    },
    status: {
        fontSize: 14,
        color: '#4d88c4',
    },
    coordinates: {
        fontSize: 14,
        color: '#4d88c4',
        marginBottom: 8,
    },
    updated: {
        fontSize: 12,
        color: '#4d88c4',
        fontStyle: 'italic',
        textAlign: 'right'
    },
});