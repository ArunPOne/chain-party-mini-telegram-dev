"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const Username: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [username, setUsername] = useState("");
  const [points, setPoints] = useState(0);
  const [partyTickets, setPartyTickets] = useState(0);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const telegramID = localStorage.getItem("telegramId");

    const fetchUserData = async () => {
      if (!backendUrl || !accessToken || !telegramID) return;

      try {
        const response = await fetch(`${backendUrl}/auth/me/${telegramID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setUsername(data.username);
        setPoints(data.point);
        setPartyTickets(data.partyTicket); // Adjust field name as per backend response
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
    const interval = setInterval(fetchUserData, 10000); // Poll every 10 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="flex flex-row items-center justify-between gap-x-5 relative p-2">
      <div className="flex items-center space-x-2 md:space-x-4">
        <Icon
          icon="game-icons:tarot-01-the-magician"
          className="text-3xl md:text-4xl"
        />
        <p className="font-semibold text-sm md:text-base">
          {username || "Loading..."}
        </p>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <span className="text-xs md:text-sm bg-slate-300 text-black font-bold px-2 py-1 rounded-full">
          {points}
        </span>
        <span className="text-[11px] md:text-sm bg-slate-300 text-black font-bold px-2 py-1 rounded-full">
          {partyTickets}
        </span>
        <div className="">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="text-black border border-black rounded-lg font-semibold py-[0.15rem]"
          >
            <option value="English">English</option>
            <option value="Chinese">Chinese</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Username;
