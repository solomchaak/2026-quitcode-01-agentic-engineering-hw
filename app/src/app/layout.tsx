import type { Metadata } from "next";
import { PorscheDesignSystemProvider } from "@porsche-design-system/components-react/ssr";
import {
  getComponentChunkLinks,
  getFontLinks,
  getIconLinks,
  getMetaTagsAndIconLinks,
} from "@porsche-design-system/components-react/partials";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tic-Tac-Toe",
  description: "A simple Tic-Tac-Toe game built with the Porsche Design System.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        {getFontLinks({ format: "jsx" })}
        {getIconLinks({ format: "jsx" })}
        {getComponentChunkLinks({ format: "jsx" })}
        {getMetaTagsAndIconLinks({ appTitle: "Tic-Tac-Toe", format: "jsx" })}
      </head>
      <body>
        <PorscheDesignSystemProvider>{children}</PorscheDesignSystemProvider>
      </body>
    </html>
  );
}
