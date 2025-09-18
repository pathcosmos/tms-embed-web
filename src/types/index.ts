export interface VehicleFormData {
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  entryExitType: 'entry' | 'exit';
  privacyConsent: boolean;
}

export interface QRCodeData {
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  entryExitType: 'entry' | 'exit';
  timestamp: string;
  id: string;
}

export interface PrivacyPolicy {
  title: string;
  content: string;
  required: boolean;
}
