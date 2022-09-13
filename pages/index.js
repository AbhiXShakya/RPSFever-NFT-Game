import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { Footer, Navbar } from "../components";
import { abi } from "../utils/data";

export default function Home() {
  const [networkId, setNetworkId] = useState(null);
  const [account, setAccount] = useState(null);
  const [nftIds, setNftIds] = useState([]);
  const [balance, setBalance] = useState(0);
  const [nftContract, setNftContract] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  const nftContractAddress = process.env.CONTRACT_ADDRESS;

  const connectWeb3 = async () => {
    let provider = window.ethereum;
    let accounti;
    if (typeof provider !== "undefined") {
      provider
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          accounti = accounts[0];
          setAccount(accounts[0]);
        })
        .catch((err) => {
          console.log(err);
          return;
        });

      window.ethereum.on("accountsChanged", function (accounts) {
        setAccount(accounts[0]);
      });
      var web3i = new Web3(provider);
      setWeb3(web3i);
      setNetworkId(await web3i.eth.net.getId());
      const nftContracti = new web3i.eth.Contract(abi, nftContractAddress);
      setNftContract(nftContracti);
      try {
        let nfts = await nftContracti.methods.walletOfOwner(accounti).call();
        let nftsNew = [];
        if (nfts.length == 3) {
          nfts.forEach((nft) => {
            let nftid = (nft * 1) % 3;
            if (nftid == 0) {
              nftsNew[0] = nft;
            } else if (nftid == 1) {
              nftsNew[1] = nft;
            } else if (nftid == 2) {
              nftsNew[2] = nft;
            }
          });
        } else {
          nftsNew = nfts;
        }
        setNftIds(nftsNew);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    } else {
      alert("Metamask Not found");
    }
  };

  useEffect(() => {
    console.log(activeCard);
  }, [activeCard]);

  const playGame = async (nftid) => {
    try {
      let response = await nftContract.methods.game(nftid).send({
        gasLimit: String(483995),
        to: nftContractAddress,
        from: account,
        value: "10000000000000000",
      });
      const resultsObj = response.events.GameResults.returnValues;
      console.log(resultsObj);
      let newRes = {
        result: resultsObj["_result"] * 1,
        player: resultsObj["_player"] * 1,
        bot: resultsObj["_bot"] * 1,
      };
      setResults(newRes);
      console.log(newRes);
      setShowResults(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const getNfts = async () => {
    try {
      if (account) {
        let nfts = await nftContract?.methods.walletOfOwner(account).call();
        let nftsNew = [];
        if (nfts?.length == 3) {
          nfts?.forEach((nft) => {
            let nftid = (nft * 1) % 3;
            if (nftid == 0) {
              nftsNew[0] = nft;
            } else if (nftid == 1) {
              nftsNew[1] = nft;
            } else if (nftid == 2) {
              nftsNew[2] = nft;
            }
          });
        } else {
          nftsNew = nfts;
        }
        setNftIds(nftsNew);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const mintNft = async () => {
    // mint nft
    setLoading(true);
    try {
      if (account) {
        let response = await nftContract?.methods.mint(account).send({
          gasLimit: String(383995),
          to: nftContractAddress,
          from: account,
          value: 0,
        });
        console.log(response);
        if (response.blockHash ? true : false) {
          setLoading(false);
          getNfts();
        } else {
          setLoading(false);
          alert("Something went wrong");
        }
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    getNfts();
  }, [account]);

  // get account eth balance
  const getBalance = async () => {
    if (account) {
      let balance = await web3?.eth.getBalance(account);
      console.log(balance * 1e-18);
      setBalance(balance);
    }
  };

  useEffect(() => {
    getBalance();
  }, [account]);

  return (
    <div>
      <Head>
        <title>RPS Fever NFT Game</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <Navbar />
      {showResults ? (
        <>
          <div className="z-10 w-full h-full absolute inset-0 bg-black opacity-40"></div>
          <div className="z-20 absolute inset-0 px-4 flex justify-center items-center">
            <div className="relative bg-white text-center rounded-xl p-6 w-full lg:mx-32">
              <h2>
                {results?.result == 1
                  ? "You Won 🎉"
                  : results?.result == 0
                  ? "You Lost ❌"
                  : "Its a Tie 😅"}
              </h2>
              <div className="grid grid-flow-rows place-items-center gap-6 lg:gap-40 mb-16 grid-cols-2">
                <div className="relative w-full h-40 lg:h-80 md:h-96 mb-6 p-6">
                  <h3 className="text-2xl font-semibold ml-2">You</h3>
                  <div className="relative w-full h-40 lg:h-80 md:h-96 mb-6 shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] rounded-lg p-6">
                    <Image
                      src={`/nfts/${results?.["player"]}.jpeg`}
                      alt="nft"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
                <h2 className="absolute text-md z-30 top-[43%]">Vs</h2>
                <div className="relative w-full h-40 lg:h-80 md:h-96 mb-6 p-6">
                  <h3 className="text-2xl font-semibold mr-2">Bot</h3>
                  <div className="relative w-full h-40 lg:h-80 md:h-96 mb-6 shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] rounded-lg p-6">
                    <Image
                      src={`/nfts/${results?.["bot"]}.jpeg`}
                      alt="nft"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
              </div>
              {results?.result == 1 ? (
                <h3 className="text-2xl md:text-4xl font-bold">
                  Rewards : <span className="text-green-500">0.02 MATIC</span>
                </h3>
              ) : results?.result == 2 ? (
                <h3 className="text-2xl md:text-4xl font-bold">
                  Rewards : <span className="text-yellow-500">0.01 MATIC</span>
                </h3>
              ) : (
                <h3 className="text-2xl md:text-4xl font-bold">
                  <span className="text-red-500">No Rewards</span>
                </h3>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowResults(false);
                }}
                class="mt-5 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-bold rounded-lg text-lg px-5 py-3 text-center mr-2 mb-2"
              >
                Close
              </button>
            </div>
          </div>
        </>
      ) : null}

      {!account ? (
        <center>
          <h2 className="mt-24">Let&apos;s Play</h2>
          <h1 className="mt-6 md:mt-12 text-4xl md:text-7xl font-bold">
            ROCK, PAPER and SCISSORS
          </h1>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              connectWeb3();
            }}
            className="mt-16 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-semibold rounded-lg text-lg px-5 py-3 text-center mr-2 mb-2"
          >
            Connect Wallet
          </button>
        </center>
      ) : loading ? (
        <h2 className="mt-12 text-center">Loading...</h2>
      ) : nftIds?.length < 1 ? (
        <div className="text-center mt-8">
          <h2 className="mb-8">You Will Get 3 NFTs after Mint</h2>
          <div className="grid grid-flow-rows place-items-center gap-6 mt-10 mb-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="relative w-full h-80 md:h-96 mb-6 shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] rounded-lg p-6">
              <Image
                src="/nfts/0.jpeg"
                alt="nft"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="relative w-full h-80 md:h-96 mb-6 shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] rounded-lg p-6">
              <Image
                src="/nfts/1.jpeg"
                alt="nft"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="relative w-full h-80 md:h-96 mb-6 shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] rounded-lg p-6">
              <Image
                src="/nfts/2.jpeg"
                alt="nft"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
          <button
            onClick={() => {
              mintNft();
            }}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-lg font-semibold text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white focus:ring-4 focus:outline-none focus:ring-pink-200"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
              Mint NFTs
            </span>
          </button>
        </div>
      ) : (
        <div className="text-center mt-8">
          <h2 className="mb-8">You Have the Following NFTs</h2>
          <p className="text-xl font-medium">
            Select NFT you want to Play With
          </p>
          <div className="grid grid-flow-rows place-items-center gap-6 mt-6 mb-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {nftIds?.map((nftId, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    setActiveCard(nftId);
                  }}
                  className={`hover:ring-orange-400 hover:cursor-pointer focus:ring-4 focus:ring-orange-400 hover:ring-4 relative w-full h-80 md:h-96 mb-6 shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] rounded-lg p-6 ${
                    activeCard == nftId ? "ring-4 ring-orange-400" : ""
                  }`}
                >
                  <Image
                    src={`/nfts/${nftId % 3}.jpeg`}
                    alt="nft"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              );
            })}
          </div>
          <button
            onClick={() => {
              setLoading(true);
              playGame(activeCard);
            }}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-lg font-semibold text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white focus:ring-4 focus:outline-none focus:ring-pink-200"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
              Play Game
            </span>
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
}
