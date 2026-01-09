#CMR HACKFEST
## Team Entropykillers

# 🏛️ Decentralized Government Tender & Voting Portal (Prototype)

A transparent, frontend-based web application designed to connect Citizens, Contractors, and the Government. This prototype focuses on the **Citizen Voting Module**, allowing users to securely log in, vote for contractors on upcoming tenders, and audit ongoing project phases.

---

## 🚀 Key Features

### 🔐 Secure User Authentication (Simulated)
- **16-Digit ID Format**: Enforces a strict 16-digit Aadhaar/VID format with auto-spacing (e.g., `0000 0000 0000 0000`).
- **Mock OTP System**: Simulates a 2-Factor Authentication (2FA) flow with a generated OTP for login verification.
- **Session Uniqueness**: Prevents duplicate logins or unauthorized access using `sessionStorage`.

### 🛡️ Privacy & Security
- **Data Hashing**: User IDs are hashed before being stored. The raw 16-digit ID is never saved in the browser's permanent storage, protecting user privacy.
- **Masked Identity**: The dashboard displays a masked version of the ID (e.g., `XXXX-XXXX-XXXX-9012`) to prevent "shoulder surfing."

### 🗳️ Dual Voting Mechanism
1.  **Contractor Selection**: Citizens can vote for their preferred contractor for new government tenders (e.g., Highway Expansion).
2.  **Phase Verification**: Citizens can audit ongoing projects and mark phases (like "Foundation") as **Satisfactory** or **Unsatisfactory**.

### 💾 Serverless Database (LocalStorage)
- The application uses the browser's `localStorage` to persist voting records permanently.
- Users cannot vote twice on the same project, even after refreshing the page or logging out.

---

## 📂 Project Structure

```text
/ (Root Directory)
│
├── index.html              # Main Landing Page (Gateway to all portals)
├── README.md               # Project Documentation
│
└── src/                    # Source Code Folder
    ├── user_login.html     # Secure Citizen Login Page (with OTP & Hashing)
    ├── user-dashboard.html # Citizen Dashboard (Voting & Auditing Interface)
    ├── gov_login.html      # (Placeholder) Government Admin Login
    └── contractor_main.html# (Placeholder) Contractor Interface