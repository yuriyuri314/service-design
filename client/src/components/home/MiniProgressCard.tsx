import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { COLORS, METRICS, TYPOGRAPHY } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import { ProgressSteps } from "../common/ProgressSteps";

export const MiniProgressCard: React.FC = () => {
  const { startupStep, setActiveTab } = useApp();

  const getStepInfo = () => {
    switch (startupStep) {
      case 1:
        return {
          title: "유휴공간 탐색 단계",
          desc: "마음에 드는 공간을 찾으면 계약 전 진단을 진행합니다.",
          targetTab: "EXPLORE" as const,
        };
      case 2:
        return {
          title: "공간 상태 및 상권 진단 단계",
          desc: "예상 수리비와 상권 손익 분석 결과를 확인합니다.",
          targetTab: "AI_REVIEW" as const,
        };
      case 3:
        return {
          title: "소유자 조건 협의 단계",
          desc: "청년창창센터 담당자와 함께 현장 방문 및 조건을 협의합니다.",
          targetTab: "CHAT" as const,
        };
      case 4:
        return {
          title: "태백시 지원사업 신청 단계",
          desc: "확보된 공간 진단서로 공간개선 지원금을 접수합니다.",
          targetTab: "MY_STARTUP" as const,
        };
      default:
        return {
          title: "창업 준비 완료",
          desc: "태백에서 시작하는 사업 정착을 이어갑니다.",
          targetTab: "MY_STARTUP" as const,
        };
    }
  };

  const info = getStepInfo();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>창업 진행 현황</Text>
        </View>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => setActiveTab(info.targetTab)}
          activeOpacity={0.8}
        >
          <Text style={styles.continueBtnText}>이어서 하기</Text>
          <ArrowRight size={13} color={COLORS.surface} strokeWidth={1.75} style={{ marginLeft: 3 }} />
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
    borderRadius: METRICS.borderRadiusMd,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  badge: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: METRICS.borderRadiusSm,
  },
  badgeText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  continueBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: METRICS.borderRadiusSm,
  },
  continueBtnText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.surface,
  },
  titleText: {
    fontFamily: TYPOGRAPHY.titleFont,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  descText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
});
