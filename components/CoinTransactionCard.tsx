import { THEME } from "@/shared/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type CoinTransactionCardProps = {
  type: "purchase" | "spend" | "refund";
  amount: number;
  date: string | Date;
  description?: string;
};

export const CoinTransactionCard: React.FC<CoinTransactionCardProps> = ({
  type,
  amount,
  date,
  description,
}) => {
  // 🪙 Determine color and prefix based on transaction type
  const isPositive = type === "purchase" || type === "refund";
  const sign = isPositive ? "+" : "-";
  const color = isPositive ? THEME.colors.text : THEME.colors.error;

  // Format date
  const formattedDate =
    typeof date === "string"
      ? new Date(date).toLocaleDateString()
      : date.toLocaleDateString();

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={[styles.amount, { color }]}>
          {sign}
          {amount} 🪙
        </Text>
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>
      <Text style={styles.date}>{formattedDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: THEME.colors.background,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  left: {
    flexDirection: "column",
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: THEME.colors.text,
  },
  description: {
    fontSize: 14,
    color: THEME.colors.text,
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: THEME.colors.text,
  },
});
