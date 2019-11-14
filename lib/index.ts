import { Client } from "./client";
import * as Constants from "./constants";
import * as Schema from "./graphql/schema";
import * as Interfaces from "./graphql/interfaces";
import * as Types from "./graphql/types";
import * as Errors from "./errors";

// polyfills
(Symbol as any).asyncIterator = Symbol.asyncIterator || Symbol.for("Symbol.asyncIterator");

export { Client, Constants, Schema, Interfaces, Types, Errors };
