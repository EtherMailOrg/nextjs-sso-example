'use client';
import { Toaster } from 'react-hot-toast';
import { Web3Utils } from '@/utils/web3.utils';
import { useEffect, useState } from "react";
import { useAccount, useWalletClient, usePublicClient, useConnect } from "wagmi";
import { EthermailLoginData } from "@/intefaces/ethermail.interfaces";

export default function Home() {
  const web3Utils = new Web3Utils();
  const signMessage = 'Sign message with SSO';

  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [tokenSmartContract, setTokenSmartContract] = useState<string>('0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8'); // UDSC on sepolia
  const [tokenRecipient, setTokenRecipient] = useState<string>('');
  const [loginData, setLoginData] = useState<null | EthermailLoginData>(null);

  const walletClient = useWalletClient();
  const publicClient = usePublicClient();
  const { isConnected, connector } = useAccount();

  useEffect(() => {
    if (connector && connector.id === 'ethermail') {
      setLoginData(connector.loginData as EthermailLoginData);
    }
  }, [connector]);

  return (
    <div>
      <Toaster />
      <main className="flex min-h-screen flex-col items-center p-16 gap-2">
        <div className="flex flex-col gap-4">
          {isConnected ?
            <section className="flex flex-col">
              <div>
                <div className="flex flex-col align-center justify-center gap-4">
                  <h1>Actions:</h1>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <h4 className="font-bold text-xl">Sign Message:</h4>
                      <button onClick={async () => {
                        await web3Utils.handleSignMessage(signMessage, walletClient?.data ?? undefined);
                      }}>Sign Message
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4 className="font-bold text-xl">Send Transaction:</h4>
                      <div className="flex gap-4">
                        <label>Recipient Address:</label>
                        <input
                          type="text"
                          placeholder="0x00"
                          value={recipient}
                          onChange={(e) => setRecipient(e.target.value)}
                          className="text-black"
                        />
                      </div>
                      <div className="flex gap-4">
                        <label>Amount:</label>
                        <input
                          type="text"
                          placeholder="0.005"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="text-black"
                        />
                      </div>
                      <button onClick={async () => {
                        await web3Utils.handleSendTransaction(recipient, amount, walletClient?.data ?? undefined);
                      }}>Send Transaction
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4 className="font-bold text-xl">Send Tokens:</h4>
                      <div className="flex gap-4">
                        <label>Smart Contract Address:</label>
                        <input
                          type="text"
                          placeholder="0x00"
                          value={tokenSmartContract}
                          onChange={(e) => setTokenSmartContract(e.target.value)}
                          className="text-black"
                        />
                      </div>
                      <div className="flex gap-4">
                        <label>Token Recipient:</label>
                        <input
                          type="text"
                          placeholder="0x00"
                          value={tokenRecipient}
                          onChange={(e) => setTokenRecipient(e.target.value)}
                          className="text-black"
                        />
                      </div>
                      <div className="flex gap-4">
                        <label>Token Amount:</label>
                        <input
                          type="text"
                          placeholder="0.005"
                          value={tokenAmount}
                          onChange={(e) => setTokenAmount(e.target.value)}
                          className="text-black"
                        />
                      </div>
                      <button onClick={async () => {
                        await web3Utils.handleSendTokens(tokenRecipient, tokenAmount, tokenSmartContract as `0x${string}`, walletClient?.data ?? undefined, publicClient);
                      }}>Send Tokens
                      </button>
                    </div>

                    <div>
                      <h4 className="font-bold text-xl">Sign Typed Data v4:</h4>
                      <button onClick={async () => {
                        const typedData = {
                          types: {
                            EIP712Domain: [
                              { name: 'name', type: 'string' },
                              { name: 'version', type: 'string' },
                            ],
                            Person: [
                              { name: 'name', type: 'string' },
                              { name: 'wallet', type: 'address' },
                            ],
                          },
                          primaryType: 'Person',
                          domain: {
                            name: 'Ether Mail',
                            version: '1',
                          },
                          message: {
                            name: 'John Doe',
                            wallet: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
                            date: Date.now()
                          },
                        };
                        await web3Utils.handleSignTypedData(typedData, walletClient?.data ?? undefined);
                      }}>Sign Typed Data v4
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl">Login Data:</h4>
                    <textarea
                      readOnly
                      value={JSON.stringify(loginData, null, 2)}
                      rows={5}
                      cols={30}
                      className="text-black"
                    />
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
    </div>
  );
}
