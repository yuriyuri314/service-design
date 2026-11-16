import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal } from "react-native";
import { X } from "lucide-react-native";
import { COLORS, METRICS, TYPOGRAPHY } from "../../constants/theme";
import { StartupStory } from "../../types";
import { HighlightBox } from "../common/HighlightBox";

interface StoryDetailModalProps {
  story: StartupStory | null;
  visible: boolean;
  onClose: () => void;
}

export const StoryDetailModal: React.FC<StoryDetailModalProps> = ({
  story,
  visible,
  onClose,
}) => {
  if (!story) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* 상단 닫기 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <X size={20} color={COLORS.textPrimary} strokeWidth={1.75} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>태백 청년 창업 이야기</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
          {/* 상단 대표 이미지 및 타이틀 */}
          <View style={styles.heroImageContainer}>
            <Image source={{ uri: story.image }} style={styles.heroImage} resizeMode="cover" />
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{story.businessType}</Text>
              </View>
              <Text style={styles.heroBusinessName}>{story.businessName}</Text>
              <Text style={styles.heroFounder}>
                {story.founderName} 대표 ({story.founderAge}) · {story.location}
              </Text>
            </View>
          </View>

          <View style={styles.bodyPadding}>
            {/* 한 줄 인용구 */}
            <View style={styles.quoteBox}>
              <Text style={styles.quoteText}>{story.quote}</Text>
            </View>

            {/* "공간 구할 때 어려웠던 점" 강조 박스 (HighlightBox 왼쪽 3px 벽돌색 세로줄) */}
            <HighlightBox
              title="공간 구할 때 가장 어려웠던 점"
              style={styles.challengeBox}
            >
              {story.spaceChallenge}
            </HighlightBox>

            {/* 인터뷰 Q&A */}
            <View style={styles.qnaSection}>
              <Text style={styles.qnaSectionTitle}>창업 인터뷰</Text>
              {story.storyQna.map((item, idx) => (
                <View key={idx} style={styles.qnaItem}>
                  <Text style={styles.questionText}>{item.question}</Text>
                  <Text style={styles.answerText}>{item.answer}</Text>
                </View>
              ))}
            </View>

            {/* 안내 배너 */}
            <View style={styles.bottomBanner}>
              <Text style={styles.bannerTitle}>공간 확보부터 함께합니다</Text>
              <Text style={styles.bannerSub}>
                계약 전 진단 리포트와 청년창창센터 동행 협의로
                사전에 점검하고 계약을 진행할 수 있습니다.
              </Text>
            </View>

            <View style={{ height: 40 }} />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: TYPOGRAPHY.titleFont,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  scrollBody: {
    flex: 1,
  },
  heroImageContainer: {
    width: "100%",
    height: 220,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(42, 42, 40, 0.5)",
  },
  heroContent: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  typeBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.accent,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: METRICS.borderRadiusSm,
    marginBottom: 6,
  },
  typeBadgeText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.surface,
  },
  heroBusinessName: {
    fontFamily: TYPOGRAPHY.titleFont,
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.surface,
    letterSpacing: -0.3,
  },
  heroFounder: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 12,
    color: COLORS.line,
    marginTop: 2,
  },
  bodyPadding: {
    padding: 16,
  },
  quoteBox: {
    backgroundColor: COLORS.background,
    padding: 14,
    borderRadius: METRICS.borderRadiusSm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    borderWidth: 1,
    borderColor: COLORS.line,
    marginBottom: 14,
  },
  quoteText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  challengeBox: {
    marginVertical: 10,
  },
  qnaSection: {
    marginTop: 18,
  },
  qnaSectionTitle: {
    fontFamily: TYPOGRAPHY.titleFont,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  qnaItem: {
    marginBottom: 14,
    backgroundColor: COLORS.background,
    borderRadius: METRICS.borderRadiusSm,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  questionText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.accent,
    marginBottom: 6,
    lineHeight: 18,
  },
  answerText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  bottomBanner: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: METRICS.borderRadiusSm,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: "center",
    marginTop: 14,
  },
  bannerTitle: {
    fontFamily: TYPOGRAPHY.titleFont,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  bannerSub: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
});
