import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { COLORS } from "../../constants/theme";
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
    width: 260,
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 14,
    backgroundColor: "#1F2937",
    position: "relative",
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
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  businessName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  founderText: {
    fontSize: 11,
    color: "#D1D5DB",
    marginTop: 2,
    marginBottom: 4,
  },
  quoteText: {
    fontSize: 11,
    color: "#F3F4F6",
    fontStyle: "italic",
    lineHeight: 15,
  },
});
