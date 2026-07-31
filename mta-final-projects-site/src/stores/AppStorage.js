import { makeAutoObservable } from "mobx"

/*
UserStorage → authenticated user: who is currently logged in
AppStorage  → app-wide UI state and temporary registration-form data
*/

class AppStorage {
  /*
  false -> app is not restoring a token
  true  -> app is currently restoring/verifying a saved token
  isLoading coordinates token restoration and route guards.
  */
  
  isLoading = false;
  //probably can remove this user object
  user = {
    email: "", // New email field added
    name: "",
    password: ""
  };

  constructor() {
    makeAutoObservable(this)
  }

  setUserEmail(email) {
    this.user.email = email;
  }

  // Optionally add additional setters for other fields:
  updateUserField(field, value) {
    if (this.user.hasOwnProperty(field)) {
      this.user[field] = value;
    }
  }
}

const appStorage = new AppStorage()
/*
AppStorage is a MobX singleton, just like UserStorage.
*/
export default appStorage