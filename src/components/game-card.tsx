"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

export interface Team {
  id: string;
  name: string;
  flag: string; // Emoji character or URL
}

export interface GameCardProps {
  id: string;
  date: string;
  group: string;
  teamA: Team;
  teamB: Team;
}

export function GameCard({ id, date, group, teamA, teamB }: GameCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)]"
    >
      <div className="flex justify-center mb-4">
        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          {group} • {date}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        {/* Team A */}
        <div className="flex flex-col items-center flex-1">
          <div className="w-12 h-12 flex items-center justify-center text-4xl mb-2 drop-shadow-md">
            {teamA.flag}
          </div>
          <span className="font-bold text-sm text-gray-800 dark:text-gray-200 text-center uppercase tracking-wide">
            {teamA.name}
          </span>
        </div>

        {/* Score Inputs */}
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-950 p-2 rounded-xl">
          <Input 
            type="number" 
            min="0"
            max="99"
            placeholder="-"
            className="w-14 h-14 text-center text-2xl font-bold bg-white dark:bg-gray-900 border-none shadow-inner focus-visible:ring-blue-500"
          />
          <span className="text-gray-400 font-medium select-none">X</span>
          <Input 
            type="number" 
            min="0"
            max="99"
            placeholder="-"
            className="w-14 h-14 text-center text-2xl font-bold bg-white dark:bg-gray-900 border-none shadow-inner focus-visible:ring-blue-500"
          />
        </div>

        {/* Team B */}
        <div className="flex flex-col items-center flex-1">
          <div className="w-12 h-12 flex items-center justify-center text-4xl mb-2 drop-shadow-md">
            {teamB.flag}
          </div>
          <span className="font-bold text-sm text-gray-800 dark:text-gray-200 text-center uppercase tracking-wide">
            {teamB.name}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
