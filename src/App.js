import { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import { Tweet } from "react-twitter-widgets";
import "./App.css";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_TWEETS = [
  "841418541026877441",
  "1457408745244332034",
  "1442173206799044609",
  "1457156043612459009",
  "1457096407169609729",
  "841418541026877441",
  "1457408745244332034",
  "1442173206799044609",
  "1457156043612459009",
  "1457096407169609729",
];

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [tweetList, setTweetList] = useState([]);

  /*
   * This function holds the logic for deciding if a Phantom Wallet is
   * connected or not
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");

          /**
           *
           * The solana object gives us a function that will allow us to connect
           * directly with the user's wallet!
           */
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            "Connected with Public Key:",
            response.publicKey.toString()
          );
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found! Get a Phantom Wallet 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };

  /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
  useEffect(() => {
    window.addEventListener("load", async (event) => {
      await checkIfWalletIsConnected();
    });
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log("Fetching Tweet list...");

      // Call Solana program here.

      // Set state
      setTweetList(TEST_TWEETS);
    }
  }, [walletAddress]);

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const sendTweet = async () => {
    if (inputValue.length > 0) {
      console.log("Tweet link:", inputValue);
    } else {
      console.log("Empty input. Try again.");
    }
  };

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <input
        type="text"
        placeholder="Enter tweet link!"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button className="cta-button submit-gif-button" onClick={sendTweet}>
        Submit
      </button>
      <div className="gif-grid">
        {tweetList.map((tweetId, i) => (
          <Tweet key={i} tweetId={tweetId} options={{ width: "400" }} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">
            <img
              alt="Twitter Logo"
              style={{ height: "80px", width: "80px" }}
              src={twitterLogo}
            />
            &nbsp; Tweet portal
          </p>
          <p className="sub-text">
            View your tweets collection in the metaverse ✨
          </p>
          {walletAddress
            ? renderConnectedContainer()
            : renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
