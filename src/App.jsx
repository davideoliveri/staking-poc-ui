import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import StakingContractABI from './StakingContractABI.json';
import './App.css';

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const [stakedBalance, setStakedBalance] = useState("0");
  const [rewards, setRewards] = useState("0");
  const [stakeAmount, setStakeAmount] = useState("");

  const [apr, setApr] = useState(0);
  const [startTs, setStartTs] = useState(0);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await newProvider.send("eth_requestAccounts", []);
        const newSigner = await newProvider.getSigner();
        const newContract = new ethers.Contract(contractAddress, StakingContractABI.abi, newSigner);

        setProvider(newProvider);
        setSigner(newSigner);
        setAccount(accounts[0]);
        setContract(newContract);

        if (import.meta.env.DEV) {
          window.contract = newContract;
          window.provider = newProvider;
          window.signer = newSigner;
          window.ethers = ethers;
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  async function updateDashboard() {
    if (!contract || !account) return;
    const [balance, reward, rate, ts] = await Promise.all([
      contract.stakedBalance(account),
      contract.calculateRewards(account),
      contract.ANNUAL_PERCENTAGE_RATE(),
      contract.startTime(account)
    ]);
    setStakedBalance(ethers.formatEther(balance));
    setRewards(ethers.formatEther(reward));
    setApr(Number(rate));
    setStartTs(Number(ts));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      updateDashboard();
    }, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [contract, account]);

  useEffect(() => {
    if (contract && account) updateDashboard();
  }, [contract, account]);

  const handleStake = async () => {
    if (!contract || !stakeAmount) return;

    try {
      // 1) Send the stake transaction
      const gasPrice = ethers.parseUnits("10", "gwei");
      const tx = await contract.stake({
        value: ethers.parseEther(stakeAmount)
      });
      console.log("🔸 stake tx hash:", tx.hash);

      // 2) Wait for it to be mined (1 confirmation)
      await tx.wait(1);
      console.log("✅ stake confirmed");

      // 3) Refresh balances & clear input
      await updateDashboard();
      setStakeAmount("");
    } catch (err) {
      console.error("Staking failed:", err);
    }
  };

  const handleWithdraw = async () => {
    if (contract) {
      try {
        const tx = await contract.withdraw();
        await tx.wait();
        updateDashboard();
      } catch (err) {
        console.error("Withdrawal failed:", err);
      }
    }
  };

  const handleClaim = async () => {
    if (contract) {
      try {
        const tx = await contract.claimRewards();
        await tx.wait();
        updateDashboard();
      } catch (err) {
        console.error("Claim failed:", err);
      }
    }
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>Staking Dashboard PoC</h1>
        {account ? (
          <div>
            <p>Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}</p>
            <div className="dashboard">
              <h2>Your Stake: {parseFloat(stakedBalance).toFixed(6)} ETH</h2>
              <p>APR: {apr}%</p>
              <p>Since: {startTs
                ? new Date(startTs * 1000).toLocaleString()
                : "— never staked —"
              }
              </p>
              <p>≈ {(parseFloat(stakedBalance) * apr / 100 / 365).toFixed(6)} ETH / day</p>
              <h3>Accrued Rewards: {parseFloat(rewards).toFixed(12)} ETH</h3>
            </div>
            <div className="actions">
              <input
                type="text"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="Amount in ETH to stake"
              />
              <button
                onClick={handleStake}
                disabled={!stakeAmount}
              >
                Stake
              </button>
              <button onClick={handleWithdraw}
                disabled={+stakedBalance === 0}>
                Withdraw
              </button>
              <button onClick={handleClaim}
                disabled={+rewards === 0}>
                Claim Rewards
              </button>
            </div>
          </div>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
      </header>
    </div>
  );
}

export default App;