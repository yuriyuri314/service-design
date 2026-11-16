import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { APP_NAME, COLORS, METRICS, TYPOGRAPHY } from "../../constants/theme";
import { useApp } from "../../context/AppContext";

interface HeaderProps {
  title?: string;
  showRoleSwitch?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showRoleSwitch = true,
  onBack,
  rightAction,
}) => {
  const { role, setRole } = useApp();

  const toggleRole = () => {
    setRole(role === "YOUTH" ? "OWNER" : "YOUTH");
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
            <ArrowLeft size={20} color={COLORS.textPrimary} strokeWidth={1.75} />
          </TouchableOpacity>
        ) : null}
        <View>
          <Text style={styles.logoTitle}>{title || APP_NAME}</Text>
          {!title && <Text style={styles.locationSubtitle}>강원도 태백시 청년창업</Text>}
        </View>
      </View>

      <View style={styles.rightRow}>
        {rightAction ? (
          rightAction
        ) : showRoleSwitch ? (
          <TouchableOpacity 
            style={[
              styles.roleSwitchButton,
              role === "OWNER" && styles.roleSwitchOwner
            ]} 
            onPress={toggleRole}
            activeOpacity={0.8}
          >
            <View style={[styles.roleDot, role === "OWNER" && styles.roleDotOwner]} />
            <Text style={[styles.roleSwitchText, role === "OWNER" && styles.roleSwitchTextOwner]}>
              {role === "YOUTH" ? "청년 창업가" : "공간 소유자"}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    paddingRight: 10,
    paddingVertical: 4,
  },
  logoTitle: {
    fontFamily: TYPOGRAPHY.titleFont,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: -0.3,
  },
  locationSubtitle: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  rightRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  roleSwitchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: METRICS.borderRadiusSm,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  roleSwitchOwner: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.primary,
  },
  roleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
    marginRight: 6,
  },
  roleDotOwner: {
    backgroundColor: COLORS.primary,
  },
  roleSwitchText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  roleSwitchTextOwner: {
    color: COLORS.primary,
  },
});
