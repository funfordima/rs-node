import { AbstractMessage } from './baseMessage.js';
import { messageType } from '../constants/message.enum.js';

export interface RegistrationRequestData {
  name: string;
  password: string;
}

export class RegistrationRequest extends AbstractMessage<RegistrationRequestData> {
  type = messageType.REG;
}

export interface RegistrationResponseData {
  name: string;
  index: number | string;
  error: boolean;
  errorText: string;
}

export class RegistrationResponse extends AbstractMessage<RegistrationResponseData> {
  type = messageType.REG;
}
