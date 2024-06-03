import { toast } from "react-hot-toast";
import { BrowserProvider } from "ethers";

export class Web3Utils {
  constructor() {}

  public async handleSignMessage(web3Provider: BrowserProvider | undefined) {
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
}