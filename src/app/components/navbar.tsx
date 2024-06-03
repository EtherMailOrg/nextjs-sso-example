"use client"

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  EtherMailSignInOnSuccessEvent,
  EtherMailTokenErrorEvent,
  SSOPermissionType
} from "@/intefaces/web3.interfaces";
import jwt from "jsonwebtoken";
import { EtherMailProvider } from "@ethermail/ethermail-wallet-provider";
import { BrowserProvider } from "ethers";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { _web3Provider, web3ProviderSlice } from "@/lib/reducers/web3ProviderSlice";
import { _ethermailProvider } from "@/lib/reducers/ethermailProviderSlice";
import { _loginDataProvider } from "@/lib/reducers/loginDataProviderSlice";
import Script from "next/script";
import { Chain } from "@/intefaces/web3.interfaces";
import { useRouter } from "next/navigation";
import { EthermailLoginData } from "@/intefaces/ethermail.interfaces";

export default function NavBar() {
  const router = useRouter();

  const web3Provider = useAppSelector(state => state.web3Provider.value) as BrowserProvider | undefined;
  const ethermailProvider = useAppSelector(state => state.ethermailProvider.value) as EtherMailProvider | undefined;
  const loginData = useAppSelector(state => state.loginData.value) as EthermailLoginData | undefined;
  const dispatch = useAppDispatch();

  const [ssoPermission, setSsoPermission] = useState("write");
  const [chains, setChains] = useState<Chain[]>([{ name: "Ethereum", chainId: 1 }, { name: "Polygon", chainId: 137 }]);
  const [chain, setChain] = useState<Chain | undefined>();

  useEffect(() => {
    toast.success("Setting Event Listeners!");
    window.addEventListener("EtherMailSignInOnSuccess",  (event) => {
      const __loginEvent = event as EtherMailSignInOnSuccessEvent;
      const __loginData = jwt.decode(__loginEvent.detail.token);
      console.log(loginData);

      const __ethermailProvider = new EtherMailProvider({
        websocketServer: "wss://staging-api.ethermail.io/events",
        appUrl: "https://staging.ethermail.io"
      });
      const __browserProvider = new BrowserProvider(__ethermailProvider);

      _loginDataProvider.setData(__loginData);
      _ethermailProvider.setProvider(_ethermailProvider);
      _web3Provider.setProvider(__browserProvider);

      console.log(loginData);
      console.log(ethermailProvider);
      console.log(web3Provider);
    });

    window.addEventListener("EtherMailTokenError", (event: Event) => {
      console.log(event);
      const errorEvent = event as EtherMailTokenErrorEvent;
      if (errorEvent.detail.type === "expired") {
        toast.error("Expired Session!");
      } else if (errorEvent.detail.type === "permissions") {
        toast.error("Permissions Error!");
      }
    });
  }, []);

  function handleSSOPermissionChange(event: React.ChangeEvent<HTMLSelectElement>) {
    try {
      const selectedValue = event.target.value;

      if (!selectedValue) throw Error("Must select a valid permission");

      setSsoPermission(selectedValue as SSOPermissionType);
      router.refresh();
      toast.success("SSO Permissions Changed!");
    } catch(err: any) {
      toast.error(err.message);
      console.log(err);
    }
  }

  function handleChainChange() {
    try {
      toast("Not yet implemented!");
    } catch(err: any) {
      toast.error(err.message);
      console.log(err);
    }
  }

  async function handleDisconnect() {
    try {
      if (!ethermailProvider) throw new Error("No Provider!");


      await (ethermailProvider as EtherMailProvider).disconnect();
      toast.success("Wallet disconnected!");
    } catch (err: any) {
      toast.error(err.message);
      console.log(err);
    }
  }

  return (
    <>
      <Script
        src="https://cdn-email.ethermail.io/sdk/v2/dev-ethermail.js"
        strategy="lazyOnload"
        onLoad={() => {
          (function({ ...args }) {
            const script = document.createElement('script');
            script.src = 'https://cdn-email.ethermail.io/sdk/v2/staging-ethermail.js';
            document.body.appendChild(script);
            script.setAttribute('a', args.afid);
            script.setAttribute('b', args.communityAlias);
            // @ts-ignore
            script.setAttribute('c', args.features);
          })({
            afid: '65ddf7aa3631bb310429bbb7',
            communityAlias: 'prestige-worldwid',
            features: ['login']
          });
        }}
      />
      <nav className="flex justify-between p-6">
        <div>
          <h1>EtherMail SSO Test</h1>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <select onChange={handleSSOPermissionChange}>
              <option key="labelOption" value="">--- Change SSO Permissions ---</option>
              {
                ["write", "read", "none"].map(permission => {
                  return <option key={"ssoOption-" + permission}
                                 value={permission}>{permission}{ssoPermission === permission ? " (Current)" : ""}</option>;
                })
              }
            </select>
            <select onChange={handleChainChange}>
              <option key="labelOption" value="">--- Change Chain ---</option>
              {
                chains.map(_chain => {
                  return <option key={"chain-" + _chain.chainId}
                                 value={_chain.chainId}>{_chain.name + "-" + _chain.chainId}{_chain.chainId === chain?.chainId ? " (Current)" : ""}</option>;
                })
              }
            </select>
          </div>
          <div>
            {loginData ?
              <div className="flex justify-between gap-2">
                <div className="flex flex-col gap-2">
                  <h3>EtherMail Signer:</h3>
                  <p>{loginData.wallet}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <h3>Signer Permissions:</h3>
                  <p>{loginData.permissions}</p>
                </div>
                <button onClick={handleDisconnect}>Disconnect</button>
              </div>
              :
              <ethermail-login style={{width: "150px", backgroundColor: "black", color: "white", fontWeight: 700, borderRadius: "1rem"}} widget="6659a4865f3bb424d99d11b2" type="wallet"
                               permissions={ssoPermission} text="Connect Wallet"></ethermail-login>}
          </div>
        </div>
      </nav>
    </>
  )
}