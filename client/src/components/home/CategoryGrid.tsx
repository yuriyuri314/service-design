import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import { SpaceType } from "../../types";

interface CategoryItem {
  type: SpaceType;
  title: string;
  icon: string;
  sub: string;
}

const CATEGORIES: CategoryItem[] = [
  { type: "VACANT_HOUSE", title: "빈집", icon: "🏡", sub: "단독·한옥" },
  { type: "VACANT_STORE", title: "빈 상가", icon: "🏬", sub: "도심·시장" },
  { type: "WAREHOUSE_FACTORY", title: "창고·공장", icon: "🏭", sub: "층고높음" },
  { type: "CLOSED_SCHOOL", title: "폐교·공공", icon: "🏫", sub: "대형부지" },
  { type: "ALL", title: "전체보기", icon: "🔍", sub: "태백 전역" },
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
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.type}
            style={styles.gridItem}
            onPress={() => handleSelectCategory(cat.type)}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>{cat.icon}</Text>
            </View>
            <Text style={styles.titleText}>{cat.title}</Text>
            <Text style={styles.subText}>{cat.sub}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: -20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
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
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#F4F6FB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  iconText: {
    fontSize: 22,
  },
  titleText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  subText: {
    fontSize: 10,
    color: COLORS.textTertiary,
    marginTop: 1,
  },
});
