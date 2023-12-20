import { describe, expect, test } from "vitest";
import { setupTestDatabaseLifecycle } from "../../setupTests/integration.test-utils.js";

const suiteName = "authRouter";
describe(suiteName, () => {
  const ref = setupTestDatabaseLifecycle(suiteName);

  test("can register user by email and password and login user only with correct password", async () => {
    const email = "albert.einstein@example.com";
    const password = "G&Di5EaF!hoF";
    const wrongPassword = "G&Di5EaF!hoG";
    await ref.caller.auth.signUpWithEmail({
      email,
      authMode: "session",
      name: "Test name",
      password,
    });

    await ref.caller.auth.signOut();

    await expect(async () => {
      await ref.caller.auth.signInWithEmail({
        email,
        password: wrongPassword,
      });
    }).rejects.toThrow();

    await ref.caller.auth.signInWithEmail({ email, password });

    await ref.caller.auth.registerUsername({
      newUsername: "Some random new username",
    });
  });
});
