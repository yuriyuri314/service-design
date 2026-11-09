import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  Dimensions, 
  Platform 
} from "react-native";
import { COLORS } from "../../constants/theme";
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
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{space.title}</Text>
          <TouchableOpacity 
            onPress={() => toggleBookmark(space.id)} 
            style={styles.iconBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.headerHeart}>{bookmarked ? "❤️" : "🤍"}</Text>
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
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>AI 검토 지원 매물 ✨</Text>
              </View>
              {space.canOwnerDiscuss && (
                <View style={styles.discussBadge}>
                  <Text style={styles.discussBadgeText}>소유자 협의 가능 🤝</Text>
                </View>
              )}
            </View>

            {/* 가격 정보 */}
            <Text style={styles.priceHeading}>{formatRent()}</Text>
            <Text style={styles.titleHeading}>{space.title}</Text>
            <Text style={styles.addressText}>📍 {space.address}</Text>

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
                <View style={styles.specGradeRow}>
                  <RiskBadge 
                    level={getRiskLevel()} 
                    label={`${space.conditionGrade}급 (${space.conditionLabel})`}
                    size="sm"
                  />
                </View>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>예상 수리비</Text>
                <Text style={styles.specValueHighlight}>
                  {space.estimatedRepairCost || "AI 리포트 참조"}
                </Text>
              </View>
            </View>

            {/* 소유자의 말 (강조 박스: 점선 테두리 + 둥근 모서리 스타일) */}
            <HighlightBox
              title={`소유자 ${space.ownerName}의 안내`}
              icon={<Text>📢</Text>}
            >
              {space.description}
            </HighlightBox>

            {/* 추천 창업 업종 */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>💡 이 공간 추천 창업 업종</Text>
              <View style={styles.recommendedUsesRow}>
                {space.recommendedUses.map((use, idx) => (
                  <View key={idx} style={styles.useChip}>
                    <Text style={styles.useChipText}>✓ {use}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 주변 시설 & 관광지 접근성 */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>🚶 주변 편의시설 및 접근성</Text>
              {space.nearbyAmenities.map((amenity, idx) => (
                <View key={idx} style={styles.amenityRow}>
                  <Text style={styles.amenityName}>• {amenity.name}</Text>
                  <Text style={styles.amenityDist}>{amenity.distance}</Text>
                </View>
              ))}
            </View>

            {/* 판단 근거 안내 배너 */}
            <View style={styles.reasonCard}>
              <Text style={styles.reasonTitle}>💡 계약 전 꼭 확인하세요!</Text>
              <Text style={styles.reasonText}>
                임대차 계약서 작성 전에 태백시 지원사업과 연계 가능한지,
                숨은 수리비(배관/전기/단열)가 얼마나 발생하는지 
                <Text style={styles.boldText}> AI 창업 검토 리포트</Text>로 먼저 확인해 보세요.
              </Text>
            </View>

            <View style={{ height: 100 }} />
          </View>
        </ScrollView>

        {/* 하단 고정 CTA 바 (직방 스타일) */}
        <View style={styles.bottomCtaBar}>
          <TouchableOpacity
            style={styles.ctaBookmarkBtn}
            onPress={() => toggleBookmark(space.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaHeart}>{bookmarked ? "❤️" : "🤍"}</Text>
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
            <Text style={styles.ctaMainBtnText}>✨ 이 공간 AI로 검토하기</Text>
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
    borderBottomColor: "#F3F4F6",
    backgroundColor: COLORS.surface,
  },
  headerTitle: {
    flex: 1,
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
  closeIcon: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  headerHeart: {
    fontSize: 18,
  },
  scrollBody: {
    flex: 1,
  },
  carouselContainer: {
    width: "100%",
    height: 240,
    backgroundColor: "#E2E8F0",
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
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: "#FFFFFF",
    width: 16,
  },
  imageCounter: {
    position: "absolute",
    bottom: 12,
    right: 14,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  imageCounterText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  contentPadding: {
    padding: 18,
  },
  badgeRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  aiBadge: {
    backgroundColor: COLORS.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  aiBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  discussBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D6DCFF",
  },
  discussBadgeText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
  },
  priceHeading: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  titleHeading: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    lineHeight: 22,
    marginBottom: 6,
  },
  addressText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  specGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  specItem: {
    width: "50%",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  specLabel: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginBottom: 3,
  },
  specValue: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  specGradeRow: {
    flexDirection: "row",
  },
  specValueHighlight: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
  },
  sectionBlock: {
    marginTop: 18,
  },
  sectionTitle: {
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
    backgroundColor: "#F3F4F6",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  useChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  amenityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  amenityName: {
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  amenityDist: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },
  reasonCard: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginTop: 18,
  },
  reasonTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#B45309",
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 12,
    color: "#78350F",
    lineHeight: 18,
  },
  boldText: {
    fontWeight: "700",
    color: COLORS.primary,
  },
  bottomCtaBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 74,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 14 : 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  ctaBookmarkBtn: {
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  ctaHeart: {
    fontSize: 20,
  },
  ctaHeartText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  ctaChatBtn: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginRight: 8,
  },
  ctaChatBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  ctaMainBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
  },
  ctaMainBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
});
