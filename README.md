# GradeWise

GradeWise is a full‑stack web app for managing projects exhibitions and competitions, assigning judges, and collecting structured grades across multiple criteria. It provides separate, role‑based experiences for **judges** and **administrators**, built with a modern React frontend and a Node.js/Express backend on MongoDB.

---

## Highlights

- **Role‑based UX**: Dedicated dashboards for judges and admins, with protected routes (`/admin`, `/judge`) and JWT‑based auth.
- **Rich grading model**: Projects are evaluated across five criteria: complexity, usability, innovation, presentation, and proficiency.
- **Admin tools**:
  - Import projects and potential users from CSV.
  - Assign projects to judges with duplicate‑assignment protection.
  - Browse and manage submitted grades.
  - Analytics and podium views for top projects and grade distributions.
- **Judge tools**:
  - See assigned projects and grade them via a clean UI.
  - Configure preferences and profile details (including avatar).

---

## Tech Stack

- **Frontend**: React 18, React Router 6, MobX, Styled Components, MUI, SweetAlert2  
- **Backend**: Node.js, Express.js, JWT, MongoDB (Mongoose + native collections)  
- **Other**: Multer (CSV import), Chart.js, Axios

---

## Run Locally

### Backend

```bash
cd mta-final-projects-site-backend-server
npm install
```

Create `.env` in `mta-final-projects-site-backend-server`:

```env
MONGODB_URI=mongodb://localhost:27017/gradewise
JWT_SECRET=dev-only-change-me-immediately
JWT_EXPIRES_IN=7d
CORS_ORIGINS=http://localhost:3000
PORT=3001
```

Start the server:

```bash
npm start
```

### Frontend

```bash
cd mta-final-projects-site
npm install
```

Create `.env` in `mta-final-projects-site`:

```env
REACT_APP_BACKEND_URL=http://localhost:3001
```

Start the app:

```bash
npm start
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:3001`.

---

## Screens at a Glance

- `/` – Login (redirects to `/admin` or `/judge` based on role).
- `/judge` – Judge dashboard and grading flow.
- `/admin` – Admin home with navigation to:
  - Manage judges and projects.
  - Assign projects to judges.
  - View grades, analytics, and podium.

---

> This project demonstrates a realistic full‑stack architecture: Express + JWT backend with controllers/services, and a React/MobX frontend with role‑based routing and a non‑trivial domain (grading and analytics). Perfect to showcase in a portfolio or CV.

