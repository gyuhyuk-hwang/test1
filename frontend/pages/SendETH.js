import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import contractAbi from './contractAbi.json';

// 스마트 컨트랙트 주소
const contractAddress = '0xA3061f16dd6b89a14003Aac5bF65e087C1032A17';

export default function MyComponent() {
  const [web3, setWeb3] = useState(null);
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('');
  const [receiver, setReceiver] = useState('');
  const [message, setMessage] = useState('');

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

  // Matic 보내기
  async function sendMatic() {
    if (web3) {
      try {
        const accounts = await web3.eth.getAccounts();
        console.log('연결된 계정:', accounts[0]);
        setAccount(accounts[0]);

        // 송금 금액 유효성 검사
        if (!amount) {
          console.log('송금 금액을 입력하세요.');
          return;
        }

        // 스마트 컨트랙트 인스턴스 생성
        const contract = new web3.eth.Contract(contractAbi, contractAddress);

        // Matic을 스마트 컨트랙트에 기부
        const value = web3.utils.toWei(amount, 'ether'); // 보내는 Matic의 양

        const result = await contract.methods.donate(receiver, message, value).send({ from: accounts[0], value: value });
        await web3.eth.sendTransaction();
        console.log('기부 결과:', result);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('MetaMask에 연결되지 않았습니다.');
    }
  }

  return (
    <div>
      <h1>Web3.js와 MetaMask 연결 예제</h1>
      <div>
        <label>받을 사람 주소:</label>
        <input type="text" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
      </div>
      <div>
        <label>보낼 Matic 양:</label>
        <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <div>
        <label>보낼 메시지:</label>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      <button onClick={sendMatic}>기부하기</button>
    </div>
  );
}
