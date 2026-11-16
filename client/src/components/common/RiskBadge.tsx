import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react-native";
import { COLORS, METRICS, TYPOGRAPHY } from "../../constants/theme";
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
          defaultLabel: "안전",
          Icon: CheckCircle2,
        };
      case "CAUTION":
        return {
          color: COLORS.riskCaution,
          defaultLabel: "주의",
          Icon: AlertTriangle,
        };
      case "DANGER":
        return {
          color: COLORS.riskDanger,
          defaultLabel: "위험",
          Icon: AlertCircle,
        };
      default:
        return {
          color: COLORS.textSecondary,
          defaultLabel: "점검 필요",
          Icon: AlertCircle,
        };
    }
  };

  const config = getBadgeConfig();
  const displayLabel = label || config.defaultLabel;
  const IconComponent = config.Icon;

  const sizeStyles = {
    sm: { paddingVertical: 2, paddingHorizontal: 6, fontSize: 11, iconSize: 12 },
    md: { paddingVertical: 3, paddingHorizontal: 8, fontSize: 12, iconSize: 14 },
    lg: { paddingVertical: 5, paddingHorizontal: 10, fontSize: 13, iconSize: 16 },
  }[size];

  return (
    <View
      style={[
        styles.container,
        {
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          borderColor: config.color,
        },
        style,
      ]}
    >
      <IconComponent 
        size={sizeStyles.iconSize} 
        color={config.color} 
        strokeWidth={1.75} 
        style={styles.icon}
      />
      <Text
        style={[
          styles.text,
          {
            color: config.color,
            fontSize: sizeStyles.fontSize,
          },
        ]}
      >
        {displayLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderRadius: METRICS.borderRadiusSm,
    alignSelf: "flex-start",
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
});
