import { users } from '../data/users.js';
import { User } from './user.js';

const findAll = (): User[] => {
  return users;
};

const findById = (userId: string): User | undefined => {
  return users.find(({ id }) => id == userId);
};

const createUser = (username: string, age: number, hobbies: string[]) => {
  const user: User = new User({ username, age, hobbies });

  users.push(user);
  
  return user;
};

export default {
  findAll,
  findById,
  createUser,
};
