import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { COLORS } from "../../constants/theme";
import { RiskLevel } from "../../types";

interface RiskBadgeProps {
  level: RiskLevel;
  label?: string;
  size?: "sm" | "md" | "lg";
  style?: ViewStyle;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  label,
  size = "md",
  style,
}) => {
  const getBadgeConfig = () => {
    switch (level) {
      case "SAFE":
        return {
          color: COLORS.riskSafe,
          bgColor: "#ECFDF5",
          defaultLabel: "안전",
          dotColor: "#10B981"
        };
      case "CAUTION":
        return {
          color: COLORS.riskCaution,
          bgColor: "#FFFBEB",
          defaultLabel: "주의",
          dotColor: "#F59E0B"
        };
      case "DANGER":
        return {
          color: COLORS.riskDanger,
          bgColor: "#FEF2F2",
          defaultLabel: "위험",
          dotColor: "#EF4444"
        };
      default:
        return {
          color: COLORS.textSecondary,
          bgColor: "#F3F4F6",
          defaultLabel: "미정",
          dotColor: COLORS.textSecondary
        };
    }
  };

  const config = getBadgeConfig();
  const displayLabel = label || config.defaultLabel;

  const sizeStyles = {
    sm: { paddingVertical: 2, paddingHorizontal: 6, fontSize: 10, dotSize: 5 },
    md: { paddingVertical: 4, paddingHorizontal: 9, fontSize: 11, dotSize: 6 },
    lg: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 13, dotSize: 8 },
  }[size];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: config.bgColor,
          borderColor: config.color,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.dot,
          {
            backgroundColor: config.dotColor,
            width: sizeStyles.dotSize,
            height: sizeStyles.dotSize,
            borderRadius: sizeStyles.dotSize / 2,
          },
        ]}
      />
      <Text style={[styles.text, { color: config.color, fontSize: sizeStyles.fontSize }]}>
        {displayLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 9999,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  dot: {
    marginRight: 5,
  },
  text: {
    fontWeight: "700",
    letterSpacing: -0.2,
  },
});
