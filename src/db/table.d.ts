import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  id: string; // primary key
  password: string;
  createdAt: Date;
}

export interface Carpool {
  _id?: ObjectId;
  driver_id: string; // primary key, ref: User.id
  passengers_id: string[]; // ref: User.id (복수)
  departure: string;
  destination: string;
  departureTime: Date;
  createdAt: Date;
}

export interface Taxi {
  _id?: ObjectId;
  passengers_id: string; // primary key, ref: User.id
  departure: string;
  destination: string;
  departureTime: Date;
  createdAt: Date;
}
