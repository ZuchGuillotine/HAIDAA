```
src/
│
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   │
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   ├── MFAVerification.jsx
│   │   └── PasswordReset.jsx
│   │
│   ├── dashboard/
│   │   ├── DoctorDashboard.jsx
│   │   ├── PatientDashboard.jsx
│   │   └── AdminDashboard.jsx
│   │
│   ├── patient/
│   │   ├── PatientRecordView.jsx
│   │   ├── ConsentManagement.jsx
│   │   └── HealthInformationTabs.jsx
│   │
│   ├── ai/
│   │   ├── DiagnosticAssistant.jsx
│   │   ├── AIDiagnosticResults.jsx
│   │   └── AIFeedbackForm.jsx
│   │
│   └── sandbox/
│       └── SandboxEnvironment.jsx
│
├── hooks/
│   ├── useAuth.js
│   ├── usePatientData.js
│   └── useAIDiagnostics.js
│
├── context/
│   ├── AuthContext.jsx
│   ├── PatientContext.jsx
│   └── AIContext.jsx
│
├── utils/
│   ├── apiClient.js
│   ├── authUtils.js
│   └── dataFormatter.js
│
├── styles/
│   ├── globals.css
│   └── tailwind.css
│
├── pages/
│   ├── index.jsx           // Landing/Login page
│   ├── dashboard.jsx       // Main dashboard routing
│   ├── doctor/
│   │   ├── index.jsx
│   │   └── patient-records.jsx
│   │
│   ├── patient/
│   │   ├── index.jsx
│   │   └── health-info.jsx
│   │
│   └── admin/
│       └── index.jsx
│
└── app.jsx                 // Optional root layout/wrapper
```
