export enum VehicleStatusCategory {
  MOVING = 'MOVING',
  ARRIVING = 'ARRIVING',
  STOPPED = 'STOPPED',
  UNKNOWN = 'UNKNOWN'
}

export const categorizeVehicleStatus = (currentStatus: string | null | undefined): VehicleStatusCategory => {
  if (!currentStatus) return VehicleStatusCategory.UNKNOWN;
  
  switch (currentStatus.toUpperCase()) {
    case 'IN_TRANSIT_TO':
      return VehicleStatusCategory.MOVING;
    case 'INCOMING_AT':
      return VehicleStatusCategory.ARRIVING;
    case 'STOPPED_AT':
      return VehicleStatusCategory.STOPPED;
    default:
      return VehicleStatusCategory.UNKNOWN;
  }
};

export const getVehicleStatusLabel = (currentStatus: string | null | undefined): string => {
  if (!currentStatus) return 'Unknown';
  
  const category = categorizeVehicleStatus(currentStatus);
  
  switch (category) {
    case VehicleStatusCategory.MOVING:
      return 'On the way';
    case VehicleStatusCategory.ARRIVING:
      return 'Arriving soon';
    case VehicleStatusCategory.STOPPED:
      return 'At the stop';
    case VehicleStatusCategory.UNKNOWN:
    default:
      return currentStatus;
  }
};

export const getVehicleStatusColor = (currentStatus: string | null | undefined): string => {
  if (!currentStatus) return 'gray';
  
  const category = categorizeVehicleStatus(currentStatus);
  
  switch (category) {
    case VehicleStatusCategory.MOVING:
      return 'green';
    case VehicleStatusCategory.ARRIVING:
      return 'gold';
    case VehicleStatusCategory.STOPPED:
      return 'red';
    case VehicleStatusCategory.UNKNOWN:
    default:
      return 'gray'
  }
};
