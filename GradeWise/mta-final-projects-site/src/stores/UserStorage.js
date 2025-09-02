
import {makeAutoObservable, observable} from "mobx"
import { backendURL } from '../../src/config';


class UserStorage {
  /**
  * @param user has "type" and "name" in it  
  */
  user = null
  constructor() {
    makeAutoObservable(this, {
      user: observable
    })
  }

  async getDataFromToken(token) {
    const res = await fetch(`${backendURL}/check-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
    const resData = await res.json()
    console.log('Token verification response:', resData);
    if (!resData.success) return;
    this.user = resData.user;
    console.log('User data loaded from token:', this.user);
    return true
  }

  logout() {
    localStorage.removeItem("token");
    this.user = null;
  }
}

const userStorage = new UserStorage()
export default userStorage