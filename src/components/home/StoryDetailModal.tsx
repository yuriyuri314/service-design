import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal } from "react-native";
import { COLORS } from "../../constants/theme";
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
            <Text style={styles.closeText}>✕</Text>
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

            {/* "공간 구할 때 어려웠던 점" 강조 박스 (필수 요구사항!) */}
            <HighlightBox
              title="💡 공간 구할 때 가장 어려웠던 점"
              icon={<Text>⚠️</Text>}
              style={styles.challengeBox}
            >
              {story.spaceChallenge}
            </HighlightBox>

            {/* 인터뷰 Q&A */}
            <View style={styles.qnaSection}>
              <Text style={styles.qnaSectionTitle}>💬 솔직 인터뷰</Text>
              {story.storyQna.map((item, idx) => (
                <View key={idx} style={styles.qnaItem}>
                  <Text style={styles.questionText}>{item.question}</Text>
                  <Text style={styles.answerText}>{item.answer}</Text>
                </View>
              ))}
            </View>

            {/* 응원 배너 */}
            <View style={styles.bottomBanner}>
              <Text style={styles.bannerEmoji}>🤝</Text>
              <Text style={styles.bannerTitle}>혼자 고민하지 마세요!</Text>
              <Text style={styles.bannerSub}>
                빈자리 태백의 AI 검토와 청년창창센터 동행 협의로
                안전하게 공간을 찾고 계약할 수 있습니다.
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
    borderBottomColor: "#F3F4F6",
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  headerTitle: {
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
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  heroContent: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  typeBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 4,
    marginBottom: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  heroBusinessName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  heroFounder: {
    fontSize: 12,
    color: "#E5E7EB",
    marginTop: 2,
  },
  bodyPadding: {
    padding: 18,
  },
  quoteBox: {
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    marginBottom: 14,
  },
  quoteText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    lineHeight: 20,
    fontStyle: "italic",
  },
  challengeBox: {
    marginVertical: 10,
  },
  qnaSection: {
    marginTop: 18,
  },
  qnaSectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  qnaItem: {
    marginBottom: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 14,
  },
  questionText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 6,
    lineHeight: 18,
  },
  answerText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  bottomBanner: {
    backgroundColor: COLORS.primaryLight,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 14,
  },
  bannerEmoji: {
    fontSize: 26,
    marginBottom: 6,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: 12,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 17,
  },
});
