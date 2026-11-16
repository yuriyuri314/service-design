import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { COLORS, METRICS, TYPOGRAPHY } from "../../constants/theme";
import { StartupStory } from "../../types";

interface StoryCardProps {
  story: StartupStory;
  onPress: () => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: story.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.overlay} />
      
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{story.businessType}</Text>
        </View>
        <Text style={styles.businessName}>{story.businessName}</Text>
        <Text style={styles.founderText}>
          {story.founderName} 대표 ({story.founderAge}) · {story.location}
        </Text>
        <Text style={styles.quoteText} numberOfLines={2}>
          {story.quote}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 250,
    height: 180,
    borderRadius: METRICS.borderRadiusMd,
    overflow: "hidden",
    marginRight: 12,
    backgroundColor: COLORS.primary,
    position: "relative",
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(42, 42, 40, 0.55)",
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.accent,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: METRICS.borderRadiusSm,
    marginBottom: 5,
  },
  badgeText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 10,
    color: COLORS.surface,
    fontWeight: "700",
  },
  businessName: {
    fontFamily: TYPOGRAPHY.titleFont,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.surface,
    letterSpacing: -0.2,
  },
  founderText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 11,
    color: COLORS.line,
    marginTop: 2,
    marginBottom: 4,
  },
  quoteText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 11,
    color: COLORS.surface,
    lineHeight: 16,
  },
});
