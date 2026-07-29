//{ useState } is a named import: it imports React’s useState Hook. lets the component remember changing values.
import React, { useState } from "react";
//Link is a React component for navigating without refreshing the whole page.
//useNavigate is a Hook that gives navigate(...) function to redirect in JavaScript after login.
import { Link, useNavigate } from "react-router-dom";
//observer connects this component to MobX. It makes React re-render Login if MobX state that it reads changes.
import { observer } from "mobx-react-lite";
/*
styled creates React components with CSS written in JavaScript. keyframes defines CSS animations.
styled-components is an extra JavaScript layer. It takes the CSS written in Login.js, creates a unique CSS class, injects that CSS into the page, and applies the class to the generated component.
*/
import styled, { keyframes } from "styled-components";
//This imports the project’s shared MobX stores from src/stores/index.js.
import { storages } from "./stores";
import { backendURL } from "./config";
//Swal is the default export of SweetAlert2, a library for popup messages.
import Swal from 'sweetalert2';
import "./Login.css";

/* 
Logo animations
const float stores an animation definiton.
keyframes is a tagged template literal.
transform changes how an element is displayed without changing the page layout.
translateY(...) moves it vertically.
Negative Y means up; positive Y means down.
*/
const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

/*
pulse makes the logo grow slightly and return to its normal size.
*/
const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

/*
creates a reusable styled image component
styled.img means create a React component that renders an HTML <img> element with these styles.”
The image can use at most 60% of its parent’s width.
height: auto preserves the image’s aspect ratio, preventing it from being stretched.
Adds a shadow based on the visible shape of the image.
${float} inserts the JavaScript variable into this CSS template.
3s → duration of one cycle
ease-in-out → smooth start and end
infinite  → repeat forever
*/
const AnimatedLogo = styled.img`
  max-width: 60%;
  height: auto;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
  transition: all 0.3s ease;
  animation: ${float} 3s ease-in-out infinite;

  &:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 15px 40px rgba(0, 0, 0, 0.4));
    animation: ${pulse} 1s ease-in-out;
  }
`;

/*
A React component is usually a JavaScript function that describes a reusable part of the user interface.
It can:
receive data through props
keep local state with useState
handle events such as clicks/submits
return JSX that describes what the screen should show
MobX is a JavaScript state-management library, for shared application state—data many components may need, even when they are far apart in the component tree. MobX only works when two parts work together:
1.The store makes data observable.
2.observer(...) makes a React component react to that observable data.

observer is a MobX function that takes a React component and returns an enhanced version that re-renders when MobX state it reads changes. 'Login' holds the enhanced component.

*/
const Login = observer(() => {
  const { userStorage } = storages;//The component later uses it to store the logged-in user.
  const [userID, setUserID] = useState("");//useState("") returns an array with two values [currentValue, functionToUpdateIt]
  const [password, setPassword] = useState("");//password -> current password text, setPassword -> function that updates it. 
  const navigate = useNavigate();//useNavigate() is a React Router Hook. It returns a function that lets JavaScript change the current route:

/*
helper function inside the Login component, Code outside Login.js, or outside the Login function, cannot call it directly.
React creates this function again whenever Login re-renders. That is normally fine for a small validation helper.
The arguments happen to be the React state variables with the same names, but inside the helper function they are its own local parameters.
*/
  const checkValidInputs = (userID, password) => {
  //userID.trim() Creates a new string without whitespace at the beginning or end, "" is false.
    if (!userID.trim() || !password.trim()) {
    //alert(...) is a built-in browser popup
      alert("Please enter both ID number and password");
      //immediately ends this helper function and tells the caller that validation failed.
      return false;
    }
    if (userID.length < 9) {
      alert("ID number must be at least 9 characters long");
      return false;
    }
    
    return true;
  };

/*
handles the form-submission event. e means event. When the user clicks the submit button or presses Enter inside the form,
the browser creates an event object and React passes it to this function.
It contains information and methods related to that submission.
*/
  const handleLogin = (e) => {
  /*
  Stop the browser’s normal form submission behavior.
  HTML forms have default browser behavior:
  User clicks Submit
→ browser creates an HTTP request from the form fields
→ browser navigates to the response page
→ current page is replaced/reloaded
 The browser leaves the current page, so its JavaScript memory is discarded.
  But this is a React single-page application. JavaScript handles login using fetch, without reloading the page. SPA:
  Browser loads one HTML page
→ React JavaScript loads
→ React controls the visible UI
→ changing pages usually changes components, not the full document
  */
    e.preventDefault();
    if (checkValidInputs(userID, password)) {
      sendLoginRequest(userID, password);
    }
  };

  const sendLoginRequest = (userID, password) => {
  /*
  fetch is the browser’s built-in JavaScript API for making an HTTP request without navigating away from the page.
  fetch(...) returns a Promise object. A Promise is an object representing a result that will exist later.
  Stay on the current React page
→ send a POST request to backend /login
→ send ID and password as JSON
→ wait for backend response
Backticks create a template literal. ${backendURL} inserts the value imported from config.js.
  */
    fetch(`${backendURL}/login`, {
      method: "POST",
      //Headers are metadata attached to the HTTP request.
      headers: { "Content-Type": "application/json" },
      /*
      { userID, password } creates a JavaScript object, This is property shorthand. It means:
      {
         userID: userID,
         password: password,
      }
      JSON.stringify(...) converts that JavaScript object into a JSON text string.
      That string is sent in the HTTP request body.
      */
      body: JSON.stringify({ userID, password }),
    })
    /*
    fetch(...) resolves with a response object.
    That object contains HTTP information, such as: response.status, response.headers, response.ok
    But it does not yet contain a usable JavaScript object for the response body.
    response.json() reads the response body and parses JSON into a JavaScript object.
    It also returns a Promise, because reading/parsing the response happens asynchronously.
    This shorter line has an implicit return.
    then() is a method used to handle the outcome of an asynchronous operation managed by a Promise.
    callbackfunctions to execute as soon as the Promise is successfully resolved (fulfilled) or rejected
    */
      .then((response) => response.json())
      //After response.json() succeeds, data contains the parsed backend response.
      .then((data) => {
      //Checks whether the backend says login succeeded.
        if (data.success) {
        //localStorage is browser storage that persists after a page refresh or browser restart.
        //When GradeWise starts again, App.js reads that saved token and asks the backend to verify it.
          localStorage.setItem("token", data.token);
          //This updates the shared MobX user state.
          userStorage.user = data.user;
          if (data.user.type === "admin") {
          //navigate(...) changes the React route without reloading the whole page.
            navigate("/admin");
          } else if (data.user.type === "judge") {
            navigate("/judge");
          }
        } else {
        //Swal.fire(...) shows a SweetAlert popup.
          Swal.fire({
            title: 'Error',
            text: 'Invalid credentials',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      })
      /*
      handles rejected Promises anywhere earlier in the chain.
      */
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          title: 'Error',
          text: 'An error occurred during login.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  };

/*
The React component returns JSX: a description of the UI React should display.
A React component is a JavaScript function that returns JSX (JavaScript XML), which describes what the user interface should look like. This JSX is syntactic sugar that compiles down into standard JavaScript objects representing DOM elements.
The DOM means Document Object Model.
The browser turns HTML into a tree of JavaScript objects.
Login component runs:
→ returns JSX
→ React reads the JSX
→ React creates or updates DOM elements
→ browser displays the login screen
component is the JavaScript function; JSX is its UI description; and DOM elements are the real browser-page elements React eventually updates.
State or props change:
→ React runs the component again
→ component returns new JSX
→ React updates only the necessary browser DOM elements
JSX: syntax describing UI.
- Render: React calls a component to get JSX.
- Reconciliation: React compares the new UI description with the previous one. The goal of reconciliation is to update the screen correctly without rebuilding the whole page.
- DOM update: React changes only what is needed in the browser.
*/
  return (
  //Everything nested inside this div is part of the login screen.
    <div className="login-container">
    //layout container
      <div className="left-half">
      //'AnimatedLogo is the custom styled component defined earlier
      //React renders it as an 'img' element with the animation and styling included.
        <AnimatedLogo
          src={`${process.env.PUBLIC_URL}/Assets/Logos/GradeWiseLogoRemoveBg.png`}
          alt="GradeWise Logo"
          //Images do not contain child elements, so JSX uses a self-closing tag:
        />
      </div>//end of left half
      //second layout section, beside left-half.
      <div className="right-half">
      //This is an inner container around the form. It lets Login.css style the form area alone.
        <div className="login-box">
          <h2>Login</h2>
          /*
          creates an HTML form, onSubmit=handleLogin means When the user submits this form then
          react should call the handleLogin function
          */
          <form onSubmit={handleLogin}>
            Groups the label and input together so CSS can style them as one field.
            <div className="form-group">
              /*
              creates a visible label for the ID input
              htmlFor="userID" connects this label to the input with the matching ID.
              Benefits:
              Clicking ID Number: focuses the input.
              Screen readers can announce the input as “ID Number.”
              Its gives the field proper HTML meaning and accessibility.
              */
              <label htmlFor="userID">ID Number:</label>
              //starts an HTML input element—a box where the user can type.
              <input
                type="text"
                id="userID"
                //The text shown in this input must equal the current userID state
                value={userID}
                /*
                  Whenever this input’s value changes, update React state.
                  User types: 1 ->  e.target.value: "1" -> setUserID("1") -> React re-renders
                             -> value={userID} displays "1"
                */
                onChange={(e) => setUserID(e.target.value)}
                className="input-with-icon-id"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-with-icon-password"
              />
            </div>
            //type="submit" means means clicking it submits the nearest form.
            <button type="submit">Log in</button>
            /*
            This starts the Sign up button. type="button" is important. It means:
            its a normal button so do not submit the form.”
            Without a type, a button inside a form is usually treated as type="submit" by default.
            */
            <button type="button">
            /*
            Link is React Router’s navigation component, which is a React component that changes the 
            app's URL and displayed React page.
            Click Link
             → update browser URL to /register
             → React Router checks its routes
             → React renders the Register component
             → no full page reload
            to="/register -> When clicked, change the React route to /register
            It navigates to the registration component without reloading the entire page
            */
              <Link to="/register" className="register-button">
                Sign up
              </Link>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});

export default Login;
