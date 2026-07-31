/*
This pattern is often called a barrel module: a small index.js file that gathers exports from nearby files.
*/

import userStorage from './UserStorage';
import appStorage from './AppStorage';

export const storages = {
  userStorage,
  appStorage
};
