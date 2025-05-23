import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Vehicle } from '../model/vehicle';

interface VehicleCardProps {
    vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <View style={styles.card}>
            <Text style={styles.label}>Label: {vehicle.attributes.label}</Text>
            <Text style={styles.text}>
                Current Status: {vehicle.attributes.current_status}
            </Text>
            <Text style={styles.text}>
                Location: {vehicle.attributes.latitude.toFixed(4)}, {vehicle.attributes.longitude.toFixed(4)}
            </Text>
            <Text style={styles.text}>
                Updated: {formatDate(vehicle.attributes.updated_at)}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    text: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
}); 
