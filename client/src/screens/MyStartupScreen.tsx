import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert 
} from "react-native";
import { 
  FileText, 
  Download, 
  Building2, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Heart, 
  Settings, 
  SlidersHorizontal,
  Bookmark
} from "lucide-react-native";
import { COLORS, METRICS, TYPOGRAPHY } from "../constants/theme";
import { useApp } from "../context/AppContext";
import { Header } from "../components/common/Header";
import { ProgressSteps } from "../components/common/ProgressSteps";
import { HighlightBox } from "../components/common/HighlightBox";
import { RiskBadge } from "../components/common/RiskBadge";

type SubTab = "MATCHING" | "PROPOSAL" | "TIMELINE" | "MY_ARCHIVE";

export const MyStartupScreen: React.FC = () => {
  const { 
    startupStep, 
    setStartupStep, 
    programs, 
    reports, 
    bookmarks, 
    spaces, 
    setRole, 
    resetOnboarding,
    setActiveTab,
    youthInterest
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<SubTab>("PROPOSAL");

  // 맞춤 지원사업 매칭 필터 조건
  const [targetAge, setTargetAge] = useState("만 29세 (청년)");
  const [spaceSecuredStatus, setSpaceSecuredStatus] = useState("소유자 협의 완료 (가계약 단계)");
  const [selectedProgramId, setSelectedProgramId] = useState<string>("prog-01");

  // 사업계획서 템플릿 상태 (진단 리포트 내용 연동)
  const currentReport = reports[0];
  const [bizTitle, setBizTitle] = useState("철암 탄광역사거리 로컬 수제맥주 브루펍 '검은돌'");
  const [proposalSection1, setProposalSection1] = useState(
    "철암역 인근 40년 된 유휴 제재소 상가를 재생하여, 태백의 탄광 역사와 백두대간 협곡열차 관광객을 잇는 지역 특화 F&B 문화공간을 구축하고자 함."
  );
  const [proposalSection2, setProposalSection2] = useState(
    `• 확보 대상: 강원특별자치도 태백시 동태백로 389 (전용 23.7평)\n• 소유자 협의: 월세 30만원 (초기 1년 인테리어 기간 50% 감면 합의)\n• 시설 개선: 배관 전면 교체(350만원), 전기 5kW->10kW 증설(120만원), 주방 방수 턱 공사(280만원)\n• 총 시설 소요: 약 1,450만원 (태백시 청년창창센터 공간개선 지원금 신청)`
  );
  const [proposalSection3, setProposalSection3] = useState(
    "• 주말 백두대간 협곡열차 관광객(일평균 1,820명) 타깃 로컬 맥주 굿즈 세트 판매\n• 평일 저녁 철암·장성 주민 대상 커뮤니티 펍 운영\n• 예상 월매출: 약 1,850만원, 7개월 차 손익분기점(BEP) 달성 예상"
  );
  const [proposalSaved, setProposalSaved] = useState(false);

  // 창업 절차 타임라인 가이드
  const timelineSteps = [
    {
      step: 1,
      title: "공간 발굴 및 현장 확인",
      desc: "태백시 내 빈집·빈상가 데이터 조회 및 현장 실측 (현재 완료)",
      status: "DONE",
    },
    {
      step: 2,
      title: "계약 전 진단 리포트 발행",
      desc: "골조 진단, 숨은 수리비, 손익분기점 객관적 데이터 확보 (현재 완료)",
      status: "DONE",
    },
    {
      step: 3,
      title: "소유자 상생 협의 및 현장 동행",
      desc: "청년창창센터 전담 매니저 동행, 임대료 감면 및 장기 운영 약속",
      status: "IN_PROGRESS",
    },
    {
      step: 4,
      title: "태백시 청년창업 공간개선사업 신청",
      desc: "사업계획서 초안 접수로 리모델링 보조금(최대 4,500만원) 확보",
      status: "TODO",
    },
    {
      step: 5,
      title: "공간 리모델링 및 개업",
      desc: "인테리어 완공, 사업자등록 및 영업 개시",
      status: "TODO",
    },
  ];

  const handleSaveProposal = () => {
    setProposalSaved(true);
    setTimeout(() => setProposalSaved(false), 2500);
  };

  const bookmarkedSpaces = spaces.filter(s => bookmarks.includes(s.id));

  return (
    <View style={styles.container}>
      <Header title="내 창업 (신청·기록)" />

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* 상단 5단계 여정 진행 카드 */}
        <View style={styles.journeyCard}>
          <View style={styles.journeyHeader}>
            <View>
              <Text style={styles.journeySub}>태백 청년 창업 여정</Text>
              <Text style={styles.journeyTitle}>
                {startupStep === 1 && "1단계: 유휴공간 탐색"}
                {startupStep === 2 && "2단계: 계약 전 진단"}
                {startupStep === 3 && "3단계: 소유자 조건 협의"}
                {startupStep === 4 && "4단계: 지원사업 신청"}
                {startupStep === 5 && "5단계: 창업 완료"}
              </Text>
            </View>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>{startupStep} / 5</Text>
            </View>
          </View>

          <ProgressSteps currentStep={startupStep} />

          <View style={styles.stepNavRow}>
            <TouchableOpacity 
              style={[styles.stepNavBtn, startupStep === 1 && styles.stepNavBtnDisabled]}
              onPress={() => setStartupStep(Math.max(1, startupStep - 1))}
              disabled={startupStep === 1}
            >
              <ChevronLeft size={14} color={COLORS.textSecondary} strokeWidth={1.75} style={{ marginRight: 2 }} />
              <Text style={styles.stepNavBtnText}>이전 단계</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.stepNavBtn, styles.stepNavBtnPrimary, startupStep === 5 && styles.stepNavBtnDisabled]}
              onPress={() => setStartupStep(Math.min(5, startupStep + 1))}
              disabled={startupStep === 5}
            >
              <Text style={styles.stepNavBtnTextPrimary}>다음 단계 완료</Text>
              <ChevronRight size={14} color={COLORS.surface} strokeWidth={1.75} style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 4개 서브 탭 바 */}
        <View style={styles.subTabBar}>
          <TouchableOpacity
            style={[styles.subTabItem, activeSubTab === "PROPOSAL" && styles.subTabItemActive]}
            onPress={() => setActiveSubTab("PROPOSAL")}
          >
            <Text style={[styles.subTabText, activeSubTab === "PROPOSAL" && styles.subTabTextActive]}>
              사업계획서 초안
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subTabItem, activeSubTab === "MATCHING" && styles.subTabItemActive]}
            onPress={() => setActiveSubTab("MATCHING")}
          >
            <Text style={[styles.subTabText, activeSubTab === "MATCHING" && styles.subTabTextActive]}>
              맞춤 지원사업
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subTabItem, activeSubTab === "TIMELINE" && styles.subTabItemActive]}
            onPress={() => setActiveSubTab("TIMELINE")}
          >
            <Text style={[styles.subTabText, activeSubTab === "TIMELINE" && styles.subTabTextActive]}>
              창업 절차
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subTabItem, activeSubTab === "MY_ARCHIVE" && styles.subTabItemActive]}
            onPress={() => setActiveSubTab("MY_ARCHIVE")}
          >
            <Text style={[styles.subTabText, activeSubTab === "MY_ARCHIVE" && styles.subTabTextActive]}>
              보관함 ({bookmarkedSpaces.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* 1. 사업계획서 초안 탭 */}
        {activeSubTab === "PROPOSAL" && (
          <View style={styles.sectionWrap}>
            <HighlightBox
              title="공간 확보와 지원사업 신청을 잇는 사업계획서 초안"
            >
              진단 리포트에서 분석된 공간 수리비(1,450만원), 상권 유동인구, 추천 비즈니스 모델을 태백시 청년창업 공모 양식에 맞추어 연동했습니다.
            </HighlightBox>

            <View style={styles.proposalDoc}>
              <View style={styles.docHeader}>
                <View style={styles.docBadge}>
                  <Text style={styles.docBadgeText}>2026 태백시 청년창업 지원사업 신청 표준 양식</Text>
                </View>
                <TouchableOpacity style={styles.docSaveBtn} onPress={handleSaveProposal}>
                  <Text style={styles.docSaveBtnText}>초안 저장</Text>
                </TouchableOpacity>
              </View>

              {/* 항목 1: 사업명 */}
              <Text style={styles.fieldLabel}>1. 사업명 및 프로젝트 개요</Text>
              <TextInput
                style={styles.fieldInputSingle}
                value={bizTitle}
                onChangeText={setBizTitle}
              />
              <TextInput
                style={styles.fieldInputMulti}
                multiline
                value={proposalSection1}
                onChangeText={setProposalSection1}
              />

              {/* 항목 2: 공간 확보 및 시설 개선 계획 */}
              <Text style={styles.fieldLabel}>2. 공간 확보 현황 및 시설 개선(리모델링) 계획</Text>
              <TextInput
                style={[styles.fieldInputMulti, { height: 110 }]}
                multiline
                value={proposalSection2}
                onChangeText={setProposalSection2}
              />

              {/* 항목 3: 비즈니스 모델 및 예상 수익성 */}
              <Text style={styles.fieldLabel}>3. 지역 자원 융합 비즈니스 모델 & 손익 분석</Text>
              <TextInput
                style={[styles.fieldInputMulti, { height: 100 }]}
                multiline
                value={proposalSection3}
                onChangeText={setProposalSection3}
              />

              {proposalSaved && (
                <View style={styles.savedAlert}>
                  <Check size={14} color={COLORS.riskSafe} strokeWidth={2} style={{ marginRight: 6 }} />
                  <Text style={styles.savedAlertText}>사업계획서 초안이 저장되었습니다.</Text>
                </View>
              )}

              {/* 하단 공공기관 접수 버튼 */}
              <View style={styles.proposalActionRow}>
                <TouchableOpacity 
                  style={styles.downloadPdfBtn}
                  onPress={() => Alert.alert("다운로드 완료", "태백시 지원사업 공모 양식 PDF로 저장되었습니다.")}
                >
                  <Download size={14} color={COLORS.textPrimary} strokeWidth={1.75} style={{ marginRight: 4 }} />
                  <Text style={styles.downloadPdfText}>PDF 서류 받기</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.submitCenterBtn}
                  onPress={() => Alert.alert("접수 상담 신청", "태백시 청년창창센터 담당 매니저에게 사전 검토 서류가 전송되었습니다.")}
                >
                  <Building2 size={14} color="#FFFFFF" strokeWidth={1.75} style={{ marginRight: 4 }} />
                  <Text style={styles.submitCenterText}>청년창창센터 접수</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* 2. 나에게 맞는 지원사업 탭 */}
        {activeSubTab === "MATCHING" && (
          <View style={styles.sectionWrap}>
            <View style={styles.matchingFilterBox}>
              <View style={styles.filterTitleRow}>
                <SlidersHorizontal size={15} color={COLORS.primary} strokeWidth={1.75} style={{ marginRight: 6 }} />
                <Text style={styles.matchingTitle}>나의 창업 조건 매칭</Text>
              </View>
              <View style={styles.filterChipRow}>
                <View style={styles.filterTag}>
                  <Text style={styles.filterTagText}>연령: {targetAge}</Text>
                </View>
                <View style={styles.filterTag}>
                  <Text style={styles.filterTagText}>공간: {spaceSecuredStatus}</Text>
                </View>
              </View>
              <Text style={styles.matchingNote}>
                현재 공간 확보 협의 단계에 맞춰 신청 가능한 지자체 지원사업 {programs.length}건이 매칭되었습니다.
              </Text>
            </View>

            {programs.map((prog) => {
              const isSelected = selectedProgramId === prog.id;
              return (
                <View key={prog.id} style={[styles.programCard, isSelected && styles.programCardSelected]}>
                  <View style={styles.progTop}>
                    <View style={styles.progDDayBadge}>
                      <Text style={styles.progDDayText}>D-{prog.dDay}</Text>
                    </View>
                    <Text style={styles.progGrant}>{prog.grantAmount}</Text>
                  </View>

                  <Text style={styles.progTitle}>{prog.title}</Text>
                  <Text style={styles.progTarget}>• 지원 대상: {prog.targetConditions}</Text>
                  <Text style={styles.progDesc}>{prog.description}</Text>
                  <Text style={styles.progDeadline}>주관: {prog.organizingBody} ({prog.deadline})</Text>

                  <TouchableOpacity 
                    style={styles.progApplyBtn}
                    onPress={() => {
                      setSelectedProgramId(prog.id);
                      setActiveSubTab("PROPOSAL");
                    }}
                  >
                    <Text style={styles.progApplyBtnText}>이 지원사업에 계획서 적용하기</Text>
                    <ChevronRight size={14} color={COLORS.accent} strokeWidth={1.75} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        {/* 3. 창업 절차 타임라인 가이드 */}
        {activeSubTab === "TIMELINE" && (
          <View style={styles.sectionWrap}>
            <Text style={styles.timelineHeading}>태백 청년 빈집 창업 5단계 로드맵</Text>
            <Text style={styles.timelineSub}>계약 전부터 지원금 수령까지 한눈에 확인하세요.</Text>

            <View style={styles.timelineList}>
              {timelineSteps.map((item, idx) => (
                <View key={item.step} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View style={[
                      styles.timelineCircle,
                      item.status === "DONE" && styles.timelineCircleDone,
                      item.status === "IN_PROGRESS" && styles.timelineCircleProgress,
                    ]}>
                      {item.status === "DONE" ? (
                        <Check size={12} color="#FFFFFF" strokeWidth={2} />
                      ) : (
                        <Text style={[
                          styles.timelineCircleText,
                          item.status === "IN_PROGRESS" && styles.timelineCircleTextActive,
                        ]}>
                          {item.step}
                        </Text>
                      )}
                    </View>
                    {idx < timelineSteps.length - 1 && <View style={styles.timelineLine} />}
                  </View>

                  <View style={styles.timelineRight}>
                    <View style={styles.timelineTitleRow}>
                      <Text style={styles.timelineTitleText}>{item.title}</Text>
                      {item.status === "DONE" && (
                        <View style={styles.statusPillDone}>
                          <Text style={styles.statusPillDoneText}>완료</Text>
                        </View>
                      )}
                      {item.status === "IN_PROGRESS" && (
                        <View style={styles.statusPillProgress}>
                          <Text style={styles.statusPillProgressText}>진행 중</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.timelineDescText}>{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 4. 보관함 (찜한 공간 & 리포트) */}
        {activeSubTab === "MY_ARCHIVE" && (
          <View style={styles.sectionWrap}>
            <View style={styles.archiveHeaderRow}>
              <Heart size={16} color={COLORS.accent} strokeWidth={1.75} style={{ marginRight: 6 }} />
              <Text style={styles.archiveHeading}>찜한 유휴공간 ({bookmarkedSpaces.length})</Text>
            </View>
            {bookmarkedSpaces.length === 0 ? (
              <View style={styles.emptyCard}>
                <Bookmark size={24} color={COLORS.line} strokeWidth={1.75} style={{ marginBottom: 6 }} />
                <Text style={styles.emptyNotice}>찜한 공간이 없습니다.</Text>
                <TouchableOpacity onPress={() => setActiveTab("EXPLORE")}>
                  <Text style={styles.emptyActionText}>공간 찾기에서 둘러보기 →</Text>
                </TouchableOpacity>
              </View>
            ) : (
              bookmarkedSpaces.map((sp) => (
                <View key={sp.id} style={styles.archiveCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.archiveTitle}>{sp.title}</Text>
                    <Text style={styles.archiveMeta}>
                      {sp.neighborhood} · {sp.areaPyeong}평 · {sp.rentTypeLabel} {sp.rentType === "FREE_NEGOTIATION" ? "무상" : `${sp.monthlyRent}만`}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.archiveActionBtn}
                    onPress={() => setActiveTab("AI_REVIEW")}
                  >
                    <Text style={styles.archiveActionBtnText}>진단하기</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}

            <View style={[styles.archiveHeaderRow, { marginTop: 20 }]}>
              <FileText size={16} color={COLORS.primary} strokeWidth={1.75} style={{ marginRight: 6 }} />
              <Text style={styles.archiveHeading}>
                내가 만든 진단 리포트 ({reports.length})
              </Text>
            </View>
            {reports.map((rep) => (
              <TouchableOpacity
                key={rep.id}
                style={styles.archiveCard}
                onPress={() => setActiveTab("AI_REVIEW")}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.archiveTitle}>{rep.spaceTitle}</Text>
                  <Text style={styles.archiveMeta}>{rep.createdAt} · 종합 {rep.overallScore}점</Text>
                </View>
                <RiskBadge level={rep.riskLevel} size="sm" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 하단 환경 설정 및 소유자 모드 전환 */}
        <View style={styles.settingsBox}>
          <View style={styles.settingsTitleRow}>
            <Settings size={15} color={COLORS.primary} strokeWidth={1.75} style={{ marginRight: 6 }} />
            <Text style={styles.settingsTitle}>설정 및 모드 변경</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setRole("OWNER")}
          >
            <View>
              <Text style={styles.settingItemTitle}>공간 소유자 모드로 전환</Text>
              <Text style={styles.settingItemSub}>빈집·빈상가를 소유하고 계신가요?</Text>
            </View>
            <ChevronRight size={16} color={COLORS.textSecondary} strokeWidth={1.75} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={resetOnboarding}
          >
            <View>
              <Text style={styles.settingItemTitle}>온보딩 다시 보기</Text>
              <Text style={styles.settingItemSub}>판단, 연결, 신청 안내 다시 확인</Text>
            </View>
            <ChevronRight size={16} color={COLORS.textSecondary} strokeWidth={1.75} />
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
  journeyCard: {
    backgroundColor: COLORS.surface,
    padding: 18,
    borderRadius: METRICS.borderRadiusMd,
    borderWidth: 1,
    borderColor: COLORS.line,
    marginBottom: 16,
  },
  journeyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  journeySub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  journeyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 2,
    fontFamily: TYPOGRAPHY.titleFont,
  },
  stepBadge: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: METRICS.borderRadiusSm,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
    fontVariant: ["tabular-nums"],
  },
  stepNavRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    paddingTop: 10,
  },
  stepNavBtn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background,
    borderRadius: METRICS.borderRadiusSm,
    borderWidth: 1,
    borderColor: COLORS.line,
    flexDirection: "row",
    alignItems: "center",
  },
  stepNavBtnPrimary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepNavBtnDisabled: {
    opacity: 0.4,
  },
  stepNavBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  stepNavBtnTextPrimary: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  subTabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.borderRadiusSm,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 3,
    marginBottom: 16,
  },
  subTabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: METRICS.borderRadiusSm,
  },
  subTabItemActive: {
    backgroundColor: COLORS.primary,
  },
  subTabText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  subTabTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  sectionWrap: {
    marginBottom: 16,
  },
  proposalDoc: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: METRICS.borderRadiusMd,
    borderWidth: 1,
    borderColor: COLORS.line,
    marginTop: 10,
  },
  docHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  docBadge: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: METRICS.borderRadiusSm,
    flex: 1,
    marginRight: 8,
  },
  docBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  docSaveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: METRICS.borderRadiusSm,
  },
  docSaveBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 10,
    marginBottom: 6,
    fontFamily: TYPOGRAPHY.titleFont,
  },
  fieldInputSingle: {
    backgroundColor: COLORS.background,
    borderRadius: METRICS.borderRadiusSm,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  fieldInputMulti: {
    backgroundColor: COLORS.background,
    borderRadius: METRICS.borderRadiusSm,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 10,
    fontSize: 12,
    color: COLORS.textPrimary,
    lineHeight: 18,
    textAlignVertical: "top",
  },
  savedAlert: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.riskSafe,
    padding: 8,
    borderRadius: METRICS.borderRadiusSm,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  savedAlertText: {
    fontSize: 12,
    color: COLORS.riskSafe,
    fontWeight: "700",
  },
  proposalActionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  downloadPdfBtn: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 12,
    borderRadius: METRICS.borderRadiusSm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  downloadPdfText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  submitCenterBtn: {
    flex: 1,
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    borderRadius: METRICS.borderRadiusSm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  submitCenterText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  matchingFilterBox: {
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: METRICS.borderRadiusMd,
    borderWidth: 1,
    borderColor: COLORS.line,
    marginBottom: 12,
  },
  filterTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  matchingTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    fontFamily: TYPOGRAPHY.titleFont,
  },
  filterChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 6,
  },
  filterTag: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: METRICS.borderRadiusSm,
  },
  filterTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.primary,
  },
  matchingNote: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  programCard: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.borderRadiusMd,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  programCardSelected: {
    borderColor: COLORS.accent,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  progTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  progDDayBadge: {
    backgroundColor: COLORS.accent,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: METRICS.borderRadiusSm,
  },
  progDDayText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    fontVariant: ["tabular-nums"],
  },
  progGrant: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.accent,
    fontVariant: ["tabular-nums"],
  },
  progTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
    fontFamily: TYPOGRAPHY.titleFont,
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
    marginBottom: 8,
  },
  progDeadline: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  progApplyBtn: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 9,
    borderRadius: METRICS.borderRadiusSm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  progApplyBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.accent,
    marginRight: 4,
  },
  timelineHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 2,
    fontFamily: TYPOGRAPHY.titleFont,
  },
  timelineSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  timelineList: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.borderRadiusMd,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timelineLeft: {
    alignItems: "center",
    width: 30,
    marginRight: 10,
  },
  timelineCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineCircleDone: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timelineCircleProgress: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  timelineCircleText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textSecondary,
    fontVariant: ["tabular-nums"],
  },
  timelineCircleTextActive: {
    color: "#FFFFFF",
  },
  timelineLine: {
    flex: 1,
    width: 1,
    backgroundColor: COLORS.line,
    marginTop: 4,
  },
  timelineRight: {
    flex: 1,
  },
  timelineTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  timelineTitleText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  statusPillDone: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: METRICS.borderRadiusSm,
  },
  statusPillDoneText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.riskSafe,
  },
  statusPillProgress: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: METRICS.borderRadiusSm,
  },
  statusPillProgressText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.accent,
  },
  timelineDescText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  archiveHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  archiveHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    fontFamily: TYPOGRAPHY.titleFont,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    padding: 24,
    borderRadius: METRICS.borderRadiusMd,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  emptyNotice: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  emptyActionText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.accent,
  },
  archiveCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: METRICS.borderRadiusSm,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  archiveTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
    fontFamily: TYPOGRAPHY.titleFont,
  },
  archiveMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontVariant: ["tabular-nums"],
  },
  archiveActionBtn: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: METRICS.borderRadiusSm,
  },
  archiveActionBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
  },
  settingsBox: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.borderRadiusMd,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.line,
    marginTop: 10,
  },
  settingsTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  settingsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    fontFamily: TYPOGRAPHY.titleFont,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  settingItemTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  settingItemSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
