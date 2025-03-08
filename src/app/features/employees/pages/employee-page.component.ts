import { CommonModule, registerLocaleData } from '@angular/common';
import localeEsPE from '@angular/common/locales/es-PE';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Observable } from 'rxjs';
import { Employee } from '../../../shared/models/employee';
import {
    addEmployee,
    deleteEmployee,
    loadEmployees,
    updateEmployee,
} from '../store/employee.actions';
import { EmployeeState } from '../store/employee.reducer';
import { selectAllEmployees, selectLoading } from '../store/employee.selectors';

registerLocaleData(localeEsPE, 'es-PE');

@Component({
  standalone: true,
  selector: 'app-employee-page',
  templateUrl: './employee-page.component.html',
  styleUrls: ['./employee-page.component.scss'],
  imports: [
    RouterOutlet,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogModule,
    TableModule,
    DialogModule,
    ToastModule,
    CalendarModule,
    ToolbarModule,
    InputNumberModule,
  ],
  providers: [MessageService, ConfirmationService, { provide: LOCALE_ID, useValue: 'es-PE' }],
})
export class EmployeePageComponent implements OnInit {
  employees$!: Observable<Employee[]>;
  loading$!: Observable<boolean>;
  displayDialog: boolean = false;
  employeeForm!: FormGroup;
  isEditing: boolean = false;
  submitted: boolean = false;
  selectedEmployee: Employee | null = null;

  constructor(
    private readonly store: Store<EmployeeState>, 
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.employees$ = this.store.select(selectAllEmployees);
    this.loading$ = this.store.select(selectLoading);
    this.store.dispatch(loadEmployees());

    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(18)]],
      salary: [null, [Validators.required, Validators.min(0)]],
      birthday: [null, Validators.required],
    });
  }

  openNew(): void {
    this.isEditing = false;
    this.displayDialog = true;
    this.submitted = false;
    this.selectedEmployee = null;
    this.employeeForm.reset();
  }

  editEmployee(employee: Employee): void {
    this.isEditing = true;
    this.selectedEmployee = employee;
    this.displayDialog = true;
    this.employeeForm.patchValue(employee);
  }

  deleteEmployee(employee: Employee): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar a ${employee.firstName} ${employee.lastName}?`,
      accept: () => {
        if (employee.documentId) {
          this.store.dispatch(deleteEmployee({ id: employee.documentId }));
          this.messageService.add({
            severity: 'success',
            summary: 'Empleado eliminado',
            detail: 'El empleado ha sido eliminado correctamente.',
          });
        }
      },
    });
  }

  saveEmployee(): void {
    this.submitted = true;
    if (this.employeeForm.invalid) return;

    const employeeData = {
      ...this.selectedEmployee,
      ...this.employeeForm.value,
    };

    if (this.isEditing && this.selectedEmployee?.documentId) {
      this.store.dispatch(
        updateEmployee({
          id: this.selectedEmployee.documentId,
          employee: employeeData,
        })
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Empleado actualizado',
        detail: 'El empleado ha sido actualizado correctamente.',
      });
    } else {
      this.store.dispatch(addEmployee({ employee: employeeData }));
      this.messageService.add({
        severity: 'success',
        summary: 'Empleado agregado',
        detail: 'El empleado ha sido agregado correctamente.',
      });
    }

    this.displayDialog = false;
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.submitted = false;
  }
}