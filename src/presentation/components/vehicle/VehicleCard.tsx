import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Vehicle } from '../../../domain/entities/Vehicle';

interface VehicleCardProps {
    vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <View style={styles.card}>
            <Text style={styles.label}>{vehicle.label}</Text>
            <Text style={styles.status}>Status: {vehicle.current_status}</Text>

            <Text style={styles.coordinates}>
                Lat: {vehicle.latitude}{"\n"}Lon: {vehicle.longitude}
            </Text>

            <Text style={styles.updated}>
                Last Updated: {formatDate(vehicle.updated_at)}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    status: {
        fontSize: 16,
        marginBottom: 8,
    },
    locationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 4,
    },
    location: {
        fontSize: 14,
        marginTop: 4,
    },
    coordinates: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    updated: {
        fontSize: 12,
        color: '#888',
        marginTop: 8,
        textAlign: 'right',
    },
    error: {
        color: 'red',
        fontSize: 14,
        marginTop: 4,
    },
});