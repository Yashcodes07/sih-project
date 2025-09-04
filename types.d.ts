import { Connection } from "mongoose";
// we decalre types globally to include this in our file
declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

export {};