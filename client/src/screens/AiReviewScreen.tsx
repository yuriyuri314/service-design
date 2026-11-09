import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput,
  Platform,
  Alert
} from "react-native";
import { COLORS } from "../constants/theme";
import { useApp } from "../context/AppContext";
import { Header } from "../components/common/Header";
import { RiskBadge } from "../components/common/RiskBadge";
import { HighlightBox } from "../components/common/HighlightBox";
import { BeforeAfterSlider } from "../components/common/BeforeAfterSlider";
import { ReviewReport, Space } from "../types";

type ViewMode = "LIST" | "INPUT_STEP" | "LOADING" | "REPORT_DETAIL";

export const AiReviewScreen: React.FC = () => {
  const { 
    spaces, 
    selectedSpaceId, 
    setSelectedSpaceId, 
    reports, 
    setActiveTab, 
    youthInterest,
    startChatForSpace
  } = useApp();

  const [mode, setMode] = useState<ViewMode>(selectedSpaceId ? "INPUT_STEP" : "LIST");
  const [activeReport, setActiveReport] = useState<ReviewReport>(reports[0]);

  // 입력 단계 상태 (1: 공간, 2: 업종, 3: 예산)
  const [currentStep, setCurrentStep] = useState(1);
  const [chosenSpaceId, setChosenSpaceId] = useState<string>(selectedSpaceId || spaces[0].id);
  const [customPhotoUploaded, setCustomPhotoUploaded] = useState(false);
  const [chosenBizType, setChosenBizType] = useState(youthInterest.businessType || "F&B / 로컬 카페 & 브루펍");
  const [chosenBudget, setChosenBudget] = useState(youthInterest.budget || "3,000만 ~ 5,000만원");

  // 로딩 애니메이션 문구
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const loadingTexts = [
    "공간 노후 상태와 골조를 살펴보는 중…",
    "숨은 배관·전기 용량과 누수 위험을 체크하는 중…",
    "주변 상권 및 태백 관광객 유동인구를 분석하는 중…",
    "태백 고원·탄광 자원과 융합할 겹치지 않는 업종을 도출하는 중…",
    "AI 창업 검토 리포트 작성을 완료하는 중…"
  ];

  // 로딩 타이머 시뮬레이션
  useEffect(() => {
    if (mode === "LOADING") {
      setLoadingTextIndex(0);
      const interval = setInterval(() => {
        setLoadingTextIndex((prev) => {
          if (prev < loadingTexts.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            // 완료 후 리포트 상세로 이동
            const matched = reports.find(r => r.spaceId === chosenSpaceId) || reports[0];
            setActiveReport(matched);
            setMode("REPORT_DETAIL");
            return prev;
          }
        });
      }, 700);

      return () => clearInterval(interval);
    }
  }, [mode, chosenSpaceId]);

  const handleStartReview = () => {
    setMode("LOADING");
  };

  const selectedSpace = spaces.find(s => s.id === chosenSpaceId) || spaces[0];

  const bizTypes = [
    "F&B / 로컬 카페 & 브루펍",
    "수공예 / 도예·목공 공방",
    "아웃도어 기어 & 투어",
    "독립서점 & 문화살롱",
    "청년 코워킹 & 스튜디오",
    "고원 특산물 팝업 레스토랑"
  ];

  const budgets = [
    "1,000만원 이하 (소자본 창업)",
    "1,000만 ~ 3,000만원",
    "3,000만 ~ 5,000만원",
    "5,000만원 이상"
  ];

  // 1. 내가 만든 리포트 목록 화면
  if (mode === "LIST") {
    return (
      <View style={styles.container}>
        <Header title="AI 창업 검토 (판단)" />
        <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
          {/* 배너 */}
          <View style={styles.introBanner}>
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>1. 판단 솔루션</Text>
            </View>
            <Text style={styles.introTitle}>
              계약 전 꼭 따져보세요!{"\n"}AI 창업 검토 리포트
            </Text>
            <Text style={styles.introDesc}>
              수리비 견적, 숨은 비용(배관/전기), 손익분기점까지 청년에게는 판단 기준이, 소유자에게는 믿음직한 증거가 됩니다.
            </Text>

            <TouchableOpacity 
              style={styles.newReviewBtn}
              onPress={() => {
                setCurrentStep(1);
                setMode("INPUT_STEP");
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.newReviewBtnText}>✨ 새 공간 AI 검토 시작하기</Text>
            </TouchableOpacity>
          </View>

          {/* 내가 만든 리포트 목록 */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📋 발행된 AI 검토 리포트 ({reports.length})</Text>
          </View>

          {reports.map((rep) => {
            const spaceItem = spaces.find(s => s.id === rep.spaceId);
            return (
              <TouchableOpacity
                key={rep.id}
                style={styles.savedReportCard}
                onPress={() => {
                  setActiveReport(rep);
                  setMode("REPORT_DETAIL");
                }}
                activeOpacity={0.85}
              >
                <View style={styles.reportThumbWrapper}>
                  <Image 
                    source={{ uri: rep.remodelPreview.beforeImage }} 
                    style={styles.reportThumb} 
                    resizeMode="cover"
                  />
                  <View style={styles.scoreBadgeMini}>
                    <Text style={styles.scoreBadgeText}>{rep.overallScore}점</Text>
                  </View>
                </View>

                <View style={styles.reportCardInfo}>
                  <View style={styles.reportMetaRow}>
                    <RiskBadge level={rep.riskLevel} size="sm" />
                    <Text style={styles.reportDateText}>{rep.createdAt}</Text>
                  </View>
                  <Text style={styles.reportCardTitle} numberOfLines={1}>
                    {rep.spaceTitle}
                  </Text>
                  <Text style={styles.reportBizCandidate}>
                    추천: {rep.businessNameCandidate}
                  </Text>
                  <Text style={styles.reportRepairBrief}>
                    예상 수리비: {rep.diagnosis.estimatedRepairCost}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          <View style={{ height: 60 }} />
        </ScrollView>
      </View>
    );
  }

  // 2. 단계형 입력 화면 (1: 공간, 2: 업종, 3: 예산)
  if (mode === "INPUT_STEP") {
    return (
      <View style={styles.container}>
        <Header 
          title="AI 창업 검토 신청" 
          onBack={() => setMode("LIST")} 
        />

        {/* 상단 3단계 진행 바 */}
        <View style={styles.progressBarContainer}>
          <View style={styles.stepIndicatorRow}>
            <Text style={[styles.stepText, currentStep === 1 && styles.stepTextActive]}>
              ① 공간 선택
            </Text>
            <Text style={styles.stepArrow}>→</Text>
            <Text style={[styles.stepText, currentStep === 2 && styles.stepTextActive]}>
              ② 업종 선택
            </Text>
            <Text style={styles.stepArrow}>→</Text>
            <Text style={[styles.stepText, currentStep === 3 && styles.stepTextActive]}>
              ③ 예산 범위
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(currentStep / 3) * 100}%` }]} />
          </View>
        </View>

        <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
          {/* STEP 1: 공간 선택 */}
          {currentStep === 1 && (
            <View style={styles.stepSection}>
              <Text style={styles.stepHeading}>검토할 공간을 선택해 주세요</Text>
              <Text style={styles.stepSub}>태백시 발굴 유휴공간 중 선택하거나 직접 사진을 업로드할 수 있습니다.</Text>

              {/* 직접 사진 업로드 시뮬레이션 */}
              <TouchableOpacity
                style={[styles.uploadBox, customPhotoUploaded && styles.uploadBoxActive]}
                onPress={() => setCustomPhotoUploaded(prev => !prev)}
                activeOpacity={0.8}
              >
                <Text style={styles.uploadIcon}>📷</Text>
                <Text style={styles.uploadTitle}>
                  {customPhotoUploaded ? "✓ 공간 사진 3장 업로드 완료" : "현장 사진 직접 촬영 / 업로드"}
                </Text>
                <Text style={styles.uploadSub}>
                  {customPhotoUploaded ? "터치하면 등록 공간 선택으로 변경" : "발굴 목록에 없는 빈집·유휴공간도 AI가 분석해 드립니다."}
                </Text>
              </TouchableOpacity>

              <Text style={styles.selectListTitle}>또는 태백시 등록 유휴공간 선택:</Text>

              {spaces.map((sp) => {
                const isSelected = sp.id === chosenSpaceId && !customPhotoUploaded;
                return (
                  <TouchableOpacity
                    key={sp.id}
                    style={[styles.spaceChoiceCard, isSelected && styles.spaceChoiceCardSelected]}
                    onPress={() => {
                      setChosenSpaceId(sp.id);
                      setCustomPhotoUploaded(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: sp.images[0] }} style={styles.spaceChoiceThumb} />
                    <View style={styles.spaceChoiceInfo}>
                      <Text style={styles.spaceChoiceTitle} numberOfLines={1}>{sp.title}</Text>
                      <Text style={styles.spaceChoiceMeta}>
                        {sp.neighborhood} · {sp.areaPyeong}평 · {sp.rentTypeLabel} {sp.rentType === "FREE_NEGOTIATION" ? "무상" : `${sp.monthlyRent}만`}
                      </Text>
                      <Text style={styles.spaceChoiceGrade}>상태 {sp.conditionGrade}급 ({sp.conditionLabel})</Text>
                    </View>
                    <View style={[styles.checkCircle, isSelected && styles.checkCircleSelected]}>
                      {isSelected && <Text style={styles.checkText}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* STEP 2: 업종 선택 */}
          {currentStep === 2 && (
            <View style={styles.stepSection}>
              <Text style={styles.stepHeading}>어떤 업종으로 창업하시나요?</Text>
              <Text style={styles.stepSub}>
                선택하신 업종과 공간 조건, 태백 지역 상권의 궁합을 분석합니다.
              </Text>

              <View style={styles.bizGrid}>
                {bizTypes.map((biz) => {
                  const isSelected = chosenBizType === biz;
                  return (
                    <TouchableOpacity
                      key={biz}
                      style={[styles.bizChoiceCard, isSelected && styles.bizChoiceCardSelected]}
                      onPress={() => setChosenBizType(biz)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.bizRadio, isSelected && styles.bizRadioSelected]}>
                        {isSelected && <View style={styles.bizRadioDot} />}
                      </View>
                      <Text style={[styles.bizText, isSelected && styles.bizTextSelected]}>
                        {biz}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 3: 예산 범위 */}
          {currentStep === 3 && (
            <View style={styles.stepSection}>
              <Text style={styles.stepHeading}>예상 준비 자금은 얼마인가요?</Text>
              <Text style={styles.stepSub}>
                보증금, 인테리어 수리비, 초기 운영자금을 포함한 가용 예산입니다.
              </Text>

              <View style={styles.budgetList}>
                {budgets.map((bg) => {
                  const isSelected = chosenBudget === bg;
                  return (
                    <TouchableOpacity
                      key={bg}
                      style={[styles.budgetCard, isSelected && styles.budgetCardSelected]}
                      onPress={() => setChosenBudget(bg)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.budgetText, isSelected && styles.budgetTextSelected]}>
                        {bg}
                      </Text>
                      <View style={[styles.checkCircle, isSelected && styles.checkCircleSelected]}>
                        {isSelected && <Text style={styles.checkText}>✓</Text>}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <HighlightBox
                title="태백시 지원사업 활용 팁"
                icon={<Text>💡</Text>}
                style={{ marginTop: 14 }}
              >
                공간 수리비의 최대 70~100%(최대 4,500만원)는 태백시 청년창창센터 공간개선 지원금으로 연계 신청할 수 있습니다.
              </HighlightBox>
            </View>
          )}

          <View style={{ height: 90 }} />
        </ScrollView>

        {/* 하단 단계 이동 CTA */}
        <View style={styles.stepBottomBar}>
          {currentStep > 1 ? (
            <TouchableOpacity
              style={styles.stepPrevBtn}
              onPress={() => setCurrentStep(prev => prev - 1)}
            >
              <Text style={styles.stepPrevBtnText}>◀ 이전</Text>
            </TouchableOpacity>
          ) : <View style={{ width: 60 }} />}

          <TouchableOpacity
            style={styles.stepNextBtn}
            onPress={() => {
              if (currentStep < 3) {
                setCurrentStep(prev => prev + 1);
              } else {
                handleStartReview();
              }
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.stepNextBtnText}>
              {currentStep < 3 ? "다음 단계 →" : "⚡ AI 검토 시작하기"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 3. 로딩 애니메이션 화면
  if (mode === "LOADING") {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingIconCircle}>
          <Text style={styles.loadingIcon}>✨</Text>
        </View>
        <Text style={styles.loadingTitle}>AI가 빈 공간을 정밀 진단 중입니다</Text>
        <View style={styles.loadingListBox}>
          {loadingTexts.map((txt, idx) => {
            const isDone = idx < loadingTextIndex;
            const isCurrent = idx === loadingTextIndex;
            return (
              <View key={idx} style={styles.loadingTextRow}>
                <Text style={styles.loadingStatusIcon}>
                  {isDone ? "✅" : isCurrent ? "⏳" : "⚪"}
                </Text>
                <Text style={[
                  styles.loadingStatusText,
                  isCurrent && styles.loadingStatusTextCurrent,
                  isDone && styles.loadingStatusTextDone,
                ]}>
                  {txt}
                </Text>
              </View>
            );
          })}
        </View>
        <Text style={styles.loadingNotice}>
          태백시 건축물 대장, 주변 유동인구 빅데이터, 상권 데이터를 종합하고 있습니다.
        </Text>
      </View>
    );
  }

  // 4. 결과: "AI 창업 검토 리포트" 풀버전 화면
  return (
    <View style={styles.container}>
      <Header 
        title="AI 창업 검토 리포트" 
        onBack={() => setMode("LIST")} 
      />

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* 상단 요약 카드 (종합 판단 + 위험도 신호등) */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryDate}>2026.11 태백 청년 맞춤 분석</Text>
              <Text style={styles.summaryTitle}>{activeReport.spaceTitle}</Text>
              <Text style={styles.summaryBiz}>목표 업종: {activeReport.businessNameCandidate}</Text>
            </View>
            <View style={styles.scoreBubble}>
              <Text style={styles.scoreNum}>{activeReport.overallScore}</Text>
              <Text style={styles.scoreLabel}>종합 점수</Text>
            </View>
          </View>

          <View style={styles.verdictContainer}>
            <RiskBadge level={activeReport.riskLevel} size="md" />
            <Text style={styles.verdictMainText}>{activeReport.overallVerdict}</Text>
          </View>
        </View>

        {/* (1) 공간 진단 */}
        <View style={styles.reportSection}>
          <Text style={styles.sectionHeaderTitle}>🛠️ 1. 공간 상태 및 수리비 진단</Text>
          
          <View style={styles.diagnosisBox}>
            <View style={styles.diagRow}>
              <Text style={styles.diagLabel}>노후도 상태</Text>
              <Text style={styles.diagValue}>{activeReport.diagnosis.agingStatus}</Text>
            </View>
            <View style={styles.diagRow}>
              <Text style={styles.diagLabel}>필요 수리 범위</Text>
              <Text style={styles.diagValue}>{activeReport.diagnosis.repairScope}</Text>
            </View>
            <View style={styles.diagRowHighlight}>
              <Text style={styles.diagLabelHighlight}>예상 수리비</Text>
              <Text style={styles.diagValueHighlight}>{activeReport.diagnosis.estimatedRepairCost}</Text>
            </View>
          </View>

          {/* 숨은 비용 체크리스트 */}
          <Text style={styles.subHeaderTitle}>⚠️ 숨은 비용 체크리스트 (계약 전 필수 확인)</Text>
          {activeReport.diagnosis.hiddenCosts.map((hc, idx) => (
            <View key={idx} style={styles.hiddenCostItem}>
              <View style={styles.hiddenCostTop}>
                <Text style={styles.hiddenCostName}>• {hc.item}</Text>
                <RiskBadge 
                  level={hc.risk === "HIGH" ? "DANGER" : hc.risk === "MEDIUM" ? "CAUTION" : "SAFE"} 
                  size="sm" 
                />
              </View>
              <Text style={styles.hiddenCostDesc}>{hc.description}</Text>
            </View>
          ))}
        </View>

        {/* (2) 버틸 수 있을까? 상권 & 손익분기 분석 */}
        <View style={styles.reportSection}>
          <Text style={styles.sectionHeaderTitle}>📊 2. 버틸 수 있을까? 상권 & 손익 분석</Text>
          
          <View style={styles.metricGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricVal}>{activeReport.feasibility.monthlyFootTraffic}</Text>
              <Text style={styles.metricLab}>월 유동인구</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={[styles.metricVal, { color: COLORS.primary }]}>
                {activeReport.feasibility.estimatedMonthlyRevenue}
              </Text>
              <Text style={styles.metricLab}>예상 월매출</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricVal}>{activeReport.feasibility.breakEvenMonths}개월</Text>
              <Text style={styles.metricLab}>손익분기(BEP)</Text>
            </View>
          </View>

          {/* 손익분기 타임라인 바 */}
          <View style={styles.bepBarBox}>
            <Text style={styles.bepTitle}>손익분기점 도달 시뮬레이션</Text>
            <View style={styles.bepTrack}>
              <View style={[styles.bepFill, { width: `${Math.min(100, activeReport.feasibility.breakEvenMonths * 8)}%` }]}>
                <Text style={styles.bepFillText}>{activeReport.feasibility.breakEvenMonths}개월차 흑자 전환</Text>
              </View>
            </View>
            <View style={styles.bepLabelRow}>
              <Text style={styles.bepSubText}>오픈(0개월)</Text>
              <Text style={styles.bepSubText}>12개월</Text>
            </View>
          </View>

          {activeReport.feasibility.warningMessage && (
            <View style={styles.warningBox}>
              <Text style={styles.warningBoxText}>
                ⚠️ <Text style={{ fontWeight: "700" }}>주의 권고:</Text> {activeReport.feasibility.warningMessage}
              </Text>
            </View>
          )}
        </View>

        {/* (3) 태백 자원 연계 겹치지 않는 업종 추천 3개 */}
        <View style={styles.reportSection}>
          <Text style={styles.sectionHeaderTitle}>💡 3. 태백 자원 연계 추천 업종 3선</Text>
          
          {activeReport.recommendations.map((rec, idx) => (
            <View key={idx} style={styles.recCard}>
              <View style={styles.recCardTop}>
                <View style={styles.recRankBadge}>
                  <Text style={styles.recRankText}>추천 {idx + 1}</Text>
                </View>
                <Text style={styles.recTitle}>{rec.title}</Text>
                <Text style={styles.recScore}>{rec.matchScore}점</Text>
              </View>
              <Text style={styles.recResource}>🔗 융합 자원: {rec.taebaekResource}</Text>
              <Text style={styles.recReason}>✓ {rec.reason}</Text>
            </View>
          ))}
        </View>

        {/* (4) 리모델링 미리보기: 전/후 비교 슬라이더 */}
        <View style={styles.reportSection}>
          <Text style={styles.sectionHeaderTitle}>🎨 4. 리모델링 예상 시뮬레이션</Text>
          <BeforeAfterSlider
            beforeImage={activeReport.remodelPreview.beforeImage}
            afterImage={activeReport.remodelPreview.afterImage}
            concept={activeReport.remodelPreview.concept}
          />
        </View>

        {/* 하단 연결 액션 버튼들 */}
        <View style={styles.actionButtonGroup}>
          <TouchableOpacity 
            style={styles.connectSupportBtn}
            onPress={() => setActiveTab("MY_STARTUP")}
            activeOpacity={0.8}
          >
            <Text style={styles.connectSupportText}>📑 이 리포트로 태백시 지원사업 찾기 →</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.consultBtn}
            onPress={() => startChatForSpace(activeReport.spaceId)}
            activeOpacity={0.8}
          >
            <Text style={styles.consultText}>🏛️ 청년창창센터에 사전 상담 요청</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* 하단 고정 CTA 바 */}
      <View style={styles.fixedBottomBar}>
        <TouchableOpacity 
          style={styles.fixedShareBtn}
          onPress={() => Alert.alert("공유하기", "AI 검토 리포트 링크가 복사되었습니다.")}
        >
          <Text style={styles.fixedShareIcon}>📤</Text>
          <Text style={styles.fixedShareText}>공유</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.fixedPdfBtn}
          onPress={() => Alert.alert("PDF 다운로드", "소유자 제출용 검토 리포트 PDF가 저장되었습니다.")}
        >
          <Text style={styles.fixedPdfIcon}>💾</Text>
          <Text style={styles.fixedPdfText}>PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.fixedCtaMain}
          onPress={() => startChatForSpace(activeReport.spaceId)}
          activeOpacity={0.85}
        >
          <Text style={styles.fixedCtaMainText}>🤝 소유자에게 협의 요청하기</Text>
        </TouchableOpacity>
      </View>
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
  introBanner: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  bannerBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  bannerBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.textPrimary,
    lineHeight: 26,
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  introDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginBottom: 16,
  },
  newReviewBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  newReviewBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  savedReportCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  reportThumbWrapper: {
    width: 90,
    height: 85,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    marginRight: 12,
  },
  reportThumb: {
    width: "100%",
    height: "100%",
  },
  scoreBadgeMini: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: COLORS.primary,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  scoreBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  reportCardInfo: {
    flex: 1,
  },
  reportMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  reportDateText: {
    fontSize: 11,
    color: COLORS.textTertiary,
  },
  reportCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  reportBizCandidate: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: 2,
  },
  reportRepairBrief: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  progressBarContainer: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  stepIndicatorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  stepText: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: "600",
  },
  stepTextActive: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  stepArrow: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  progressTrack: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },
  stepSection: {
    paddingVertical: 10,
  },
  stepHeading: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  stepSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 17,
  },
  uploadBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  uploadBoxActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    borderStyle: "solid",
  },
  uploadIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  uploadSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  selectListTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  spaceChoiceCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  spaceChoiceCardSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: COLORS.primaryLight,
  },
  spaceChoiceThumb: {
    width: 65,
    height: 65,
    borderRadius: 8,
    marginRight: 10,
  },
  spaceChoiceInfo: {
    flex: 1,
  },
  spaceChoiceTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  spaceChoiceMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  spaceChoiceGrade: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: "700",
    marginTop: 2,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircleSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  bizGrid: {
    gap: 10,
  },
  bizChoiceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  bizChoiceCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  bizRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  bizRadioSelected: {
    borderColor: COLORS.primary,
  },
  bizRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  bizText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  bizTextSelected: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  budgetList: {
    gap: 10,
  },
  budgetCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  budgetCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  budgetText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  budgetTextSelected: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  stepBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  stepPrevBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  stepPrevBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  stepNextBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  stepNextBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  loadingIcon: {
    fontSize: 36,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 24,
    textAlign: "center",
  },
  loadingListBox: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
  },
  loadingTextRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  loadingStatusIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  loadingStatusText: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  loadingStatusTextCurrent: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  loadingStatusTextDone: {
    color: COLORS.textSecondary,
  },
  loadingNotice: {
    fontSize: 11,
    color: COLORS.textTertiary,
    textAlign: "center",
    lineHeight: 16,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  summaryDate: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginBottom: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    maxWidth: 220,
    marginBottom: 4,
  },
  summaryBiz: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "700",
  },
  scoreBubble: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreNum: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.primary,
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: -2,
  },
  verdictContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 10,
    marginTop: 6,
  },
  verdictMainText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 6,
    lineHeight: 17,
  },
  reportSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  subHeaderTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 14,
    marginBottom: 8,
  },
  diagnosisBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
  },
  diagRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F6",
  },
  diagLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  diagValue: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
    maxWidth: "60%",
    textAlign: "right",
  },
  diagRowHighlight: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
  },
  diagLabelHighlight: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
  },
  diagValueHighlight: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.primary,
  },
  hiddenCostItem: {
    backgroundColor: "#FFFBEB",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  hiddenCostTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  hiddenCostName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400E",
  },
  hiddenCostDesc: {
    fontSize: 11,
    color: "#78350F",
    lineHeight: 16,
  },
  metricGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 3,
  },
  metricVal: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  metricLab: {
    fontSize: 10,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  bepBarBox: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  bepTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  bepTrack: {
    height: 18,
    backgroundColor: "#CBD5E1",
    borderRadius: 9,
    overflow: "hidden",
  },
  bepFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  bepFillText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
  bepLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  bepSubText: {
    fontSize: 10,
    color: COLORS.textTertiary,
  },
  warningBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginTop: 6,
  },
  warningBoxText: {
    fontSize: 11,
    color: "#991B1B",
    lineHeight: 16,
  },
  recCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  recCardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  recRankBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginRight: 6,
  },
  recRankText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.primary,
  },
  recTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
    flex: 1,
  },
  recScore: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.primary,
  },
  recResource: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  recReason: {
    fontSize: 11,
    color: "#475569",
    lineHeight: 16,
  },
  actionButtonGroup: {
    gap: 8,
    marginVertical: 10,
  },
  connectSupportBtn: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D6DCFF",
  },
  connectSupportText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  consultBtn: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  consultText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "700",
  },
  fixedBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 74,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 14 : 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  fixedShareBtn: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  fixedShareIcon: {
    fontSize: 18,
  },
  fixedShareText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  fixedPdfBtn: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  fixedPdfIcon: {
    fontSize: 18,
  },
  fixedPdfText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  fixedCtaMain: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  fixedCtaMainText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
