import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { PatientProvider } from './context/PatientContext';
import { EmergencyProvider } from './context/EmergencyContext';
import { BedProvider } from './context/BedContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <PatientProvider>
        <EmergencyProvider>
          <BedProvider>
            <App />
          </BedProvider>
        </EmergencyProvider>
      </PatientProvider>
    </AuthProvider>
  </React.StrictMode>
);