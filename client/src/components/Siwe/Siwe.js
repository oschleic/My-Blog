import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';
import useAuth from '../../utils/auth.js';
import { useNavigate } from "react-router-dom";
import {useState, useEffect}from "react";



function Siwe() {
  


  const navigate = useNavigate();
  const { connectWallet, signInWithEthereum, getInformation, isAuthenticated } = useAuth();

  

  return (
    <>
    <button onClick={connectWallet}>Connect wallet</button>
    <button onClick={signInWithEthereum}>Sign in</button>
    <button onClick={getInformation}>Get info</button>
    <button onClick={isAuthenticated}>Auth?</button>

    </>
  );
}

export default Siwe;
