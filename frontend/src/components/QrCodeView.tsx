import { onMount } from "solid-js";
import QRCode from "qrcode";

const canvasRef: HTMLCanvasElement | undefined = undefined;

export const QrCodeView = ({ text }: { text: string }) => {
  onMount(() => {
    QRCode.toCanvas(canvasRef, text, {
      width: 350,
      color: {
        dark: "#3b82f6",
        light: "#fff",
      },
    });
  });

  return <canvas ref={canvasRef}></canvas>;
};
