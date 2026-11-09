import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { COLORS } from "../constants/theme";
import { useApp } from "../context/AppContext";
import { Header } from "../components/common/Header";
import { RiskBadge } from "../components/common/RiskBadge";
import { HighlightBox } from "../components/common/HighlightBox";

export const AiReviewScreen: React.FC = () => {
  const { spaces, selectedSpaceId, setSelectedSpaceId, reports, setActiveTab } = useApp();
  const [selectedReportId, setSelectedReportId] = useState<string>("report-01");

  const activeReport = reports.find(r => r.id === selectedReportId) || reports[0];
  const associatedSpace = spaces.find(s => s.id === (activeReport ? activeReport.spaceId : selectedSpaceId));

  return (
    <View style={styles.container}>
      <Header title="AI 창업 검토 리포트" />

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* 상단 탭 소개 배너 */}
        <View style={styles.banner}>
          <View style={styles.bannerPill}>
            <Text style={styles.bannerPillText}>판단 · 1단계 완료 후 확장 예정</Text>
          </View>
          <Text style={styles.bannerTitle}>계약 전 필수! AI 창업 검토</Text>
          <Text style={styles.bannerDesc}>
            공간 상태 진단, 숨은 수리비, 유동인구 기반 예상 매출과 겹치지 않는 태백 자원 연계 업종을 분석합니다.
          </Text>
        </View>

        {/* 리포트 선택 탭 */}
        <View style={styles.reportSelector}>
          <Text style={styles.selectorLabel}>발행된 예시 리포트 확인하기:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reportChips}>
            {reports.map((rep) => (
              <TouchableOpacity
                key={rep.id}
                style={[
                  styles.reportChip,
                  selectedReportId === rep.id && styles.reportChipActive,
                ]}
                onPress={() => setSelectedReportId(rep.id)}
              >
                <Text style={[
                  styles.reportChipText,
                  selectedReportId === rep.id && styles.reportChipTextActive,
                ]}>
                  {rep.spaceTitle.split(" ")[0]} ({rep.businessNameCandidate.split(" ")[0]})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 선택된 리포트 카드 프리뷰 */}
        {activeReport && (
          <View style={styles.reportCard}>
            <View style={styles.reportCardHeader}>
              <View>
                <Text style={styles.reportDate}>{activeReport.createdAt} 분석 리포트</Text>
                <Text style={styles.reportSpaceTitle}>{activeReport.spaceTitle}</Text>
                <Text style={styles.reportBizCandidate}>추천 업종: {activeReport.businessNameCandidate}</Text>
              </View>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreNumber}>{activeReport.overallScore}</Text>
                <Text style={styles.scoreUnit}>점</Text>
              </View>
            </View>

            <View style={styles.verdictRow}>
              <RiskBadge level={activeReport.riskLevel} size="md" />
              <Text style={styles.verdictText}>{activeReport.overallVerdict}</Text>
            </View>

            <HighlightBox
              title="예상 수리비 및 숨은 비용 진단"
              icon={<Text>🛠️</Text>}
            >
              {`• 진단 상태: ${activeReport.diagnosis.agingStatus}\n• 필요 수리: ${activeReport.diagnosis.repairScope}\n• 예상 수리비: ${activeReport.diagnosis.estimatedRepairCost}`}
            </HighlightBox>

            <View style={styles.feasibilityBox}>
              <Text style={styles.feasibilityTitle}>📈 버틸 수 있을까? 상권 & 손익 분석</Text>
              <Text style={styles.feasibilityItem}>• 유동인구: {activeReport.feasibility.monthlyFootTraffic}</Text>
              <Text style={styles.feasibilityItem}>• 예상 월매출: {activeReport.feasibility.estimatedMonthlyRevenue}</Text>
              <Text style={styles.feasibilityItem}>• 손익분기점 도달: {activeReport.feasibility.breakEvenMonths}개월</Text>
              {activeReport.feasibility.warningMessage && (
                <Text style={styles.warningItem}>⚠️ {activeReport.feasibility.warningMessage}</Text>
              )}
            </View>

            {/* 하단 액션 버튼 */}
            <TouchableOpacity 
              style={styles.discussActionBtn}
              onPress={() => setActiveTab("CHAT")}
              activeOpacity={0.85}
            >
              <Text style={styles.discussActionBtnText}>
                🤝 이 리포트로 소유자에게 협의 요청하기
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollBody: {
    flex: 1,
    padding: 16,
  },
  banner: {
    backgroundColor: COLORS.surface,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  bannerPill: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  bannerPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  bannerDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  reportSelector: {
    marginBottom: 14,
  },
  selectorLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  reportChips: {
    flexDirection: "row",
  },
  reportChip: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 8,
  },
  reportChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  reportChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  reportChipTextActive: {
    color: "#FFFFFF",
  },
  reportCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  reportCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  reportDate: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginBottom: 2,
  },
  reportSpaceTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
    maxWidth: 220,
    marginBottom: 4,
  },
  reportBizCandidate: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },
  scoreCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreNumber: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.primary,
  },
  scoreUnit: {
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: -2,
  },
  verdictRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    flexWrap: "wrap",
    gap: 8,
  },
  verdictText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
    flex: 1,
  },
  feasibilityBox: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  feasibilityTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  feasibilityItem: {
    fontSize: 12,
    color: "#334155",
    lineHeight: 19,
  },
  warningItem: {
    fontSize: 11,
    color: "#B45309",
    marginTop: 6,
    lineHeight: 16,
  },
  discussActionBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  discussActionBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
