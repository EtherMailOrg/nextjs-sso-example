"use client"
import Image from "next/image";
import Script from "next/script"
import { useEffect, useState } from "react";
import { EtherMailProvider } from "@ethermail/ethermail-wallet-provider";
import { BrowserProvider } from 'ethers';
import { Toaster, toast } from "react-hot-toast";

interface EtherMailSignInOnSuccessEvent extends CustomEvent {
  detail: {
    token: string;
  };
}

interface EtherMailTokenErrorEvent extends CustomEvent {
  detail: {
    type: "expired" | "permissions";
  };
}

export default function Home() {
    const [provider, setProvider] = useState<BrowserProvider | undefined>(undefined);

    useEffect(() => {
      toast.success("Inside!");
      window.addEventListener("EtherMailSignInOnSuccess",  (event) => {
        const loginEvent = event as EtherMailSignInOnSuccessEvent;
        console.log("token", loginEvent.detail.token);
        // If you want to support wallet actions, connect to our provider
        setProvider(new BrowserProvider(new EtherMailProvider()));
      });

      window.addEventListener("EtherMailTokenError", (event: Event) => {
        const errorEvent = event as EtherMailTokenErrorEvent;
        if (errorEvent.detail.type === "expired") {
          toast.error("Expired Session!");
        } else if (errorEvent.detail.type === "permissions") {
          toast.error("Permissions Error!");
        }
      });
    }, [])

  function metamaskLogin() {
      toast.error("Not yet implemented!");
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
        <main className="flex min-h-screen flex-col items-center p-24 gap-2">
            <div className="flex flex-col gap-4">
                <h1>My SSO Tets</h1>
                <section>
                  <h2>Login:</h2>
                  <div className="flex flex-col gap-2 m-4">
                    <button onClick={metamaskLogin}>Metamask</button>

                    <ethermail-login widget="665994315f3bb424d99cf7f1" type="wallet"
                                     permissions="write"></ethermail-login>
                  </div>
                </section>
              {provider ?
                <section className="flex flex-col">
                  <div>
                    <div>
                      <h1>Actions</h1>
                    </div>
                  </div>
                </section>
                :
                ""}

            </div>
        </main>
      </>
  );
}
