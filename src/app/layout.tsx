import { Inter, Poppins } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter"
});

const poppins = Poppins({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-poppins"
});

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}): JSX.Element {
    return (
        <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
            <body>{children}</body>
        </html>
    );
}
