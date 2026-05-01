# BreachRadar 🔐

BreachRadar is a full-stack web application designed to scan email addresses against known data breaches and provide users with a comprehensive risk analysis and timeline of compromises.

![BreachRadar Screenshot](./screenshot-placeholder.png)

## Tech Stack
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)

## Features
- **Comprehensive Scanning:** Checks email addresses against HaveIBeenPwned API (12+ billion records).
- **Risk Scoring:** Intelligent Python-based risk scoring algorithm based on data classes compromised and recency.
- **Visual Analytics:** Interactive risk meter and timeline charts using Recharts.
- **Alert System:** Email notifications when new breaches are discovered.
- **Scan History:** View past scans and monitor risk over time.

## Setup Instructions

1. Clone the repository and install dependencies in the root, client, and server folders:
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

2. Environment Configuration:
   - In `server/`, copy `.env.example` to `.env` and fill in the required keys:
     ```env
     PORT=5000
     MONGODB_URI=your_mongodb_atlas_connection_string
     HIBP_API_KEY=your_haveibeenpwned_api_key
     EMAIL_USER=your_gmail@gmail.com
     EMAIL_PASS=your_gmail_app_password
     ```
   - In `client/`, ensure `.env` has:
     ```env
     VITE_API_URL=http://localhost:5000
     ```

3. Run the development environment:
   ```bash
   # From the root directory:
   npm run dev
   ```

## APIs
You will need a [HaveIBeenPwned API Key](https://haveibeenpwned.com/api/key) to fetch live breach data.
