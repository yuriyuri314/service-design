import React, { useState } from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  Platform, 
  TouchableOpacity, 
  Dimensions 
} from "react-native";
import { AppProvider, useApp } from "./src/context/AppContext";
import { COLORS, METRICS, APP_NAME } from "./src/constants/theme";
import { BottomTabBar } from "./src/components/navigation/BottomTabBar";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ExploreScreen } from "./src/screens/ExploreScreen";
import { AiReviewScreen } from "./src/screens/AiReviewScreen";
import { ChatScreen } from "./src/screens/ChatScreen";
import { MyStartupScreen } from "./src/screens/MyStartupScreen";
import { OwnerHomeScreen } from "./src/screens/OwnerHomeScreen";

const MainAppContent: React.FC = () => {
  const { isOnboarded, role, activeTab } = useApp();

  // 온보딩 미완료 시
  if (!isOnboarded) {
    return <OnboardingScreen />;
  }

  // 소유자 모드일 때
  if (role === "OWNER") {
    return (
      <View style={styles.screenContainer}>
        <OwnerHomeScreen />
        <BottomTabBar />
      </View>
    );
  }

  // 청년 모드 5개 탭 렌더링
  return (
    <View style={styles.screenContainer}>
      <View style={styles.tabContentArea}>
        {activeTab === "HOME" && <HomeScreen />}
        {activeTab === "EXPLORE" && <ExploreScreen />}
        {activeTab === "AI_REVIEW" && <AiReviewScreen />}
        {activeTab === "CHAT" && <ChatScreen />}
        {activeTab === "MY_STARTUP" && <MyStartupScreen />}
      </View>
      <BottomTabBar />
    </View>
  );
};

export default function App() {
  const isWeb = Platform.OS === "web";
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);

  return (
    <AppProvider>
      <SafeAreaView style={styles.outerContainer}>
        <StatusBar barStyle="dark-content" />

        {isWeb && (
          <View style={styles.webTopBar}>
            <View style={styles.webTopBarLeft}>
              <View style={styles.brandDot} />
              <Text style={styles.webTitle}>
                {APP_NAME} <Text style={styles.webBadge}>모바일 앱 프로토타입</Text>
              </Text>
            </View>
            <View style={styles.webTopBarRight}>
              <TouchableOpacity
                style={styles.frameToggleBtn}
                onPress={() => setDeviceFrameMode(prev => !prev)}
                activeOpacity={0.8}
              >
                <Text style={styles.frameToggleText}>
                  {deviceFrameMode ? "📱 모바일 프레임 모드 (390×844)" : "🖥️ 반응형 전체화면"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={[styles.mainWrapper, isWeb && styles.webWrapper]}>
          <View
            style={[
              styles.appContainer,
              isWeb && deviceFrameMode && styles.deviceFrame,
            ]}
          >
            {/* iPhone 다이내믹 아일랜드 & 노치 시뮬레이션 */}
            {isWeb && deviceFrameMode && (
              <View style={styles.dynamicIslandWrapper}>
                <View style={styles.dynamicIsland} />
              </View>
            )}

            <MainAppContent />
          </View>
        </View>
      </SafeAreaView>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  webTopBar: {
    height: 44,
    backgroundColor: "#1E293B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 999,
  },
  webTopBarLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 8,
  },
  webTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  webBadge: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "400",
  },
  webTopBarRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  frameToggleBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  frameToggleText: {
    color: "#E2E8F0",
    fontSize: 11,
    fontWeight: "600",
  },
  mainWrapper: {
    flex: 1,
  },
  webWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  appContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.surface,
    overflow: "hidden",
  },
  deviceFrame: {
    width: METRICS.standardWidth,
    height: METRICS.standardHeight,
    borderRadius: 44,
    borderWidth: 10,
    borderColor: "#0F172A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 28,
    elevation: 20,
    position: "relative",
  },
  dynamicIslandWrapper: {
    width: "100%",
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    zIndex: 9999,
  },
  dynamicIsland: {
    width: 96,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#0F172A",
  },
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabContentArea: {
    flex: 1,
  },
});
