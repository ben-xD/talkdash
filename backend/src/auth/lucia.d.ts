/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./lucia.js").Auth;
  // These need to match the database column names, not the drizzle column properties
  type DatabaseUserAttributes = {
    name: string;
    created_at: Date;
    updated_at: Date;
  };
  type DatabaseSessionAttributes = {
    created_at: Date;
  };
}
