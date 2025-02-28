import { CommonModule } from '@angular/common';
import { Component, LOCALE_ID, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from "primeng/toolbar";
import { catchError, EMPTY, finalize, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { EmployeeService } from './core/services/employee.service';
import { Employee } from './shared/models/employee';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule, FormsModule, ButtonModule, InputTextModule, ConfirmDialogModule, TableModule, DialogModule, ToastModule, CalendarModule, ToolbarModule, InputNumberModule, CalendarModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService, ConfirmationService, EmployeeService, { provide: LOCALE_ID, useValue: 'es-PE' }]
})

export class AppComponent implements OnDestroy {
  employees: Employee[] = [];
  employees$!: Observable<Employee[]>;
  employeeForm: FormGroup;
  displayDialog = false;
  isEditing = false;
  selectedEmployee?: Employee;
  loading: boolean = true;
  submitted: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private employeeService: EmployeeService, private confirmationService: ConfirmationService, private messageService: MessageService,
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(18)]],
      birthday: [null, Validators.required],
      salary: [null, Validators.required],
    });
    
  }

  ngOnInit(): void {
    this.getAllEmployees();
  }

  getAllEmployees() {
    this.loading = true;
    this.employeeService.getAllEmployees().pipe(
      tap((data: any) => this.employees = data.content),
      catchError(() => this.handleResponseMessage('error', 'Error', 'No se pudieron cargar los empleados')),
      finalize(() => this.loading = false),
      takeUntil(this.destroy$) 
    ).subscribe();
  }

  openNew(): void {
    this.employeeForm.reset();
  
    this.employeeForm.markAsUntouched();
    this.employeeForm.markAsPristine();
    
    this.isEditing = false;
    this.submitted = false; 
    this.displayDialog = true;
  }

  editEmployee(employee: Employee): void {
    this.isEditing = true;
    this.selectedEmployee = { ...employee };
  
    const parsedBirthday = employee.birthday ? new Date(employee.birthday) : null;
  
    this.employeeForm.patchValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      age: employee.age,
      salary: employee.salary,
      birthday: parsedBirthday,
    });
  
    this.displayDialog = true;
  }

  saveEmployee(): void {
    this.submitted = true;

    if (this.employeeForm.invalid) return;

    const employeeData: Employee = this.employeeForm.value;
    const saveOperation = this.isEditing && this.selectedEmployee?.documentId
      ? this.employeeService.updateEmployee(this.selectedEmployee.documentId, employeeData)
      : this.employeeService.createEmployee(employeeData);

      saveOperation.pipe(
        tap(() => {
          this.displayDialog = false;
          this.submitted = false;
          this.handleResponseMessage('success', 'Éxito', 'Empleado guardado correctamente');
        }),        
        switchMap(() => this.employeeService.getAllEmployees()),
        tap((data: any) => this.employees = data.content),
        catchError(() => this.handleResponseMessage('error', 'Error', 'No se pudo guardar el empleado')),
        finalize(() => this.loading = false),
        takeUntil(this.destroy$)
      ).subscribe();
  }

  deleteEmployee(event: any) {
    this.confirmationService.confirm({
      header: '¿Estás seguro?',
      message: `Una vez eliminado el empleado no podrá ser recuperado.`,
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-outlined p-button-danger',
      accept: () => {
        this.employeeService.deleteEmployee(event.documentId).pipe(
          tap(() => this.handleResponseMessage('success', 'Empleado eliminado', 'El empleado se ha eliminado correctamente.')),
          catchError(() => this.handleResponseMessage('error', 'Error al eliminar', 'No se pudo eliminar el producto. Intente nuevamente.')),
          finalize(() => this.getAllEmployees()),
          takeUntil(this.destroy$)
        ).subscribe();
      }
    });
  }
  
  hideDialog() {
    this.displayDialog = false;
    this.submitted = false;
  }

  handleResponseMessage(severity: string, summary: string, message: string) {
    this.messageService.add({ severity, summary, detail: message, life: 3000 });
    return EMPTY;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
