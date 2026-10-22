import localFont from "next/font/local";

// Font files can be colocated inside of `app`
export const satoshi = localFont({
    src: [
        {
            path: "./fonts/Satoshi-Regular.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "./fonts/Satoshi-Medium.woff2",
            weight: "500",
            style: "normal",
        },
        {
            path: "./fonts/Satoshi-Bold.woff2",
            weight: "700",
            style: "normal",
        },
        {
            path: "./fonts/Satoshi-Black.woff2",
            weight: "900",
            style: "normal",
        },
    ],
    display: "swap",
});