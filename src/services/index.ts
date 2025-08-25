// src/services/index.ts
// export { default as apiService } from './api.service';
export { default as appointmentService } from './appointment.service';
export { default as doctorService } from './doctor.service';
export { default as hospitalService } from './hospital.service';
export { default as patientService } from './patient.service';

// Named exports for compatibility
export { apiService as namedApiService } from './api.service';
export { appointmentService as namedAppointmentService } from './appointment.service';
export { doctorService as namedDoctorService } from './doctor.service';
export { hospitalService as namedHospitalService } from './hospital.service';
export { patientService as namedPatientService } from './patient.service';

// Export types
export type { AppointmentDto, CreateAppointmentRequest } from './appointment.service';
export type { DoctorDto, CreateDoctorRequest } from './doctor.service';
export type { HospitalDto, CreateHospitalRequest } from './hospital.service';
export type { PatientDto, CreatePatientRequest } from './patient.service';

// Export all services with proper default imports
// export { default as apiService } from './api.service';
// export { default as appointmentService } from './appointment.service';
// export { default as doctorService } from './doctor.service';
// export { default as hospitalService } from './hospital.service';
// export { default as patientService } from './patient.service';

// Export types from api.service for convenience
export type { ApiResponse, PaginatedResponse } from './api.service';