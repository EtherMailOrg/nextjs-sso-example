import { http, createConfig, injected } from "wagmi";
import { walletConnect } from "wagmi/connectors";
import { mainnet, polygon, arbitrum, sepolia } from 'wagmi/chains';
import { ethermailConnector } from "@/utils/ethermail.connector";

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
    })
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [sepolia.id]: http(),
  },
})
