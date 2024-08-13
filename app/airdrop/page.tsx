"use client";

import React, { useState, useEffect } from "react";
import Username from "../header/page";
import { Icon } from "@iconify/react";
import Footer from "../footer/page";
import { useRouter } from "next/navigation";

const Airdrop = () => {
  const [isBind, setIsBind] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const walletBound = localStorage.getItem("isWalletBound") === "true";
    const savedWalletAddress = localStorage.getItem("walletAddress") || "";
    setIsBind(walletBound);
    setWalletAddress(savedWalletAddress);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(event.target.value);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(event.target.checked);
  };

  const validateWalletAddress = (address: string) => {
    // Simple validation for Ethereum addresses (starts with 0x and is 42 characters long)
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const bindWallet = async () => {
    if (!validateWalletAddress(walletAddress)) {
      setErrorMessage("Invalid wallet address. Please enter a valid address.");
      return;
    }

    if (!termsAccepted) {
      setErrorMessage("Please accept the Terms & Conditions.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setErrorMessage("User is not authenticated. Please log in.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/user/bind-wallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Add authorization header
        },
        body: JSON.stringify({ web3_address: walletAddress }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Simulate the wallet binding process
      setIsBind(true);
      localStorage.setItem("isWalletBound", "true");
      localStorage.setItem("walletAddress", walletAddress);
      onCloseModal();
    } catch (error) {
      console.error("Failed to bind wallet:", error);
      setErrorMessage("Failed to bind wallet address. Please try again.");
    }
  };

  const onButtonClicked = () => {
    if (!isBind) {
      setShowModal(true);
    }
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="p-4">
      <Username />
      <div className="flex flex-row items-center gap-x-2 pt-6 justify-center">
        <p className="text-2xl font-bold">Airdrop Tasks</p>
        <p className="text-4xl text-red-600">
          <Icon icon="game-icons:present" />
        </p>
      </div>
      <p className="text-xs text-center pt-5">
        Exciting opportunities await! Tasks are on their way. Complete them to
        join the airdrop and start earning rewards!
      </p>
      <p className="py-4 font-bold">Tasks</p>
      <div className="flex flex-row items-center border border-gray-800 bg-gray-800 p-2 rounded-2xl">
        <p className="p-5 border-2 border-white w-10"></p>
        <div className="pl-4 flex-grow">
          <p className="font-semibold">Bind Wallet</p>
        </div>
        <div
          className={`px-3 border rounded-full py-1 text-black font-semibold ${
            isBind
              ? "bg-gray-500 border-gray-800 opacity-60 text-white"
              : "bg-white"
          }`}
        >
          <button onClick={onButtonClicked}>{isBind ? "Done" : "Bind"}</button>
        </div>
      </div>

      <Footer />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="border-4 w-[70%] px-3 py-2 rounded-3xl bg-slate-900">
            <div className="flex flex-row items-center">
              <p className="flex-grow font-bold">Referrer Code</p>
              <Icon
                className="text-red-500 cursor-pointer"
                icon="mdi:close-outline"
                onClick={onCloseModal}
              />
            </div>
            <div>
              <input
                className="w-[100%] rounded-3xl my-2 py-2 text-black font-semibold px-4"
                type="text"
                name="airdrop"
                value={walletAddress}
                onChange={handleInputChange}
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-[12px] pb-1 text-center ">
                {errorMessage}
              </p>
            )}
            <div className="flex flex-row items-center gap-x-3">
              <input
                className="size-4"
                type="checkbox"
                name="Terms & Condition"
                checked={termsAccepted}
                onChange={handleCheckboxChange}
              />
              <p className="font-semibold">T&C</p>
            </div>

            <p className="text-justify py-2 text-xs h-32 overflow-y-scroll">
              Terms And Condition Will Be Applied Here! Terms And Condition Will
              Be Applied Here ! Terms And Condition Will Be Applied Here ! Terms
              And Condition Will Be Applied Here ! Terms And Condition Will Be
              Applied Here !Terms And Condition Will Be Applied Here !Terms And
              Condition Will Be Applied Here !Terms And Condition Will Be
              Applied Here !Terms And Condition Will Be Applied Here !Terms And
              Condition Will Be Applied Here !
            </p>
            <div className="text-center space-x-4 pt-3 pb-2">
              <button
                className="px-3 py-1 border rounded-md font-semibold border-gray-500 bg-gray-500"
                onClick={onCloseModal}
              >
                Close
              </button>
              <button
                className="px-3 py-1 border rounded-md font-semibold border-blue-600 bg-blue-600"
                onClick={bindWallet}
              >
                Bind
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Airdrop;
