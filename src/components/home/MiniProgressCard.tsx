import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import { ProgressSteps } from "../common/ProgressSteps";

export const MiniProgressCard: React.FC = () => {
  const { startupStep, setActiveTab } = useApp();

  const getStepInfo = () => {
    switch (startupStep) {
      case 1:
        return {
          title: "태백 유휴공간 탐색 중",
          desc: "마음에 드는 공간을 발견하셨나요? AI로 바로 검토해보세요.",
          targetTab: "EXPLORE" as const,
        };
      case 2:
        return {
          title: "공간 상태 & 상권 AI 검토 단계",
          desc: "계약 전 필요한 수리비와 예상 매출 리포트를 확인하세요.",
          targetTab: "AI_REVIEW" as const,
        };
      case 3:
        return {
          title: "소유자와 조건 협의 단계",
          desc: "청년창창센터 담당자와 함께 현장 방문 및 무상 협의를 진행합니다.",
          targetTab: "CHAT" as const,
        };
      case 4:
        return {
          title: "태백시 지원사업 신청 단계",
          desc: "확보된 공간 리포트로 최대 4,500만원 지원사업을 접수하세요.",
          targetTab: "MY_STARTUP" as const,
        };
      default:
        return {
          title: "축하합니다! 창업 성공",
          desc: "태백에서 시작된 청년의 멋진 도전을 응원합니다.",
          targetTab: "MY_STARTUP" as const,
        };
    }
  };

  const info = getStepInfo();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>내 창업 여정</Text>
        </View>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => setActiveTab(info.targetTab)}
          activeOpacity={0.8}
        >
          <Text style={styles.continueBtnText}>이어서 하기 →</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.titleText}>{info.title}</Text>
      <Text style={styles.descText}>{info.desc}</Text>

      <ProgressSteps currentStep={startupStep} compact={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  badge: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
  },
  continueBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  continueBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  titleText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  descText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
    marginBottom: 8,
  },
});
