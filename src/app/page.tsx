"use client"
import Image from "next/image";
import Script from "next/script"
import { useEffect, useState } from "react";
import { EtherMailProvider } from "@ethermail/ethermail-wallet-provider";
import { BrowserProvider } from 'ethers';
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
const jwt = require('jsonwebtoken');

interface EtherMailSignInOnSuccessEvent extends Event {
  detail: {
    token: string;
  };
}

interface EtherMailTokenErrorEvent extends Event {
  detail: {
    type: "expired" | "permissions";
  };
}

type SSOPermissionType = "write" | "read" | "none";

export default function Home() {
    const router = useRouter();

    const [ssoPermission, setSsoPermission] = useState<SSOPermissionType>("write");
    const [provider, setProvider] = useState<BrowserProvider | undefined>(undefined);
    const [signer, setSigner] = useState<string | undefined>(undefined);
    const [permissions, setPermissions] = useState<string | undefined>(undefined);
    const [chains, setChains] = useState([1, 137]);

    useEffect(() => {
      toast.success("Setting Event Listeners!");
      window.addEventListener("EtherMailSignInOnSuccess",  (event) => {
        const loginEvent = event as EtherMailSignInOnSuccessEvent;
        const loginData = jwt.decode(loginEvent.detail.token);
        console.log(loginData);
        setSigner(loginData.wallet);
        setPermissions(loginData.permissions);
        // If you want to support wallet actions, connect to our provider
        setProvider(new BrowserProvider(new EtherMailProvider({
          websocketServer: "wss://staging-api.ethermail.io/events",
          appUrl: "https://staging.ethermail.io"
        })));
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

  function metamaskLogin() {
      toast.error("Not yet implemented!");
  }

  function handleDisconnect() {
    try {
      toast("Not yet implemented");
    } catch (err: any) {
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

  async function handleSignMessage() {
    try {
      const message = "Test message to sign!";
      const signer = await provider?.getSigner();

      if (!signer) throw Error("No signer!");

      const signedMessage = await signer.signMessage(message);
      toast.success(`Signed Message: ${signedMessage}`);
    } catch(err: any) {
      toast.error(err.message);
      console.log(err);
    }
  }

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

  return (
      <>
        <Toaster />
        <Script
            src="https://cdn-email.ethermail.io/sdk/v2/dev-ethermail.js"
            strategy="lazyOnload"
            onLoad={() => {
                (function ({...args}) {
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
        <main className="flex min-h-screen flex-col items-center p-16 gap-2">
          {signer && permissions ?
            <div className="flex justify-between gap-2">
              <div className="flex flex-col gap-2">
                <h3>EtherMail Signer:</h3>
                <p>{signer}</p>
              </div>
              <div className="flex flex-col gap-2">
                <h3>Signer Permissions:</h3>
                <p>{permissions}</p>
              </div>
            </div>
            :
            ""}
          <div className="flex flex-col gap-4">
            <h1>My SSO Test</h1>
            <section>
              {provider ?
                <button onClick={handleDisconnect}>Disconnect</button>
                :
                <>
                <h2>Login:</h2>
                <div className="flex flex-col gap-2 m-4">
                  <button style={{width: "150px", backgroundColor: "black", color: "white", fontWeight: 700, borderRadius: "1rem"}} onClick={metamaskLogin}>Metamask</button>
                  <ethermail-login style={{width: "150px", backgroundColor: "black", color: "white", fontWeight: 700, borderRadius: "1rem"}} widget="6659a4865f3bb424d99d11b2" type="wallet"
                             permissions={ssoPermission} text="Login"></ethermail-login>
                </div>
                </>
               }
        </section>
        {provider ?
          <section className="flex flex-col">
          <div>
                  <div>
                    <h1>Select Chain:</h1>
                    <div className="flex justify-between gap-2">
                      {chains.map(chain => {
                        return <button className="min-w-6" onClick={handleChainChange}>{chain}</button>
                      })}
                    </div>
                  </div>
            <div>
              <h1>Actions:</h1>
              <div>
                <h4>Sign Message:</h4>
                <button onClick={handleSignMessage}>Sign Message</button>
              </div>
              <div>
                <h4>Claim Token:</h4>
                <button onClick={handleSignMessage}>Claim Token</button>
              </div>
            </div>
          </div>
          </section>
          :
          <section>
            <h1>Admin Panel:</h1>
            <div>
              <p>Change Permissions:</p>
              <div>
                <select onChange={handleSSOPermissionChange}>
                  <option key="labelOption" value="">--- Change SSO Permissions ---</option>
                  {
                    ["write", "read", "none"].map(permission => {
                      return <option key={"ssoOption-" + permission} value={permission}>{permission}{ssoPermission === permission ? " (Current)" : ""}</option>;
                    })
                  }
                </select>
              </div>
            </div>
          </section>
        }
          </div>
        </main>
      </>
  );
}
