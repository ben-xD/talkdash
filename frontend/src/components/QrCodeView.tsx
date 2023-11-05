import { onMount } from "solid-js";
import QRCode from "qrcode";

let canvasRef: HTMLCanvasElement | undefined;

export const QrCodeView = (props: {
  text: string;
  isDarkMode?: boolean;
  class?: string;
}) => {
  onMount(() => {
    const color = props.isDarkMode
      ? {
          dark: "#3b82f6",
          light: "#1f2937",
        }
      : {
          dark: "#3b82f6",
          light: "#fff",
        };
    QRCode.toCanvas(canvasRef, props.text, {
      width: 350,
      color,
    });
  });

  return <canvas class={props.class} ref={canvasRef} />;
};
