import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { COLORS } from "../../constants/theme";
import { Space } from "../../types";
import { useApp } from "../../context/AppContext";

interface SpaceCardProps {
  space: Space;
  onPress?: () => void;
  horizontal?: boolean;
}

export const SpaceCard: React.FC<SpaceCardProps> = ({
  space,
  onPress,
  horizontal = false,
}) => {
  const { toggleBookmark, isBookmarked, startAiReviewForSpace } = useApp();
  const bookmarked = isBookmarked(space.id);

  const formatRent = () => {
    if (space.rentType === "FREE_NEGOTIATION") {
      return `무상협의 (보증금 ${space.deposit}만)`;
    }
    return `월세 ${space.deposit}/${space.monthlyRent}만`;
  };

  const getConditionColor = () => {
    switch (space.conditionGrade) {
      case "A":
        return COLORS.riskSafe;
      case "B":
        return COLORS.riskCaution;
      case "C":
        return COLORS.riskDanger;
      default:
        return COLORS.textSecondary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, horizontal ? styles.cardHorizontal : styles.cardVertical]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {/* 썸네일 이미지 */}
      <View style={[styles.imageContainer, horizontal && styles.imageContainerHorizontal]}>
        <Image
          source={{ uri: space.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* 우측 상단 찜 버튼 */}
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleBookmark(space.id);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.bookmarkHeart}>{bookmarked ? "❤️" : "🤍"}</Text>
        </TouchableOpacity>

        {/* 좌측 상단 AI 검토 가능 배지 */}
        <View style={styles.aiBadge}>
          <Text style={styles.aiBadgeText}>AI 검토 가능 ✨</Text>
        </View>

        {/* 좌측 하단 상태 등급 배지 */}
        <View style={[styles.gradeBadge, { backgroundColor: getConditionColor() }]}>
          <Text style={styles.gradeBadgeText}>상태 {space.conditionGrade}급</Text>
        </View>
      </View>

      {/* 매물 정보 */}
      <View style={styles.infoContainer}>
        {/* 임대료 및 조건 (직방 스타일 볼드) */}
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>{formatRent()}</Text>
          <Text style={styles.typeText}>{space.typeLabel}</Text>
        </View>

        {/* 타이틀 */}
        <Text style={styles.titleText} numberOfLines={1}>
          {space.title}
        </Text>

        {/* 면적 및 위치 */}
        <Text style={styles.metaText}>
          {space.areaPyeong}평 ({space.areaM2}㎡) · {space.neighborhood}
        </Text>

        {/* 태그 칩 */}
        <View style={styles.tagRow}>
          {space.tags.slice(0, 3).map((tag, idx) => (
            <View key={idx} style={styles.tagChip}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>

        {/* 하단 빠른 액션 (가로 스크롤 아닐 때) */}
        {!horizontal && (
          <TouchableOpacity
            style={styles.quickAiBtn}
            onPress={(e) => {
              e.stopPropagation();
              startAiReviewForSpace(space.id);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.quickAiBtnText}>⚡ 이 공간 AI 리포트 바로 보기</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardVertical: {
    marginBottom: 16,
    width: "100%",
  },
  cardHorizontal: {
    width: 250,
    marginRight: 14,
  },
  imageContainer: {
    width: "100%",
    height: 160,
    position: "relative",
    backgroundColor: "#F3F4F6",
  },
  imageContainerHorizontal: {
    height: 135,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  bookmarkButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  bookmarkHeart: {
    fontSize: 16,
  },
  aiBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: COLORS.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  aiBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  gradeBadge: {
    position: "absolute",
    bottom: 10,
    left: 10,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 4,
  },
  gradeBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  infoContainer: {
    padding: 14,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },
  titleText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },
  tagChip: {
    backgroundColor: "#F4F6F8",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    color: "#555555",
  },
  quickAiBtn: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#D6DCFF",
  },
  quickAiBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
});
