import { userModel } from '../models/user.model.js';
import { RegistrationRequestData, RegistrationResponse } from '../types/wss.type.js';

export const regUser = (name: string, password: string): RegistrationResponse => {
  const user: RegistrationRequestData | null = userModel.addUser(name, password);
  const index: number = userModel.getUserIndex(name, password);

  const response = new RegistrationResponse({
    name: user?.name ?? name,
    index,
    error: !user,
    errorText: !user ? 'User not found.' : '',
  });

  return response;
};

export const hasUser = (name: string): boolean => {
  return userModel.hasUser(name);
};

export const getUserIndex = (name: string, password: string): number => {
  return userModel.getUserIndex(name, password);
};
