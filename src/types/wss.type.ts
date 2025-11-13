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

export class ErrorResponse extends AbstractMessage<RegistrationResponseData> {
  type = messageType.ERROR;
}

export class CreateRoomRequest extends AbstractMessage<string> {
  type = messageType.CREATE_ROOM;
}

export interface RoomUser {
  name: string;
  index: number | string;
}

export interface RoomRequestData {
  roomId: number | string;
  roomUsers: RoomUser[];
}

export class UpdateRoomRequest extends AbstractMessage<RoomRequestData[]> {
  type = messageType.UPDATE_ROOM;
}

export interface AddUserRoomRequestData {
  indexRoom: number | string;
}

export class AddUserRoomRequest extends AbstractMessage<AddUserRoomRequestData> {
  type = messageType.ADD_USER;
}

export type IncomingMessageRequest = RegistrationRequest | CreateRoomRequest | UpdateRoomRequest | AddUserRoomRequest;
