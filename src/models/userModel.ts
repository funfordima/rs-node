import { users } from '../data/users.js';
import { User } from './user.js';

const findAll = () : User[] => {
  return users;
};

export default {
  findAll
};
