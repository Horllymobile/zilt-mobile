import { CoinTransactionCard } from "@/components/CoinTransactionCard";
import { THEME } from "@/shared/constants/theme";
import { router } from "expo-router";
import { BanknoteArrowUp, ChevronLeft } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const dummyTransactions = [
  {
    id: "1",
    type: "purchase",
    amount: 500,
    date: "2025-11-12T09:00:00Z",
    description: "Bought 500 coins via Paystack",
  },
  {
    id: "2",
    type: "spend",
    amount: 200,
    date: "2025-11-13T14:30:00Z",
    description: "Unlocked premium profile features",
  },
  {
    id: "3",
    type: "purchase",
    amount: 1000,
    date: "2025-11-14T10:00:00Z",
    description: "Bought 1000 coins via Stripe",
  },
  {
    id: "4",
    type: "spend",
    amount: 300,
    date: "2025-11-15T16:45:00Z",
    description: "Sent coins as gift",
  },
  {
    id: "5",
    type: "refund",
    amount: 50,
    date: "2025-11-16T12:00:00Z",
    description: "Refund for failed transaction",
  },
];

export default function CoinPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "purchase" | "spend" | "refund">(
    "all"
  );
  const [showBuySheet, setShowBuySheet] = useState(false);
  const [buyAmount, setBuyAmount] = useState("");
  const wallet = { balance: 1550 };

  const filteredTransactions = useMemo(() => {
    return dummyTransactions.filter((t) => {
      const matchesFilter = filter === "all" || t.type === filter;
      const matchesSearch =
        search === "" ||
        t.description?.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  const handleBuyCoin = () => {
    // Here you would call your payment gateway / backend API
    alert(`Buying ${buyAmount} coins...`);
    setShowBuySheet(false);
    setBuyAmount("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
          padding: 16,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color={THEME.colors.text} size={24} />
        </TouchableOpacity>
        <Text
          style={{ fontSize: 24, fontWeight: "600", color: THEME.colors.text }}
        >
          Wallet
        </Text>
      </View>

      {/* Balance */}
      <View
        style={{
          marginTop: 20,
          paddingHorizontal: 16,
          gap: 15,
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#ddd",
          paddingBottom: 20,
        }}
      >
        <Text
          style={{ fontSize: 34, fontWeight: "bold", color: THEME.colors.text }}
        >
          {Intl.NumberFormat("en-NG", {
            currency: "NGN",
            style: "currency",
          }).format(wallet.balance)}
        </Text>

        {/* Buy / Spend buttons */}
        <View
          style={{ flexDirection: "row", justifyContent: "center", gap: 10 }}
        >
          <TouchableOpacity
            style={{
              borderColor: THEME.colors.text,
              borderWidth: 1,
              backgroundColor: THEME.colors.background,
              paddingVertical: 10,
              paddingHorizontal: 25,
              borderRadius: 50,
              flexDirection: "row",
              gap: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setShowBuySheet(true)}
          >
            <BanknoteArrowUp color={THEME.colors.text} />
            <Text style={{ color: THEME.colors.text }}>Buy Coin</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={{
              borderColor: THEME.colors.text,
              borderWidth: 1,
              backgroundColor: THEME.colors.background,
              paddingVertical: 10,
              paddingHorizontal: 25,
              borderRadius: 50,
              flexDirection: "row",
              gap: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {}}
          >
            <BanknoteArrowDown color={THEME.colors.text} />
            <Text style={{ color: THEME.colors.text }}>Spend Coin</Text>
          </TouchableOpacity> */}
        </View>
      </View>

      {/* Search & Filter */}
      <View style={{ marginTop: 10, paddingHorizontal: 16, gap: 10 }}>
        <TextInput
          placeholder="Search transactions..."
          value={search}
          onChangeText={setSearch}
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            color: THEME.colors.text,
          }}
          placeholderTextColor="#888"
        />

        <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
          {(["all", "purchase", "spend", "refund"] as const).map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={{
                flex: 1,
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: filter === f ? THEME.colors.surface : "#eee",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: filter === f ? THEME.colors.text : "#555" }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Transaction List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <CoinTransactionCard
            type={item.type as any}
            amount={item.amount}
            date={item.date}
            description={item.description}
          />
        )}
        style={{ marginTop: 10 }}
      />

      {/* Buy Coin Bottom Sheet */}
      <Modal visible={showBuySheet} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <View
            style={{
              backgroundColor: THEME.colors.background,
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: THEME.colors.text,
                marginBottom: 10,
              }}
            >
              Buy Coins
            </Text>

            <TextInput
              placeholder="Enter amount"
              value={buyAmount}
              onChangeText={setBuyAmount}
              keyboardType="numeric"
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                padding: 12,
                marginBottom: 20,
                color: THEME.colors.text,
              }}
              placeholderTextColor="#888"
            />

            <TouchableOpacity
              style={{
                backgroundColor: THEME.colors.surface,
                padding: 15,
                borderRadius: 10,
                alignItems: "center",
              }}
              onPress={handleBuyCoin}
            >
              <Text style={{ color: THEME.colors.text, fontWeight: "600" }}>
                Confirm Purchase
              </Text>
            </TouchableOpacity>

            <Pressable
              onPress={() => setShowBuySheet(false)}
              style={{ marginTop: 10, alignItems: "center" }}
            >
              <Text style={{ color: "#888" }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
