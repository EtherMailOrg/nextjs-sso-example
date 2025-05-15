import { useConnect } from 'wagmi';
import { WalletOption } from './WalletOption';
import { useState } from "react";

export function WalletOptions() {
  const { connectors, connect } = useConnect();
  const [show, setShow] = useState<boolean>(false);

  const connectorsToHide = ['Injected'];

  const toggleConnect = () => {
    setShow(!show);
  };

  const getWalletIcon = (connectorName: string) => {
    switch (connectorName) {
      case 'WalletConnect':
        return '/connectors/wallet-connect.svg';
      default:
        return '/connectors/default-connector.png';
    }
  };

  return (
    <div>
      <button
        onClick={toggleConnect}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Connect Wallet
      </button>

      {show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="flex flex-col gap-4 bg-white p-6 pt-12 rounded-lg w-[400px] relative">
            <button
              onClick={toggleConnect}
              className="absolute font-bold top-2 right-2 text-red-600 hover:text-red-800 border-none bg-transparent"
            >
              X
            </button>
            <div className="flex flex-col gap-4">
              {connectors.map((connector) => {
                if (!connectorsToHide.includes(connector.name)) {
                  return (
                    <WalletOption
                      key={connector.uid}
                      connector={connector}
                      icon={connector.icon ?? getWalletIcon(connector.name)}
                      onClick={() => connect({ connector })}
                    />
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}