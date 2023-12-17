import type { Component } from "solid-js";
import { Show } from "solid-js";
import { useRegisterSW } from "virtual:pwa-register/solid";
import * as Sentry from "@sentry/browser";

// Inspired by the SolidJS example on https://vite-pwa-org.netlify.app/frameworks/solidjs.html
const RefreshPwaPrompt: Component = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_scriptUrl, _r) {},
    onRegisterError(error) {
      console.error("SW registration error", error);
      Sentry.captureException(error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <div>
      <Show when={offlineReady() || needRefresh()}>
        <div class="fixed bottom-0 right-0 z-50 m-4 flex max-w-lg flex-col items-center gap-4 rounded-2xl bg-primary-50 px-4 py-4 text-primary-800 opacity-90 shadow-lg transition-opacity hover:opacity-100">
          <div>
            <Show
              fallback={
                <span>
                  🦄 A new version is available. Refresh your page to use it.
                </span>
              }
              when={offlineReady()}
            >
              <span>🔌️ Some app functionality is now available offline.</span>
            </Show>
          </div>
          <div class="flex w-full justify-end gap-4">
            <button class="btn-secondary" onClick={() => close()}>
              Close
            </button>
            <Show when={needRefresh()}>
              <button class="btn" onClick={() => updateServiceWorker()}>
                Refresh
              </button>
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default RefreshPwaPrompt;
