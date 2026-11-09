import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from "react-native";
import { COLORS } from "../../constants/theme";
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
  // 태백시 중심 좌표 범위: 위도 37.100 ~ 37.200 (차이 0.100), 경도 128.940 ~ 129.040 (차이 0.100)
  const minLat = 37.095;
  const maxLat = 37.205;
  const minLng = 128.935;
  const maxLng = 129.045;

  const [mapScale, setMapScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // 위경도를 맵 컨테이너 내부의 % 좌표로 변환
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
        {/* 그리드 패턴 */}
        <View style={styles.gridOverlay} />

        {/* 태백 주요 랜드마크 안내 라벨 */}
        <View style={[styles.landmark, { top: "18%", left: "42%" }]}>
          <Text style={styles.landmarkIcon}>⛰️</Text>
          <Text style={styles.landmarkText}>매봉산 바람의언덕</Text>
        </View>

        <View style={[styles.landmark, { top: "42%", left: "50%" }]}>
          <Text style={styles.landmarkIcon}>⛲</Text>
          <Text style={styles.landmarkText}>황지연못 (도심)</Text>
        </View>

        <View style={[styles.landmark, { top: "72%", left: "20%" }]}>
          <Text style={styles.landmarkIcon}>🏔️</Text>
          <Text style={styles.landmarkText}>태백산 국립공원 당골</Text>
        </View>

        <View style={[styles.landmark, { top: "68%", left: "75%" }]}>
          <Text style={styles.landmarkIcon}>🚂</Text>
          <Text style={styles.landmarkText}>철암 탄광역사촌</Text>
        </View>

        <View style={[styles.landmark, { top: "82%", left: "62%" }]}>
          <Text style={styles.landmarkIcon}>🏘️</Text>
          <Text style={styles.landmarkText}>장성 탄광마을</Text>
        </View>

        {/* 도로 라인 표현 */}
        <View style={styles.roadLine1} />
        <View style={styles.roadLine2} />
        <View style={styles.roadLine3} />

        {/* 공간 직방형 마커 렌더링 */}
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
                  space.rentType === "FREE_NEGOTIATION" && styles.markerBubbleFree,
                ]}
              >
                <Text
                  style={[
                    styles.markerText,
                    isSelected && styles.markerTextSelected,
                    space.rentType === "FREE_NEGOTIATION" && styles.markerTextFree,
                  ]}
                >
                  {formatPriceBadge(space)}
                </Text>
              </View>
              <View
                style={[
                  styles.markerPointer,
                  isSelected && styles.markerPointerSelected,
                  space.rentType === "FREE_NEGOTIATION" && styles.markerPointerFree,
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 우측 상단 지도 컨트롤 (확대/축소 및 태백 중심 리셋) */}
      <View style={styles.mapControls}>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => setMapScale((prev) => Math.min(prev + 0.1, 1.4))}
          activeOpacity={0.7}
        >
          <Text style={styles.controlBtnText}>＋</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => setMapScale((prev) => Math.max(prev - 0.1, 0.8))}
          activeOpacity={0.7}
        >
          <Text style={styles.controlBtnText}>－</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => {
            setMapScale(1);
            setPanOffset({ x: 0, y: 0 });
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.controlCenterText}>📍</Text>
        </TouchableOpacity>
      </View>

      {/* 좌측 상단 매물 개수 배지 */}
      <View style={styles.countBadge}>
        <Text style={styles.countText}>
          태백시 발굴 공간 <Text style={styles.countNumber}>{spaces.length}</Text>개
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBF1F5",
    position: "relative",
    overflow: "hidden",
  },
  mapCanvas: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#F2F5F8",
  },
  gridOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
    borderWidth: 1,
    borderColor: "#94A3B8",
  },
  roadLine1: {
    position: "absolute",
    top: "10%",
    left: "48%",
    width: 6,
    height: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
    transform: [{ rotate: "15deg" }],
    opacity: 0.7,
  },
  roadLine2: {
    position: "absolute",
    top: "45%",
    left: "15%",
    width: "75%",
    height: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
    transform: [{ rotate: "-8deg" }],
    opacity: 0.7,
  },
  roadLine3: {
    position: "absolute",
    top: "60%",
    left: "55%",
    width: 5,
    height: "35%",
    backgroundColor: "#E2E8F0",
    transform: [{ rotate: "-25deg" }],
  },
  landmark: {
    position: "absolute",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    zIndex: 1,
  },
  landmarkIcon: {
    fontSize: 12,
  },
  landmarkText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#475569",
    marginTop: 1,
  },
  markerWrapper: {
    position: "absolute",
    alignItems: "center",
    zIndex: 10,
    transform: [{ translateX: -40 }, { translateY: -30 }],
  },
  markerWrapperSelected: {
    zIndex: 99,
    transform: [{ translateX: -40 }, { translateY: -34 }, { scale: 1.1 }],
  },
  markerBubble: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 4,
  },
  markerBubbleSelected: {
    backgroundColor: COLORS.primary,
    borderColor: "#FFFFFF",
  },
  markerBubbleFree: {
    borderColor: COLORS.accentOrange,
  },
  markerText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: -0.2,
  },
  markerTextSelected: {
    color: "#FFFFFF",
  },
  markerTextFree: {
    color: COLORS.accentOrange,
  },
  markerPointer: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: COLORS.primary,
    marginTop: -1,
  },
  markerPointerSelected: {
    borderTopColor: COLORS.primary,
  },
  markerPointerFree: {
    borderTopColor: COLORS.accentOrange,
  },
  mapControls: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    overflow: "hidden",
    zIndex: 30,
  },
  controlBtn: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  controlBtnText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  controlCenterText: {
    fontSize: 14,
  },
  countBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: "rgba(31, 31, 31, 0.85)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    zIndex: 30,
  },
  countText: {
    fontSize: 11,
    color: "#E2E8F0",
    fontWeight: "600",
  },
  countNumber: {
    color: "#60A5FA",
    fontWeight: "800",
  },
});
