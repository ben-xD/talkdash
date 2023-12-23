import { ByBenButterworth } from "../components/ByBenButterworth.tsx";
import { onMount } from "solid-js";
import { captureAnalyticsEvent } from "../AnalyticsEvents.ts";

const AboutPage = () => {
  onMount(() => {
    document.title = "About · TalkDash";
    captureAnalyticsEvent("pageLoad", { page: "about" });
  });

  return (
    <div class="my-4 flex max-w-[400px] flex-col gap-8">
      <p>
        This app is completely free to use and is open source. I designed it for
        event organisers to use to keep speakers on time.
      </p>
      <p>
        If you'd like to report a bug or request a feature, please use the{" "}
        <a class="link" href="https://github.com/ben-xD/talkdash/issues">
          issue tracker
        </a>
        .
      </p>
      <ByBenButterworth />
    </div>
  );
};

export default AboutPage;
