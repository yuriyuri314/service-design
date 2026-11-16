import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  Platform, 
  TouchableOpacity 
} from "react-native";
import { 
  useFonts, 
  NotoSerifKR_600SemiBold, 
  NotoSerifKR_700Bold 
} from "@expo-google-fonts/noto-serif-kr";
import { Smartphone, Monitor } from "lucide-react-native";
import { AppProvider, useApp } from "./src/context/AppContext";
import { COLORS, METRICS, APP_NAME, TYPOGRAPHY } from "./src/constants/theme";
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

  // Load Noto Serif KR font
  const [fontsLoaded] = useFonts({
    NotoSerifKR_600SemiBold,
    NotoSerifKR_700Bold,
  });

  // Inject web font styling for reliable Pretendard & Noto Serif KR rendering
  useEffect(() => {
    if (isWeb && typeof document !== "undefined") {
      if (!document.getElementById("taebaek-typography")) {
        const style = document.createElement("style");
        style.id = "taebaek-typography";
        style.textContent = `
          @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
          @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@500;600;700;900&display=swap');
          * {
            font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
            box-sizing: border-box;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, [isWeb]);

  return (
    <AppProvider>
      <SafeAreaView style={styles.outerContainer}>
        <StatusBar barStyle="dark-content" />

        {isWeb && (
          <View style={styles.webTopBar}>
            <View style={styles.webTopBarLeft}>
              <View style={styles.brandDot} />
              <Text style={styles.webTitle}>
                {APP_NAME} <Text style={styles.webBadge}>태백 유휴공간 기록물</Text>
              </Text>
            </View>
            <View style={styles.webTopBarRight}>
              <TouchableOpacity
                style={styles.frameToggleBtn}
                onPress={() => setDeviceFrameMode(prev => !prev)}
                activeOpacity={0.8}
              >
                {deviceFrameMode ? (
                  <Smartphone size={14} color={COLORS.surface} strokeWidth={1.75} style={{ marginRight: 5 }} />
                ) : (
                  <Monitor size={14} color={COLORS.surface} strokeWidth={1.75} style={{ marginRight: 5 }} />
                )}
                <Text style={styles.frameToggleText}>
                  {deviceFrameMode ? "모바일 프레임 (390×844)" : "반응형 전체화면"}
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
    backgroundColor: COLORS.background,
  },
  webTopBar: {
    height: 44,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 999,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  webTopBarLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    marginRight: 8,
  },
  webTitle: {
    color: COLORS.surface,
    fontSize: 13,
    fontWeight: "700",
    fontFamily: TYPOGRAPHY.titleFont,
  },
  webBadge: {
    color: COLORS.line,
    fontSize: 11,
    fontWeight: "400",
    fontFamily: TYPOGRAPHY.bodyFont,
  },
  webTopBarRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  frameToggleBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: METRICS.borderRadiusSm,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  frameToggleText: {
    color: COLORS.surface,
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
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.line,
    position: "relative",
  },
  dynamicIslandWrapper: {
    width: "100%",
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    zIndex: 9999,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  dynamicIsland: {
    width: 96,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabContentArea: {
    flex: 1,
  },
});
