import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { COLORS, METRICS, TYPOGRAPHY } from "../../constants/theme";

interface HighlightBoxProps {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const HighlightBox: React.FC<HighlightBoxProps> = ({
  title,
  children,
  style,
  contentStyle,
  icon,
}) => {
  return (
    <View style={[styles.container, style]}>
      {title && (
        <View style={styles.titleRow}>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
          <Text style={styles.titleText}>{title}</Text>
        </View>
      )}
      {typeof children === "string" ? (
        <Text style={[styles.contentText, contentStyle]}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.line,
    borderRadius: METRICS.borderRadiusSm,
    padding: 14,
    marginVertical: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  iconWrapper: {
    marginRight: 6,
  },
  titleText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.accent,
    letterSpacing: -0.2,
  },
  contentText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
});
