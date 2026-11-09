import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { APP_NAME, COLORS } from "../../constants/theme";
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
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
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
    borderBottomColor: "#F3F4F6",
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    paddingRight: 12,
    paddingVertical: 4,
  },
  backArrow: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  locationSubtitle: {
    fontSize: 10,
    color: COLORS.textTertiary,
    marginTop: -1,
  },
  rightRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  roleSwitchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D6DCFF",
  },
  roleSwitchOwner: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  roleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: 5,
  },
  roleDotOwner: {
    backgroundColor: "#4B5563",
  },
  roleSwitchText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
  },
  roleSwitchTextOwner: {
    color: "#374151",
  },
});
