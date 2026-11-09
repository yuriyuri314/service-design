import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { COLORS } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import { SpaceType, SpaceCondition } from "../../types";

const NEIGHBORHOODS = ["전체", "황지동", "장성동", "철암동", "문곡소도동", "상장동", "삼수동"];

const SPACE_TYPES: { key: SpaceType; label: string }[] = [
  { key: "ALL", label: "전체 공간" },
  { key: "VACANT_HOUSE", label: "빈집" },
  { key: "VACANT_STORE", label: "빈 상가" },
  { key: "WAREHOUSE_FACTORY", label: "창고·공장" },
  { key: "CLOSED_SCHOOL", label: "폐교·공공시설" },
];

const CONDITIONS: { key: SpaceCondition | "ALL"; label: string }[] = [
  { key: "ALL", label: "상태 전체" },
  { key: "READY", label: "바로 사용" },
  { key: "MINOR_REPAIR", label: "일부 수리" },
  { key: "MAJOR_REPAIR", label: "대규모 수리" },
];

export const FilterChips: React.FC = () => {
  const { filters, setFilters } = useApp();

  return (
    <View style={styles.container}>
      {/* 1행: 동네 필터 (가로 스크롤) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.filterCategoryLabel}>동네</Text>
        {NEIGHBORHOODS.map((nh) => {
          const isActive = filters.neighborhood === nh;
          return (
            <TouchableOpacity
              key={nh}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => setFilters(prev => ({ ...prev, neighborhood: nh }))}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {nh}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 2행: 공간 유형 및 상태 필터 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, styles.secondRow]}
      >
        <Text style={styles.filterCategoryLabel}>유형</Text>
        {SPACE_TYPES.map((st) => {
          const isActive = filters.type === st.key;
          return (
            <TouchableOpacity
              key={st.key}
              style={[styles.subChip, isActive && styles.subChipActive]}
              onPress={() => setFilters(prev => ({ ...prev, type: st.key }))}
              activeOpacity={0.7}
            >
              <Text style={[styles.subChipText, isActive && styles.subChipTextActive]}>
                {st.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        <View style={styles.divider} />

        <Text style={styles.filterCategoryLabel}>상태</Text>
        {CONDITIONS.map((cond) => {
          const isActive = filters.condition === cond.key;
          return (
            <TouchableOpacity
              key={cond.key}
              style={[styles.subChip, isActive && styles.subChipActive]}
              onPress={() => setFilters(prev => ({ ...prev, condition: cond.key }))}
              activeOpacity={0.7}
            >
              <Text style={[styles.subChipText, isActive && styles.subChipTextActive]}>
                {cond.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 20,
  },
  scrollContent: {
    paddingHorizontal: 14,
    alignItems: "center",
  },
  secondRow: {
    marginTop: 6,
  },
  filterCategoryLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginRight: 6,
  },
  chip: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  subChip: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  subChipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  subChipText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#4B5563",
  },
  subChipTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 8,
  },
});
