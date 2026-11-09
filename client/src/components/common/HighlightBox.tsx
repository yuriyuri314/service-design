import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { COLORS } from "../../constants/theme";

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
  icon
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
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 14,
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
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: -0.2,
  },
  contentText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 19,
    letterSpacing: -0.2,
  },
});
