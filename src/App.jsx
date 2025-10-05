// src/App.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ILOS from "./ilos"; // ✅ import your ILO list

export default function App() {
  const [deck, setDeck] = useState([...ILOS]);
  const [discardPile, setDiscardPile] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [canDiscard, setCanDiscard] = useState(false);

  // Draw a new random card
  const drawCard = () => {
    if (deck.length === 0 || isAnimating) return;

    setIsAnimating(true);
    const randomIndex = Math.floor(Math.random() * deck.length);
    const selected = deck[randomIndex];

    // Delay to simulate card draw animation
    setTimeout(() => {
      setCurrentCard(selected);
      setShowInfo(true);
      setIsAnimating(false);
      setCanDiscard(false);

      // Add a small cooldown before allowing discard
      setTimeout(() => setCanDiscard(true), 600);
    }, 800);
  };

  // Discard the current card
  const discardCard = () => {
    if (!currentCard || !canDiscard) return;
    setDiscardPile([...discardPile, currentCard]);
    setDeck(deck.filter((c) => c !== currentCard));
    setCurrentCard(null);
    setShowInfo(false);
  };

  // Shuffle current card back into deck
  const shuffleIntoDeck = () => {
    if (!currentCard) return;
    setCurrentCard(null);
    setShowInfo(false);
  };

  // Reset deck (move all discarded cards back)
  const resetDeck = () => {
    setDeck([...deck, ...discardPile]);
    setDiscardPile([]);
    setCurrentCard(null);
    setShowInfo(false);
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center p-6 relative overflow-hidden">
      <h1 className="text-3xl font-bold mb-6">Year 2 ILO Generator</h1>

      {/* Deck counter */}
      <div className="mb-2 text-lg font-semibold">Deck: {deck.length}</div>

      {/* Card Display */}
      <div className="relative w-64 h-40 mb-4">
        <AnimatePresence>
          {currentCard ? (
            <motion.div
              key={currentCard.ilo}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-white shadow-xl rounded-2xl flex items-center justify-center text-center p-4 text-sm font-medium"
            >
              {currentCard.ilo}
            </motion.div>
          ) : (
            <motion.div
              key="back"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-blue-200 shadow-xl rounded-2xl flex items-center justify-center text-xl font-bold"
            >
              Card Back
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4 mb-6 flex-wrap justify-center">
        {/* Draw a card */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={drawCard}
          disabled={isAnimating || (currentCard && showInfo)}
          className={`px-4 py-2 rounded-lg text-white font-semibold transition-all ${
            isAnimating || (currentCard && showInfo)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 animate-pulse"
          }`}
        >
          Draw a Card
        </motion.button>

        {/* Shuffle into deck */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={shuffleIntoDeck}
          disabled={!currentCard}
          className="px-4 py-2 rounded-lg bg-yellow-500 text-white font-semibold"
        >
          Shuffle into Deck
        </motion.button>

        {/* Discard */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={discardCard}
          disabled={!currentCard || !canDiscard}
          className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold"
        >
          Discard
        </motion.button>

        {/* Reset Deck */}
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#dc2626" }}
          whileTap={{ scale: 0.95 }}
          onClick={resetDeck}
          className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold border-2 border-red-800 shadow-md"
        >
          🔄 Reset Deck
        </motion.button>
      </div>

      {/* Info Panel */}
      {showInfo && currentCard && (
        <div className="absolute left-6 top-32 w-64 bg-white rounded-xl shadow-md p-4 text-sm border border-gray-200">
          <h2 className="text-lg font-bold mb-2">ILO Information</h2>
          <p><strong>Title:</strong> {currentCard.title}</p>
          <p><strong>Type:</strong> {currentCard.type}</p>
          <p><strong>Week:</strong> {currentCard.week}</p>
          <a
            href={currentCard.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline mt-2 inline-block"
          >
            Open Blackboard Source for ILO
          </a>
        </div>
      )}

      {/* Discard Pile */}
      <div className="absolute bottom-6 right-6 text-center">
        <div className="mb-1 font-semibold">Discard: {discardPile.length}</div>
        <div className="relative w-16 h-24">
          {discardPile.map((_, i) => (
            <div
              key={i}
              className="absolute w-16 h-24 bg-gray-400 rounded-md shadow-md"
              style={{ top: i * 0.5, left: i * 0.5 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
