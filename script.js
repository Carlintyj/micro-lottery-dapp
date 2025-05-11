const contractAddress = "0x6d2EAB82086299940B7fAdCDDf3f818f3C508ed6";
const abi = [
  {
    inputs: [],
    name: "enter",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "performUpkeep",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_interval",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "winner",
        type: "address",
      },
    ],
    name: "WinnerPicked",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "checkUpkeep",
    outputs: [
      {
        internalType: "bool",
        name: "upkeepNeeded",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "performData",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "interval",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastTimeStamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "manager",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "players",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

let provider, signer, contract;

window.onload = async () => {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  contract = new ethers.Contract(contractAddress, abi, signer);

  updateUI();
};

async function updateUI() {
  const manager = await contract.manager();
  document.getElementById("manager").innerText = manager;

  // Players
  const playerCount = await contract.players();
  document.getElementById("playerCount").innerText = playerCount.length;

  // Ticket price (hardcoded in smart contract as 0.01 ether)
  document.getElementById("ticketPrice").innerText = "0.01 ETH";

  // Next draw time
  const lastTimeStamp = await contract.lastTimeStamp();
  const interval = await contract.interval();
  const nextTime = Number(lastTimeStamp) + Number(interval);

  const drawDate = new Date(nextTime * 1000).toLocaleString();
  document.getElementById("nextDraw").innerText = drawDate;
}

async function enterLottery() {
  const tx = await contract.enter({ value: ethers.utils.parseEther("0.01") });
  await tx.wait();
  document.getElementById("status").innerText =
    "Successfully entered the lottery!";
  updateUI(); // refresh UI after entering
}
