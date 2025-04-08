import { makeAutoObservable } from "mobx"

class AppStorage {
  isLoading = false;
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
export default appStorage