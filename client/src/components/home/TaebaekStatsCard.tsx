import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants/theme";

export const TaebaekStatsCard: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.badgeText}>📊 DATA REPORT</Text>
        <Text style={styles.titleText}>숫자로 보는 강원도 태백</Text>
      </View>
      <Text style={styles.subText}>
        인구 감소와 고령화 속에서도, 빈 공간은 청년의 새로운 무대가 됩니다.
      </Text>

      <View style={styles.grid}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>14.3%</Text>
          <Text style={styles.statLabel}>청년 인구 비율</Text>
          <Text style={styles.statNote}>20~39세 청년층</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: COLORS.accentOrange }]}>32.7%</Text>
          <Text style={styles.statLabel}>초고령화율</Text>
          <Text style={styles.statNote}>65세 이상 인구</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: COLORS.primary }]}>328곳</Text>
          <Text style={styles.statLabel}>발굴 유휴공간</Text>
          <Text style={styles.statNote}>태백 전역 빈집·상가</Text>
        </View>
      </View>

      <View style={styles.insightBox}>
        <Text style={styles.insightText}>
          💬 <Text style={styles.boldText}>"빈 공간과 창업 지원은 모두 있지만 서로 이어지지 않는다."</Text>{"\n"}
          빈자리 태백은 공간 확보 단계의 판단 근거를 만들어 지원사업과 연결합니다.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1F2430",
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  titleRow: {
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#60A5FA",
    letterSpacing: 1,
    marginBottom: 2,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  subText: {
    fontSize: 12,
    color: "#94A3B8",
    lineHeight: 17,
    marginTop: 2,
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginHorizontal: 3,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "900",
    color: "#38BDF8",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#F1F5F9",
    marginTop: 4,
  },
  statNote: {
    fontSize: 9,
    color: "#64748B",
    marginTop: 2,
  },
  insightBox: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  insightText: {
    fontSize: 11,
    color: "#CBD5E1",
    lineHeight: 17,
  },
  boldText: {
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
