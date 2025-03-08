import { createReducer, on } from '@ngrx/store';
import * as EmployeeActions from '../store/employee.actions';
import { Employee } from '../../../shared/models/employee';

export interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
}

export const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
};

export const employeeReducer = createReducer(
  initialState,
  on(EmployeeActions.loadEmployees, (state) => ({ ...state, loading: true })),
  on(EmployeeActions.loadEmployeesSuccess, (state, { employees }) => ({
    ...state,
    loading: false,
    employees,
  })),
  on(EmployeeActions.loadEmployeesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(EmployeeActions.addEmployeeSuccess, (state, { employee }) => ({
    ...state,
    employees: [...state.employees, employee],
  })),
  on(EmployeeActions.updateEmployeeSuccess, (state, { employee }) => ({
    ...state,
    employees: state.employees.map(e => e.documentId === employee.documentId ? employee : e),
  })),
  on(EmployeeActions.deleteEmployeeSuccess, (state, { id }) => ({
    ...state,
    employees: state.employees.filter(e => e.documentId !== id),
  }))
);