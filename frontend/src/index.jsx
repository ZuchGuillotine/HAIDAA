// src/index.jsx

// Layout Components
import MainLayout from './components/layout/MainLayout';

// Common Components
import { Header, Sidebar, Footer } from './components/common';

// Authentication Components
import { LoginForm, MFAVerification } from './components/auth';

// Patient Components
import { PatientSearchList } from './components/patient';

// AI Components
import { 
	AIDiagnosticInterface,
	DiagnosticResults,
	InputMethods 
} from './components/ai';

// Sandbox Components
import { SandboxEnvironment } from './components/sandbox';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';

// Export all components
export {
	// Layout
	MainLayout,

	// Common
	Header,
	Sidebar,
	Footer,

	// Auth
	LoginForm,
	MFAVerification,

	// Patient
	PatientSearchList,

	// AI
	AIDiagnosticInterface,
	DiagnosticResults,
	InputMethods,

	// Sandbox
	SandboxEnvironment,

	// Context
	AuthProvider,
	useAuth,
};

/**
 * This is the main entry point for the application.
 * All components and utilities should be exported from here.
 * 
 * Usage example:
 * 
 * import { 
 *   MainLayout, 
 *   LoginForm, 
 *   PatientSearchList,
 *   useAuth 
 * } from '@/';
 */