'use client';

import { useState, useEffect } from 'react';
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from 'wagmi';
import { base } from 'wagmi/chains';
import { parseEther } from 'viem';

const CONTRACT_ADDRESS = '0xd49Ee0CB5193325ad10F94BAcA59aC6ffeaBcBbF' as `0x${string}`;
const MINT_PRICE = '0.001';
const SHORT_ADDRESS = CONTRACT_ADDRESS.slice(0, 10) + '...' + CONTRACT_ADDRESS.slice(-8);
const BASESCAN_URL = 'https://basescan.org/address/' + CONTRACT_ADDRESS;
const OPENSEA_URL = 'https://opensea.io/assets/base/' + CONTRACT_ADDRESS;

const ABI = [
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tokenURI', type: 'string' },
    ],
    outputs: [],
  },
  {
    name: 'totalMinted',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'remainingSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

function ConnectWallet() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [showList, setShowList] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return (
    <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium">
      Connect Wallet
    </button>
  );

  if (isConnected) return (
    <button
      onClick={() => disconnect()}
      className="bg-white/10 border border-white/20 px-6 py-2 rounded-full text-sm font-medium hover:bg-white/20 transition"
    >
      {address?.slice(0, 6)}...{address?.slice(-4)} X
    </button>
  );

  return (
    <div className="relative">
      <button
        onClick={() => setShowList(!showList)}
        className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition"
      >
        Connect Wallet
      </button>
      {showList && (
        <div className="absolute right-0 mt-2 bg-gray-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 min-w-48">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => { connect({ connector }); setShowList(false); }}
              className="w-full text-left px-4 py-3 hover:bg-white/10 text-sm transition"
            >
              {connector.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const { isConnected, address, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const { data: totalMinted } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'totalMinted',
  });

  const { data: remaining } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'remainingSupply',
  });

  // Hydration guard clause to keep Next.js stable
  if (!mounted) return <div className="min-h-screen bg-black" />;

  const isWrongNetwork = isConnected && chain?.id !== base.id;
  const minted = totalMinted ? Number(totalMinted) : 0;
  const left = remaining ? Number(remaining) : 100;
  const progressPercent = (minted / 100) * 100;

  const handleMint = () => {
    if (!address) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'mint',
      args: [address, 'ipfs://bafkreifnj5l342rc6d6ebccabz4h3v26fkbmpikcyj5lxdk4ynfwvsccta'], 
      value: parseEther(MINT_PRICE),
    });
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <div>
          <p className="text-xs text-gray-400 tracking-widest uppercase">Collection</p>
          <h1 className="text-lg font-bold tracking-tight">The_neewArt</h1>
        </div>
        <ConnectWallet />
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16 text-center">

        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-400 mb-8">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
          Live on Base Mainnet
        </div>

        <h2 className="text-5xl font-bold tracking-tight mb-4">The_neewArt</h2>
        <p className="text-gray-400 text-lg mb-2">NEEW</p>
        <p className="text-gray-500 text-sm mb-12 max-w-md mx-auto">
          A curated collection of original artwork by a real-world artist.
          Each piece is unique, permanently stored on IPFS, and minted on Base.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-2xl font-bold">{minted}</p>
            <p className="text-gray-500 text-xs mt-1">Minted</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-2xl font-bold">{left}</p>
            <p className="text-gray-500 text-xs mt-1">Remaining</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-2xl font-bold">{MINT_PRICE}</p>
            <p className="text-gray-500 text-xs mt-1">ETH per mint</p>
          </div>
        </div>

        <div className="w-full bg-white/10 rounded-full h-1.5 mb-8">
          <div
            className="bg-white h-1.5 rounded-full transition-all duration-500"
            style={{ width: progressPercent + '%' }}
          />
        </div>

        {isWrongNetwork && (
          <button
            onClick={() => switchChain({ chainId: base.id })}
            className="w-full bg-red-500/20 border border-red-500/30 text-red-400 py-3 rounded-2xl text-sm mb-4 hover:bg-red-500/30 transition"
          >
            Switch to Base network to mint
          </button>
        )}

        {!isConnected ? (
          <div className="text-gray-500 text-sm py-4">
            Connect your wallet to mint
          </div>
        ) : (
          <button
            onClick={handleMint}
            disabled={isPending || isConfirming || isWrongNetwork || left === 0}
            className="w-full bg-white text-black py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 disabled:bg-white/20 disabled:text-white/40 transition"
          >
            {isPending ? 'Confirm in wallet...' :
             isConfirming ? 'Minting...' :
             left === 0 ? 'Sold Out' :
             'Mint for ' + MINT_PRICE + ' ETH'}
          </button>
        )}

        {isSuccess && (
          <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
            <p className="text-green-400 font-medium">NFT Minted Successfully!</p>
            <p className="text-gray-500 text-sm mt-1">
              Your piece from The_neewArt collection is now in your wallet.
            </p>
          </div>
        )}

        <div className="mt-12 grid grid-cols-2 gap-4 text-left">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-1">Contract</p>
            <a
              href={BASESCAN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 break-all"
            >
              {SHORT_ADDRESS}
            </a>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-1">View on</p>
            <a
              href={OPENSEA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              OpenSea
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}