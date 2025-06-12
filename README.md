# Staking Dashboard PoC

A proof-of-concept (PoC) decentralized application (dApp) that provides a user interface for interacting with an Ethereum staking smart contract. Users can connect their wallets, stake Ether, view their current staked balance and accrued rewards, and withdraw their principal and earnings.

This project is built with **React** and **Vite**, and it uses **ethers.js** to communicate with the blockchain.

Make sure to have a local node and a version of the contract ([https://github.com/davideoiveri/staking-poc](https://github.com/davideoiveri/staking-poc)) before running this repo. You will need the `contract address` and the `StakingContractABI.json` from the other project in order to successfully run this one _with your own contract_. 

## ✨ Features

-   **Wallet Connection**: Connects to browser-based Ethereum wallets like MetaMask.
-   **Stake ETH**: Users can deposit ETH into the staking contract.
-   **Withdraw Stake**: Users can withdraw their entire staked principal along with any rewards.
-   **Claim Rewards**: Users can claim their accrued rewards without withdrawing the principal.
-   **Dynamic Dashboard**: Displays key information that updates periodically:
    -   Connected wallet address.
    -   Current staked balance.
    -   Real-time calculated rewards.
    -   The contract's Annual Percentage Rate (APR).
    -   The date and time the user first staked.

## 🛠️ Tech Stack

-   **Framework**: [React 19](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Blockchain Interaction**: [Ethers.js v6](https://docs.ethers.org/v6/)
-   **Styling**: Plain CSS

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (v18.x or later recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A web browser with an Ethereum wallet extension, such as [MetaMask](https://metamask.io/).

## 🚀 Getting Started

Follow these steps to get the project running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/davideoliveri/staking-poc-ui
cd staking-poc-ui
```

### 2. Install Dependencies

Install the necessary Node.js packages.

```bash
npm install
```

### 3. Configure Environment Variables

The application needs to know the address of the deployed `StakingContract`. Create a `.env` file in the root of the project by copying the example file:

```bash
cp .env.example .env
```

Now, open the `.env` file and add the address of your deployed smart contract:

```
VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddressHere
```

### 4. Set Up the Smart Contract ABI

This application requires the ABI (Application Binary Interface) of the smart contract to function correctly. The ABI file tells the frontend how to format calls to the smart contract's functions.

The project expects the ABI to be located at `src/StakingContractABI.json`.

**Note**: This ABI file is intended to be sourced from the corresponding smart contract repository, which can be found at [https://github.com/davideoliveri/staking-poc](https://github.com/davideoliveri/staking-poc). For development convenience, a version is included in this project, but for production, you should always use the definitive ABI from the contract source.

### 5. Run the Application

Start the Vite development server:

```bash
npm run dev
```

The application will now be running on `http://localhost:5173` (or another port if 5173 is busy).

## 💡 Usage

1.  Open the application in your browser.
2.  Ensure your MetaMask wallet is connected to the same network where the smart contract is deployed (e.g., Sepolia, or a local Hardhat/Anvil network).
3.  Click the **"Connect Wallet"** button to link your wallet to the dApp.
4.  Once connected, the dashboard will display your staking information.
5.  To **stake** ETH, enter an amount in the input field and click the "Stake" button. Approve the transaction in MetaMask.
6.  To **withdraw** your principal and rewards, click the "Withdraw" button.
7.  To **claim** only your rewards, click the "Claim Rewards" button.

The dashboard will automatically refresh every 5 seconds to show the latest reward calculations.

## 📜 Available Scripts

In the project directory, you can run:

-   `npm run dev`: Starts the development server with Hot-Module-Replacement.
-   `npm run build`: Bundles the app for production into the `dist` folder.
-   `npm run preview`: Serves the production build locally to preview it before deployment.

## 🧮 Reward Calculation

The smart contract calculates rewards based on a fixed Annual Percentage Rate (APR). The formula used is:

$$\text{Reward} = \text{Principal} \times \frac{\text{APR}}{100} \times \frac{\text{Time Elapsed in Seconds}}{365 \times 24 \times 60 \times 60}$$

The frontend periodically calls the `calculateRewards(user)` view function on the contract to display the most up-to-date reward amount for the connected user.
