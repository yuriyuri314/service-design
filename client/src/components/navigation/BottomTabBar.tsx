import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { 
  Home, 
  MapPin, 
  FileCheck2, 
  MessageSquare, 
  Briefcase, 
  Building2, 
  Inbox, 
  User 
} from "lucide-react-native";
import { COLORS, METRICS, TYPOGRAPHY } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import { MainTab, OwnerTab } from "../../types";

export const BottomTabBar: React.FC = () => {
  const { role, activeTab, setActiveTab, ownerActiveTab, setOwnerActiveTab } = useApp();

  if (role === "OWNER") {
    const ownerTabs: { key: OwnerTab; label: string; Icon: any }[] = [
      { key: "HOME", label: "홈", Icon: Home },
      { key: "MY_SPACE", label: "내 공간", Icon: Building2 },
      { key: "REQUESTS", label: "협의 요청", Icon: Inbox },
      { key: "MY_PAGE", label: "마이", Icon: User },
    ];

    return (
      <View style={styles.container}>
        {ownerTabs.map((tab) => {
          const isActive = ownerActiveTab === tab.key;
          const IconComponent = tab.Icon;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              onPress={() => setOwnerActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <IconComponent 
                size={20} 
                color={isActive ? COLORS.accent : COLORS.textSecondary} 
                strokeWidth={1.75} 
              />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
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
        <Home 
          size={20} 
          color={activeTab === "HOME" ? COLORS.accent : COLORS.textSecondary} 
          strokeWidth={1.75} 
        />
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
        <MapPin 
          size={20} 
          color={activeTab === "EXPLORE" ? COLORS.accent : COLORS.textSecondary} 
          strokeWidth={1.75} 
        />
        <Text style={[styles.tabLabel, activeTab === "EXPLORE" && styles.tabLabelActive]}>
          공간 찾기
        </Text>
      </TouchableOpacity>

      {/* 3. 진단 (가운데 강조 버튼) */}
      <View style={styles.centerTabContainer}>
        <TouchableOpacity
          style={[
            styles.centerButton,
            activeTab === "AI_REVIEW" && styles.centerButtonActive,
          ]}
          onPress={() => setActiveTab("AI_REVIEW")}
          activeOpacity={0.85}
        >
          <FileCheck2 size={20} color={COLORS.surface} strokeWidth={2} />
          <Text style={styles.centerButtonText}>진단</Text>
        </TouchableOpacity>
      </View>

      {/* 4. 협의 (채팅) */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => setActiveTab("CHAT")}
        activeOpacity={0.7}
      >
        <MessageSquare 
          size={20} 
          color={activeTab === "CHAT" ? COLORS.accent : COLORS.textSecondary} 
          strokeWidth={1.75} 
        />
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
        <Briefcase 
          size={20} 
          color={activeTab === "MY_STARTUP" ? COLORS.accent : COLORS.textSecondary} 
          strokeWidth={1.75} 
        />
        <Text style={[styles.tabLabel, activeTab === "MY_STARTUP" && styles.tabLabelActive]}>
          내 창업
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    paddingBottom: Platform.OS === "ios" ? 12 : 6,
    paddingTop: 6,
    alignItems: "center",
    justifyContent: "space-around",
    zIndex: 100,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
  },
  tabLabel: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.textSecondary,
    letterSpacing: -0.2,
    marginTop: 3,
  },
  tabLabelActive: {
    color: COLORS.accent,
    fontWeight: "700",
  },
  centerTabContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -16,
  },
  centerButton: {
    width: 52,
    height: 52,
    borderRadius: METRICS.borderRadiusFull,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  centerButtonActive: {
    backgroundColor: COLORS.primary,
  },
  centerButtonText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.surface,
    marginTop: 1,
  },
});
