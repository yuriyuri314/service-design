import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { COLORS, METRICS, TYPOGRAPHY } from "../../constants/theme";
import { Space } from "../../types";
import { SpaceCard } from "./SpaceCard";

interface BottomSheetListProps {
  spaces: Space[];
  selectedSpace: Space | null;
  onSelectSpace: (space: Space) => void;
  onOpenDetail: (space: Space) => void;
}

type SheetSnap = "COLLAPSED" | "HALF" | "EXPANDED";

export const BottomSheetList: React.FC<BottomSheetListProps> = ({
  spaces,
  selectedSpace,
  onSelectSpace,
  onOpenDetail,
}) => {
  const [snap, setSnap] = useState<SheetSnap>("HALF");

  const getSheetHeight = () => {
    switch (snap) {
      case "COLLAPSED":
        return 92;
      case "HALF":
        return 380;
      case "EXPANDED":
        return 650;
    }
  };

  const cycleSnap = () => {
    if (snap === "COLLAPSED") setSnap("HALF");
    else if (snap === "HALF") setSnap("EXPANDED");
    else setSnap("COLLAPSED");
  };

  return (
    <View style={[styles.sheetContainer, { height: getSheetHeight() }]}>
      {/* 바텀시트 핸들러 및 헤더 */}
      <TouchableOpacity
        style={styles.handleHeader}
        onPress={cycleSnap}
        activeOpacity={0.9}
      >
        <View style={styles.handleBar} />
        <View style={styles.headerInfoRow}>
          <Text style={styles.sheetTitle}>
            발굴 공간 <Text style={styles.countText}>{spaces.length}</Text>곳
          </Text>
          <View style={styles.snapPills}>
            <TouchableOpacity
              style={[styles.snapPill, snap === "COLLAPSED" && styles.snapPillActive]}
              onPress={() => setSnap("COLLAPSED")}
            >
              <Text style={[styles.snapPillText, snap === "COLLAPSED" && styles.snapPillTextActive]}>
                접기
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.snapPill, snap === "HALF" && styles.snapPillActive]}
              onPress={() => setSnap("HALF")}
            >
              <Text style={[styles.snapPillText, snap === "HALF" && styles.snapPillTextActive]}>
                절반
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.snapPill, snap === "EXPANDED" && styles.snapPillActive]}
              onPress={() => setSnap("EXPANDED")}
            >
              <Text style={[styles.snapPillText, snap === "EXPANDED" && styles.snapPillTextActive]}>
                전체
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {/* 매물 카드 리스트 (스크롤뷰) */}
      <ScrollView
        style={styles.listScrollView}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {spaces.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>선택한 조건의 공간이 없습니다.</Text>
            <Text style={styles.emptySubText}>필터를 변경해 다른 공간을 찾아보세요.</Text>
          </View>
        ) : (
          spaces.map((space) => {
            const isSelected = selectedSpace?.id === space.id;
            return (
              <View
                key={space.id}
                style={[
                  styles.cardWrapper,
                  isSelected && styles.cardWrapperSelected,
                ]}
              >
                <SpaceCard
                  space={space}
                  onPress={() => {
                    onSelectSpace(space);
                    onOpenDetail(space);
                  }}
                />
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: METRICS.borderRadiusLg,
    borderTopRightRadius: METRICS.borderRadiusLg,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.line,
    zIndex: 50,
  },
  handleHeader: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  handleBar: {
    width: 36,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.line,
    marginBottom: 8,
  },
  headerInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  sheetTitle: {
    fontFamily: TYPOGRAPHY.titleFont,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  countText: {
    color: COLORS.accent,
    fontWeight: "800",
    fontVariant: TYPOGRAPHY.fontVariantTabular,
  },
  snapPills: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    borderRadius: METRICS.borderRadiusSm,
    padding: 2,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  snapPill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: METRICS.borderRadiusSm,
  },
  snapPillActive: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  snapPillText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  snapPillTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  listScrollView: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  cardWrapper: {
    marginBottom: 4,
  },
  cardWrapperSelected: {
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: METRICS.borderRadiusMd,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontFamily: TYPOGRAPHY.titleFont,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  emptySubText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});
