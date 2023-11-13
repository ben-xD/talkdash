/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("lucia").Auth;
  // These need to match the database column names, not the drizzle column properties
  type DatabaseUserAttributes = {
    name: string | null;
    created_at: Date;
    updated_at: Date;
    email: string | null;
  };
  type DatabaseSessionAttributes = {
    created_at: Date;
  };
}
