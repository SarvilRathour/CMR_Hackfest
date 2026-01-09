# Government Tender and Voting Portal (Prototype)

## Project Overview
This project is a web-based prototype designed to demonstrate a transparent digital governance system. The platform aims to connect government entities, contractors, and citizens in a unified ecosystem.

The current build focuses specifically on the **Citizen Interface**, enabling users to securely log in, participate in the selection of contractors for public tenders, and audit the progress of ongoing government projects.

## Core Functionality

### 1. Secure Authentication Simulation
The application simulates a high-security login environment without requiring a backend server.
* **ID Validation:** The login system enforces a strict 16-digit format (simulating a Virtual ID or Aadhaar), automatically handling spacing for better user experience.
* **Two-Factor Authentication (2FA):** A mock OTP (One-Time Password) system is implemented. Users cannot access the dashboard without verifying the randomly generated code sent to them during the login process.
* **Session Management:** The system differentiates between an active session (temporary) and long-term records, ensuring users are securely logged out when they leave the application.

### 2. Privacy and Data Protection
To adhere to privacy best practices, this prototype avoids storing sensitive Personal Identifiable Information (PII) in plain text.
* **Client-Side Hashing:** When a user logs in, their 16-digit ID is converted into a cryptographic hash. This hash is used to track voting records in the database, ensuring the actual ID is never exposed in the storage.
* **Masked Identity:** On the dashboard, the user's ID is displayed in a masked format (e.g., XXXX-XXXX-XXXX-1234), preventing "shoulder surfing" or accidental exposure of the full number.

### 3. Dual Voting Mechanism
The dashboard allows citizens to participate in governance through two distinct channels:
* **Tender Selection:** Citizens can review competing contractors for upcoming projects (e.g., Highway Expansion) and cast a vote for their preferred choice.
* **Phase Verification:** Citizens can act as auditors for ongoing work. They can review the status of specific project phases (e.g., Foundation work) and mark them as either "Satisfactory" or "Unsatisfactory."

### 4. Data Persistence
The application utilizes the browser's LocalStorage to function as a serverless database. This allows the application to remember a user's voting history even after the browser is closed. Logic is in place to prevent a single user (identified by their unique hash) from voting on the same project multiple times.

## Project Structure

The project is organized into a root directory and a source folder:

* **index.html**: The main landing page acting as the central gateway to the Government, Contractor, and User portals.
* **src/**: Contains the specific module files.
    * **user_login.html**: The secure login interface containing the validation, OTP, and hashing logic.
    * **user-dashboard.html**: The main interface for authenticated users to cast votes and review project status.
    * **gov_login.html**: (Placeholder) Interface for government administrators.
    * **contractor_main.html**: (Placeholder) Interface for contractors to view tenders.

## Setup and Usage

To run this prototype, no installation of Node.js or Python is required.

1.  Download or clone the project repository to your local machine.
2.  Ensure the file structure is maintained (keep the `src` folder inside the root folder).
3.  Open the `index.html` file in any modern web browser (Chrome, Edge, Firefox, or Safari).
4.  Navigate to "User Login" to test the authentication and voting flows.

## Disclaimer

This application is a frontend prototype developed for educational and demonstration purposes. It performs security operations (like hashing and OTP generation) on the client side. A production-ready version would require a secure backend server and a robust database management system to handle sensitive citizen data.
