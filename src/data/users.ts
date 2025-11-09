import { User } from 'models/user.js';

export const users: User[] = [
  new User({ username: 'John', age: 20, hobbies: ['gym', 'box'] }),
  new User({ username: 'Jane', age: 21, hobbies: ['pole dance'] }),
];
