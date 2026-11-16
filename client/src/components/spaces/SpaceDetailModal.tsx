import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  Platform 
} from "react-native";
import { X, Heart, MapPin, Check } from "lucide-react-native";
import { COLORS, METRICS, TYPOGRAPHY } from "../../constants/theme";
import { Space } from "../../types";
import { useApp } from "../../context/AppContext";
import { HighlightBox } from "../common/HighlightBox";
import { RiskBadge } from "../common/RiskBadge";

interface SpaceDetailModalProps {
  space: Space | null;
  visible: boolean;
  onClose: () => void;
}

export const SpaceDetailModal: React.FC<SpaceDetailModalProps> = ({
  space,
  visible,
  onClose,
}) => {
  const { isBookmarked, toggleBookmark, startAiReviewForSpace, startChatForSpace } = useApp();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!space) return null;

  const bookmarked = isBookmarked(space.id);

  const formatRent = () => {
    if (space.rentType === "FREE_NEGOTIATION") {
      return `무상임대 협의 (보증금 ${space.deposit}만원)`;
    }
    return `보증금 ${space.deposit}만 / 월세 ${space.monthlyRent}만원`;
  };

  const getRiskLevel = () => {
    if (space.conditionGrade === "A") return "SAFE";
    if (space.conditionGrade === "B") return "CAUTION";
    return "DANGER";
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* 상단 닫기 및 찜 헤더 */}
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={onClose} style={styles.iconBtn} activeOpacity={0.7}>
            <X size={20} color={COLORS.textPrimary} strokeWidth={1.75} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{space.title}</Text>
          <TouchableOpacity 
            onPress={() => toggleBookmark(space.id)} 
            style={styles.iconBtn}
            activeOpacity={0.7}
          >
            <Heart 
              size={20} 
              color={bookmarked ? COLORS.accent : COLORS.textPrimary} 
              fill={bookmarked ? COLORS.accent : "none"}
              strokeWidth={1.75}
            />
          </TouchableOpacity>
        </View>

        {/* 본문 스크롤 영역 */}
        <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
          {/* 상단 사진 캐러셀 */}
          <View style={styles.carouselContainer}>
            <Image
              source={{ uri: space.images[activeImageIndex] || space.images[0] }}
              style={styles.carouselImage}
              resizeMode="cover"
            />
            {space.images.length > 1 && (
              <View style={styles.carouselDots}>
                {space.images.map((_, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.dot,
                      activeImageIndex === idx && styles.dotActive,
                    ]}
                    onPress={() => setActiveImageIndex(idx)}
                  />
                ))}
              </View>
            )}
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {activeImageIndex + 1}/{space.images.length}
              </Text>
            </View>
          </View>

          {/* 메인 상세 정보 */}
          <View style={styles.contentPadding}>
            {/* 배지 행 */}
            <View style={styles.badgeRow}>
              <View style={styles.statusBadge}>
                <RiskBadge 
                  level={getRiskLevel()} 
                  label={`보존상태 ${space.conditionGrade}급 (${space.conditionLabel})`}
                  size="sm"
                />
              </View>
              {space.canOwnerDiscuss && (
                <View style={styles.discussBadge}>
                  <Text style={styles.discussBadgeText}>소유자 협의 가능</Text>
                </View>
              )}
            </View>

            {/* 가격 정보 */}
            <Text style={styles.priceHeading}>{formatRent()}</Text>
            <Text style={styles.titleHeading}>{space.title}</Text>
            <View style={styles.addressRow}>
              <MapPin size={14} color={COLORS.textSecondary} strokeWidth={1.75} style={{ marginRight: 4 }} />
              <Text style={styles.addressText}>{space.address}</Text>
            </View>

            {/* 핵심 스펙 그리드 */}
            <View style={styles.specGrid}>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>전용면적</Text>
                <Text style={styles.specValue}>{space.areaPyeong}평 ({space.areaM2}㎡)</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>공간유형</Text>
                <Text style={styles.specValue}>{space.typeLabel}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>보존상태</Text>
                <Text style={styles.specValue}>{space.conditionGrade}급 ({space.conditionLabel})</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>예상 수리비</Text>
                <Text style={styles.specValueHighlight}>
                  {space.estimatedRepairCost || "진단 리포트 참조"}
                </Text>
              </View>
            </View>

            {/* 소유자 안내 (HighlightBox) */}
            <HighlightBox
              title={`소유자 ${space.ownerName}의 안내`}
            >
              {space.description}
            </HighlightBox>

            {/* 추천 창업 업종 */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>추천 창업 업종</Text>
              <View style={styles.recommendedUsesRow}>
                {space.recommendedUses.map((use, idx) => (
                  <View key={idx} style={styles.useChip}>
                    <Check size={13} color={COLORS.primary} strokeWidth={2} style={{ marginRight: 4 }} />
                    <Text style={styles.useChipText}>{use}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 주변 시설 & 관광지 접근성 */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>주변 편의시설 및 접근성</Text>
              {space.nearbyAmenities.map((amenity, idx) => (
                <View key={idx} style={styles.amenityRow}>
                  <Text style={styles.amenityName}>{amenity.name}</Text>
                  <Text style={styles.amenityDist}>{amenity.distance}</Text>
                </View>
              ))}
            </View>

            {/* 계약 전 확인 안내 */}
            <View style={styles.reasonCard}>
              <Text style={styles.reasonTitle}>계약 전 점검 안내</Text>
              <Text style={styles.reasonText}>
                임대차 계약서 작성 전에 태백시 지원사업과 연계 가능한지,
                배관·전기·단열 등 숨은 수리비가 얼마나 발생하는지 
                진단 리포트를 먼저 확인해 보세요.
              </Text>
            </View>

            <View style={{ height: 100 }} />
          </View>
        </ScrollView>

        {/* 하단 고정 CTA 바 */}
        <View style={styles.bottomCtaBar}>
          <TouchableOpacity
            style={styles.ctaBookmarkBtn}
            onPress={() => toggleBookmark(space.id)}
            activeOpacity={0.8}
          >
            <Heart 
              size={20} 
              color={bookmarked ? COLORS.accent : COLORS.textPrimary} 
              fill={bookmarked ? COLORS.accent : "none"}
              strokeWidth={1.75}
            />
            <Text style={styles.ctaHeartText}>찜</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ctaChatBtn}
            onPress={() => {
              onClose();
              startChatForSpace(space.id);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaChatBtnText}>협의 요청</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ctaMainBtn}
            onPress={() => {
              onClose();
              startAiReviewForSpace(space.id);
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaMainBtnText}>계약 전 진단 리포트 확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  topHeader: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    backgroundColor: COLORS.surface,
  },
  headerTitle: {
    flex: 1,
    fontFamily: TYPOGRAPHY.titleFont,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginHorizontal: 12,
    textAlign: "center",
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollBody: {
    flex: 1,
  },
  carouselContainer: {
    width: "100%",
    height: 240,
    backgroundColor: COLORS.background,
    position: "relative",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  carouselDots: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    flexDirection: "row",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: COLORS.surface,
    width: 14,
  },
  imageCounter: {
    position: "absolute",
    bottom: 12,
    right: 14,
    backgroundColor: "rgba(42, 42, 40, 0.7)",
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: METRICS.borderRadiusSm,
  },
  imageCounterText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    color: COLORS.surface,
    fontSize: 11,
    fontWeight: "600",
    fontVariant: TYPOGRAPHY.fontVariantTabular,
  },
  contentPadding: {
    padding: 16,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statusBadge: {
    marginRight: 6,
  },
  discussBadge: {
    backgroundColor: COLORS.background,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: METRICS.borderRadiusSm,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  discussBadgeText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
  priceHeading: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 4,
    letterSpacing: -0.4,
    fontVariant: TYPOGRAPHY.fontVariantTabular,
  },
  titleHeading: {
    fontFamily: TYPOGRAPHY.titleFont,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    lineHeight: 23,
    marginBottom: 6,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  addressText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  specGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: COLORS.background,
    borderRadius: METRICS.borderRadiusMd,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  specItem: {
    width: "50%",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  specLabel: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  specValue: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
    fontVariant: TYPOGRAPHY.fontVariantTabular,
  },
  specValueHighlight: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.accent,
  },
  sectionBlock: {
    marginTop: 18,
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.titleFont,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  recommendedUsesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  useChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: METRICS.borderRadiusSm,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  useChipText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  amenityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  amenityName: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  amenityDist: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  reasonCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.line,
    borderWidth: 1,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    borderRadius: METRICS.borderRadiusSm,
    padding: 14,
    marginTop: 18,
  },
  reasonTitle: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  reasonText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  bottomCtaBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 14 : 6,
  },
  ctaBookmarkBtn: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  ctaHeartText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  ctaChatBtn: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: METRICS.borderRadiusSm,
    marginRight: 8,
  },
  ctaChatBtnText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  ctaMainBtn: {
    flex: 1,
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    borderRadius: METRICS.borderRadiusSm,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaMainBtnText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: "800",
  },
});
