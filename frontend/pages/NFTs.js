import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import contractAbi from './contractAbi.json';

const contractAddress = '0xE598C75888EAcD2a59aC3712dD43A8dc0FE8fB8c';


export default function MyComponent() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    // 페이지 로드 시 실행되는 부분
    async function connectToMetaMask() {
      if (typeof window.ethereum !== 'undefined') {
        // MetaMask가 설치되어 있는 경우
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
        } catch (error) {
          console.error(error);
        }
      } else {
        // MetaMask가 설치되어 있지 않은 경우
        console.log('MetaMask를 설치하세요.');
      }
    }

    connectToMetaMask();
  }, []);

  useEffect(() => {
    // NFT 확인하기
    async function checkNfts() {
      if (web3) {
        try {
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
          // 스마트 컨트랙트 인스턴스 생성
          const contract = new web3.eth.Contract(contractAbi, contractAddress);

          // 사용자의 NFT 목록 가져오기
          const nftIds = await contract.methods.getUserNFTs(accounts[0]).call();
          setNfts(nftIds);
        } catch (error) {
          console.error(error);
        }
      }
    }

    checkNfts();
  }, [web3]);

  return (
    <div>
      <h1>My NFTs</h1>
      <div>
        {nfts.length > 0 ? (
          <ul>
            {nfts.map((nftId) => (
              <li key={nftId}>
                NFT ID: {nftId}
                <p>NFT Name: {nftData[nftId].name}</p>
                <p>NFT Image: <img src={nftData[nftId].image} alt={nftData[nftId].name} /></p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No NFTs found.</p>
        )}
      </div>
    </div>
  );
}
