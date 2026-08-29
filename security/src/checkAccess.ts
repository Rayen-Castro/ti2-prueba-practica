import { users, appointments } 
from "./data.js"; import { canViewAppointment } 
from "./authorize.js"; 
export function checkAccess(userId: string, appointmentId: string) 

{ const user = users.find(u => u.id === userId); 
    const appointment = appointments.find(a => a.id === appointmentId); 
    if (!user) return { allowed: false, reason: "user_not_found" }; 
    if (!appointment) return { allowed: false, reason: "resource_not_found" }; 
    const allowed = canViewAppointment(user, appointment); 
    return allowed ? { allowed: true } : { allowed: false, reason: "forbidden" }; }