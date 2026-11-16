import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { COLORS, METRICS, TYPOGRAPHY } from "../../constants/theme";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  concept?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  concept,
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [containerWidth, setContainerWidth] = useState(320);

  const handleTouch = (evt: any) => {
    const locationX = evt.nativeEvent.locationX;
    const clampedPercent = Math.max(5, Math.min(95, (locationX / containerWidth) * 100));
    setSliderPos(clampedPercent);
  };

  return (
    <View style={styles.wrapper}>
      {concept && (
        <View style={styles.conceptHeader}>
          <Text style={styles.conceptTitle}>리모델링 예상 모습</Text>
          <Text style={styles.conceptDesc}>{concept}</Text>
        </View>
      )}

      <View
        style={styles.container}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        onTouchMove={handleTouch}
        onTouchStart={handleTouch}
      >
        {/* After 이미지 (전체 배경) */}
        <Image
          source={{ uri: afterImage }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.afterLabel}>
          <Text style={styles.labelText}>공사 후</Text>
        </View>

        {/* Before 이미지 (sliderPos % 만큼만 보이도록 클리핑) */}
        <View style={[styles.beforeClip, { width: `${sliderPos}%` }]}>
          <Image
            source={{ uri: beforeImage }}
            style={[styles.image, { width: containerWidth }]}
            resizeMode="cover"
          />
          <View style={styles.beforeLabel}>
            <Text style={styles.labelText}>현재 상태</Text>
          </View>
        </View>

        {/* 드래그 디바이더 바 & 핸들 */}
        <View style={[styles.dividerLine, { left: `${sliderPos}%` }]}>
          <View style={styles.sliderHandle}>
            <Text style={styles.handleArrows}>|</Text>
          </View>
        </View>
      </View>

      <Text style={styles.hintText}>
        가운데 분할선을 좌우로 움직여 공사 전후 모습을 비교해 보세요.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 12,
  },
  conceptHeader: {
    marginBottom: 8,
  },
  conceptTitle: {
    fontFamily: TYPOGRAPHY.titleFont,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  conceptDesc: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  container: {
    width: "100%",
    height: 220,
    borderRadius: METRICS.borderRadiusMd,
    overflow: "hidden",
    position: "relative",
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  beforeClip: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    overflow: "hidden",
  },
  dividerLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: COLORS.surface,
    transform: [{ translateX: -1 }],
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  sliderHandle: {
    width: 28,
    height: 28,
    borderRadius: METRICS.borderRadiusFull,
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  handleArrows: {
    color: COLORS.surface,
    fontSize: 11,
    fontWeight: "700",
  },
  beforeLabel: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: COLORS.primary,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: METRICS.borderRadiusSm,
  },
  afterLabel: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: COLORS.accent,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: METRICS.borderRadiusSm,
  },
  labelText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    color: COLORS.surface,
    fontSize: 11,
    fontWeight: "700",
  },
  hintText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 6,
  },
});
