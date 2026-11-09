import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  Platform 
} from "react-native";
import { COLORS } from "../constants/theme";
import { useApp } from "../context/AppContext";
import { Space, StartupStory, SupportProgram } from "../types";
import { Header } from "../components/common/Header";
import { CategoryGrid } from "../components/home/CategoryGrid";
import { MiniProgressCard } from "../components/home/MiniProgressCard";
import { SpaceCard } from "../components/spaces/SpaceCard";
import { StoryCard } from "../components/home/StoryCard";
import { StoryDetailModal } from "../components/home/StoryDetailModal";
import { TaebaekStatsCard } from "../components/home/TaebaekStatsCard";
import { SpaceDetailModal } from "../components/spaces/SpaceDetailModal";

export const HomeScreen: React.FC = () => {
  const { 
    spaces, 
    stories, 
    programs, 
    setActiveTab, 
    filters, 
    setFilters,
    youthInterest 
  } = useApp();

  const [searchText, setSearchText] = useState("");
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [isSpaceModalVisible, setIsSpaceModalVisible] = useState(false);
  const [selectedStory, setSelectedStory] = useState<StartupStory | null>(null);
  const [isStoryModalVisible, setIsStoryModalVisible] = useState(false);

  // 검색 실행 시 공간 찾기 탭으로 전환
  const handleSearchSubmit = () => {
    if (searchText.trim().length > 0) {
      setFilters(prev => ({ ...prev, searchQuery: searchText.trim() }));
      setActiveTab("EXPLORE");
    }
  };

  const handleOpenSpaceDetail = (space: Space) => {
    setSelectedSpace(space);
    setIsSpaceModalVisible(true);
  };

  const handleOpenStoryDetail = (story: StartupStory) => {
    setSelectedStory(story);
    setIsStoryModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 상단 블루 배경 헤더 영역 (직방 스타일 감성) */}
        <View style={styles.heroBackground}>
          <Text style={styles.greetingText}>
            청년 창업가님, 반갑습니다 👋
          </Text>
          <Text style={styles.heroHeadline}>
            태백의 빈 공간에서{"\n"}당신의 창업을 시작하세요
          </Text>

          {/* 직방 스타일 큰 검색창 */}
          <View style={styles.searchBarContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="동네(철암·황지·장성)나 업종(카페·공방) 검색"
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText("")} style={styles.clearBtn}>
                <Text style={styles.clearText}>✕</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.searchActionBtn}
              onPress={handleSearchSubmit}
            >
              <Text style={styles.searchActionBtnText}>찾기</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 카테고리 아이콘 그리드 (마진 음수로 블루 헤더 위에 겹치게 배치) */}
        <CategoryGrid />

        {/* 내 창업 진행 미니 카드 */}
        <MiniProgressCard />

        {/* 추천 공간 가로 스크롤 카드 */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionBadge}>AI 검토 추천</Text>
              <Text style={styles.sectionTitle}>지금 바로 검토 가능한 유휴공간</Text>
            </View>
            <TouchableOpacity onPress={() => setActiveTab("EXPLORE")}>
              <Text style={styles.seeAllText}>더보기 →</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {spaces.slice(0, 5).map((space) => (
              <SpaceCard
                key={space.id}
                space={space}
                horizontal={true}
                onPress={() => handleOpenSpaceDetail(space)}
              />
            ))}
          </ScrollView>
        </View>

        {/* 마감 임박 지원사업 */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionBadge}>지원사업</Text>
              <Text style={styles.sectionTitle}>놓치면 안 되는 태백 청년 지원사업</Text>
            </View>
            <TouchableOpacity onPress={() => setActiveTab("MY_STARTUP")}>
              <Text style={styles.seeAllText}>전체보기 →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.programList}>
            {programs.slice(0, 3).map((prog) => (
              <TouchableOpacity 
                key={prog.id} 
                style={styles.programCard}
                onPress={() => setActiveTab("MY_STARTUP")}
                activeOpacity={0.8}
              >
                <View style={styles.programTopRow}>
                  <View style={[styles.dDayBadge, { backgroundColor: prog.badgeColor || COLORS.primary }]}>
                    <Text style={styles.dDayText}>D-{prog.dDay}</Text>
                  </View>
                  <Text style={styles.grantText}>{prog.grantAmount}</Text>
                </View>
                <Text style={styles.programTitle} numberOfLines={1}>{prog.title}</Text>
                <Text style={styles.programOrg}>{prog.organizingBody} · {prog.deadline}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 태백 창업 이야기 가로 스크롤 */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionBadge}>선배 창업가 인터뷰</Text>
              <Text style={styles.sectionTitle}>태백에서 먼저 공간을 연 사람들</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onPress={() => handleOpenStoryDetail(story)}
              />
            ))}
          </ScrollView>
        </View>

        {/* 숫자로 보는 태백 통계 카드 */}
        <TaebaekStatsCard />

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* 공간 상세 모달 */}
      <SpaceDetailModal
        space={selectedSpace}
        visible={isSpaceModalVisible}
        onClose={() => setIsSpaceModalVisible(false)}
      />

      {/* 창업 이야기 상세 모달 */}
      <StoryDetailModal
        story={selectedStory}
        visible={isStoryModalVisible}
        onClose={() => setIsStoryModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroBackground: {
    backgroundColor: COLORS.primary,
    paddingTop: 16,
    paddingBottom: 36,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greetingText: {
    fontSize: 13,
    color: "#D6DCFF",
    fontWeight: "600",
    marginBottom: 4,
  },
  heroHeadline: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 28,
    letterSpacing: -0.4,
    marginBottom: 16,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    paddingVertical: 8,
  },
  clearBtn: {
    padding: 6,
  },
  clearText: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  searchActionBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  searchActionBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  sectionBlock: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  horizontalScroll: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  programList: {
    paddingHorizontal: 16,
  },
  programCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  programTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  dDayBadge: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 4,
  },
  dDayText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  grantText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.primary,
  },
  programTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  programOrg: {
    fontSize: 11,
    color: COLORS.textTertiary,
  },
});
