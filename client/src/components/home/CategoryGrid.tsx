import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Home, Store, Factory, Building, Compass } from "lucide-react-native";
import { COLORS, METRICS, TYPOGRAPHY } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import { SpaceType } from "../../types";

interface CategoryItem {
  type: SpaceType;
  title: string;
  IconComponent: any;
  sub: string;
}

const CATEGORIES: CategoryItem[] = [
  { type: "VACANT_HOUSE", title: "빈집", IconComponent: Home, sub: "단독·한옥" },
  { type: "VACANT_STORE", title: "빈 상가", IconComponent: Store, sub: "도심·시장" },
  { type: "WAREHOUSE_FACTORY", title: "창고·공장", IconComponent: Factory, sub: "높은 층고" },
  { type: "CLOSED_SCHOOL", title: "폐교·공공", IconComponent: Building, sub: "대형 부지" },
  { type: "ALL", title: "전체보기", IconComponent: Compass, sub: "태백 전역" },
];

export const CategoryGrid: React.FC = () => {
  const { setFilters, setActiveTab } = useApp();

  const handleSelectCategory = (type: SpaceType) => {
    setFilters(prev => ({ ...prev, type }));
    setActiveTab("EXPLORE");
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {CATEGORIES.map((cat) => {
          const Icon = cat.IconComponent;
          return (
            <TouchableOpacity
              key={cat.type}
              style={styles.gridItem}
              onPress={() => handleSelectCategory(cat.type)}
              activeOpacity={0.7}
            >
              <View style={styles.iconCircle}>
                <Icon size={20} color={COLORS.primary} strokeWidth={1.75} />
              </View>
              <Text style={styles.titleText}>{cat.title}</Text>
              <Text style={styles.subText}>{cat.sub}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: METRICS.borderRadiusMd,
    marginHorizontal: 16,
    marginTop: -16,
    borderWidth: 1,
    borderColor: COLORS.line,
    zIndex: 10,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gridItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: METRICS.borderRadiusSm,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  titleText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  subText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
