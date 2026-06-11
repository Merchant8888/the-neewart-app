# 🎨 The_neewArt Minting Engine

A high-performance, responsive Web3 minting interface built for **The_neewArt** NFT collection on **Base Mainnet**. This application provides a direct, secure bridge for users to interact with the underlying ERC-721 smart contract ledger, enabling seamless non-fungible token generation with decentralized metadata storage.

---

## 🌐 Project Links
* **Live App Url:** `https://your-project-name.vercel.app` *(Replace this with your live link once Vercel finishes!)*
* **Network:** Base Mainnet (Chain ID: `8453`)
* **Smart Contract Address:** [`0xd49Ee0CB5193325ad10F94BAcA59aC6ffeaBcBbF`](https://basescan.org/address/0xd49Ee0CB5193325ad10F94BAcA59aC6ffeaBcBbF)
* **Asset Engine:** IPFS (InterPlanetary File System)

---

## 🚀 Key Engineering Features

* **State-Driven Hydration Guards:** Implements custom React lifecycle mounting checks to prevent common Web3 layout and rendering mismatches between server-side processing and browser-side provider execution.
* **Reactive Network Monitoring:** Features native, conditional chain-ID tracking with immediate `useSwitchChain` execution triggers if a user is connected to an unsupported network.
* **Decentralized Storage Mapping:** Leverages content-addressed IPFS CIDs for both raw artwork media and JSON metadata layers, completely bypassing centralized storage choke points.
* **Asynchronous Global Hook Queries:** Employs optimized `useReadContract` hooks to pull live transaction states (`totalMinted`, `remainingSupply`) without introducing blocking lags into the UI thread.
* **Lightweight Multi-Wallet UI:** Built a performant, modular modal configuration directly interfacing with injected browser providers via Wagmi v2 and Viem, reducing reliance on heavy boilerplate UI wrappers.

---

## 🛠️ The Tech Stack
* **Framework:** Next.js (App Router Layout)
* **Web3 Core:** Wagmi v2 & Viem
* **Styling:** Tailwind CSS (Cyberpunk Minimalist theme)
* **Data Fetching:** TanStack React Query

---

## 📦 Local Installation & Setup

1. Clone the repository:
   ```bash
   git clone [https://github.com/Merchant8888/the-neewart-app.git](https://github.com/Merchant8888/the-neewart-app.git)
