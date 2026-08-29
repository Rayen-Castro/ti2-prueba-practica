 import { User, Appointment } from "./data"; 
 export function canViewAppointment(user: User, appointment: Appointment): 
 boolean { if (user.role === "student") 
    { return appointment.studentId === user.id; } 
    if (user.role === "professional") 
        { return appointment.professionalId === user.id; } return false; }