import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { COLORS } from "../constants/theme";
import { useApp } from "../context/AppContext";
import { Header } from "../components/common/Header";
import { ProgressSteps } from "../components/common/ProgressSteps";
import { HighlightBox } from "../components/common/HighlightBox";

export const MyStartupScreen: React.FC = () => {
  const { 
    startupStep, 
    setStartupStep, 
    programs, 
    reports, 
    bookmarks, 
    spaces, 
    setRole, 
    resetOnboarding 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<"PROGRAMS" | "PROPOSAL" | "BOOKMARKS">("PROGRAMS");
  const [proposalDraft, setProposalDraft] = useState(
    "【사업명】 철암 탄광역사거리 폐자재 업사이클링 복합문화 라운지 & 로컬 브루펍\n" +
    "【공간확보 현황】 강원특별자치도 태백시 동태백로 389 (소유자 협의 완료, AI 적합도 88점)\n" +
    "【필요 지원금】 실내 설비 및 배관 보수 1,450만원 (태백시 청년창업 공간개선사업 100% 매칭)\n" +
    "【기대 효과】 철암역 관광객 유입 및 연간 2억원 로컬 경제 유발 효과 창출"
  );
  const [savedNotice, setSavedNotice] = useState(false);

  const bookmarkedSpaces = spaces.filter(s => bookmarks.includes(s.id));

  const handleSaveProposal = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <View style={styles.container}>
      <Header title="내 창업 관리" />

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* 상단 5단계 진행 바 */}
        <View style={styles.stepsCard}>
          <Text style={styles.cardHeading}>🚀 나의 태백 창업 진행 상황</Text>
          <ProgressSteps currentStep={startupStep} />
          
          <View style={styles.stepControls}>
            <TouchableOpacity 
              style={[styles.stepBtn, startupStep === 1 && styles.stepBtnDisabled]}
              onPress={() => setStartupStep(Math.max(1, startupStep - 1))}
              disabled={startupStep === 1}
            >
              <Text style={styles.stepBtnText}>◀ 이전 단계</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.stepBtn, startupStep === 5 && styles.stepBtnDisabled]}
              onPress={() => setStartupStep(Math.min(5, startupStep + 1))}
              disabled={startupStep === 5}
            >
              <Text style={styles.stepBtnText}>다음 단계 ▶</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 서브 탭: 지원사업 매칭 / AI 사업계획서 / 찜한 공간 */}
        <View style={styles.subTabBar}>
          <TouchableOpacity
            style={[styles.subTabItem, activeSubTab === "PROGRAMS" && styles.subTabActive]}
            onPress={() => setActiveSubTab("PROGRAMS")}
          >
            <Text style={[styles.subTabText, activeSubTab === "PROGRAMS" && styles.subTabTextActive]}>
              지원사업 매칭 ({programs.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subTabItem, activeSubTab === "PROPOSAL" && styles.subTabActive]}
            onPress={() => setActiveSubTab("PROPOSAL")}
          >
            <Text style={[styles.subTabText, activeSubTab === "PROPOSAL" && styles.subTabTextActive]}>
              AI 사업계획서 ✨
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subTabItem, activeSubTab === "BOOKMARKS" && styles.subTabActive]}
            onPress={() => setActiveSubTab("BOOKMARKS")}
          >
            <Text style={[styles.subTabText, activeSubTab === "BOOKMARKS" && styles.subTabTextActive]}>
              찜한 공간 ({bookmarkedSpaces.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* 1. 지원사업 매칭 탭 */}
        {activeSubTab === "PROGRAMS" && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionNotice}>
              💡 공간 확보 단계(협의/가계약)에 맞추어 신청 가능한 지원사업입니다.
            </Text>

            {programs.map((prog) => (
              <View key={prog.id} style={styles.progCard}>
                <View style={styles.progHeader}>
                  <View style={[styles.dDayPill, { backgroundColor: prog.badgeColor || COLORS.primary }]}>
                    <Text style={styles.dDayPillText}>D-{prog.dDay}</Text>
                  </View>
                  <Text style={styles.progAmount}>{prog.grantAmount}</Text>
                </View>
                <Text style={styles.progTitle}>{prog.title}</Text>
                <Text style={styles.progTarget}>🎯 대상: {prog.targetConditions}</Text>
                <Text style={styles.progDesc}>{prog.description}</Text>

                <TouchableOpacity style={styles.applyBtn} activeOpacity={0.8}>
                  <Text style={styles.applyBtnText}>이 지원사업 AI 신청서 작성하기 →</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* 2. AI 사업계획서 초안 탭 (핵심 연결) */}
        {activeSubTab === "PROPOSAL" && (
          <View style={styles.tabContent}>
            <HighlightBox
              title="공간 확보와 지원 신청을 잇는 AI 사업계획서"
              icon={<Text>📑</Text>}
            >
              AI 검토 리포트의 공간 진단, 예상 수리비, 상권 분석 데이터를 공공 지원사업 양식에 맞추어 자동 완성한 초안입니다.
            </HighlightBox>

            <View style={styles.editorCard}>
              <View style={styles.editorHeader}>
                <Text style={styles.editorTitle}>2026 태백시 청년창업 지원사업 신청서 초안</Text>
                <TouchableOpacity onPress={handleSaveProposal} style={styles.saveBtn}>
                  <Text style={styles.saveBtnText}>저장</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.textEditor}
                multiline
                value={proposalDraft}
                onChangeText={setProposalDraft}
                textAlignVertical="top"
              />

              {savedNotice && (
                <View style={styles.saveNoticeBanner}>
                  <Text style={styles.saveNoticeText}>✓ 사업계획서가 성공적으로 저장되었습니다!</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* 3. 찜한 공간 탭 */}
        {activeSubTab === "BOOKMARKS" && (
          <View style={styles.tabContent}>
            {bookmarkedSpaces.length === 0 ? (
              <View style={styles.emptyBookmarks}>
                <Text style={styles.emptyIcon}>🤍</Text>
                <Text style={styles.emptyText}>찜한 유휴공간이 없습니다.</Text>
                <Text style={styles.emptySub}>공간 찾기에서 관심 있는 공간에 하트를 눌러보세요.</Text>
              </View>
            ) : (
              bookmarkedSpaces.map((space) => (
                <View key={space.id} style={styles.bookmarkItem}>
                  <View style={styles.bookmarkInfo}>
                    <Text style={styles.bookmarkTitle}>{space.title}</Text>
                    <Text style={styles.bookmarkMeta}>
                      {space.neighborhood} · {space.areaPyeong}평 · {space.rentTypeLabel}
                    </Text>
                  </View>
                  <Text style={styles.bookmarkPrice}>
                    {space.rentType === "FREE_NEGOTIATION" ? "무상협의" : `${space.monthlyRent}만`}
                  </Text>
                </View>
              ))
            )}
          </View>
        )}

        {/* 마이 설정 & 모드 전환 */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsHeading}>⚙️ 환경 설정</Text>
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => setRole("OWNER")}
          >
            <Text style={styles.settingRowText}>공간 소유자 모드로 전환하기</Text>
            <Text style={styles.settingRowArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={resetOnboarding}
          >
            <Text style={styles.settingRowText}>온보딩 다시 보기</Text>
            <Text style={styles.settingRowArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollBody: {
    flex: 1,
    padding: 16,
  },
  stepsCard: {
    backgroundColor: COLORS.surface,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  stepControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 10,
  },
  stepBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  stepBtnDisabled: {
    opacity: 0.4,
  },
  stepBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  subTabBar: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    padding: 3,
    marginBottom: 16,
  },
  subTabItem: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 10,
  },
  subTabActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  subTabText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  subTabTextActive: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  tabContent: {
    marginBottom: 20,
  },
  sectionNotice: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  progCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  progHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  dDayPill: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 4,
  },
  dDayPillText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  progAmount: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.primary,
  },
  progTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  progTarget: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  progDesc: {
    fontSize: 12,
    color: COLORS.textPrimary,
    lineHeight: 17,
    marginBottom: 10,
  },
  applyBtn: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  applyBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  editorCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  editorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  editorTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
    flex: 1,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  textEditor: {
    height: 180,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  saveNoticeBanner: {
    backgroundColor: "#ECFDF5",
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    alignItems: "center",
  },
  saveNoticeText: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "700",
  },
  emptyBookmarks: {
    alignItems: "center",
    paddingVertical: 30,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  bookmarkItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  bookmarkInfo: {
    flex: 1,
  },
  bookmarkTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  bookmarkMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  bookmarkPrice: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.primary,
  },
  settingsSection: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 10,
  },
  settingsHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  settingRowText: {
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  settingRowArrow: {
    fontSize: 14,
    color: COLORS.textTertiary,
  },
});
