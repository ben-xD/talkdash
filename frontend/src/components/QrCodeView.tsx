import { onMount } from "solid-js";
import QRCode from "qrcode";

let canvasRef: HTMLCanvasElement | undefined;

export const QrCodeView = (props: { text: string }) => {
  onMount(() => {
    QRCode.toCanvas(canvasRef, props.text, {
      width: 350,
      color: {
        dark: "#3b82f6",
        light: "#fff",
      },
    });
  });

  return <canvas ref={canvasRef} />;
};
