'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  SSOPermissionType,
} from '@/intefaces/web3.interfaces';
import { EtherMailProvider } from '@ethermail/ethermail-wallet-provider';
import { BrowserProvider } from 'ethers';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { _web3Provider } from '@/lib/reducers/web3ProviderSlice';
import { _ethermailProvider } from '@/lib/reducers/ethermailProviderSlice';
import { _loginDataProvider } from '@/lib/reducers/loginDataProviderSlice';
import { Chain } from '@/intefaces/web3.interfaces';
import { usePathname, useRouter } from 'next/navigation';
import { EthermailLoginData } from '@/intefaces/ethermail.interfaces';
import { useAccount, useDisconnect } from 'wagmi';
import { WalletOptions } from "@/app/components/WagmiWalletOptions";
import { Web3Utils } from "@/utils/web3.utils";

export default function NavBar() {
  const router = useRouter();
  const path = usePathname();

  const web3Provider = useAppSelector(state => state.web3Provider.value) as BrowserProvider | undefined;
  const ethermailProvider = useAppSelector(state => state.ethermailProvider.value) as EtherMailProvider | undefined;
  const loginData = useAppSelector(state => state.loginData.value) as EthermailLoginData | undefined;
  const dispatch = useAppDispatch();

  const [ssoPermission, setSsoPermission] = useState('write');
  const [chains, setChains] = useState<Chain[]>([{ name: 'Ethereum', chainId: 1 }, {
    name: 'Polygon',
    chainId: 137,
  }, { name: 'Arbitrum', chainId: 42161 },
    { name: 'Sepolia', chainId: 11155111}
  ]);
  const [chain, setChain] = useState<Chain | undefined>();
  const [loginType, setLoginType] = useState('wallet');

  const { isConnected, address } = useAccount();

  const web3Utils = new Web3Utils();

  function handleSSOPermissionChange(event: React.ChangeEvent<HTMLSelectElement>) {
    try {
      const selectedValue = event.target.value;

      if (!selectedValue) throw Error('Must select a valid permission');

      setSsoPermission(selectedValue as SSOPermissionType);
      router.refresh();
      toast.success('SSO Permissions Changed!');
    } catch (err: any) {
      toast.error(err.message);
      console.log(err);
    }
  }

  async function handleChainChange(event: React.ChangeEvent<HTMLSelectElement>) {
    try {
      const chainId = +event.target.value;

      if (!ethermailProvider) throw new Error('Connect wallet before');

      await ethermailProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId }],
      });

      setChain(chains.find(chain => chain.chainId === chainId) ?? undefined);
      toast.success('Chain changed!');
    } catch (err: any) {
      event.target.value = '';
      toast.error(err.message);
      console.log(err);
    }
  }

  async function handleDisconnect() {
    try {
      useDisconnect()
      if (!ethermailProvider) throw new Error('No Provider!');


      await (ethermailProvider as EtherMailProvider).disconnect();

      dispatch(_web3Provider.reset());
      dispatch(_ethermailProvider.reset());
      dispatch(_loginDataProvider.reset());
      toast.success('Wallet disconnected!');
    } catch (err: any) {
      toast.error(err.message);
      console.log(err);
    }
  }

  function handlePageChange(event: React.ChangeEvent<HTMLSelectElement>) {
    try {
      const newPage = event.target.value;

      if (newPage === path) throw new Error('Already on selected page');

      router.replace(newPage);
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    }
  }

  function handleLoginTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setLoginType(event.target.value);
  }

  return (
    <>
      <nav className="flex justify-between p-6">
        <div>
          <h1>EtherMail SSO Test</h1>
        </div>
        <div className="flex items-center justify-between gap-4 text-black">
          <div className="flex gap-2">
            <select onChange={handlePageChange}>
              <option key="labelOption" value="">--- Change Page ---</option>
              {
                ['/', '/token', '/nfts'].map(page => {
                  return <option key={'page-' + page}
                                 value={page}>{page === '/' ? 'Home' : page.slice(1)}{page === path ? ' (Current)' : ''}</option>;
                })
              }
            </select>
            {loginData ?
              '' :
              <select onChange={handleSSOPermissionChange}>
                <option key="labelOption" value="">--- Change SSO Permissions ---</option>
                {
                  ['write', 'read', 'none'].map(permission => {
                    return <option key={'ssoOption-' + permission}
                                   value={permission}>{permission}{ssoPermission === permission ? ' (Current)' : ''}</option>;
                  })
                }
              </select>
            }
            <select onChange={handleChainChange}>
              <option key="labelOption" value="">--- Change Chain ---</option>
              {
                chains.map(_chain => {
                  return <option key={'chain-' + _chain.chainId}
                                 value={_chain.chainId}>{_chain.name + '-' + _chain.chainId}{_chain.chainId === chain?.chainId ? ' (Current)' : ''}</option>;
                })
              }
            </select>
            <select onChange={handleLoginTypeChange} value={loginType}>
              <option value="wallet">Wallet</option>
              <option value="sso">SSO</option>
            </select>
          </div>
          {
            isConnected ?
              <div className="flex justify-between gap-2">
                <div className="flex flex-col gap-2">
                  <h3 className="text-bold text-white">EtherMail Signer:</h3>
                  <p className="text-white">{web3Utils.truncateAddress(address)}</p>
                </div>
                <button onClick={handleDisconnect}>Disconnect</button>
              </div>
              :
              <div>
                <WalletOptions />
              </div>
          }
        </div>
      </nav>
    </>
  );
}