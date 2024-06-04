"use client"
import ethers, { BrowserProvider } from 'ethers';
import { Toaster, toast } from "react-hot-toast";
import { useAppSelector } from "@/lib/hooks";
import { Web3Utils } from "@/utils/web3.utils";

export default function Home() {
  const web3Provider = useAppSelector(state => state.web3Provider.value) as BrowserProvider | undefined;
  const ethermailProvider = useAppSelector(state => state.ethermailProvider.value) as BrowserProvider | undefined;
  const web3Utils = new Web3Utils();
  const signMessage = "Sign message with SSO";

  async function signTokenMessage() {
    try {
      if (!web3Provider) throw Error("Need provider to sign!");
      const message = "[basescan.org 04/06/2024 16:50:39] I, hereby verify that I am the owner/creator of the address [0xe2c86869216aC578bd62a4b8313770d9EE359A05]";

      const signer = await web3Provider.getSigner();

      if (!signer) throw Error("No signer!");

      const signedMessage = await signer.signMessage(message);
      console.log(signedMessage)
      toast.success(`Signed Message: ${signedMessage}`, { duration: 8000 });
    } catch (err: any) {
      toast.error(err.message);
      console.log(err);
    }
  }

  return (
    <>
      <Toaster />
      <main className="flex min-h-screen flex-col items-center p-16 gap-2">
        <div className="flex flex-col gap-4">
        {web3Provider ?
          <section className="flex flex-col">
          <div>
            <div className="flex flex-col align-center justify-center gap-4">
              <h1>Actions:</h1>
              <div>
                <h4>Sign Message:</h4>
                <button onClick={async () => {await web3Utils.handleSignMessage(signMessage, web3Provider)}}>Sign Message</button>
              </div>
            </div>
          </div>
          </section>
          :
          <section>
            <h3>Connect Wallet Please...</h3>
          </section>
        }
          </div>
        <button onClick={signTokenMessage}>Sign EMT Message!</button>
      </main>
    </>
  );
}
