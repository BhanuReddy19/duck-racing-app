import React, { useState, useEffect } from 'react';
import './App.css';

const duckNames = ['Quacky', 'Feathers', 'Waddles'];

const Duck = ({ name, position, lane }) => (
  <div className="duck" style={{ left: `${position}%`, top: `${lane * 40}px` }}>
    {name} 🦆
  </div>
);

function App() {
  const [positions, setPositions] = useState([0, 0, 0]);
  const [racing, setRacing] = useState(false);
  const [winner, setWinner] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [dummyBalance, setDummyBalance] = useState(100);
  const [selectedDuck, setSelectedDuck] = useState('');
  const [betAmount, setBetAmount] = useState(0);
  const [auctionBids, setAuctionBids] = useState([10, 20, 15]);
  const [affiliateEarnings, setAffiliateEarnings] = useState(25);

  useEffect(() => {
    let interval;
    if (racing) {
      interval = setInterval(() => {
        setPositions(prev => {
          const newPositions = prev.map(pos =>
            Math.min(pos + Math.random() * 5, 100)
          );
          const winnerIndex = newPositions.findIndex(pos => pos >= 100);
          if (winnerIndex !== -1) {
            const winningDuck = duckNames[winnerIndex];
            setWinner(winningDuck);
            setRacing(false);
            clearInterval(interval);

            // Handle bet result
            if (selectedDuck === winningDuck) {
              alert(`You won! ${winningDuck} won the race!`);
              setDummyBalance(b => b + betAmount * 2);
              setAffiliateEarnings(e => e + 5); // mock affiliate bonus
            } else {
              alert(`You lost! ${winningDuck} won the race.`);
            }
          }
          return newPositions;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [racing]);

  const connectWallet = () => {
    setWalletConnected(true);
    alert("Mock wallet connected!");
  };

  const startRace = () => {
    setPositions([0, 0, 0]);
    setWinner('');
    setRacing(true);
  };

  const placeBet = () => {
    if (!walletConnected) {
      alert("Connect your wallet first.");
      return;
    }
    if (!selectedDuck) {
      alert("Select a duck to bet on.");
      return;
    }
    if (betAmount <= 0 || betAmount > dummyBalance) {
      alert("Invalid bet amount.");
      return;
    }
    setDummyBalance(b => b - betAmount);
    startRace();
  };

  const handleAuctionBid = (index) => {
    const updatedBids = [...auctionBids];
    updatedBids[index] += 5;
    setAuctionBids(updatedBids);
    alert(`New bid on ${duckNames[index]}: ${updatedBids[index]} DUX`);
  };

  return (
    <div className="App">
      <h1>Duck Racing App MVP</h1>

      {!walletConnected ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <p>Wallet Connected | Balance: {dummyBalance} DUX</p>
      )}

      <div className="betting-section">
        <h2>Place Your Bet</h2>
        <select
          value={selectedDuck}
          onChange={(e) => setSelectedDuck(e.target.value)}
        >
          <option value="">Select Duck</option>
          {duckNames.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Bet Amount"
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
        />
        <button onClick={placeBet} disabled={racing}>Place Bet & Start Race</button>
      </div>

      <div className="track">
  {positions.map((pos, index) => (
    <Duck
      key={index}
      name={duckNames[index]}
      position={pos}
      lane={index}
    />
  ))}
</div>

      {winner && <h2>Winner: {winner}!</h2>}

      <div className="auction">
        <h2>Duck Sponsorship Auction</h2>
        {duckNames.map((name, index) => (
          <div key={name} className="auction-item">
            <p>{name} - Current Bid: {auctionBids[index]} DUX</p>
            <button onClick={() => handleAuctionBid(index)}>Place Bid</button>
          </div>
        ))}
      </div>

      <div className="dashboard">
        <h2>Affiliate Dashboard</h2>
        <p>Total Affiliate Earnings: {affiliateEarnings} DUX</p>
      </div>
    </div>
  );
}

export default App;