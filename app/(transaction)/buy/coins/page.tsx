"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { HandCoins, MessageCircle } from "lucide-react";

interface CoinOption {
  amount: number;
  price: number;
}

const coinOptions: CoinOption[] = [
  { amount: 1000, price: 499999 },
  { amount: 500, price: 249999 },
  { amount: 300, price: 149999 },
  { amount: 200, price: 119999 },
  { amount: 100, price: 59999 },
];

export default function CoinStore() {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handlePurchase() {
    if (!selectedOption) return;

    setLoading(true);

    const selectedCoin = coinOptions.find(
      (option) => option.amount.toString() === selectedOption
    );

    if (!selectedCoin) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/transactions/purchase-coins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coinAmount: selectedCoin.amount,
          price: selectedCoin.price,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create transaction");
      }

      const { paymentUrl } = await res.json();
      window.location.href = paymentUrl; // Redirect to Midtrans
    } catch (error) {
      console.error("Purchase failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Coins Store</h1>
          <p className="text-zinc-400">
            Dive into the world of your favorite series with our exclusive coin
            system. Whether you&apos;re a new reader or a seasoned fan, our Coin
            Store offers a seamless way to purchase and enjoy the latest
            chapters of the stories you love.
          </p>
        </div>

        <RadioGroup
          className="space-y-2"
          value={selectedOption}
          onValueChange={setSelectedOption}
        >
          {coinOptions.map((option) => (
            <label
              key={option.amount}
              className="flex items-center justify-between w-full p-4 bg-zinc-900 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-center">
                <RadioGroupItem
                  value={option.amount.toString()}
                  id={option.amount.toString()}
                  className="text-white bg-white"
                />
                <div className="flex items-center ml-3">
                  <span className="text-sm font-semibold flex gap-2">
                    <HandCoins size={20} /> {option.amount} Coins
                  </span>
                </div>
              </div>
              <span className="text-sm font-semibold bg-white text-zinc-900 py-0.5 px-2 rounded-full">
                Rp {option.price.toLocaleString("id-ID")}
              </span>
            </label>
          ))}
        </RadioGroup>

        <div className="space-y-4">
          <Button
            className="w-full bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-700 disabled:opacity-50"
            size="lg"
            onClick={handlePurchase}
            disabled={!selectedOption || loading}
          >
            {loading ? "Processing..." : "Buy coins"}
          </Button>

          <Button
            variant="secondary"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            size="lg"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact customer support
          </Button>
        </div>
      </div>
    </div>
  );
}
