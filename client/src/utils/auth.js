import React, {useState, useEffect}from "react";
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';
import {useCookies} from 'react-cookie';

const authContext = React.createContext();

export default function useAuth() {
  const [authed, setAuthed] = useState(false);
  const [nonce, setNonce] = useState(null);
  const [cookies] = useCookies(['siwe-quickstart']);


  const domain = window.location.host;
  const origin = window.location.origin;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  useEffect(() => {    
    fetch('/nonce', {
      credentials: 'include',
    }).then(res => res.text().then(text => setNonce(text)));
  }, []);




  function createSiweMessage (address, statement) {
    console.log('nonce', nonce);
    const message = new SiweMessage({
      domain,
      address,
      statement,
      uri: origin,
      version: '1',
      chainId: '1',
      nonce: nonce
    });
    return message.prepareMessage();
  }

  function connectWallet () {
    provider.send('eth_requestAccounts', [])
      .catch(() => console.log('user rejected request'));
  }


  async function signInWithEthereum () {
    const message = createSiweMessage(
        await signer.getAddress(), 
        'Sign in with Ethereum to the app.'
      );
    const signature = await signer.signMessage(message);
    console.log(signature);
    const res = await fetch('/verify', {
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, signature }),
      credentials: 'include'
    });
    console.log(await res.text());
  }

  async function getInformation() {
    const res = await fetch('/personal_information', {
        credentials: 'include',
    });
    console.log(await res.text());
  }




  return {
    authed,
    connectWallet,
    signInWithEthereum,
    getInformation,
  };
}

export async function useAuthCheck(){
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(()=>{
    const res = fetch('/auth', {
      credentials: 'include',
    }).then(res => setIsAuthenticated(res.status === 200));
  },[]);

  return{
    isAuthenticated,
  }
}
/*
export function AuthProvider({ children }) {
  const auth = useAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export default function AuthConsumer() {
  return React.useContext(authContext);
}
*/
