﻿# projects_contest_2025

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [Contact](#contact)

## Project Overview

This project is a **grading system** designed for managing projects, assigning judges, and allowing judges to submit grades for assigned projects. The system provides a user-friendly interface for judges to grade projects based on multiple criteria such as **complexity, usability, innovation, presentation, and proficiency**.
**project url** http://mta-projects-contest.org/

> **Note:** The project was developed by Ido Beit On, Tamar Fuchs and Ohad Avidar.

## Technologies Used

- **Frontend:**
  - React
  - Styled Components
  - Material UI
  - SweetAlert2
  - Axios

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose

- **Cloud:**
  - Google Cloud Platform
  - Google Compute Engine
  - Google Artifact Registry
  - Namecheap (Domain + DNS)

- **Other Tools:**
  - MobX (state management)
  - Docker
  - CSV/XSLX Parsing (for bulk uploads)

## Setup Instructions

To set up and run this project locally, follow these steps:

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud-based)
- Docker (optional)

### Step-by-Step Guide

1. **Clone the repository:**

   ```bash
   git clone https://github.com/orelkabetz/projects_contest_2024.git
   cd projects_contest_2024
   ```

2. **Install dependencies:**

   Run the following commands to install the required dependencies:

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file at the root of the project with the following variables:

   ```
   REACT_APP_BACKEND_URL=http://localhost:3001
   ```

4. **Start the development server:**

   For frontend:
   ```bash
   cd mta-final-projects-site
   npm start
   ```

   For backend:
   ```bash
   cd mta-final-projects-site-backend-server
   npm start
   ```

5. **Access the application:**

   Open your browser and visit `http://localhost:3000` to use the grading system.

## Usage

- **Login:** Users (judges) can log in using their assigned credentials. Judge id: 111111111, password: 1234. Admin id: 315668954, password: 1234.
- **Grading Projects:** Judges can view a list of assigned projects, open a project, and submit grades.
- **Admin Functionality:** Admins can manage projects, upload project data via CSV, assign judges to projects, and view submitted grades.

## Features

- **Project Management:** Add, edit, and remove projects.
- **Judge Management:** Assign and manage judges for each project.
- **Project Assigning:** Asign Judges to Projects.
- **Grading System:** Allows judges to grade projects across five criteria.
- **Real-Time Validation:** Prevents the submission of duplicate grades for the same project by the same judge.
- **Confetti Effect:** Adds a playful confetti animation when hovering over graded projects in the Podium.

## API Endpoints

Here are some key API endpoints used in this project:

- **POST** `/gradeProject`: Submit a grade for a project.
- **GET** `/projectsForJudge/projectList`: Fetch the list of projects assigned to a judge.
- **POST** `/admin/projects/upload`: Upload project data via CSV.
- **POST** `/admin/judges/assign`: Assign judges to projects.
- **GET** `/admin/podium`: Fetch top 3 projects in various categories for podium view.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new feature branch.
3. Submit a pull request for review.

## Contact

If you have any questions or suggestions, feel free to reach out to:

- **Ido Beit On** - [beiton.ido@gmail.com](beiton.ido@gmail.com)
- **Tamar Fuchs** - [tamifuchs@gmail.com](tamifuchs@gmail.com)
- **Ohad Avidar** - [ohadavidar@gmail.com](ohadavidar@gmail.com)

