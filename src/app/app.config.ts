import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';

import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideMockStore } from '@ngrx/store/testing';
import { EmployeePageComponent } from './features/employees/pages/employee-page.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' }, // Redirección por defecto
  { path: 'employees', component: EmployeePageComponent }, // Ruta para empleados
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideNoopAnimations(),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideHttpClientTesting(),
    provideMockStore({}),
  ],
};
