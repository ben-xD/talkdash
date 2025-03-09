import { makePersisted } from "@solid-primitives/storage";
import QRCode from "qrcode";
import { createEffect, createSignal } from "solid-js";
import { bgColor, oklchToHex, primaryColor } from "../css/colors.ts";
import { cn } from "../css/tailwind.ts";
import { createWindowSizeSignal } from "../window/useWindowSize.ts";

export const [isQrCodeShown, setIsQrCodeShown] = makePersisted(
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
    const primary = primaryColor();
    const primaryHex = primary !== undefined ? oklchToHex(primary) : undefined;
    const bg = bgColor();
    const bgHex = bg !== undefined ? oklchToHex(bg) : undefined;
    const color = props.isDarkMode
      ? {
          light: primaryHex,
          dark: "#1f2937",
        }
      : {
          dark: primaryHex,
          light: bgHex,
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
