export interface Employee {
    id?: string;
    salary?: string;
    name?: string;
    role?: string;
  }

export interface Student { 
  id? : number, 
  firstname? : string, 
  lastname? : string, 
  groupname? : string,
  role? : string, 
  expectedsalary? : number, 
  expecteddateofdefense? : string
}

export interface Task {
  id: number | string;
  title: string;
  description?: string;
  duedate?: Date | string;
  completed?: boolean;
}

export type TaskType = 'basic' | 'timed' | 'checklist';