import React, { useState, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";
import { useApp } from "../context/AppContext";
import { Space } from "../types";
import { Header } from "../components/common/Header";
import { FilterChips } from "../components/spaces/FilterChips";
import { MapView } from "../components/spaces/MapView";
import { BottomSheetList } from "../components/spaces/BottomSheetList";
import { SpaceDetailModal } from "../components/spaces/SpaceDetailModal";

export const ExploreScreen: React.FC = () => {
  const { spaces, filters, selectedSpaceId, setSelectedSpaceId } = useApp();
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // 필터링된 공간 리스트
  const filteredSpaces = useMemo(() => {
    return spaces.filter((space) => {
      // 1. 동네 필터
      if (filters.neighborhood !== "전체" && space.neighborhood !== filters.neighborhood) {
        return false;
      }
      // 2. 공간 유형 필터
      if (filters.type !== "ALL" && space.type !== filters.type) {
        return false;
      }
      // 3. 상태 필터
      if (filters.condition !== "ALL" && space.condition !== filters.condition) {
        return false;
      }
      // 4. 검색어 필터
      if (filters.searchQuery.trim().length > 0) {
        const query = filters.searchQuery.toLowerCase();
        const matchTitle = space.title.toLowerCase().includes(query);
        const matchDong = space.neighborhood.toLowerCase().includes(query);
        const matchAddr = space.address.toLowerCase().includes(query);
        const matchTags = space.tags.some(t => t.toLowerCase().includes(query));
        const matchUses = space.recommendedUses.some(u => u.toLowerCase().includes(query));
        if (!matchTitle && !matchDong && !matchAddr && !matchTags && !matchUses) {
          return false;
        }
      }
      return true;
    });
  }, [spaces, filters]);

  const activeSelectedSpace = useMemo(() => {
    return spaces.find((s) => s.id === selectedSpaceId) || filteredSpaces[0] || null;
  }, [spaces, selectedSpaceId, filteredSpaces]);

  const handleSelectSpace = (space: Space) => {
    setSelectedSpaceId(space.id);
  };

  const handleOpenDetail = (space: Space) => {
    setSelectedSpaceId(space.id);
    setIsDetailOpen(true);
  };

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <Header title="공간 찾기" />

      {/* 직방 스타일 상단 필터 칩 바 */}
      <FilterChips />

      {/* 메인 지도 및 핀 마커 */}
      <View style={styles.mapContainer}>
        <MapView
          spaces={filteredSpaces}
          selectedSpaceId={selectedSpaceId}
          onSelectSpace={handleSelectSpace}
        />

        {/* 하단 3단계 바텀시트 리스트 */}
        <BottomSheetList
          spaces={filteredSpaces}
          selectedSpace={activeSelectedSpace}
          onSelectSpace={handleSelectSpace}
          onOpenDetail={handleOpenDetail}
        />
      </View>

      {/* 공간 상세 모달 */}
      <SpaceDetailModal
        space={activeSelectedSpace}
        visible={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
});
