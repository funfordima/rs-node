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
  index: number;
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
  index: number;
}

export interface RoomData {
  roomId: number | string;
  roomUsers: RoomUser[];
}

export class UpdateRoomResponse extends AbstractMessage<RoomData[]> {
  type = messageType.UPDATE_ROOM;
}

export interface AddUserRoomRequestData {
  indexRoom: number;
}

export class AddUserRoomRequest extends AbstractMessage<AddUserRoomRequestData> {
  type = messageType.ADD_USER;
}

export interface WinnersData {
  name: string;
  wins: number;
}

export class UpdateWinnersResponse extends AbstractMessage<WinnersData[]> {
  type = messageType.UPDATE_WINNERS;
}

export interface GameData {
  idGame: number | string;  
  idPlayer: number | string;
}

export class CreateGameResponse extends AbstractMessage<GameData> {
  type = messageType.CREATE_GAME;
}

export interface ShipPosition {
  x: number;
  y: number;
}

export interface Ships {
  position: ShipPosition;
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' |'huge',
}

export interface ShipsData {
  gameId: number | string;
  ships: Ships[];
  indexPlayer: number | string;
}

export class AddShipsRequest extends AbstractMessage<ShipsData> {
  type = messageType.ADD_SHIPS;
}

export type IncomingMessageRequest = RegistrationRequest | CreateRoomRequest | AddUserRoomRequest | AddShipsRequest;
