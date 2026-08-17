let fleetPagePromise;
let vehicleDetailsPagePromise;

export const loadFleetPage = () => import('../pages/FleetPage');
export const loadVehicleDetailsPage = () => import('../pages/VehicleDetailsPage');

export const prefetchFleetPage = () => {
  fleetPagePromise ||= loadFleetPage();
  return fleetPagePromise;
};

export const prefetchVehicleDetailsPage = () => {
  vehicleDetailsPagePromise ||= loadVehicleDetailsPage();
  return vehicleDetailsPagePromise;
};
