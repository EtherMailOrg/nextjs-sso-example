import { toast } from 'react-hot-toast';
import { BrowserProvider, ethers } from 'ethers';

export class Web3Utils {
  constructor() {
  }

  public async handleSignMessage(message: string, web3Provider: BrowserProvider | undefined) {
    try {
      if (!web3Provider) throw Error('Need provider to sign!');

      const signer = await web3Provider.getSigner();

      if (!signer) throw Error('No signer!');

      const signedMessage = await signer.signMessage(message);
      toast.success(`Signed Message: ${signedMessage}`, { duration: 8000 });
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  public async handleSendTransaction(recipient: string, amount: string, web3Provider: BrowserProvider | undefined) {
    try {
      if (!web3Provider) throw Error('Need provider to send transaction!');

      const signer = await web3Provider.getSigner();

      if (!signer) throw Error('No signer!');

      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount),  // Adjust as needed
      });

      toast.success(`Transaction Sent: ${tx.hash}`, { duration: 8000 });
    } catch (err: any) {
      console.log("SEND TRANSACTION error");

      toast.error(err.message);
      console.log(err);
    }
  }

  public async handleSignTypedData(data: any, web3Provider: BrowserProvider | undefined) {
    try {
      if (!web3Provider) throw Error('Need provider to sign!');

      const signer = await web3Provider.getSigner();

      if (!signer) throw Error('No signer!');

      const address = await signer.getAddress();
      const signature = await web3Provider.send('eth_signTypedData_v4', [address, JSON.stringify(data)]);

      toast.success(`Signed Typed Data: ${signature}`, { duration: 8000 });
    } catch (err: any) {
      console.log("SIGNATURE v4 error");

      toast.error(err.message);
      console.log(err);
    }
  }
}