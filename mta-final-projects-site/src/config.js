/*
Define the frontend URL of the backend API once, then export it for all API requests.
*/







//const backendURL = process.env.REACT_APP_BACKEND_URL;
//const backendURL = "http://localhost:3001";
//const apiUrl = "http://localhost:3001";

const backendURL = process.env.REACT_APP_BACKEND_URL;
const apiUrl = process.env.REACT_APP_BACKEND_URL;

export { backendURL, apiUrl };
//export default { apiUrl };
