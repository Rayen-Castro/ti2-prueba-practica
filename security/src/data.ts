export type Role = "student" | "professional"; 

export interface User { id: string; name: string; role: Role; } 

export interface Appointment { id: string; studentId: string; professionalId: string; date: string; } 

export const users: User[] = [ 
    { id: "u1", name: "Ana", role: "student" },
    { id: "u2", name: "Beto", role: "student" }, 
    { id: "u3", name: "Dra. Cruz", role: "professional" }, ]; 

export const appointments: Appointment[] = [
    { id: "a1", studentId: "u1", professionalId: "u3", date: "2026-09-01" },
    { id: "a2", studentId: "u2", professionalId: "u3", date: "2026-09-02" }, ];