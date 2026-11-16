import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Plus, Minus, Locate } from "lucide-react-native";
import { COLORS, METRICS, TYPOGRAPHY } from "../../constants/theme";
import { Space } from "../../types";

interface MapViewProps {
  spaces: Space[];
  selectedSpaceId: string | null;
  onSelectSpace: (space: Space) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  spaces,
  selectedSpaceId,
  onSelectSpace,
}) => {
  // 태백시 중심 좌표 범위: 위도 37.100 ~ 37.200, 경도 128.940 ~ 129.040
  const minLat = 37.095;
  const maxLat = 37.205;
  const minLng = 128.935;
  const maxLng = 129.045;

  const [mapScale, setMapScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const getMarkerPosition = (lat: number, lng: number) => {
    const topPercent = ((maxLat - lat) / (maxLat - minLat)) * 100;
    const leftPercent = ((lng - minLng) / (maxLng - minLng)) * 100;
    return { top: `${topPercent}%`, left: `${leftPercent}%` };
  };

  const formatPriceBadge = (space: Space) => {
    if (space.rentType === "FREE_NEGOTIATION") {
      return `무상 ${space.areaPyeong}평`;
    }
    return `${space.monthlyRent}만 · ${space.areaPyeong}평`;
  };

  return (
    <View style={styles.container}>
      {/* 지도 배경 캔버스 (태백시 지형 및 구역 스타일링) */}
      <View style={styles.mapCanvas}>
        <View style={styles.gridOverlay} />

        {/* 태백 주요 지명 텍스트 라벨 */}
        <View style={[styles.landmark, { top: "18%", left: "42%" }]}>
          <Text style={styles.landmarkText}>매봉산 풍력단지</Text>
        </View>

        <View style={[styles.landmark, { top: "42%", left: "50%" }]}>
          <Text style={styles.landmarkText}>황지연못 (도심)</Text>
        </View>

        <View style={[styles.landmark, { top: "72%", left: "20%" }]}>
          <Text style={styles.landmarkText}>태백산 당골광장</Text>
        </View>

        <View style={[styles.landmark, { top: "68%", left: "75%" }]}>
          <Text style={styles.landmarkText}>철암 탄광역사촌</Text>
        </View>

        <View style={[styles.landmark, { top: "82%", left: "62%" }]}>
          <Text style={styles.landmarkText}>장성 탄광마을</Text>
        </View>

        {/* 도로 라인 표현 */}
        <View style={styles.roadLine1} />
        <View style={styles.roadLine2} />
        <View style={styles.roadLine3} />

        {/* 매물 핀 마커 렌더링 */}
        {spaces.map((space) => {
          const isSelected = space.id === selectedSpaceId;
          const pos = getMarkerPosition(space.coordinates.lat, space.coordinates.lng);

          return (
            <TouchableOpacity
              key={space.id}
              style={[
                styles.markerWrapper,
                { top: pos.top as any, left: pos.left as any },
                isSelected && styles.markerWrapperSelected,
              ]}
              onPress={() => onSelectSpace(space)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.markerBubble,
                  isSelected && styles.markerBubbleSelected,
                  space.rentType === "FREE_NEGOTIATION" && !isSelected && styles.markerBubbleFree,
                ]}
              >
                <Text
                  style={[
                    styles.markerText,
                    isSelected && styles.markerTextSelected,
                    space.rentType === "FREE_NEGOTIATION" && !isSelected && styles.markerTextFree,
                  ]}
                >
                  {formatPriceBadge(space)}
                </Text>
              </View>
              <View
                style={[
                  styles.markerPointer,
                  isSelected && styles.markerPointerSelected,
                  space.rentType === "FREE_NEGOTIATION" && !isSelected && styles.markerPointerFree,
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 우측 상단 지도 컨트롤 (확대/축소/리셋) */}
      <View style={styles.mapControls}>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => setMapScale((prev) => Math.min(prev + 0.1, 1.4))}
          activeOpacity={0.7}
        >
          <Plus size={16} color={COLORS.textPrimary} strokeWidth={1.75} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => setMapScale((prev) => Math.max(prev - 0.1, 0.8))}
          activeOpacity={0.7}
        >
          <Minus size={16} color={COLORS.textPrimary} strokeWidth={1.75} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => {
            setMapScale(1);
            setPanOffset({ x: 0, y: 0 });
          }}
          activeOpacity={0.7}
        >
          <Locate size={15} color={COLORS.textPrimary} strokeWidth={1.75} />
        </TouchableOpacity>
      </View>

      {/* 좌측 상단 매물 개수 안내 */}
      <View style={styles.countBadge}>
        <Text style={styles.countText}>
          등록 공간 <Text style={styles.countNumber}>{spaces.length}</Text>곳
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    position: "relative",
    overflow: "hidden",
  },
  mapCanvas: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.background,
  },
  gridOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.35,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  roadLine1: {
    position: "absolute",
    top: "10%",
    left: "48%",
    width: 3,
    height: "80%",
    backgroundColor: COLORS.line,
    transform: [{ rotate: "15deg" }],
  },
  roadLine2: {
    position: "absolute",
    top: "45%",
    left: "15%",
    width: "75%",
    height: 3,
    backgroundColor: COLORS.line,
    transform: [{ rotate: "-8deg" }],
  },
  roadLine3: {
    position: "absolute",
    top: "60%",
    left: "55%",
    width: 2,
    height: "35%",
    backgroundColor: COLORS.line,
    transform: [{ rotate: "-25deg" }],
  },
  landmark: {
    position: "absolute",
    backgroundColor: COLORS.surface,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: METRICS.borderRadiusSm,
    borderWidth: 1,
    borderColor: COLORS.line,
    zIndex: 1,
  },
  landmarkText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  markerWrapper: {
    position: "absolute",
    alignItems: "center",
    zIndex: 10,
    transform: [{ translateX: -36 }, { translateY: -28 }],
  },
  markerWrapperSelected: {
    zIndex: 99,
    transform: [{ translateX: -36 }, { translateY: -30 }],
  },
  markerBubble: {
    backgroundColor: COLORS.surface,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: METRICS.borderRadiusSm,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  markerBubbleSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  markerBubbleFree: {
    borderColor: COLORS.accent,
  },
  markerText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
    fontVariant: TYPOGRAPHY.fontVariantTabular,
    letterSpacing: -0.2,
  },
  markerTextSelected: {
    color: COLORS.surface,
  },
  markerTextFree: {
    color: COLORS.accent,
  },
  markerPointer: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 5,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: COLORS.primary,
    marginTop: -1,
  },
  markerPointerSelected: {
    borderTopColor: COLORS.accent,
  },
  markerPointerFree: {
    borderTopColor: COLORS.accent,
  },
  mapControls: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.borderRadiusSm,
    borderWidth: 1,
    borderColor: COLORS.line,
    overflow: "hidden",
    zIndex: 30,
  },
  controlBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  countBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: COLORS.surface,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: METRICS.borderRadiusSm,
    borderWidth: 1,
    borderColor: COLORS.line,
    zIndex: 30,
  },
  countText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  countNumber: {
    color: COLORS.accent,
    fontWeight: "800",
    fontVariant: TYPOGRAPHY.fontVariantTabular,
  },
});
