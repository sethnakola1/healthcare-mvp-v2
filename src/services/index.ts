// src/services/index.ts (FIX TYPO)

// export { appointmentService } from './appointment.service';  // Fixed typo
// export { patientService } from './patient.service';
// export { doctorService } from './doctor.service';
// export { hospitalService } from './hospital.service';
// Single point of truth for all services
export { default as authService } from './api.service';

// Re-export specific functions if needed
export * from './patient.service';
export * from './hospital.service';
export * from './appointment.service';
export * from './business.service';
export * from './doctor.service';