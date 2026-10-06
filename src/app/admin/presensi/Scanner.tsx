"use client";
import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
export default function QRScanner({
  onScan,
}: {
  onScan: (decodedText: string) => void;
}) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false,
    );
    scannerRef.current.render(
      (decodedText) => {
        onScan(decodedText);
      },
      (err) => {
        /* Silent error during scanning (e.g. no QR detected yet) */
      },
    );
    return () => {
      scannerRef.current?.clear().catch(() => {});
    };
  }, [onScan]);
  return (
    <div
      id="qr-reader"
      className="w-full max-w-md mx-auto overflow-hidden rounded-md border-4 border-slate-800 bg-black"
    ></div>
  );
}
