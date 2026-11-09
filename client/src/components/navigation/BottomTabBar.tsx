import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { COLORS } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import { MainTab, OwnerTab } from "../../types";

export const BottomTabBar: React.FC = () => {
  const { role, activeTab, setActiveTab, ownerActiveTab, setOwnerActiveTab } = useApp();

  if (role === "OWNER") {
    const ownerTabs: { key: OwnerTab; label: string; icon: string }[] = [
      { key: "HOME", label: "홈", icon: "🏠" },
      { key: "MY_SPACE", label: "내 공간", icon: "🏢" },
      { key: "REQUESTS", label: "협의 요청", icon: "📬" },
      { key: "MY_PAGE", label: "마이", icon: "👤" },
    ];

    return (
      <View style={styles.container}>
        {ownerTabs.map((tab) => {
          const isActive = ownerActiveTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              onPress={() => setOwnerActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  // 청년 모드 5개 탭
  return (
    <View style={styles.container}>
      {/* 1. 홈 */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => setActiveTab("HOME")}
        activeOpacity={0.7}
      >
        <Text style={styles.tabIcon}>🏠</Text>
        <Text style={[styles.tabLabel, activeTab === "HOME" && styles.tabLabelActive]}>
          홈
        </Text>
      </TouchableOpacity>

      {/* 2. 공간 찾기 (지도) */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => setActiveTab("EXPLORE")}
        activeOpacity={0.7}
      >
        <Text style={styles.tabIcon}>🗺️</Text>
        <Text style={[styles.tabLabel, activeTab === "EXPLORE" && styles.tabLabelActive]}>
          공간 찾기
        </Text>
      </TouchableOpacity>

      {/* 3. AI 검토 (가운데 강조 버튼) */}
      <View style={styles.centerTabContainer}>
        <TouchableOpacity
          style={[
            styles.centerButton,
            activeTab === "AI_REVIEW" && styles.centerButtonActive,
          ]}
          onPress={() => setActiveTab("AI_REVIEW")}
          activeOpacity={0.85}
        >
          <View style={styles.centerIconWrapper}>
            <Text style={styles.centerIcon}>✨</Text>
          </View>
          <Text style={styles.centerButtonText}>AI 검토</Text>
        </TouchableOpacity>
      </View>

      {/* 4. 협의 (채팅) */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => setActiveTab("CHAT")}
        activeOpacity={0.7}
      >
        <Text style={styles.tabIcon}>💬</Text>
        <Text style={[styles.tabLabel, activeTab === "CHAT" && styles.tabLabelActive]}>
          협의
        </Text>
      </TouchableOpacity>

      {/* 5. 내 창업 (신청 + 마이) */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => setActiveTab("MY_STARTUP")}
        activeOpacity={0.7}
      >
        <Text style={styles.tabIcon}>🚀</Text>
        <Text style={[styles.tabLabel, activeTab === "MY_STARTUP" && styles.tabLabelActive]}>
          내 창업
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 68,
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingBottom: Platform.OS === "ios" ? 12 : 6,
    paddingTop: 6,
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 100,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#8E8E93",
    letterSpacing: -0.2,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 3,
  },
  centerTabContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20,
  },
  centerButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  centerButtonActive: {
    backgroundColor: "#3B58E6",
    transform: [{ scale: 1.05 }],
  },
  centerIconWrapper: {
    marginBottom: -2,
  },
  centerIcon: {
    fontSize: 19,
  },
  centerButtonText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
});
