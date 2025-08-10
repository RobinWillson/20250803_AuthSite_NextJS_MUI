import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import ThemeRegistry from '@/components/ThemeRegistry';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';

export const metadata: Metadata = {
  title: "Authentication Site",
  description: "Next.js Authentication Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "placeholder-client-id"}>
          <ThemeRegistry>
            <AuthProvider>
              <AppLayoutWrapper>
                {children}
              </AppLayoutWrapper>
            </AuthProvider>
          </ThemeRegistry>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
