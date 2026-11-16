import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, METRICS, TYPOGRAPHY } from "../../constants/theme";

export const TaebaekStatsCard: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.badgeText}>지역 지표</Text>
        <Text style={styles.titleText}>숫자로 보는 태백</Text>
      </View>
      <Text style={styles.subText}>
        인구 감소와 고령화 속에서도, 빈 공간은 청년의 새로운 활동 기반이 됩니다.
      </Text>

      <View style={styles.grid}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>14.3%</Text>
          <Text style={styles.statLabel}>청년 인구 비율</Text>
          <Text style={styles.statNote}>20~39세 인구</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: COLORS.accent }]}>32.7%</Text>
          <Text style={styles.statLabel}>초고령화율</Text>
          <Text style={styles.statNote}>65세 이상 인구</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: COLORS.textPrimary }]}>328곳</Text>
          <Text style={styles.statLabel}>발굴 유휴공간</Text>
          <Text style={styles.statNote}>태백 전역 빈집·상가</Text>
        </View>
      </View>

      <View style={styles.insightBox}>
        <Text style={styles.insightText}>
          <Text style={styles.boldText}>"빈 공간과 창업 지원은 모두 있지만 서로 이어지지 않는다."</Text>{"\n"}
          공간 확보 단계의 사전 판단 근거를 마련하여 지원사업과 잇습니다.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.borderRadiusMd,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  titleRow: {
    marginBottom: 4,
  },
  badgeText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.accent,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  titleText: {
    fontFamily: TYPOGRAPHY.titleFont,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  subText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 2,
    marginBottom: 14,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: METRICS.borderRadiusSm,
    marginHorizontal: 3,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  statNumber: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
    fontVariant: TYPOGRAPHY.fontVariantTabular,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  statNote: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  insightBox: {
    backgroundColor: COLORS.background,
    borderRadius: METRICS.borderRadiusSm,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  insightText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  boldText: {
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
});
