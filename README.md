HealthConnect
HealthConnect is a telemedicine platform designed to provide seamless virtual healthcare services. The system connects patients with healthcare providers for consultations, scheduling, and medical records management. The platform features user-friendly interfaces for patients and healthcare providers, offering a streamlined solution to access medical services remotely.

Project Overview
HealthConnect is developed as part of the final assignment for introduction to software engineering course. The system aims to enhance healthcare accessibility by allowing remote consultations, improving patient outcomes, and reducing the need for in-person visits. The system supports three primary user roles: Patients, Healthcare Providers, and Administrators.

Technologies Used
Frontend: React, Vite, HTML, CSS, JavaScript, Tailwind CSS, Material UI
Backend: Django
Database: SQLite
Deployment: Vercel (Frontend), PythonAnywhere (Backend)
CI/CD: GitHub Actions
Authentication: Django-Auth, JWT
Features and Functionalities
User Registration and Login
Users can register and log in to the system.
Authentication is managed with Django-Auth and JWT.

Appointment Scheduling
Patients can schedule consultations with healthcare providers and receive reminders.

Video Consultations
Patients and healthcare providers can conduct live video consultations using integrated WebRTC technology.

Medical Records Management
Patients can manage their health records and share them with healthcare providers during consultations.

Healthcare Provider Dashboard
Healthcare providers can manage their consultations, patient records, and availability.

Admin Dashboard
Administrators can monitor system performance, manage users, and track consultations.

Project Setup
Prerequisites
Python 3.x
React Vite
SQLite
Git
PythonAnywhere
vercel
Installation
Clone the Repository:
Clone the Repository:
1. Clone the repository:
   ```bash
   git clone https://github.com/Deolinda/health.git
   cd health

2. Backend Setup
Step 1: Create a Virtual Environment

python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
Step 2: Install Required Python Packages

pip install -r requirements.txt
Step 3: Configure the Database

Navigate to the backend/settings.py file. Ensure the database settings point to an SQLite database or configure it for another DBMS.
Step 4: Run Migrations

python manage.py migrate
Step 5: Start the Backend Server

python manage.py runserver
The server will be accessible at http://127.0.0.1:8000/.

3. Frontend Setup
Step 1: Navigate to the Frontend Directory

cd frontend
Step 2: Install Required Packages

pnpm install
Step 3: Configure Environment Variables

Create a .env file in the frontend directory with the following:
VITE_BACKEND_URL=http://127.0.0.1:8000
Step 4: Start the Frontend Server

pnpm run dev
The server will be accessible at http://127.0.0.1:5173/.

Running the Project

Start the Backend Server:
python manage.py runserver
Start the Frontend Server:
pnpm run dev
Open your browser and navigate to http://127.0.0.1:5173/.
Deployment

Frontend
Deploy the frontend using Vercel:
vercel --prod
Backend
Deploy the backend using PythonAnywhere:
Upload the code to PythonAnywhere.
Set up a virtual environment and install the required dependencies.
Configure the database and environment variables.
Run migrations and start the application.
License

This project is licensed under the MIT License. See the LICENSE file for details.

Acknowledgements

Instructor: Tunde Isiaq Gbadamosi
Course: Introduction to Software Engineering
University: African Leadership University
