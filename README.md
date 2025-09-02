# GradeWise

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
**project url** https://myy-frontend-732475345418.me-west1.run.app/

> **Note:** The project was developed by Ido Beit On, Tamar Fuchs, Ohad Avidar.

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
  

## Setup Instructions

To set up and run this project locally, follow these steps:

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud-based)
- Docker (optional)



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
- 

## API Endpoints

Here are some key API endpoints used in this project:

- **POST** `/gradeProject`: Submit a grade for a project.
- **GET** `/projectsForJudge/projectList`: Fetch the list of projects assigned to a judge.
- **POST** `/admin/judges/assign`: Assign judges to projects.
- **GET** `/admin/podium`: Fetch top 3 projects in various categories for podium view.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new feature branch.
3. Submit a pull request for review.
