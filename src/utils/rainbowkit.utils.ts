import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  mainnet,
  polygon,
  arbitrum,
  base,
} from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'EtherMail RainbowKit POC',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? '',
  chains: [mainnet, polygon, arbitrum, base],
  ssr: true,
});