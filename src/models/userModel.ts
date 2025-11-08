import { users } from '../data/users.js';
import { User } from './user.js';

const findAll = (): User[] => {
  return users;
};

const findById = (userId: string): User | undefined => {
  return users.find(({ id }) => id == userId);
};

const createUser = (username: string, age: number, hobbies: string[]): User => {
  const user: User = new User({ username, age, hobbies });

  users.push(user);
  
  return user;
};

const updateUser = (userId: string, username?: string, age?: number, hobbies?: string[]): User | undefined => {
  const user: User | undefined = users.find(({ id }) => id == userId);
  
  if (!!user) {
    user.username = username ?? user.username;
    user.age = age ?? user.age;
    user.hobbies = hobbies ?? user.hobbies;
  }
  
  return user;
};

const deleteUser = (userId: string): boolean => {
  const index: number = users.findIndex(({ id }) => id == userId);
  
  users.splice(index, 1);
  
  return index !== -1;
};

export default {
  findAll,
  findById,
  createUser,
  updateUser,
  deleteUser,
};
