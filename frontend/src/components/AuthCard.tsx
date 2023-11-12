import { Card } from "./Card";
import { A } from "@solidjs/router";
import { createStore } from "solid-js/store";

export const AuthCard = (props: {
  title: string;
  subtitle: string;
  mode: "sign-in" | "sign-up";
  onSubmit: (username: string, password: string) => void;
}) => {
  const label = () => (props.mode === "sign-in" ? "Sign In" : "Sign Up");
  const switchLabel = () => (props.mode === "sign-in" ? "Sign Up" : "Sign In");
  const switchPath = () => (props.mode === "sign-in" ? "/sign-up" : "/sign-in");
  const switchQuestion = () =>
    props.mode === "sign-in" ? "Don't have an account?" : "Have an account?";

  const [fields, setFields] = createStore<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const onSubmit = () => {
    const { email, password } = fields;
    props.onSubmit(email, password);
  };

  return (
    <div class="flex flex-1 flex-col justify-center py-8">
      <Card class="flex flex-col p-4">
        <div class="flex w-96 flex-1 flex-col gap-8">
          <div>
            <h1 class="lg:text-2xl">{props.title}</h1>
            <h2 class="text-sm">{props.subtitle}</h2>
          </div>
          <div class="flex flex-col gap-4">
            {/*<div>*/}
            {/*  <p>Oauth option 1</p>*/}
            {/*  <p>Oauth option 2</p>*/}
            {/*</div>*/}
            {/*<div class="flex justify-center text-sm">*/}
            {/*  <span class="bg-background text-foreground px-2 text-sm">or</span>*/}
            {/*</div>*/}
            <div>
              <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                  <label for="email">Email</label>
                  <input
                    id="email"
                    type="text"
                    onInput={(e) => setFields("email", e.target.value)}
                  />
                </div>
                <div class="flex flex-col gap-2">
                  <label for="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    onInput={(e) => setFields("password", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <button class="btn" onClick={onSubmit}>
            {label()}
          </button>
          <p class="text-center text-sm">
            {switchQuestion()}{" "}
            <A class="underline hover:text-blue-200" href={switchPath()}>
              {switchLabel()}
            </A>
          </p>
        </div>
      </Card>
    </div>
  );
};
