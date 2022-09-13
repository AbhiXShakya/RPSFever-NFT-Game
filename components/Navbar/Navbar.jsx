import React from "react";
import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
  const [showInfo, setShowInfo] = React.useState(false);
  return (
    <nav>
      <div className="mb-16 flex justify-between items-center flex-col md:flex-row">
        <Link href="/">
          <div className="cursor-pointer mb-6 md:mb-2 flex space-x-3 items-center my-2 md:my-4 lg:my-6">
            <Image
              priority={true}
              src="/logo.png"
              alt="logo"
              width={50}
              height={50}
            />
            <h1 className="text-5xl font-bold">RPS Fever</h1>
          </div>
        </Link>
        <div>
          <h3
            onClick={() => {
              setShowInfo(true);
            }}
            className="text-3xl font-bold mr-4 cursor-pointer"
          >
            Info
          </h3>
        </div>
      </div>
      {showInfo ? (
        <>
          <div className="z-10 w-full h-full absolute inset-0 bg-black opacity-40"></div>
          <div className="z-50 absolute inset-0 px-4 flex justify-center items-center">
            <div className="relative bg-white text-center rounded-xl p-6 w-full lg:mx-32">
              <h2 className="text-2xl md:text-6xl">Info About The Game</h2>
              <br />
              <p className="text-sm md:text-lg">
                Its your favourite game Rock, Paper, Scissors on Blockchain. For
                playing this game you need to connect your metamask to{" "}
                <a
                  className="text-orange-600"
                  href="https://chainlist.org/chain/80001"
                  target="_blank"
                  rel="noreferrer"
                >
                  Polygon (Mumbai) Testnet
                </a>{" "}
                and mint free NFTs. After you have minted your NFTs you can play
                the game.
              </p>
              <br />
              <p className="text-sm md:text-lg">
                You can get Free MATIC Testnet tokens from{" "}
                <a
                  className="text-orange-600"
                  href="https://faucet.polygon.technology/"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://faucet.polygon.technology
                </a>
              </p>
              <br />
              <p className="text-sm md:text-lg">
                The game is played with the help of smart contract. The smart
                contract is deployed on the polygon testnet. You need to give
                0.01 MATIC to play and you win, you will get 0.02 MATIC as a
                Reward. If the Game is a draw, you will get your 0.01 MATIC
                back.
              </p>
              <p className="text-sm md:text-lg mt-3">
                <a
                  href="https://testnets.opensea.io/collection/rps-fever-nft"
                  target="_blank"
                  rel="noreferrer"
                >
                  <button
                    type="button"
                    class="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    NFT Collection on OpenSea
                  </button>
                </a>
              </p>
              <p className="text-sm md:text-lg mt-3">
                Made with ❤️ by{" "}
                <a
                  className="text-orange-600"
                  href="https://AbhiXShakya.me"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  AbhiXShakya
                </a>
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowInfo(false);
                }}
                class="mt-5 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-bold rounded-lg text-lg px-5 py-2 text-center mr-2 mb-2"
              >
                Close
              </button>
            </div>
          </div>
        </>
      ) : null}
    </nav>
  );
};
