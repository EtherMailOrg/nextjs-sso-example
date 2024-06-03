"use client"
import ethers, { BrowserProvider } from 'ethers';
import { Toaster, toast } from "react-hot-toast";
import { useAppSelector } from "@/lib/hooks";

export default function Home() {
  const web3Provider = useAppSelector(state => state.web3Provider.value) as BrowserProvider | undefined;
  const ethermailProvider = useAppSelector(state => state.ethermailProvider.value) as BrowserProvider | undefined;

  async function handleSignMessage() {
    try {
      if (!web3Provider) throw Error("Need provider to sign!");

      const message = "Test message to sign!";
      const signer = await web3Provider.getSigner();

      if (!signer) throw Error("No signer!");

      const signedMessage = await signer.signMessage(message);
      toast.success(`Signed Message: ${signedMessage}`);
    } catch(err: any) {
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
            <h3>Connect Wallet Please...</h3>
          </section>
        }
          </div>
      </main>
    </>
  );
}
