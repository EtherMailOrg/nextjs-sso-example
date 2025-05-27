'use client';

import { useState } from "react";
import { toast } from 'react-hot-toast';
import {
  SSOPermissionType,
} from '@/intefaces/web3.interfaces';
import { useAppDispatch } from '@/lib/hooks';
import { _web3Provider } from '@/lib/reducers/web3ProviderSlice';
import { _ethermailProvider } from '@/lib/reducers/ethermailProviderSlice';
import { _loginDataProvider } from '@/lib/reducers/loginDataProviderSlice';
import { usePathname, useRouter } from 'next/navigation';
import { useAccount, useDisconnect, useSwitchChain } from "wagmi";
import { WalletOptions } from "@/app/components/WagmiWalletOptions";
import { Web3Utils } from "@/utils/web3.utils";

export default function NavBar() {
  const router = useRouter();
  const path = usePathname();

  const dispatch = useAppDispatch();

  const [ssoPermission, setSsoPermission] = useState('write');
  const [loginType, setLoginType] = useState('wallet');

  const { isConnected, address, chainId } = useAccount();
  const { chains, switchChainAsync } = useSwitchChain();
  const { disconnect } = useDisconnect();

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

  async function handleDisconnect() {
    try {
      disconnect();

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
    <div>
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
            <select onChange={handleSSOPermissionChange}>
              <option key="labelOption" value="">--- Change SSO Permissions ---</option>
              {
                ['write', 'read', 'none'].map(permission => {
                  return <option key={'ssoOption-' + permission}
                                 value={permission}>{permission}{ssoPermission === permission ? ' (Current)' : ''}</option>;
                })
              }
            </select>
            {
              isConnected ?
                <div className="flex flex-col gap-2 p-2 items-center">
                  <p className="font-bold text-white">Change Chain:</p>
                  <div className="flex gap-2">
                    <select
                      onChange={async (e) => {
                        const chainId = +e.target.value;
                        if (chainId) {
                          await switchChainAsync({ chainId });
                          toast.success(`Chain changed to chain with ID: ${chainId}`);
                        } else {
                          toast.error('Invalid chainId');
                        }
                      }}
                      value={chainId}
                    >
                      <option value="" disabled>--- Select Chain ---</option>
                      {chains.map((chain) => (
                        <option key={chain.id} value={chain.id}>
                          {chain.name + ' - ' + chain.id}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                :
                ''
            }
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
    </div>
  );
}