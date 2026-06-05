export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  joinDate: string;
  status: 'active' | 'inactive';
  workoutsCompleted: number;
  nextSession?: string;
}

export interface WorkoutSession {
  id: string;
  clientId: string;
  date: string;
  duration: number;
  completed: boolean;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  completed: boolean;
}

export interface ScheduleEvent {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface ProgressData {
  date: string;
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
}
