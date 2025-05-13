import { Connector } from "wagmi";
import { useEffect, useState } from "react";

export function WalletOption({
                               connector,
                               icon,
                               onClick,
                             }: {
  connector: Connector,
  icon: string,
  onClick: () => void
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    ;(async () => {
      // @dev Skipping EtherMail connector as getting provider needs user action.
      if (connector.id !== 'ethermail') {
        const provider = await connector.getProvider()
        setReady(!!provider)
      }
    })()
  }, [connector])

  return (
    <div
      onClick={onClick} className="flex items-center gap-4 bg-gray-50 border border-gray-200 p-2 rounded-xl cursor-pointer hover:bg-gray-100 transition">
      <img className="w-12 h-12 rounded-xl" alt="Connector Icon" src={icon} />
      <p>{connector.name}</p>
    </div>
  )
}