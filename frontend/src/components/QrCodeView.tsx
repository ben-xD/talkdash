import { createEffect } from "solid-js";
import QRCode from "qrcode";
import { cn } from "../css/tailwind.ts";
import { bgColor, primaryColor } from "../css/colors.ts";

export const QrCodeView = (props: {
  text: string;
  isDarkMode?: boolean;
  class?: string;
}) => {
  let canvasRef: HTMLCanvasElement | undefined;
  const renderQrToCanvas = () => {
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
      width: 350,
      color,
    });
  };

  createEffect(() => {
    renderQrToCanvas();
  });

  return (
    <canvas
      class={cn("overflow-hidden rounded-2xl", props.class)}
      ref={canvasRef}
    />
  );
};
