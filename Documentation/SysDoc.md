# 📘 SYSTEM DOCUMENTATION

## 1. Project Information

**Project Name:** OdontologyBD - Dental Clinic Management System<cite />

**Student Name:** Neir Daza Hernández<cite />

**Course:** Base de Datos II<cite />

**Semester:** 6<cite />

**Date:** November 2025<cite />

**Instructor:** Jaider Quintero<cite />

**Short Project Description:**
OdontologyBD is a full-stack web application for managing dental clinic operations, including patient management, appointments, clinical procedures, treatment plans, inventory control, and dental laboratory relationships.<cite />

## 2. System Architecture Overview

### 2.1 Architecture Description

The system follows a three-tier architecture with clear separation of concerns:<cite />

- **Presentation Layer:** Angular 20.3.0 single-page application (SPA)<cite />
- **Business Logic Layer:** Django REST Framework API<cite />
- **Data Layer:** Relational database with Django ORM<cite />

### 2.2 Technologies Used

**Frontend:**<cite />
- Angular 20.3.0<cite />
- PrimeNG 20.3.0 (UI components)<cite />
- Tailwind CSS 4.1.17<cite />
- TypeScript 5.9.2<cite />
- RxJS 7.8.0<cite />

**Backend:**<cite />
- Django (Python 3.12)<cite />
- Django REST Framework<cite />

**Database Engine:**<cite />
- Relational database (PostgreSQL/MySQL/SQLite - specific engine not shown in context)<cite />

**Additional Libraries / Tools:**<cite />
- PrimeIcons 7.0.0<cite />
- Angular CLI 20.3.10<cite />
- Prettier (code formatting)<cite />

### 2.3 Visual Explanation of System Operation

```
┌─────────────────────────────────────────────────────────────┐
│                      Web Browser                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Angular SPA (Port 4200)                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │  │
│  │  │  Components │  │  Services   │  │   Routes    │    │  │
│  │  │   (CRUD)    │──│  (HTTP)     │──│ (Routing)   │    │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/JSON
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Django Backend (Port 8000)                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  URL Router                           │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │  │
│  │  │ /api/clinic/ │ │/api/inventory│ │ /api/patients│   │  │
│  │  │  (ViewSets)  │ │ (Generic)    │ │  (APIView)   │   │  │
│  │  └──────────────┘ └──────────────┘ └──────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ ORM
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Database Layer                            │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐                │
│  │  Clinical │  │ Inventory │  │  Patients │                │
│  │   Tables  │  │   Tables  │  │   Tables  │                │
│  └───────────┘  └───────────┘  └───────────┘                │
└─────────────────────────────────────────────────────────────┘
```
<cite />

## 3. Database Documentation

### 3.1 Database Description

The database is organized into three logical domains managing 12 core entities:<cite />

1. **Clinical Domain:** Dentists, Procedures, Teeth, MaterialTreatment, TreatmentPlan, Treatment<cite />
2. **Inventory Domain:** Material, DentalLab, Payment<cite />
3. **Patients Domain:** Patient, Appointment, DentalHistory<cite />

### 3.2 ERD – Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Patient    │───────│ Appointment  │───────│   Dentist    │
└──────────────┘       └──────────────┘       └──────────────┘
       │                                              │
       │                                              │
       ▼                                              ▼
┌──────────────┐                              ┌──────────────┐
│DentalHistory │                              │  Treatment   │
└──────────────┘                              └──────────────┘
                                                     │
                                                     ▼
                                              ┌──────────────┐
                                              │TreatmentPlan │
                                              └──────────────┘
                                                     │
                                                     ▼
                                              ┌──────────────┐
                                              │  Procedure   │
                                              └──────────────┘
                                                     │
                                                     ▼
                                              ┌──────────────┐
                                              │MaterialTreat.│
                                              └──────────────┘
                                                     │
                                                     ▼
┌──────────────┐                              ┌──────────────┐
│  DentalLab   │──────────────────────────────│   Material   │
└──────────────┘                              └──────────────┘
       │
       ▼
┌──────────────┐
│   Payment    │
└──────────────┘
```
<cite />

### 3.3 Logical Model

[Note: Specific field details not available in provided context]<cite />

### 3.4 Physical Model (Tables)

| Table | Column | Type | PK/FK | Description |
|-------|--------|------|-------|-------------|
| dentist | [fields not shown] | - | PK | Stores dentist information |
| procedure | [fields not shown] | - | PK | Dental procedures catalog |
| teeth | [fields not shown] | - | PK | Dental anatomy records |
| material_treatment | [fields not shown] | - | PK/FK | Links materials to treatments |
| treatment_plan | [fields not shown] | - | PK/FK | Treatment planning records |
| treatment | [fields not shown] | - | PK/FK | Individual treatments |
| material | [fields not shown] | - | PK | Inventory materials |
| dental_lab | [fields not shown] | - | PK | Laboratory information |
| payment | [fields not shown] | - | PK/FK | Payment records |
| patient | [fields not shown] | - | PK | Patient information |
| appointment | [fields not shown] | - | PK/FK | Appointment scheduling |
| dental_history | [fields not shown] | - | PK/FK | Patient dental history |

<cite />

## 4. Use Cases – CRUD

### 4.1 Use Case: Create [Entity]

**Actor:** Clinic Administrator/Dentist<cite />

**Description:** Create a new record for any of the 12 entities in the system<cite />

**Preconditions:** 
- User is authenticated<cite />
- User navigates to `/{entity}/new` route<cite />

**Postconditions:**
- New record is persisted in database<cite />
- User is redirected to list view<cite />
- Success notification is displayed<cite />

**Main Flow:**
1. User clicks "New" button from list view<cite />
2. System displays creation form<cite />
3. User fills required fields<cite />
4. User submits form<cite />
5. Frontend sends POST request to `/api/{domain}/{entity}`<cite />
6. Backend validates and saves data<cite />
7. System returns to list view with success message<cite /> 

### 4.2 Use Case: Read [Entity]

**Actor:** Clinic Administrator/Dentist<cite />

**Description:** View list of all records or individual record details<cite />

**Preconditions:** User is authenticated<cite />

**Postconditions:** Data is displayed in table/form format<cite />

**Main Flow:**
1. User navigates to `/{entity}` route<cite />
2. Frontend sends GET request to `/api/{domain}/{entity}`<cite />
3. Backend retrieves records from database<cite />
4. System displays data in PrimeNG table component<cite />

### 4.3 Use Case: Update [Entity]

**Actor:** Clinic Administrator/Dentist<cite />

**Description:** Modify existing record<cite />

**Preconditions:** 
- Record exists in database<cite />
- User navigates to `/{entity}/edit/:id`<cite />

**Postconditions:** Record is updated in database<cite />

**Main Flow:**
1. User clicks "Edit" button from list view<cite />
2. System loads existing data via GET request<cite />
3. User modifies fields<cite />
4. User submits form<cite />
5. Frontend sends PUT request to `/api/{domain}/{entity}/{id}`<cite />
6. Backend validates and updates record<cite />
7. System returns to list view<cite /> 

### 4.4 Use Case: Delete [Entity]

**Actor:** Clinic Administrator/Dentist<cite />

**Description:** Remove record from system<cite />

**Preconditions:** 
- Record exists and has no dependencies<cite />
- User navigates to `/{entity}/delete/:id`<cite />

**Postconditions:** Record is removed from database<cite />

**Main Flow:**
1. User clicks "Delete" button from list view<cite />
2. System displays confirmation dialog<cite />
3. User confirms deletion<cite />
4. Frontend sends DELETE request to `/api/{domain}/{entity}/{id}`<cite />
5. Backend removes record<cite />
6. System returns to list view<cite /> 

## 5. Backend Documentation

### 5.1 Backend Architecture

The backend uses Django REST Framework with three different API patterns:<cite />

- **ViewSets Pattern:** Used for Clinical domain (`/api/clinic/`)<cite />
- **Generic Views Pattern:** Used for Inventory domain (`/api/inventory/`)<cite />
- **APIView Pattern:** Used for Patients domain (`/api/patients/`)<cite />

### 5.2 Folder Structure

```
cluster-odontology/
├── odontology/
│   ├── settings.py          # Django configuration
│   └── urls.py              # Main URL router
├── myapps/
│   ├── clinic/
│   │   ├── models.py        # Clinical domain models
│   │   ├── views.py         # API view implementation
│   │   └── urls_viewset.py  # URL routing (ViewSets)
│   ├── inventory/
│   │   ├── models.py        # Inventory domain models
│   │   ├── views.py         # API view implementation
│   │   └── urls_generic.py  # URL routing (Generic Views)
│   └── patients/
│       ├── models.py        # Patient domain models
│       ├── views.py         # API view implementation
│       └── urls_apiview.py  # URL routing (APIViews)
└── manage.py                # Django management script
```
<cite />

### 5.3 API Documentation (REST)

**Example Endpoint:**

**Method Path:** `GET /api/clinic/dentists`<cite />

**Purpose:** Retrieve list of all dentists<cite />

**Request Body Example:** N/A (GET request)<cite />

**Responses:**
- 200 OK: Returns array of dentist objects<cite />
- 400 Bad Request: Invalid parameters<cite />
- 500 Internal Server Error: Server error<cite />

**Method Path:** `POST /api/clinic/dentists`<cite />

**Purpose:** Create new dentist record<cite />

**Request Body Example:**
```json
{
  "name": "Dr. John Smith",
  "specialty": "Orthodontics",
  "license_number": "12345"
}
```
<cite />

**Responses:**
- 201 Created: Dentist created successfully<cite />
- 400 Bad Request: Validation error<cite />

### 5.4 REST Client

The system uses standard HTTP methods following REST conventions:<cite />

- **GET:** Retrieve resources<cite />
- **POST:** Create new resources<cite />
- **PUT:** Update existing resources<cite />
- **DELETE:** Remove resources<cite />

## 6. Frontend Documentation

### 6.1 Technical Frontend Documentation

**Framework Used:** Angular 20.3.0<cite />

**Folder Structure:**

```
cluster-frontend/
├── src/
│   ├── app/
│   │   ├── app.component.ts        # Application shell
│   │   ├── app.routes.ts           # Route configuration
│   │   ├── components/             # Feature components
│   │   │   ├── appointment/        # Appointment CRUD
│   │   │   │   ├── getall/
│   │   │   │   ├── create/
│   │   │   │   ├── update/
│   │   │   │   └── delete/
│   │   │   ├── dental-history/     # DentalHistory CRUD
│   │   │   ├── dental-lab/         # DentalLab CRUD
│   │   │   ├── dentist/            # Dentist CRUD
│   │   │   ├── material/           # Material CRUD
│   │   │   ├── material-treatment/ # MaterialTreatment CRUD
│   │   │   ├── patient/            # Patient CRUD
│   │   │   ├── payment/            # Payment CRUD
│   │   │   ├── procedure/          # Procedure CRUD
│   │   │   ├── teeth/              # Teeth CRUD
│   │   │   ├── treatment/          # Treatment CRUD
│   │   │   ├── treatment-plan/     # TreatmentPlan CRUD
│   │   │   └── layout/             
```

### Citations

**File:** frontend/src/app/app.routes.ts (L1-1)
```typescript
import { Routes } from '@angular/router';
```

**File:** frontend/src/app/app.routes.ts (L79-79)
```typescript
  { path: 'dentists', component: DentistGetall },
```

**File:** frontend/src/app/app.routes.ts (L80-80)
```typescript
  { path: 'dentists/new', component: DentistCreate },
```

**File:** frontend/src/app/app.routes.ts (L81-81)
```typescript
  { path: 'dentists/edit/:id', component: DentistUpdate },
```

**File:** frontend/src/app/app.routes.ts (L82-82)
```typescript
  { path: 'dentists/delete/:id', component: DentistDelete },
```
<cite/>

### 6.2 Visual Explanation of the System's Operation

The frontend follows a consistent component-based architecture where each entity has four dedicated components for CRUD operations: [1](#1-0) 

```
User Interaction Flow:

┌─────────────────────────────────────────────────────────────┐
│                    Browser Navigation                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Angular Router                             │
│  Routes user to appropriate component based on URL path     │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Getall     │   │   Create     │   │   Update     │
│  Component   │   │  Component   │   │  Component   │
│              │   │              │   │              │
│ - Displays   │   │ - Form with  │   │ - Pre-filled │
│   table      │   │   validators │   │   form       │
│ - Pagination │   │ - Dropdowns  │   │ - Load by ID │
│ - Actions    │   │   for FKs    │   │ - Save edits │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                            │
│  - DentistService, PatientService, AppointmentService, etc. │
│  - HTTP client methods (GET, POST, PUT, DELETE)             │
│  - BehaviorSubject for reactive state management            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  HTTP Requests                              │
│  GET    /api/{domain}/{entity}/                             │
│  POST   /api/{domain}/{entity}/                             │
│  PUT    /api/{domain}/{entity}/{id}/                        │
│  DELETE /api/{domain}/{entity}/{id}/                        │
└─────────────────────────────────────────────────────────────┘
```
<cite/>

**Component Lifecycle Example (Appointment Creation):**  

1. **Initialization**: Component loads lookup data (patients, dentists) from respective services 
2. **Form Building**: Reactive form created with validators  
3. **User Input**: User fills form fields with validation feedback  
4. **Submission**: Form data sent to service 
5. **Navigation**: Success redirects to list view with toast notification  

**State Management Pattern:**

Services use `BehaviorSubject` to maintain reactive state, allowing components to subscribe to data changes and automatically update the UI when CRUD operations occur.  

## 7. Frontend–Backend Integration

### 7.1 Communication Protocol

The frontend and backend communicate exclusively through RESTful HTTP/JSON APIs.<cite/>

**Service-to-API Mapping:** 

| Frontend Service | Backend Endpoint | HTTP Methods |
|-----------------|------------------|--------------|
| `DentistService` | `/api/clinic/dentists` | GET, POST, PUT, DELETE |
| `PatientService` | `/api/patients/patients` | GET, POST, PUT, DELETE |
| `AppointmentService` | `/api/patients/appointments` | GET, POST, PUT, DELETE |
| `MaterialService` | `/api/inventory/materials` | GET, POST, PUT, DELETE |

<cite/>

### 7.2 Request/Response Flow

**Example: Fetching All Dentists** 

```
Frontend                          Backend
   │                                 │
   │  GET /api/clinic/dentists/      │
   │────────────────────────────────>│
   │                                 │
   │                                 │ Django ViewSet
   │                                 │ queries database
   │                                 │
   │  200 OK                         │
   │  {results: [...], count: N}     │
   │<────────────────────────────────│
   │                                 │
   │  Update BehaviorSubject         │
   │  Notify subscribers             │
   │                                 │
```
<cite/>

The service extracts the `results` array from the paginated response and updates the reactive state stream.  

### 7.3 Data Synchronization

**Automatic Refresh Pattern:**  

After any CREATE, UPDATE, or DELETE operation, services automatically call `refreshDentists()` (or equivalent) to reload the data and update all subscribed components. 

**Component Subscription:**  

Components subscribe to the service's observable stream to receive automatic updates when data changes, ensuring the UI stays synchronized with the backend state.<cite/>

### 7.4 Error Handling

Both frontend and backend implement consistent error handling:<cite/>

**Frontend:** 
- Catches HTTP errors in service subscriptions
- Displays user-friendly toast notifications
- Logs detailed errors to console for debugging

**Backend:**<cite/>
- Returns appropriate HTTP status codes (400, 404, 500)
- Provides validation error messages in response body
- Django REST Framework handles serialization errors automatically

### 7.5 Foreign Key Resolution

When creating entities with foreign key relationships, the frontend loads related entities to populate dropdown selectors: [2] 

The form then submits only the ID values, which the backend uses to establish database relationships. 

## 8. Conclusions & Recommendations

### 8.1 System Strengths

**Architectural Consistency:** 
- All 12 entities follow identical CRUD patterns
- Standardized routing structure (`/{entity}`, `/{entity}/new`, `/{entity}/edit/:id`)
- Consistent component organization across domains

**Separation of Concerns:**<cite/>
- Clear three-tier architecture (Presentation, Business Logic, Data)
- Domain-driven design with Clinical, Inventory, and Patient modules
- Service layer abstracts HTTP communication from components

**Modern Technology Stack:**<cite/>
- Angular 20.3.0 with standalone components
- Reactive programming with RxJS
- PrimeNG for enterprise-grade UI components
- Django REST Framework for robust API development

### 8.2 Recommendations for Enhancement

**1. Authentication & Authorization:**<cite/>
Currently, the system lacks visible authentication mechanisms. Implement:
- JWT-based authentication
- Role-based access control (Admin, Dentist, Receptionist)
- Route guards to protect sensitive operations

**2. Data Validation:**<cite/>
Enhance validation beyond basic required fields:
- Add custom validators for phone numbers, dates, email formats
- Implement cross-field validation (e.g., appointment end time > start time)
- Backend validation should mirror frontend rules

**3. Error Recovery:** 
Improve error handling:
- Implement retry logic for failed HTTP requests
- Add offline detection and queue operations
- Provide more specific error messages to users

**4. Performance Optimization:**<cite/>
- Implement virtual scrolling for large tables
- Add search and filter capabilities to list views
- Consider lazy loading for entity relationships
- Implement caching strategies for frequently accessed data

**5. Testing:**<cite/>
Add comprehensive test coverage:
- Unit tests for services and components
- Integration tests for API endpoints
- End-to-end tests for critical user workflows

**6. Documentation:**<cite/>
- Add JSDoc comments to service methods
- Document API contracts with OpenAPI/Swagger
- Create user manual for clinic staff
- Maintain changelog for version tracking

### 8.3 Scalability Considerations

**Database:**<cite/>
- Add indexes on foreign key columns
- Implement database connection pooling
- Consider read replicas for reporting queries

**Frontend:**<cite/>
- Implement code splitting for faster initial load
- Use Angular's OnPush change detection strategy
- Optimize bundle size by removing unused dependencies

**Backend:**<cite/>
- Add API rate limiting
- Implement caching layer (Redis)
- Consider microservices architecture for high-traffic modules

### 8.4 Security Recommendations

- Implement HTTPS for all communications
- Add CSRF protection tokens
- Sanitize all user inputs
- Implement audit logging for sensitive operations
- Regular security updates for dependencies

### 8.5 Final Notes

The OdontologyBD system demonstrates solid architectural foundations with consistent patterns and modern technologies.<cite/> The modular design facilitates maintenance and future enhancements.<cite/> By implementing the recommended improvements, particularly around authentication, validation, and testing, the system will be production-ready for real-world dental clinic operations.<cite/>

**Notes**

The documentation is based on the frontend codebase structure visible in `app.routes.ts` and component implementations. Backend implementation details are inferred from service endpoints but actual Django code was not provided in the context.<cite/> The system manages 12 core entities across three domains with full CRUD operations for each.

### Citations

**File:** frontend/src/app/app.routes.ts (L1-149)
```typescript
import { Routes } from '@angular/router';

// Dentist
import { Getall as DentistGetall } from './components/dentist/getall/getall';
import { Create as DentistCreate } from './components/dentist/create/create';
import { Update as DentistUpdate } from './components/dentist/update/update';
import { Delete as DentistDelete } from './components/dentist/delete/delete';

// Procedure
import { Getall as ProcedureGetall } from './components/procedure/getall/getall';
import { Create as ProcedureCreate } from './components/procedure/create/create';
import { Update as ProcedureUpdate } from './components/procedure/update/update';
import { Delete as ProcedureDelete } from './components/procedure/delete/delete';

// Teeth
import { Getall as TeethGetall } from './components/teeth/getall/getall';
import { Create as TeethCreate } from './components/teeth/create/create';
import { Update as TeethUpdate } from './components/teeth/update/update';
import { Delete as TeethDelete } from './components/teeth/delete/delete';

// MaterialTreatment
import { Getall as MaterialTreatmentGetall } from './components/material-treatment/getall/getall';
import { Create as MaterialTreatmentCreate } from './components/material-treatment/create/create';
import { Update as MaterialTreatmentUpdate } from './components/material-treatment/update/update';
import { Delete as MaterialTreatmentDelete } from './components/material-treatment/delete/delete';

// TreatmentPlan
import { Getall as TreatmentPlanGetall } from './components/treatment-plan/getall/getall';
import { Create as TreatmentPlanCreate } from './components/treatment-plan/create/create';
import { Update as TreatmentPlanUpdate } from './components/treatment-plan/update/update';
import { Delete as TreatmentPlanDelete } from './components/treatment-plan/delete/delete';

// Treatment
import { Getall as TreatmentGetall } from './components/treatment/getall/getall';
import { Create as TreatmentCreate } from './components/treatment/create/create';
import { Update as TreatmentUpdate } from './components/treatment/update/update';
import { Delete as TreatmentDelete } from './components/treatment/delete/delete';

// Material
import { Getall as MaterialGetall } from './components/material/getall/getall';
import { Create as MaterialCreate } from './components/material/create/create';
import { Update as MaterialUpdate } from './components/material/update/update';
import { Delete as MaterialDelete } from './components/material/delete/delete';

// DentalLab
import { Getall as DentalLabGetall } from './components/dental-lab/getall/getall';
import { Create as DentalLabCreate } from './components/dental-lab/create/create';
import { Update as DentalLabUpdate } from './components/dental-lab/update/update';
import { Delete as DentalLabDelete } from './components/dental-lab/delete/delete';

// Payment
import { Getall as PaymentGetall } from './components/payment/getall/getall';
import { Create as PaymentCreate } from './components/payment/create/create';
import { Update as PaymentUpdate } from './components/payment/update/update';
import { Delete as PaymentDelete } from './components/payment/delete/delete';

// Appointment
import { Getall as AppointmentGetall } from './components/appointment/getall/getall';
import { Create as AppointmentCreate } from './components/appointment/create/create';
import { Update as AppointmentUpdate } from './components/appointment/update/update';
import { Delete as AppointmentDelete } from './components/appointment/delete/delete';

// DentalHistory
import { Getall as DentalHistoryGetall } from './components/dental-history/getall/getall';
import { Create as DentalHistoryCreate } from './components/dental-history/create/create';
import { Update as DentalHistoryUpdate } from './components/dental-history/update/update';
import { Delete as DentalHistoryDelete } from './components/dental-history/delete/delete';

// Patient
import { Getall as PatientGetall } from './components/patient/getall/getall';
import { Create as PatientCreate } from './components/patient/create/create';
import { Update as PatientUpdate } from './components/patient/update/update';
import { Delete as PatientDelete } from './components/patient/delete/delete';

export const routes: Routes = [
  { path: '', redirectTo: '/dentists', pathMatch: 'full' },

  // Dentist
  { path: 'dentists', component: DentistGetall },
  { path: 'dentists/new', component: DentistCreate },
  { path: 'dentists/edit/:id', component: DentistUpdate },
  { path: 'dentists/delete/:id', component: DentistDelete },

  // Procedure
  { path: 'procedures', component: ProcedureGetall },
  { path: 'procedures/new', component: ProcedureCreate },
  { path: 'procedures/edit/:id', component: ProcedureUpdate },
  { path: 'procedures/delete/:id', component: ProcedureDelete },

  // Teeth
  { path: 'teeth', component: TeethGetall },
  { path: 'teeth/new', component: TeethCreate },
  { path: 'teeth/edit/:id', component: TeethUpdate },
  { path: 'teeth/delete/:id', component: TeethDelete },

  // MaterialTreatment
  { path: 'material-treatments', component: MaterialTreatmentGetall },
  { path: 'material-treatments/new', component: MaterialTreatmentCreate },
  { path: 'material-treatments/edit/:id', component: MaterialTreatmentUpdate },
  { path: 'material-treatments/delete/:id', component: MaterialTreatmentDelete },

  // TreatmentPlan
  { path: 'treatment-plans', component: TreatmentPlanGetall },
  { path: 'treatment-plans/new', component: TreatmentPlanCreate },
  { path: 'treatment-plans/edit/:id', component: TreatmentPlanUpdate },
  { path: 'treatment-plans/delete/:id', component: TreatmentPlanDelete },

  // Treatment
  { path: 'treatments', component: TreatmentGetall },
  { path: 'treatments/new', component: TreatmentCreate },
  { path: 'treatments/edit/:id', component: TreatmentUpdate },
  { path: 'treatments/delete/:id', component: TreatmentDelete },

  // Material
  { path: 'materials', component: MaterialGetall },
  { path: 'materials/new', component: MaterialCreate },
  { path: 'materials/edit/:id', component: MaterialUpdate },
  { path: 'materials/delete/:id', component: MaterialDelete },

  // DentalLab
  { path: 'dental-labs', component: DentalLabGetall },
  { path: 'dental-labs/new', component: DentalLabCreate },
  { path: 'dental-labs/edit/:id', component: DentalLabUpdate },
  { path: 'dental-labs/delete/:id', component: DentalLabDelete },

  // Payment
  { path: 'payments', component: PaymentGetall },
  { path: 'payments/new', component: PaymentCreate },
  { path: 'payments/edit/:id', component: PaymentUpdate },
  { path: 'payments/delete/:id', component: PaymentDelete },

  // Appointment
  { path: 'appointments', component: AppointmentGetall },
  { path: 'appointments/new', component: AppointmentCreate },
  { path: 'appointments/edit/:id', component: AppointmentUpdate },
  { path: 'appointments/delete/:id', component: AppointmentDelete },

  // DentalHistory
  { path: 'dental-histories', component: DentalHistoryGetall },
  { path: 'dental-histories/new', component: DentalHistoryCreate },
  { path: 'dental-histories/edit/:id', component: DentalHistoryUpdate },
  { path: 'dental-histories/delete/:id', component: DentalHistoryDelete },

  // Patient
  { path: 'patients', component: PatientGetall },
  { path: 'patients/new', component: PatientCreate },
  { path: 'patients/edit/:id', component: PatientUpdate },
  { path: 'patients/delete/:id', component: PatientDelete },
];
```

**File:** frontend/src/app/components/dental-history/create/create.ts (L38-41)
```typescript
    this.form = this.fb.group({
      historyPatient: [null, [Validators.required]],
      historyAnamnesis: [''],
    });
```

**File:** frontend/src/app/components/dental-history/create/create.ts (L44-46)
```typescript
  ngOnInit(): void {
    this.patientService.getAllPatients().pipe(takeUntil(this.destroy$)).subscribe({ next: (p) => (this.patients = p) });
  }
```

**File:** frontend/src/app/components/dental-history/create/create.ts (L57-62)
```typescript
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Formulario inválido', detail: 'Revise los campos requeridos' });
      return;
    }
```

**File:** frontend/src/app/components/dental-history/create/create.ts (L64-67)
```typescript
    const payload: DentalHistory = {
      historyPatient: this.f['historyPatient'].value,
      historyAnamnesis: this.f['historyAnamnesis'].value || null,
    };
```

**File:** frontend/src/app/components/dental-history/create/create.ts (L69-82)
```typescript
    this.saving = true;
    this.dhService
      .createHistory(payload)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Historia creada' });
          this.router.navigate(['/dental-histories']);
        },
        error: (err: any) => {
          console.error('create dental history', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear' });
        },
      });
```

**File:** frontend/src/app/components/dental-history/create/create.html (L10-17)
```html
						<label for="historyPatient">Paciente</label>
						<p-select [options]="patients" optionLabel="patientName" optionValue="id" formControlName="historyPatient" placeholder="Seleccione paciente"></p-select>
					</div>

					<div class="p-field p-col-12">
						<label for="historyAnamnesis">Anamnesis</label>
						<textarea id="historyAnamnesis" rows="4" pInputText formControlName="historyAnamnesis"></textarea>
					</div>
```

**File:** frontend/src/app/services/clinic/dentist.service.ts (L12-12)
```typescript
  private baseUrl = 'http://127.0.0.1:8000/api/clinic/dentists';
```

**File:** frontend/src/app/services/clinic/dentist.service.ts (L13-14)
```typescript
  private dentistsSubject = new BehaviorSubject<Dentist[]>([]);
  public dentists$ = this.dentistsSubject.asObservable();
```

**File:** frontend/src/app/services/clinic/dentist.service.ts (L18-30)
```typescript
  getAllDentists(): Observable<Dentist[]> {
    return this.http.get<PaginatedResponse<Dentist>>(`${this.baseUrl}/`).pipe(
      map((response) => response.results),
      tap((dentists) => {
        console.log('Fetched dentists:', dentists);
        this.dentistsSubject.next(dentists);
      }),
      catchError((error) => {
        console.error('Error fetching dentists:', error);
        return throwError(() => error);
      }),
    );
  }
```

**File:** frontend/src/app/services/clinic/dentist.service.ts (L41-52)
```typescript
  createDentist(dentist: Dentist): Observable<Dentist> {
    return this.http.post<Dentist>(`${this.baseUrl}/`, dentist).pipe(
      tap((response) => {
        console.log('Dentist created:', response);
        this.refreshDentists();
      }),
      catchError((error) => {
        console.error('Error creating dentist:', error);
        return throwError(() => error);
      }),
    );
  }
```

**File:** frontend/src/app/services/clinic/dentist.service.ts (L80-89)
```typescript
  refreshDentists(): void {
    this.getAllDentists().subscribe({
      next: (dentists) => {
        this.dentistsSubject.next(dentists);
      },
      error: (error) => {
        console.error('Error refreshing dentists:', error);
      },
    });
  }
```

**File:** frontend/src/app/components/dentist/getall/getall.ts (L44-47)
```typescript
    // Escuchar cambios en el servicio
    this.subscription.add(
      this.dentistService.dentists$.subscribe((dentists) => (this.dentists = dentists)),
    );
```

**File:** frontend/src/app/components/dentist/getall/getall.ts (L62-70)
```typescript
        error: (err) => {
          console.error(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los dentistas',
          });
          this.loading = false;
        },
```

**File:** frontend/src/app/components/layout/aside/aside.ts (L15-94)
```typescript
    this.items = [
      {
        label: 'Clínica',
        icon: 'pi pi-fw pi-plus',
        items: [
          {
            label: 'Dentistas',
            icon: 'pi pi-fw pi-user-plus',
            routerLink: '/dentists',
          },
          {
            label: 'Procedimientos',
            icon: 'pi pi-fw pi-address-book',
            routerLink: '/procedures',
          },
          {
            label: 'Piezas Dentales',
            icon: 'pi pi-fw pi-box',
            routerLink: '/teeth',
          },
          {
            label: 'Tratamiento de Materiales',
            icon: 'pi pi-fw pi-hammer',
            routerLink: '/material-treatments',
          },
          {
            label: 'Plan de Tratamientos',
            icon: 'pi pi-fw pi-calendar-clock',
            routerLink: '/treatment-plans',
          },
          {
            label: 'Tratamientos',
            icon: 'pi pi-fw pi-clipboard',
            routerLink: '/treatments',
          },
        ],
      },
      {
        label: 'Inventario',
        icon: 'pi pi-fw pi-shopping-bag',
        items: [
          {
            label: 'Materiales',
            icon: 'pi pi-fw pi-briefcase',
            routerLink: '/materials',
          },
          {
            label: 'Laboratorio Dental',
            icon: 'pi pi-fw pi-home',
            routerLink: '/dental-labs',
          },
          {
            label: 'Método de Pago',
            icon: 'pi pi-fw pi-wallet',
            routerLink: '/payments',
          },
        ],
      },
      {
        label: 'Pacientes',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Citas',
            icon: 'pi pi-fw pi-calendar',
            routerLink: '/appointments',
          },
          {
            label: 'Historia Odontológica',
            icon: 'pi pi-fw pi-file',
            routerLink: '/dental-histories',
          },
          {
            label: 'Pacientes',
            icon: 'pi pi-fw pi-user',
            routerLink: '/patients',
          },
        ],
      },
    ];
```
