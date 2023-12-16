import { Navigator } from "@solidjs/router";

// TODO store the previous page and redirect to it, when the user pressing signIn
export const navigateAfterAuth = (navigate: Navigator) => {
  const redirectToUrl = getRedirectPath();
  if (redirectToUrl) {
    console.info("Redirecting to", redirectToUrl);
    navigate(redirectToUrl);
  } else {
    navigate("/");
  }
};

export const redirectToLoginWithRedirectBack = (navigate: Navigator) => {
  const redirectToPath = window.location.pathname + window.location.search;
  navigate(`/sign-in?redirectTo=${redirectToPath}`);
};

export const getRedirectPath = (): string | undefined => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("redirectTo") ?? undefined;
};
