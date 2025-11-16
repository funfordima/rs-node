import { RegistrationRequestData } from '../types/wss.type.js';

const users: RegistrationRequestData[] = [];

export const userModel = {
  getUser(name: string, password: string): RegistrationRequestData | null {
    return users.find(u => u.name == name && u.password == password) ?? null;
  },

  getUserIndex(name: string, password: string): number {
    return users.findIndex(u => u.name == name && u.password == password);
  },

  hasUser(name: string): boolean {
    return users.some(u => u.name == name);
  },

  addUser(name: string, password: string): RegistrationRequestData | null {
    if (userModel.hasUser(name)) {
      return userModel.getUser(name, password);
    }

    const user: RegistrationRequestData = {
      name, 
      password,
    };

    users.push(user);

    return user;
  },
};