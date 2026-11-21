import localFont from "next/font/local";
import { cn } from "@/lib/utils";

const fontSans = localFont({
	src: "../assets/Geist.ttf",
	variable: "--font-geist-sans",
	weight: "400",
});

const fontMono = localFont({
	src: "../assets/GeistMono.ttf",
	variable: "--font-geist-mono",
	weight: "400",
});

// Only the Square variant is used. Importing from `geist/font/pixel` would
// declare (and preload) all five Geist Pixel fonts on every page.
const GeistPixelSquare = localFont({
	src: "../assets/GeistPixel-Square.woff2",
	variable: "--font-geist-pixel-square",
	weight: "500",
	fallback: ["Geist Mono", "ui-monospace", "monospace"],
	adjustFontFallback: false,
});

export const fontVariables = cn(
	fontSans.variable,
	fontMono.variable,
	GeistPixelSquare.variable,
);
