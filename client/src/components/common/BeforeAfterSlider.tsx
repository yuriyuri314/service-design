import React, { useState } from "react";
import { View, Text, StyleSheet, Image, PanResponder, Platform } from "react-native";
import { COLORS } from "../../constants/theme";

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
  // 0% ~ 100% (기본값 50%)
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
          <Text style={styles.conceptTitle}>🎨 AI 예상 리모델링 컨셉</Text>
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
          <Text style={styles.labelText}>After (리모델링 후)</Text>
        </View>

        {/* Before 이미지 (sliderPos % 만큼만 보이도록 클리핑) */}
        <View style={[styles.beforeClip, { width: `${sliderPos}%` }]}>
          <Image
            source={{ uri: beforeImage }}
            style={[styles.image, { width: containerWidth }]}
            resizeMode="cover"
          />
          <View style={styles.beforeLabel}>
            <Text style={styles.labelText}>Before (현재 상태)</Text>
          </View>
        </View>

        {/* 드래그 디바이더 바 & 핸들 */}
        <View style={[styles.dividerLine, { left: `${sliderPos}%` }]}>
          <View style={styles.sliderHandle}>
            <Text style={styles.handleArrows}>◀ ▶</Text>
          </View>
        </View>
      </View>

      <Text style={styles.hintText}>
        👆 가운데 선을 좌우로 드래그하여 리모델링 전/후 모습을 비교해 보세요.
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
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  conceptDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  container: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#E2E8F0",
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
    width: 3,
    backgroundColor: "#FFFFFF",
    transform: [{ translateX: -1.5 }],
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  sliderHandle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  handleArrows: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
  beforeLabel: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  afterLabel: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(82, 113, 255, 0.85)",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  labelText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  hintText: {
    fontSize: 11,
    color: COLORS.textTertiary,
    textAlign: "center",
    marginTop: 6,
  },
});
