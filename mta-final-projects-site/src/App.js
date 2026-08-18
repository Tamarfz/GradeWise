/*
App.js is the frontend’s central coordinator. Its main goals are:
1. Define which React component appears for each URL.
2. Restore the logged-in user when the app starts.
3. Prevent users from seeing frontend pages for the wrong role.
4. Provide global app features, such as the theme.
It defines URLs such as:
/                  → Login
/register          → Register
/judge             → Judge dashboard
/admin             → Admin dashboard
It also contains route “layouts”:
 AuthLayout ->  redirects logged-in users away from Login
 JudgeLayout -> allows only judge users
 AdminLayout -> allows only admin users
*/

/*
useCallback -> memoizes a function reference between renders.
useEffect -> runs side effects after React renders
*/
import React, {useCallback, useEffect } from 'react';
/*
BrowserRouter connects React Router to the browser URL and history.
Routes is a container for all route definitions. It finds the route matching the current URL.
Route defines one URL rule.
Outlet is a placeholder for nested routes.
useNavigate is a Hook that gives a component a navigation function. It changes the route through JavaScript, without reloading the page.
*/
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import JudgeHome from './users/judge/JudgeHome';
import ProfileSetup from './users/judge/ProfileSetup';
import GradeProjects from './users/judge/GradeProjects';
import { AdminHome } from './users/admin/admin-homepage';
import ManageJudges from './users/admin/manage-judges';
import ManageProjects from './users/admin/manage-projects';
import AssignProjects from './users/admin/assign-projects';
import ManageGrades from './users/admin/manage-projects-grades';
import ExportData from './users/admin/export-data';
import Podium from './users/admin/podium';
import Analytics from './users/admin/analytics';
import Administration from './users/admin/administration';
import './App.css';
import './styles/theme.css';
import { observer } from 'mobx-react-lite';
import { storages } from './stores';
import styled from 'styled-components';
import { ThemeProvider } from './context/ThemeContext';


/*
 Add FontAwesome CSS
 document.createElement('link') creates a new DOM <link> element in memory.
 fontAwesomeLink.rel = 'stylesheet';-> tells the browser the link points to CSS.
*/
const fontAwesomeLink = document.createElement('link');
fontAwesomeLink.rel = 'stylesheet';
fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
document.head.appendChild(fontAwesomeLink);


/*
reates a React component named AdminLayout, wrapped with MobX observer.
It is a route guard: Only allow an admin user to see nested admin routes.”
*/
const AdminLayout = observer(() => {
  //Gets the React Router function used to redirect
  const navigate = useNavigate();
  const { userStorage, appStorage } = storages;
  //userStorage.user -> current logged-in user
  //appStorage.isLoading -> whether token restoration is in progress
  if (userStorage.user?.type !== 'admin' && !appStorage.isLoading) {
    return navigate('/');
  }
  //If the user is an admin, render the matching nested admin route.
  //<Outlet /> is where React Router inserts that child page.
  return <Outlet />;
});

const JudgeLayout = observer(() => {
  const navigate = useNavigate();
  const { userStorage, appStorage } = storages;
  if (userStorage.user?.type !== 'judge' && !appStorage.isLoading) {
    return navigate('/');
  }
  return <Outlet />;
});

const AuthLayout = observer(() => {
  const navigate = useNavigate();
  const { userStorage, appStorage } = storages;
  if (!appStorage.isLoading && userStorage.user) {
    if (userStorage.user?.type === 'admin') {
      return navigate('/admin');
    } else if (userStorage.user?.type === 'judge') {
      return navigate('/judge');
    }
  }
  return <Outlet />;
});

const App = observer(() => {
//not used currently
  const h1Style = {
    fontSize: '50px',
    color: '#165ea1',
    marginBottom: '15px',
  };

  const { userStorage, appStorage } = storages;

  const initiate = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    appStorage.isLoading = true;
    await userStorage.getDataFromToken(token);
    appStorage.isLoading = false;
  }, []);

  useEffect(() => {
    initiate();
  }, [initiate]);

  return (
    <ThemeProvider>{/*makes theme state available to every child component*/}
      <Router>{/*enables React Router for all child components*/}
        <div className="app-container" style={{ position: 'relative' }}>
        {/*starts the route definitions. React Router checks the current URL and renders the matching route tree inside this component.*/}
          <Routes>
            <Route path="/" element={<AuthLayout />}>
              <Route index element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route path={"/judge"} element={<JudgeLayout />}>
              <Route index element={<JudgeHome />} />
              <Route path="profile-setup" element={<ProfileSetup />} />
              <Route path="grade-projects" element={<GradeProjects />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminHome />} />
              <Route path="manage-judges" element={<ManageJudges />} />
              <Route path="manage-projects" element={<ManageProjects />} />
              <Route path="assign-projects" element={<AssignProjects />} />
              <Route path="manage-projects-grades" element={<ManageGrades />} />
              <Route path="export-data" element={<ExportData />} />
              <Route path="podium" element={<Podium />} />

              <Route path="analytics" element={<Analytics />} />
              <Route path="administration" element={<Administration />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
});

export default App;
