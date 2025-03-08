import { Injectable } from '@angular/core';
import * as EmployeeActions from '../store/employee.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Employee } from '../../../shared/models/employee';
import { EmployeeService } from '../../../core/services/employee.service';

@Injectable() 
export class EmployeeEffects {
  constructor(private actions$: Actions, private employeeService: EmployeeService) {}

  loadEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployees),
      mergeMap(() =>
        this.employeeService.getAllEmployees().pipe(
          map((response: any) => {
            return EmployeeActions.loadEmployeesSuccess({ employees: response.content || [] });
          }),
          catchError(error => of(EmployeeActions.loadEmployeesFailure({ error: error.message })))
        )
      )
    )
  );

  saveEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.addEmployee),
      mergeMap(action =>
        this.employeeService.createEmployee(action.employee).pipe(
          map((employee: Employee) => EmployeeActions.addEmployeeSuccess({ employee })),  
          catchError(error => of(EmployeeActions.addEmployeeFailure({ error: error.message })))  
        )
      )
    )
  );

  deleteEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.deleteEmployee),
      mergeMap(action =>
        this.employeeService.deleteEmployee(+action.id).pipe(
          map(() => EmployeeActions.deleteEmployeeSuccess({ id: action.id })),
          catchError(error => of(EmployeeActions.deleteEmployeeFailure({ error: error.message })))
        )
      )
    )
  );
}