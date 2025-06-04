'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import NavBar from '@/app/components/navbar';
import StoreProvider from '@/app/StoreProvider';
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from "@/utils/wagmi.utils";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import '@rainbow-me/rainbowkit/styles.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  return (
    <html lang="en">
    <body className={inter.className}>
    <StoreProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider coolMode={true} appInfo={{appName: "EtherMail POC", learnMoreUrl: `https://${process.env.NEXT_PUBLIC_ETHERMAIL_DOMAIN}/sso` }}>
            <NavBar />
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </StoreProvider>
    </body>
    </html>
  );
}