import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity 
} from "react-native";
import { Search, X, ArrowRight } from "lucide-react-native";
import { COLORS, METRICS, TYPOGRAPHY } from "../constants/theme";
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
    setFilters 
  } = useApp();

  const [searchText, setSearchText] = useState("");
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [isSpaceModalVisible, setIsSpaceModalVisible] = useState(false);
  const [selectedStory, setSelectedStory] = useState<StartupStory | null>(null);
  const [isStoryModalVisible, setIsStoryModalVisible] = useState(false);

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
        {/* 상단 크림 배경 헤더 영역 (탄광/동네 전단지 느낌의 담백한 헤더) */}
        <View style={styles.heroBackground}>
          <Text style={styles.greetingText}>
            강원도 태백시 청년 공간 매칭
          </Text>
          <Text style={styles.heroHeadline}>
            태백의 빈 공간에서{"\n"}사업을 시작해 보세요
          </Text>

          {/* 단정한 검색창 */}
          <View style={styles.searchBarContainer}>
            <Search size={18} color={COLORS.textSecondary} strokeWidth={1.75} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="동네(철암·황지·장성)나 업종(카페·공방) 검색"
              placeholderTextColor={COLORS.textTertiary}
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText("")} style={styles.clearBtn}>
                <X size={16} color={COLORS.textSecondary} strokeWidth={1.75} />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.searchActionBtn}
              onPress={handleSearchSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.searchActionBtnText}>검색</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 카테고리 아이콘 그리드 */}
        <CategoryGrid />

        {/* 내 창업 진행 미니 카드 */}
        <MiniProgressCard />

        {/* 추천 공간 가로 스크롤 카드 */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionBadge}>추천 공간</Text>
              <Text style={styles.sectionTitle}>진단 가능한 유휴공간</Text>
            </View>
            <TouchableOpacity onPress={() => setActiveTab("EXPLORE")} style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>더보기</Text>
              <ArrowRight size={13} color={COLORS.textSecondary} strokeWidth={1.75} style={{ marginLeft: 3 }} />
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
              <Text style={styles.sectionTitle}>태백 청년 창업 지원사업</Text>
            </View>
            <TouchableOpacity onPress={() => setActiveTab("MY_STARTUP")} style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>전체보기</Text>
              <ArrowRight size={13} color={COLORS.textSecondary} strokeWidth={1.75} style={{ marginLeft: 3 }} />
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
                  <View style={styles.dDayBadge}>
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

        {/* 선배 창업가 인터뷰 이야기 */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionBadge}>창업 사례</Text>
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
    backgroundColor: COLORS.surface,
    paddingTop: 18,
    paddingBottom: 34,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  greetingText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  heroHeadline: {
    fontFamily: TYPOGRAPHY.titleFont,
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
    lineHeight: 30,
    letterSpacing: -0.4,
    marginBottom: 16,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: METRICS.borderRadiusSm,
    paddingHorizontal: 10,
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 13,
    color: COLORS.textPrimary,
    paddingVertical: 6,
  },
  clearBtn: {
    padding: 6,
  },
  searchActionBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: METRICS.borderRadiusSm,
  },
  searchActionBtnText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: "700",
  },
  sectionBlock: {
    marginTop: 22,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionBadge: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.accent,
    marginBottom: 2,
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.titleFont,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    fontFamily: TYPOGRAPHY.bodyFont,
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
    borderRadius: METRICS.borderRadiusMd,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  programTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  dDayBadge: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.accent,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: METRICS.borderRadiusSm,
  },
  dDayText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.accent,
    fontVariant: TYPOGRAPHY.fontVariantTabular,
  },
  grantText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.primary,
    fontVariant: TYPOGRAPHY.fontVariantTabular,
  },
  programTitle: {
    fontFamily: TYPOGRAPHY.titleFont,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  programOrg: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
