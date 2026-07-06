import "./index.css"; 
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { EmergencyProvider } from "./context/EmergencyContext";
import { BedProvider } from "./context/BedContext";
import { PatientProvider } from "./context/PatientContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <EmergencyProvider>
        <BedProvider>
          <PatientProvider>
            <App />
          </PatientProvider>
        </BedProvider>
      </EmergencyProvider>
    </AuthProvider>
  </React.StrictMode>
);