import { createEffect, createSignal } from "solid-js";
import QRCode from "qrcode";
import { cn } from "../css/tailwind.ts";
import { bgColor, primaryColor } from "../css/colors.ts";
import { createWindowSizeSignal } from "../window/useWindowSize.ts";
import { makePersisted } from "@solid-primitives/storage";

export const [isQrCodeShown, setIsQrCodeShown] = makePersisted(
  // we don't destructure because makePersisted wants the entire signal
  // eslint-disable-next-line solid/reactivity
  createSignal<boolean>(false),
  {
    name: "is_qr_code_shown",
  },
);

export const QrCodeView = (props: {
  text: string;
  isDarkMode?: boolean;
  class?: string;
}) => {
  let canvasRef: HTMLCanvasElement | undefined;
  const size = createWindowSizeSignal();

  const renderQrToCanvas = (width: number) => {
    const color = props.isDarkMode
      ? {
          light: primaryColor(),
          dark: "#1f2937",
        }
      : {
          dark: primaryColor(),
          light: bgColor(),
        };
    QRCode.toCanvas(canvasRef, props.text, {
      width,
      color,
    });
  };

  createEffect(() => {
    renderQrToCanvas(size().width * 0.5);
  });

  return (
    <canvas
      class={cn("overflow-hidden rounded-2xl", props.class)}
      ref={canvasRef}
    />
  );
};
