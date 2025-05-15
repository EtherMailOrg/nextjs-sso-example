import { http, createConfig, injected } from "wagmi";
import { walletConnect } from "wagmi/connectors";
import { mainnet, polygon, arbitrum, sepolia } from 'wagmi/chains';
import { ethermailConnector } from "@ethermail/ethermail-wallet-provider";

const environment = process.env.NEXT_PUBLIC_ENVIRONMENT as 'staging' | 'dev' | 'production' ?? 'production';

export const config = createConfig({
  chains: [mainnet, polygon, arbitrum, sepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? '',
    }),
    ethermailConnector({
      widget_id: process.env.NEXT_PUBLIC_WIDGET_ID ?? '',
      afid: process.env.NEXT_PUBLIC_WIDGET_AFID ?? '',
      community_name: process.env.NEXT_PUBLIC_WIDGET_COMMUNITY_NAME ?? '',
      permissions: 'write',
      loginType: 'wallet',
      environment
    })
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [sepolia.id]: http(),
  },
})
