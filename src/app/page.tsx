'use client';
import {  BrowserProvider } from 'ethers';
import { Toaster } from 'react-hot-toast';
import { useAppSelector } from '@/lib/hooks';
import { Web3Utils } from '@/utils/web3.utils';
import { useState } from 'react';
import { useAccount, useWalletClient, usePublicClient } from "wagmi";

export default function Home() {
  const web3Provider = useAppSelector(state => state.web3Provider.value) as BrowserProvider | undefined;
  const loginData = useAppSelector(state => state.loginData.value);
  const web3Utils = new Web3Utils();
  const signMessage = 'Sign message with SSO';

  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [tokenSmartContract, setTokenSmartContract] = useState<string>('0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8'); // UDSC on sepolia

  const client = useWalletClient();
  const publicClient = usePublicClient();

  return (
    <>
      <Toaster />
      <main className="flex min-h-screen flex-col items-center p-16 gap-2">
        <div className="flex flex-col gap-4">
          {useAccount().isConnected ?
            <section className="flex flex-col">
              <div>
                <div className="flex flex-col align-center justify-center gap-4">
                  <h1>Actions:</h1>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <h4>Sign Message:</h4>
                      <button onClick={async () => {
                        await web3Utils.handleSignMessage(signMessage, client?.data ?? undefined);
                      }}>Sign Message
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4>Send Transaction:</h4>
                      <div>
                        <input
                          type="text"
                          placeholder="Recipient Address"
                          value={recipient}
                          onChange={(e) => setRecipient(e.target.value)}
                          className="text-black"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="text-black"
                        />
                      </div>
                      <button onClick={async () => {
                        await web3Utils.handleSendTransaction(recipient, amount, client?.data ?? undefined);
                      }}>Send Transaction
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4>Send Tokens:</h4>
                      <div>
                        <input
                          type="text"
                          placeholder="Smart Contract Address"
                          value={tokenSmartContract}
                          onChange={(e) => setTokenSmartContract(e.target.value)}
                          className="text-black"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Token Amount"
                          value={tokenAmount}
                          onChange={(e) => setTokenAmount(e.target.value)}
                          className="text-black"
                        />
                      </div>
                      <button onClick={async () => {
                        await web3Utils.handleSendTokens(recipient, tokenAmount, tokenSmartContract as `0x${string}`, client?.data ?? undefined, publicClient);
                      }}>Send Tokens
                      </button>
                    </div>

                    <div>
                      <h4>Sign Typed Data v4:</h4>
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
                        await web3Utils.handleSignTypedData(typedData, client?.data ?? undefined);
                      }}>Sign Typed Data v4
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4>Login Data:</h4>
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
    </>
  );
}
