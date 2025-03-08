import { createAction, props } from '@ngrx/store';
import { Employee } from '../../../shared/models/employee';

// Cargar empleados
export const loadEmployees = createAction('[Employee] Load Employees');
export const loadEmployeesSuccess = createAction('[Employee] Load Employees Success', props<{ employees: Employee[] }>());
export const loadEmployeesFailure = createAction('[Employee] Load Employees Failure', props<{ error: string }>());

// Agregar empleado
export const addEmployee = createAction('[Employee] Add Employee', props<{ employee: Employee }>());
export const addEmployeeSuccess = createAction('[Employee] Add Employee Success', props<{ employee: Employee }>());
export const addEmployeeFailure = createAction('[Employee] Add Employee Failure', props<{ error: string }>());

// Actualizar empleado
export const updateEmployee = createAction('[Employee] Update Employee', props<{ id: string; employee: Employee }>());
export const updateEmployeeSuccess = createAction('[Employee] Update Employee Success', props<{ employee: Employee }>());
export const updateEmployeeFailure = createAction('[Employee] Update Employee Failure', props<{ error: string }>());

// Eliminar empleado
export const deleteEmployee = createAction('[Employee] Delete Employee', props<{ id: string }>());
export const deleteEmployeeSuccess = createAction('[Employee] Delete Employee Success', props<{ id: string }>());
export const deleteEmployeeFailure = createAction('[Employee] Delete Employee Failure', props<{ error: string }>());