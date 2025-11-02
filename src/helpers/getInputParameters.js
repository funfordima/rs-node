import { commandList } from '../constants/command.js';
import { BASE_ERROR } from '../constants/error.js';

export const getInputParameters = (input) => {
  const [method, ...params] = input.split(' ');

  if (!commandList.includes(method)) {
    console.log(BASE_ERROR);

    return {
      method: 'cd',
      params: [], 
    };
  }

  return {
    method,
    params,
  };
};
