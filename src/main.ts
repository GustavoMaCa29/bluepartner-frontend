import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import esPE from '@angular/common/locales/es-PE';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { AppComponent } from './app/app.component';
import { EmployeeEffects } from './app/features/employees/store/employee.effects';
import { employeeReducer } from './app/features/employees/store/employee.reducer';
import { appConfig } from './app/app.config';


// 🔥 Extiende appConfig con los providers de NgRx
const extendedAppConfig = {
  ...appConfig, // Mantiene la configuración original
  providers: [
    ...(appConfig.providers || []),  // Mantiene los providers previos
    provideStore({ employees: employeeReducer }),  // Agrega el store
    provideEffects(EmployeeEffects),               // Agrega los efectos
    provideHttpClient(),                           // Asegura que haya un HttpClient
  ],
};

// 🚀 Inicia la aplicación con la configuración extendida
bootstrapApplication(AppComponent, extendedAppConfig)
  .catch((err) => console.error(err));
