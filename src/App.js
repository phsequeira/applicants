import styles from './App.css';
import React, { useState } from 'react';
import { ethers } from 'ethers';
import abi from './abi.json';


function App() {

  const [state, setState] = useState({
    userAdress: '0xFB9288e34e8516424c3b39DDeC4ca4A0ef4af3ce',
    contractAdress: '0x9eC401A74553E8E27B8f5E5fd1A2829cfD0C6230'
  })
  const [balance, setBalance] = useState(null);
  const [balanceSymbol, setSymbol] = useState(null);

  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isMetaMaskInstalled){
      alert('please install MetaMask extention')
    }
    else {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner()
      const erc20 = new ethers.Contract(state.contractAdress, abi, signer);

      console.log(state);
      checkBalance(erc20);
    }
  }

  const checkBalance = async (erc20) => {
    const newBalance = await erc20.balanceOf(state.userAdress);
    const balanceToString = newBalance.toString();
    const formattedBalance = ethers.utils.formatUnits(balanceToString, 6)
    setBalance(formattedBalance);

    const symbol = await erc20.symbol()

    setSymbol(symbol)
  }
  
  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }
  return (
    <>
    <div className={styles.main}>
      <h2 className={styles.title}>Balance Checker</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>User's Address: </label>
        <input type='text' name='userAdress' value={state.userAdress} onChange={handleChange} />
        <br/><br/>
        <label>Contract Address: </label>
        <input type='text' name='contractAdress' value={state.contractAdress} onChange={handleChange} />
        <input type='submit' value='submit' />
      </form>
      <div className={styles.balance}>
        <p>Current Balance: </p>
        <h1>{balanceSymbol}  </h1>
        <h1>{balance}</h1>
      </div>
      

    </div>
    </>
  );
}

export default App;
