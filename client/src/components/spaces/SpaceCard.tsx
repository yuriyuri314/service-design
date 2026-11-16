import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Heart } from "lucide-react-native";
import { COLORS, METRICS, TYPOGRAPHY } from "../../constants/theme";
import { Space } from "../../types";
import { useApp } from "../../context/AppContext";
import { RiskBadge } from "../common/RiskBadge";

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
      return `무상협의 · 보증금 ${space.deposit}만`;
    }
    return `월세 ${space.deposit}/${space.monthlyRent}만`;
  };

  const getRiskLevel = () => {
    if (space.conditionGrade === "A") return "SAFE";
    if (space.conditionGrade === "B") return "CAUTION";
    return "DANGER";
  };

  return (
    <TouchableOpacity
      style={[styles.card, horizontal ? styles.cardHorizontal : styles.cardVertical]}
      onPress={onPress}
      activeOpacity={0.85}
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
          <Heart 
            size={18} 
            color={bookmarked ? COLORS.accent : COLORS.surface} 
            fill={bookmarked ? COLORS.accent : "rgba(0, 0, 0, 0.35)"}
            strokeWidth={1.75}
          />
        </TouchableOpacity>

        {/* 좌측 상단 상태/진단 배지 */}
        <View style={styles.badgeRow}>
          <View style={styles.badgeItem}>
            <RiskBadge 
              level={getRiskLevel()} 
              label={`${space.conditionGrade}급`}
              size="sm"
            />
          </View>
        </View>
      </View>

      {/* 매물 정보 */}
      <View style={styles.infoContainer}>
        {/* 가격 정보: 가장 크고 굵게, tabular-nums */}
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>{formatRent()}</Text>
          <Text style={styles.typeText}>{space.typeLabel}</Text>
        </View>

        {/* 매물 제목: Noto Serif KR */}
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
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* 하단 계약 전 진단 바로가기 버튼 */}
        {!horizontal && (
          <TouchableOpacity
            style={styles.quickAiBtn}
            onPress={(e) => {
              e.stopPropagation();
              startAiReviewForSpace(space.id);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.quickAiBtnText}>계약 전 진단 리포트 확인</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.borderRadiusMd,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  cardVertical: {
    marginBottom: 14,
    width: "100%",
  },
  cardHorizontal: {
    width: 250,
    marginRight: 12,
  },
  imageContainer: {
    width: "100%",
    height: 160,
    position: "relative",
    backgroundColor: COLORS.background,
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
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: METRICS.borderRadiusFull,
    backgroundColor: "rgba(42, 42, 40, 0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeRow: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
  },
  badgeItem: {
    marginRight: 4,
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
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
    fontVariant: TYPOGRAPHY.fontVariantTabular,
    letterSpacing: -0.3,
  },
  typeText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  titleText: {
    fontFamily: TYPOGRAPHY.titleFont,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  metaText: {
    fontFamily: TYPOGRAPHY.bodyFont,
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
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: METRICS.borderRadiusSm,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  quickAiBtn: {
    backgroundColor: COLORS.surface,
    paddingVertical: 8,
    borderRadius: METRICS.borderRadiusSm,
    alignItems: "center",
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  quickAiBtnText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
});
