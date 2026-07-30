/*
This file stores shared information about the current user, the app keeps current-user state.
shared MobX object in JavaScript memory.
*/

/*
makeAutoObservable tells MobX to automatically make a class’s properties and methods reactive.
marks a value as data MobX should track for changes.
*/
import {makeAutoObservable, observable} from "mobx"
import { backendURL } from '../../src/config';


class UserStorage {
 //The currently authenticated user, or null when nobody is signed in.
  user = null
  constructor() {
  //this -> the newly created UserStorage object.
    makeAutoObservable(this, {
      user: observable//user is observable data. Notify MobX when it changes
    })
  }
/*
A token is a string the backend gives the browser after a successful login. It is proof that the user already authenticated
User logs in with ID + password
→ backend verifies credentials
→ backend creates a JWT token
→ Login.js saves token in localStorage
→ later requests send token to backend
→ backend verifies token and identifies the user
Receive saved token:
→ send it to backend /check-token
→ backend verifies token
→ if valid, save user data in this.user
→ return success
async means this method performs asynchronous work and always returns a Promise.
It allows using await inside the method, This does not freeze the application. It pauses only this method until the backend responds.
*/
  async getDataFromToken(token) {
    const res = await fetch(`${backendURL}/check-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      /*
      { token: "abc123" }(js object) -> '{"token":"abc123"}'(JSON string)
      */
      body: JSON.stringify({ token }),
    })
    /*
    res.json() returns a Promise because the browser reads and parses the response asynchronously.
    await pauses only getDataFromToken(), not the entire app. React can still render and the browser remains 
    responsive.
    for example, backend sends: {"success":true,"user":{"name":"Ido","type":"admin"}}
    res.json() creates: 
    {
      success: true,
      user: {
         name: "Ido",
         type: "admin",
       },
    }
    */
    const resData = await res.json()
    console.log('Token verification response:', resData);
    if (!resData.success) return;
    this.user = resData.user;
    console.log('User data loaded from token:', this.user);
    return true
  }

/*
clear the current login session

*/
  logout() {
    localStorage.removeItem("token");
    this.user = null;
  }
}

const userStorage = new UserStorage()
/*
Exports that one shared object as this file’s default export.
Other files can import the same instance
Every file receives the same object, so they all read and update the same current-user state
*/
export default userStorage