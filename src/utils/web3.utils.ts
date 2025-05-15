import { toast } from 'react-hot-toast';
import { ethers } from 'ethers';
import { PublicClient, WalletClient } from "viem";

export class Web3Utils {
  constructor() {
  }

  public truncateAddress = (addr: string | undefined) => {
    if (!addr) return 'N/A';
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`; // 0x + 6 digits, ..., last 6 digits
  };

  public async handleSignMessage(message: string, walletClient: WalletClient | undefined) {
    try {
      if (!walletClient) throw Error('Need Wallet Client to sign with');

      const signer = walletClient.account;

      if (!signer) throw Error('No signer!');

      const signedMessage = await walletClient.signMessage({
        account: signer,
        message
      });
      toast.success(`Signed Message: ${signedMessage}`, { duration: 8000 });
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  public async handleSendTransaction(recipient: string, amount: string, walletClient: WalletClient | undefined) {
    try {
      if (!walletClient) throw Error('Need Wallet Client to send transaction!');

      const account = walletClient.account;

      const tx = await walletClient.sendTransaction({
        account: account!.address,
        to: recipient as unknown as any,
        value: ethers.parseEther(amount),
        chain: walletClient.chain,
      });

      toast.success(`Transaction Sent: ${tx}`, { duration: 8000 });
    } catch (err: any) {
      toast.error(err.message);
      console.log(err);
    }
  }

  public async handleSendTokens(recipient: string, amount: string, tokenAddress: `0x${string}`, walletClient: WalletClient | undefined, publicClient: PublicClient) {
    try {
      if (!walletClient) throw Error('Need Wallet Client to send transact ion!');
      if (!ethers.isAddress(tokenAddress)) throw Error('Invalid token address!');

      const erc20Abi = [
        {
          'constant': true,
          'inputs': [],
          'name': 'decimals',
          'outputs': [
            {
              'name': '',
              'type': 'uint8',
            },
          ],
          'payable': false,
          'stateMutability': 'view',
          'type': 'function',
        },
        {
          'constant': false,
          'inputs': [
            {
              'name': '_to',
              'type': 'address',
            },
            {
              'name': '_value',
              'type': 'uint256',
            },
          ],
          'name': 'transfer',
          'outputs': [
            {
              'name': '',
              'type': 'bool',
            },
          ],
          'payable': false,
          'stateMutability': 'nonpayable',
          'type': 'function',
        },
      ];

      const normalizedTokenAddress = ethers.getAddress(tokenAddress);

      const tokenDecimals: number = await publicClient.readContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'decimals',
      }) as number;
      if (!tokenDecimals) throw Error('Please, verify token address and try again.');

      const { request } = await publicClient.simulateContract({
        account: walletClient.account!.address,
        address: normalizedTokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [recipient, ethers.parseUnits(amount, tokenDecimals)],
        chain: walletClient.chain,
      })

      const writeContractResponse = await walletClient.writeContract(request);

      toast.success(`Sent: ${writeContractResponse}`, { duration: 8000 });
    } catch (err: any) {
      toast.error(err.message);
      console.log(err);
    }
  }

  public async handleSignTypedData(data: any, walletClient: WalletClient | undefined) {
    try {
      if (!walletClient) throw Error('Need Wallet Client to sign typed data!');

      const signature = await walletClient.signTypedData(data);

      toast.success(`Signed Typed Data: ${signature}`, { duration: 8000 });
    } catch (err: any) {
      toast.error(err.message);
      console.log(err);
    }
  }
}