import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  TextInput, 
  Platform,
  Animated,
  Dimensions
} from "react-native";
import { 
  Camera, 
  ScanLine, 
  Phone, 
  MapPin, 
  Building2, 
  Check, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  UploadCloud, 
  RefreshCw, 
  FileSearch,
  Sparkles,
  Maximize2
} from "lucide-react-native";
import { COLORS, METRICS, TYPOGRAPHY } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import { Space, SpaceCondition, SpaceType } from "../../types";
import { recognizeText, extractInfo, extractNeighborhood, countMeaningfulChars } from "../../utils/ocr";

// 태백 현장 실제 유휴공간 샘플 3종 (임대 현수막 / 전단지 포함)
const SAMPLE_PHOTOS = [
  {
    id: "sample-cheoram",
    label: "철암동 적벽돌 상가",
    tag: "현수막 부착",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    phone: "010-0000-0001",
    address: "강원특별자치도 태백시 철암동 동태백로 412",
    dong: "철암동",
    type: "VACANT_STORE" as SpaceType,
    typeLabel: "빈 상가",
    areaPyeong: 26,
    condition: "MINOR_REPAIR" as SpaceCondition,
    conditionLabel: "일부 수리 필요",
    conditionGrade: "B" as const,
    recommendedUses: ["로컬 브루펍 & 펍", "여행자 카페"],
    ocrSnippet: "임대 문의 010-0000-0001 (보증금/월세 협의)",
    bbox: { top: "34%", left: "22%", width: "56%", height: "18%" }
  },
  {
    id: "sample-hwangji",
    label: "황지동 단독 구옥",
    tag: "문패 전단지 부착",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
    phone: "010-0000-0002",
    address: "강원특별자치도 태백시 황지동 황지로 78",
    dong: "황지동",
    type: "VACANT_HOUSE" as SpaceType,
    typeLabel: "빈집 (단독)",
    areaPyeong: 31,
    condition: "MAJOR_REPAIR" as SpaceCondition,
    conditionLabel: "대규모 수리 필요",
    conditionGrade: "C" as const,
    recommendedUses: ["도예·목공 공방", "청년 게스트하우스"],
    ocrSnippet: "빈집 임대 010-0000-0002 (착한 임대 협의)",
    bbox: { top: "42%", left: "18%", width: "62%", height: "20%" }
  },
  {
    id: "sample-jangseong",
    label: "장성동 광산 사택거리 상가",
    tag: "유리창 안내문 부착",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80",
    phone: "010-0000-0003",
    address: "강원특별자치도 태백시 장성동 장성로 15",
    dong: "장성동",
    type: "VACANT_STORE" as SpaceType,
    typeLabel: "빈 상가",
    areaPyeong: 22,
    condition: "READY" as SpaceCondition,
    conditionLabel: "바로 사용 가능",
    conditionGrade: "A" as const,
    recommendedUses: ["독립서점 & 문화살롱", "로컬 편집숍"],
    ocrSnippet: "임대 안내: 010-0000-0003 (청년 창업 환영)",
    bbox: { top: "28%", left: "25%", width: "50%", height: "22%" }
  }
];

const TYPE_OPTIONS: { value: SpaceType; label: string }[] = [
  { value: "VACANT_STORE", label: "빈 상가" },
  { value: "VACANT_HOUSE", label: "빈집" },
  { value: "WAREHOUSE_FACTORY", label: "창고·공장" },
  { value: "CLOSED_SCHOOL", label: "폐교·공공시설" },
];

const CONDITION_OPTIONS: { value: SpaceCondition; label: string; grade: "A" | "B" | "C" }[] = [
  { value: "READY", label: "바로 사용 가능", grade: "A" },
  { value: "MINOR_REPAIR", label: "일부 수리 필요", grade: "B" },
  { value: "MAJOR_REPAIR", label: "대규모 수리 필요", grade: "C" },
];

type ScannerStage = "CAPTURE" | "ANALYZING" | "REVIEW" | "DONE";

export const SpaceCameraModal: React.FC = () => {
  const { 
    isCameraModalOpen, 
    setIsCameraModalOpen, 
    addNewSpace, 
    setSelectedSpaceId, 
    setActiveTab 
  } = useApp();

  const [stage, setStage] = useState<ScannerStage>("CAPTURE");
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string>(SAMPLE_PHOTOS[0].image);

  // AI 분석 애니메이션 상태
  const [analysisStep, setAnalysisStep] = useState(0);
  const scanAnim = useRef(new Animated.Value(0)).current;

  // 직접 올린 사진 여부 (false = 샘플 3종, 기존 하드코딩 결과 사용)
  const [isUploaded, setIsUploaded] = useState(false);

  // OCR 상태
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrPhase, setOcrPhase] = useState<"PREP" | "LOADING" | "READING" | "PARSING">("PREP");
  const [ocrError, setOcrError] = useState("");
  const [ocrText, setOcrText] = useState("");
  const [foundKeywords, setFoundKeywords] = useState<string[]>([]);
  const [notFound, setNotFound] = useState({ phone: false, deposit: false, monthly: false, pyeong: false });

  // 폼 입력 상태
  const currentSample = SAMPLE_PHOTOS[selectedSampleIndex];
  const [formTitle, setFormTitle] = useState(`${currentSample.dong} ${currentSample.label} (현장 발굴)`);
  const [formPhone, setFormPhone] = useState(currentSample.phone);
  const [formAddress, setFormAddress] = useState(currentSample.address);
  const [formNeighborhood, setFormNeighborhood] = useState(currentSample.dong);
  const [formAreaPyeong, setFormAreaPyeong] = useState(currentSample.areaPyeong.toString());
  const [formRentType, setFormRentType] = useState<"FREE" | "MONTHLY">("FREE");
  const [formDeposit, setFormDeposit] = useState("300");
  const [formMonthly, setFormMonthly] = useState("0");
  const [formType, setFormType] = useState<SpaceType>("VACANT_STORE");
  const [formCondition, setFormCondition] = useState<SpaceCondition>("MINOR_REPAIR");
  const [newlyCreatedSpace, setNewlyCreatedSpace] = useState<Space | null>(null);

  const lowText = isUploaded && countMeaningfulChars(ocrText) < 5;

  // 스캔 레이저 빔 애니메이션 + (샘플 전용) 분석 단계 타이머
  useEffect(() => {
    if (stage !== "ANALYZING") return;

    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();

    if (isUploaded) return () => scanAnim.stopAnimation();

    setAnalysisStep(0);
    const timers = [
      setTimeout(() => setAnalysisStep(1), 600),
      setTimeout(() => setAnalysisStep(2), 1200),
      setTimeout(() => setAnalysisStep(3), 1900),
      setTimeout(() => {
        setAnalysisStep(4);
        setStage("REVIEW");
      }, 2600),
    ];
    return () => {
      timers.forEach(clearTimeout);
      scanAnim.stopAnimation();
    };
  }, [stage]);

  // 샘플 변경 시 폼 필드 동기화
  const handleSelectSample = (idx: number) => {
    setSelectedSampleIndex(idx);
    setIsUploaded(false);
    const s = SAMPLE_PHOTOS[idx];
    setCapturedImage(s.image);
    setFormTitle(`${s.dong} ${s.label} (현장 발굴)`);
    setFormPhone(s.phone);
    setFormAddress(s.address);
    setFormNeighborhood(s.dong);
    setFormAreaPyeong(s.areaPyeong.toString());
    setFormDeposit("300");
    setFormMonthly("0");
    setFormRentType("FREE");
  };

  // 웹 브라우저 파일 업로드 핸들러
  const handleWebCameraClick = () => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.setAttribute("capture", "environment");
      input.onchange = (e: any) => {
        const file = e.target?.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event: any) => {
            setCapturedImage(event.target.result);
            setIsUploaded(true);
            // 사진에서 읽기 전까지는 모두 빈 값
            setFormTitle("직접 촬영한 태백 유휴공간");
            setFormPhone("");
            setFormAddress("");
            setFormNeighborhood("");
            setFormAreaPyeong("");
            setFormDeposit("");
            setFormMonthly("");
            setFormRentType("FREE");
            setOcrText("");
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  };

  // OCR 결과 텍스트에서 폼 값 채우기
  const applyExtraction = (text: string) => {
    const info = extractInfo(text);
    setFoundKeywords(info.keywords);
    setFormPhone(info.phone);
    setFormDeposit(info.deposit);
    setFormMonthly(info.monthly);
    setFormAreaPyeong(info.pyeong);
    if (info.monthly) setFormRentType("MONTHLY");
    setNotFound({ phone: !info.phone, deposit: !info.deposit, monthly: !info.monthly, pyeong: !info.pyeong });
  };

  const runOcr = async () => {
    setStage("ANALYZING");
    setOcrError("");
    setOcrPhase("PREP");
    setOcrProgress(0);
    setAnalysisStep(0);
    try {
      const text = await recognizeText(capturedImage, ({ status, progress }) => {
        if (status.includes("recognizing")) {
          setOcrPhase("READING");
          setOcrProgress(progress);
          setAnalysisStep(2);
        } else {
          setOcrPhase("LOADING");
          setAnalysisStep(1);
        }
      });
      setOcrPhase("PARSING");
      setAnalysisStep(3);
      setOcrText(text.trim());
      applyExtraction(text);
      setAnalysisStep(4);
      setStage("REVIEW");
    } catch (err: any) {
      setOcrError(err?.message || "글자를 읽는 중 문제가 생겼어요.");
    }
  };

  // 셔터 누름
  const handleShutter = () => {
    if (isUploaded) {
      runOcr();
    } else {
      setStage("ANALYZING");
    }
  };

  // 앱에 등록 완료
  const handleUploadToApp = () => {
    const spaceId = `scouted-${Date.now()}`;
    const pyeong = Number(formAreaPyeong) || 0;
    const src = isUploaded
      ? {
          type: formType,
          typeLabel: TYPE_OPTIONS.find((t) => t.value === formType)!.label,
          condition: formCondition,
          conditionLabel: CONDITION_OPTIONS.find((c) => c.value === formCondition)!.label,
          conditionGrade: CONDITION_OPTIONS.find((c) => c.value === formCondition)!.grade,
          recommendedUses: [] as string[],
        }
      : currentSample;
    const neighborhood = formNeighborhood || extractNeighborhood(formAddress) || "태백시";

    const newSpace: Space = {
      id: spaceId,
      title: formTitle,
      type: src.type,
      typeLabel: src.typeLabel,
      neighborhood,
      address: formAddress,
      areaM2: Math.round(pyeong * 3.3),
      areaPyeong: pyeong,
      rentType: formRentType === "FREE" ? "FREE_NEGOTIATION" : "MONTHLY",
      rentTypeLabel: formRentType === "FREE" ? "무상임대 협의" : "월세",
      deposit: Number(formDeposit) || 0,
      monthlyRent: formRentType === "FREE" ? 0 : (Number(formMonthly) || 0),
      condition: src.condition,
      conditionLabel: src.conditionLabel,
      conditionGrade: src.conditionGrade,
      images: [capturedImage],
      tags: isUploaded ? ["현장 발굴", "사진 글자 인식", neighborhood, ...foundKeywords] : ["현장 발굴", "AI 사진 등록", neighborhood],
      canAiReview: true,
      canOwnerDiscuss: true,
      coordinates: { lat: 37.115, lng: 129.025 },
      nearbyAmenities: isUploaded ? [] : [{ name: "철암역", distance: "도보 6분" }],
      ownerName: "현장 식별 소유자",
      ownerPhoneMasked: (formPhone || "연락처 미입력").replace(/(\d{3})-(\d{4})-(\d{4})/, "$1-****-$3"),
      description: isUploaded
        ? `현장 사진 속 글자를 읽어 등록된 유휴공간입니다. 안내문 연락처: ${formPhone || "미입력"}`
        : `현장 사진 촬영 및 AI 분석으로 등록된 유휴공간입니다. 현수막 식별 연락처: ${formPhone}`,
      recommendedUses: src.recommendedUses,
      estimatedRepairCost: isUploaded ? "현장 확인 필요" : "약 1,200만원"
    };

    addNewSpace(newSpace);
    setNewlyCreatedSpace(newSpace);
    setStage("DONE");
  };

  const handleClose = () => {
    setIsCameraModalOpen(false);
    setTimeout(() => {
      setStage("CAPTURE");
      setNewlyCreatedSpace(null);
    }, 300);
  };

  const handleGoToExplore = () => {
    if (newlyCreatedSpace) {
      setSelectedSpaceId(newlyCreatedSpace.id);
    }
    handleClose();
    setActiveTab("EXPLORE");
  };

  const handleGoToReview = () => {
    if (newlyCreatedSpace) {
      setSelectedSpaceId(newlyCreatedSpace.id);
    }
    handleClose();
    setActiveTab("AI_REVIEW");
  };

  if (!isCameraModalOpen) return null;

  return (
    <Modal
      visible={isCameraModalOpen}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* 상단 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconBadge}>
              <Camera size={16} color={COLORS.surface} strokeWidth={2} />
            </View>
            <View>
              <Text style={styles.headerTitle}>빈자리 현장 촬영 발굴</Text>
              <Text style={styles.headerSub}>사진 촬영 → AI 전화번호·위치 분석 → 앱 업로드</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <X size={20} color={COLORS.textPrimary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* 1단계: 촬영 및 사진 선택 (CAPTURE) */}
        {stage === "CAPTURE" && (
          <View style={styles.contentWrap}>
            {/* 뷰파인더 카메라 화면 */}
            <View style={styles.viewfinderBox}>
              <Image source={{ uri: capturedImage }} style={styles.viewfinderImage} resizeMode="cover" />

              {/* 뷰파인더 격자 및 가이드 */}
              <View style={styles.viewfinderOverlay}>
                <View style={[styles.cornerGuide, styles.cornerTL]} />
                <View style={[styles.cornerGuide, styles.cornerTR]} />
                <View style={[styles.cornerGuide, styles.cornerBL]} />
                <View style={[styles.cornerGuide, styles.cornerBR]} />

                {/* 중앙 포커스 프레임 */}
                <View style={styles.focusFrame}>
                  <Text style={styles.focusText}>임대 현수막 / 건물 전면 정렬</Text>
                </View>

                {/* 하단 라이브 정보 태그 */}
                <View style={styles.liveTagRow}>
                  <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveBadgeText}>AI 뷰파인더 작동 중</Text>
                  </View>
                  <Text style={styles.liveGpsText}>강원도 태백시 GPS 연동</Text>
                </View>
              </View>
            </View>

            {/* 샘플 사진 선택 탭 */}
            <View style={styles.sampleSelectorSection}>
              <Text style={styles.sampleSelectorTitle}>태백 현장 샘플 건물 선택 (또는 직접 촬영):</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sampleScroll}>
                {SAMPLE_PHOTOS.map((sample, idx) => {
                  const isSel = !isUploaded && selectedSampleIndex === idx;
                  return (
                    <TouchableOpacity
                      key={sample.id}
                      style={[styles.sampleCard, isSel && styles.sampleCardActive]}
                      onPress={() => handleSelectSample(idx)}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri: sample.image }} style={styles.sampleThumb} />
                      <View style={styles.sampleCardContent}>
                        <Text style={[styles.sampleLabel, isSel && styles.sampleLabelActive]} numberOfLines={1}>
                          {sample.label}
                        </Text>
                        <Text style={styles.sampleTag}>{sample.tag}</Text>
                        <Text style={styles.samplePhone}>{sample.phone}</Text>
                        <Text style={styles.sampleExampleTag}>예시 데이터</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* 웹 카메라 / 파일 업로드 인풋 & 셔터 버튼 영역 */}
            <View style={styles.shutterBar}>
              {Platform.OS === "web" && (
                <TouchableOpacity 
                  style={styles.uploadFileLabel}
                  onPress={handleWebCameraClick}
                  activeOpacity={0.8}
                >
                  <UploadCloud size={18} color={COLORS.primary} strokeWidth={1.75} style={{ marginRight: 6 }} />
                  <Text style={styles.uploadFileText}>내 폰 카메라로 촬영</Text>
                </TouchableOpacity>
              )}

              {/* 셔터 트리거 */}
              <TouchableOpacity
                style={styles.shutterBtn}
                onPress={handleShutter}
                activeOpacity={0.85}
              >
                <View style={styles.shutterInnerCircle}>
                  <ScanLine size={24} color="#FFFFFF" strokeWidth={2} />
                </View>
                <Text style={styles.shutterBtnText}>사진 분석 및 스캔</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 2단계: AI 시각 분석 중 (ANALYZING) */}
        {stage === "ANALYZING" && (
          <View style={styles.analyzingContainer}>
            <View style={styles.scanImageBox}>
              <Image source={{ uri: capturedImage }} style={styles.scanImage} resizeMode="cover" />

              {/* 스캔 레이저 빔 애니메이션 */}
              <Animated.View
                style={[
                  styles.scannerLaser,
                  {
                    transform: [
                      {
                        translateY: scanAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 240],
                        }),
                      },
                    ],
                  },
                ]}
              />

              {/* OCR 인식 바운딩 박스 오버레이 */}
              {!isUploaded && analysisStep >= 1 && (
                <View style={[styles.ocrBoundingBox, currentSample.bbox as any]}>
                  <View style={styles.ocrTagBadge}>
                    <Phone size={10} color="#FFFFFF" strokeWidth={2} style={{ marginRight: 3 }} />
                    <Text style={styles.ocrTagText}>연락처 인식: {currentSample.phone}</Text>
                  </View>
                </View>
              )}

              {!isUploaded && analysisStep >= 2 && (
                <View style={styles.addressBoundingBox}>
                  <View style={styles.addressTagBadge}>
                    <MapPin size={10} color="#FFFFFF" strokeWidth={2} style={{ marginRight: 3 }} />
                    <Text style={styles.addressTagText}>{currentSample.dong} 도로명 매칭</Text>
                  </View>
                </View>
              )}
            </View>

            {/* 분석 진행 체크리스트 */}
            <View style={styles.analysisListBox}>
              <Text style={styles.analysisListTitle}>
                {isUploaded ? "사진 속 글자를 읽는 중이에요" : "AI 시각 분석 및 OCR 처리 중"}
              </Text>

              {isUploaded && ocrError ? (
                <View>
                  <Text style={styles.ocrErrorText}>{ocrError}</Text>
                  <View style={[styles.actionBtnRow, { marginTop: 12 }]}>
                    <TouchableOpacity style={styles.retakeBtn} onPress={() => setStage("CAPTURE")}>
                      <Text style={styles.retakeBtnText}>돌아가기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.uploadConfirmBtn} onPress={runOcr}>
                      <Text style={styles.uploadConfirmBtnText}>다시 시도</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                [
                  isUploaded
                    ? "사진 크기·흑백·대비 보정"
                    : `건물 외관 구조 및 노후도 식별: ${currentSample.typeLabel}`,
                  isUploaded
                    ? "한글 인식 데이터 불러오기"
                    : `현수막 전화번호 OCR 추출: ${currentSample.phone} (신뢰도 98.4%)`,
                  isUploaded
                    ? `글자 읽는 중${ocrPhase === "READING" ? ` ${Math.round(ocrProgress * 100)}%` : ""}`
                    : `태백시 도로명 주소 매칭: ${currentSample.address}`,
                  isUploaded ? "전화번호·조건 정보 찾기" : "추천 업종 및 수리 범위 산출 완료",
                ].map((label, i) => (
                  <View key={i} style={styles.analysisStepRow}>
                    {analysisStep >= i + 1 ? (
                      <CheckCircle2 size={16} color={COLORS.riskSafe} strokeWidth={2} style={{ marginRight: 8 }} />
                    ) : (
                      <RefreshCw size={16} color={COLORS.accent} strokeWidth={2} style={{ marginRight: 8 }} />
                    )}
                    <Text style={[styles.analysisStepText, analysisStep >= i + 1 && styles.analysisStepTextDone]}>
                      {label}
                    </Text>
                  </View>
                ))
              )}

              {isUploaded && !ocrError && ocrPhase === "LOADING" && (
                <Text style={styles.ocrHintText}>한글 인식 데이터를 불러오는 중이에요 (처음 한 번만)</Text>
              )}
              {isUploaded && !ocrError && ocrPhase === "READING" && (
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${Math.round(ocrProgress * 100)}%` }]} />
                </View>
              )}
            </View>
          </View>
        )}

        {/* 3단계: 추출 정보 확인 및 수정 (REVIEW) */}
        {stage === "REVIEW" && lowText && (
          <ScrollView style={styles.reviewScrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.previewImageCard}>
              <Image source={{ uri: capturedImage }} style={styles.previewThumb} resizeMode="cover" />
            </View>
            <View style={styles.lowTextBox}>
              <Text style={styles.lowTextTitle}>글자를 거의 읽지 못했어요</Text>
              <Text style={styles.lowTextDesc}>안내문이 잘 보이게 정면에서 가까이 다시 찍어 주세요</Text>
            </View>
            <TouchableOpacity style={styles.uploadConfirmBtn} onPress={() => setStage("CAPTURE")} activeOpacity={0.85}>
              <RefreshCw size={16} color="#FFFFFF" strokeWidth={2} style={{ marginRight: 6 }} />
              <Text style={styles.uploadConfirmBtnText}>다시 촬영하기</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {stage === "REVIEW" && !lowText && (
          <ScrollView style={styles.reviewScrollView} showsVerticalScrollIndicator={false}>
            {/* 상단 감지 완료 배너 */}
            <View style={styles.detectedBanner}>
              <View style={styles.detectedBannerIcon}>
                <Check size={18} color="#FFFFFF" strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detectedBannerTitle}>
                  {isUploaded ? "사진 속 글자 읽기 완료" : "AI 공간 정보 추출 완료"}
                </Text>
                <Text style={styles.detectedBannerSub}>
                  {isUploaded
                    ? "읽은 글자에서 찾은 정보를 채웠어요. 확인 후 앱에 등록하세요."
                    : "사진 속 현수막 연락처와 위치 정보가 자동 인식되었습니다. 확인 후 앱에 등록하세요."}
                </Text>
              </View>
            </View>

            {/* 촬영 사진 썸네일 */}
            <View style={styles.previewImageCard}>
              <Image source={{ uri: capturedImage }} style={styles.previewThumb} resizeMode="cover" />
              <View style={styles.previewMetaBadge}>
                <Text style={styles.previewMetaText}>{isUploaded ? "직접 올린 사진" : "예시 데이터"}</Text>
              </View>
            </View>

            {/* 사진에서 읽은 글자 (직접 올린 사진만) */}
            {isUploaded && (
              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>사진에서 읽은 글자</Text>
                <TextInput
                  style={[styles.textInput, styles.ocrTextInput]}
                  value={ocrText}
                  onChangeText={setOcrText}
                  multiline
                />
                {foundKeywords.length > 0 && (
                  <View style={styles.keywordRow}>
                    {foundKeywords.map((k) => (
                      <View key={k} style={styles.keywordChip}>
                        <Text style={styles.keywordChipText}>{k}</Text>
                      </View>
                    ))}
                  </View>
                )}
                <TouchableOpacity
                  style={styles.reExtractBtn}
                  onPress={() => applyExtraction(ocrText)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.reExtractBtnText}>고친 글자로 정보 다시 찾기</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* 폼 필드 1: 공간 명칭 */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>공간 명칭</Text>
              <TextInput
                style={styles.textInput}
                value={formTitle}
                onChangeText={setFormTitle}
              />
            </View>

            {/* 폼 필드 2: 연락처 */}
            <View style={styles.inputGroup}>
              <View style={styles.labelWithBadge}>
                <Text style={styles.fieldLabel}>{isUploaded ? "연락처" : "현수막 인식 연락처"}</Text>
                <View style={styles.aiDetectedBadge}>
                  <Phone size={11} color={COLORS.accent} strokeWidth={2} style={{ marginRight: 4 }} />
                  <Text style={styles.aiDetectedBadgeText}>{isUploaded ? "글자 인식" : "예시 데이터"}</Text>
                </View>
              </View>
              <TextInput
                style={[styles.textInput, styles.highlightInput]}
                value={formPhone}
                onChangeText={setFormPhone}
                placeholder={isUploaded && notFound.phone ? "직접 입력해 주세요" : "전화번호"}
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            {/* 폼 필드 3: 주소 및 위치 */}
            <View style={styles.inputGroup}>
              <View style={styles.labelWithBadge}>
                <Text style={styles.fieldLabel}>위치 및 주소</Text>
                {!isUploaded && (
                  <View style={styles.aiDetectedBadge}>
                    <MapPin size={11} color={COLORS.primary} strokeWidth={2} style={{ marginRight: 4 }} />
                    <Text style={styles.aiDetectedBadgeText}>예시 데이터</Text>
                  </View>
                )}
              </View>
              <TextInput
                style={styles.textInput}
                value={formAddress}
                onChangeText={setFormAddress}
                placeholder={isUploaded ? "직접 입력해 주세요" : undefined}
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>

            {/* 폼 필드 4: 면적 및 상태 */}
            <View style={styles.twoColumnRow}>
              <View style={{ flex: 1, marginRight: isUploaded ? 0 : 8 }}>
                <Text style={styles.fieldLabel}>{isUploaded ? "면적 (평수)" : "추정 면적 (평수)"}</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={formAreaPyeong}
                  onChangeText={setFormAreaPyeong}
                  placeholder={isUploaded && notFound.pyeong ? "직접 입력해 주세요" : undefined}
                  placeholderTextColor={COLORS.textSecondary}
                />
              </View>
              {!isUploaded && (
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.fieldLabel}>상태 진단</Text>
                  <View style={styles.staticFieldBox}>
                    <Text style={styles.staticFieldText}>
                      {currentSample.conditionGrade}급 ({currentSample.conditionLabel})
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* 직접 올린 사진: 공간 유형·상태 등급은 사용자가 직접 선택 */}
            {isUploaded && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.fieldLabel}>공간 유형 (직접 선택)</Text>
                  <View style={styles.chipWrap}>
                    {TYPE_OPTIONS.map((o) => (
                      <TouchableOpacity
                        key={o.value}
                        style={[styles.rentTypeBtn, styles.chipBtn, formType === o.value && styles.rentTypeBtnActive]}
                        onPress={() => setFormType(o.value)}
                      >
                        <Text style={[styles.rentTypeBtnText, formType === o.value && styles.rentTypeBtnTextActive]}>
                          {o.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.fieldLabel}>상태 등급 (직접 선택)</Text>
                  <View style={styles.chipWrap}>
                    {CONDITION_OPTIONS.map((o) => (
                      <TouchableOpacity
                        key={o.value}
                        style={[styles.rentTypeBtn, styles.chipBtn, formCondition === o.value && styles.rentTypeBtnActive]}
                        onPress={() => setFormCondition(o.value)}
                      >
                        <Text style={[styles.rentTypeBtnText, formCondition === o.value && styles.rentTypeBtnTextActive]}>
                          {o.grade}급 · {o.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            )}

            {/* 폼 필드 5: 임대 조건 선택 */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>예상 임대 조건</Text>
              <View style={styles.rentTypeChoiceRow}>
                <TouchableOpacity
                  style={[styles.rentTypeBtn, formRentType === "FREE" && styles.rentTypeBtnActive]}
                  onPress={() => setFormRentType("FREE")}
                >
                  <Text style={[styles.rentTypeBtnText, formRentType === "FREE" && styles.rentTypeBtnTextActive]}>
                    무상임대 협의 대상
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.rentTypeBtn, formRentType === "MONTHLY" && styles.rentTypeBtnActive]}
                  onPress={() => setFormRentType("MONTHLY")}
                >
                  <Text style={[styles.rentTypeBtnText, formRentType === "MONTHLY" && styles.rentTypeBtnTextActive]}>
                    일반 월세
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 보증금 / 월세 (만원) */}
            <View style={styles.twoColumnRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.fieldLabel}>보증금 (만원)</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={formDeposit}
                  onChangeText={setFormDeposit}
                  placeholder={isUploaded && notFound.deposit ? "직접 입력해 주세요" : undefined}
                  placeholderTextColor={COLORS.textSecondary}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.fieldLabel}>월세 (만원)</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={formMonthly}
                  onChangeText={setFormMonthly}
                  placeholder={isUploaded && notFound.monthly ? "직접 입력해 주세요" : undefined}
                  placeholderTextColor={COLORS.textSecondary}
                />
              </View>
            </View>

            {/* AI 추천 업종 카드 (샘플 전용) */}
            {!isUploaded && (
              <View style={styles.recUsageBox}>
                <Text style={styles.recUsageTitle}>AI 추천 업종 제안</Text>
                <Text style={styles.recUsageList}>
                  • {currentSample.recommendedUses.join("\n• ")}
                </Text>
              </View>
            )}

            {/* 등록 및 재촬영 버튼 */}
            <View style={styles.actionBtnRow}>
              <TouchableOpacity
                style={styles.retakeBtn}
                onPress={() => setStage("CAPTURE")}
              >
                <RefreshCw size={15} color={COLORS.textSecondary} strokeWidth={1.75} style={{ marginRight: 4 }} />
                <Text style={styles.retakeBtnText}>다시 촬영</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.uploadConfirmBtn}
                onPress={handleUploadToApp}
                activeOpacity={0.85}
              >
                <UploadCloud size={16} color="#FFFFFF" strokeWidth={2} style={{ marginRight: 6 }} />
                <Text style={styles.uploadConfirmBtnText}>빈자리 태백 앱에 등록하기</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.footnote}>
              {isUploaded
                ? "사진 속 글자를 자동으로 읽은 결과예요. 틀린 부분은 고쳐 주세요"
                : "예시 데이터입니다. 실제 사진 분석 결과가 아니에요"}
            </Text>

            <View style={{ height: 40 }} />
          </ScrollView>
        )}

        {/* 4단계: 등록 완료 화면 (DONE) */}
        {stage === "DONE" && newlyCreatedSpace && (
          <View style={styles.doneContainer}>
            <View style={styles.doneIconCircle}>
              <Check size={36} color={COLORS.riskSafe} strokeWidth={2.5} />
            </View>
            <Text style={styles.doneTitle}>공간이 앱에 등록되었습니다</Text>
            <Text style={styles.doneDesc}>
              촬영하신 사진과 AI 추출 정보(전화번호, 주소)가 빈자리 태백 데이터베이스에 즉시 업로드되었습니다.
            </Text>

            {/* 등록된 카드 미리보기 */}
            <View style={styles.donePreviewCard}>
              <Image source={{ uri: newlyCreatedSpace.images[0] }} style={styles.doneThumb} />
              <View style={styles.doneCardInfo}>
                <View style={styles.doneNeighborhoodRow}>
                  <Text style={styles.doneNeighborhood}>{newlyCreatedSpace.neighborhood}</Text>
                  <View style={styles.doneGradeBadge}>
                    <Text style={styles.doneGradeText}>상태 {newlyCreatedSpace.conditionGrade}급</Text>
                  </View>
                </View>
                <Text style={styles.doneSpaceTitle} numberOfLines={1}>{newlyCreatedSpace.title}</Text>
                <Text style={styles.donePhoneText}>연락처: {newlyCreatedSpace.ownerPhoneMasked}</Text>
                <Text style={styles.donePriceText}>
                  {newlyCreatedSpace.rentType === "FREE_NEGOTIATION" ? "무상협의" : `월세 ${newlyCreatedSpace.deposit}/${newlyCreatedSpace.monthlyRent}만`}
                </Text>
              </View>
            </View>

            {/* 다음 액션 버튼들 */}
            <View style={styles.doneBtnGroup}>
              <TouchableOpacity
                style={styles.donePrimaryBtn}
                onPress={handleGoToExplore}
              >
                <MapPin size={16} color="#FFFFFF" strokeWidth={2} style={{ marginRight: 6 }} />
                <Text style={styles.donePrimaryBtnText}>공간 찾기 지도에서 확인하기</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.doneSecondaryBtn}
                onPress={handleGoToReview}
              >
                <FileSearch size={16} color={COLORS.primary} strokeWidth={1.75} style={{ marginRight: 6 }} />
                <Text style={styles.doneSecondaryBtnText}>이 공간 계약 전 진단 리포트 보기</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.doneCloseTextBtn}
                onPress={handleClose}
              >
                <Text style={styles.doneCloseText}>창 닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 56,
    backgroundColor: COLORS.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIconBadge: {
    width: 32,
    height: 32,
    borderRadius: METRICS.borderRadiusSm,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    fontFamily: TYPOGRAPHY.titleFont,
  },
  headerSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
  },
  contentWrap: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  viewfinderBox: {
    width: "100%",
    height: 280,
    backgroundColor: "#1C1C1A",
    borderRadius: METRICS.borderRadiusMd,
    overflow: "hidden",
    position: "relative",
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  viewfinderImage: {
    width: "100%",
    height: "100%",
  },
  viewfinderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    justifyContent: "space-between",
  },
  cornerGuide: {
    position: "absolute",
    width: 24,
    height: 24,
    borderColor: COLORS.accent,
  },
  cornerTL: {
    top: 12,
    left: 12,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    top: 12,
    right: 12,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBL: {
    bottom: 12,
    left: 12,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    bottom: 12,
    right: 12,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  focusFrame: {
    alignSelf: "center",
    marginTop: "20%",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "rgba(42, 42, 40, 0.75)",
    borderRadius: METRICS.borderRadiusSm,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  focusText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  liveTagRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(42, 42, 40, 0.8)",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: METRICS.borderRadiusSm,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
    marginRight: 6,
  },
  liveBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  liveGpsText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 10,
    fontVariant: ["tabular-nums"],
  },
  sampleSelectorSection: {
    marginVertical: 12,
  },
  sampleSelectorTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
    fontFamily: TYPOGRAPHY.titleFont,
  },
  sampleScroll: {
    flexDirection: "row",
  },
  sampleCard: {
    width: 170,
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.borderRadiusSm,
    borderWidth: 1,
    borderColor: COLORS.line,
    marginRight: 10,
    overflow: "hidden",
  },
  sampleCardActive: {
    borderColor: COLORS.accent,
    borderWidth: 2,
  },
  sampleThumb: {
    width: "100%",
    height: 75,
  },
  sampleCardContent: {
    padding: 8,
  },
  sampleLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  sampleLabelActive: {
    color: COLORS.accent,
  },
  sampleTag: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  sampleExampleTag: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  samplePhone: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  shutterBar: {
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: METRICS.borderRadiusMd,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: "center",
  },
  uploadFileLabel: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: METRICS.borderRadiusSm,
    marginBottom: 10,
    cursor: "pointer",
  },
  uploadFileText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  shutterBtn: {
    width: "100%",
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: METRICS.borderRadiusSm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInnerCircle: {
    marginRight: 8,
  },
  shutterBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  analyzingContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  scanImageBox: {
    width: "100%",
    height: 260,
    borderRadius: METRICS.borderRadiusMd,
    overflow: "hidden",
    position: "relative",
    borderWidth: 2,
    borderColor: COLORS.accent,
    marginBottom: 20,
  },
  scanImage: {
    width: "100%",
    height: "100%",
  },
  scannerLaser: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.accent,
  },
  ocrBoundingBox: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "#10B981",
    backgroundColor: "rgba(16, 185, 129, 0.15)",
  },
  ocrTagBadge: {
    position: "absolute",
    top: -22,
    left: 0,
    backgroundColor: "#10B981",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  ocrTagText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  addressBoundingBox: {
    position: "absolute",
    bottom: "20%",
    left: "15%",
    width: "60%",
    height: "14%",
    borderWidth: 2,
    borderColor: "#3B82F6",
    backgroundColor: "rgba(59, 130, 246, 0.15)",
  },
  addressTagBadge: {
    position: "absolute",
    top: -20,
    left: 0,
    backgroundColor: "#3B82F6",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  addressTagText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  analysisListBox: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: METRICS.borderRadiusMd,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  analysisListTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
    fontFamily: TYPOGRAPHY.titleFont,
  },
  analysisStepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  analysisStepText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
  },
  analysisStepTextDone: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  reviewScrollView: {
    flex: 1,
    padding: 16,
  },
  detectedBanner: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.borderRadiusMd,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.riskSafe,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  detectedBannerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.riskSafe,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  detectedBannerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    fontFamily: TYPOGRAPHY.titleFont,
  },
  detectedBannerSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  previewImageCard: {
    width: "100%",
    height: 160,
    borderRadius: METRICS.borderRadiusSm,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: COLORS.line,
    marginBottom: 16,
  },
  previewThumb: {
    width: "100%",
    height: "100%",
  },
  previewMetaBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(42, 42, 40, 0.85)",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: METRICS.borderRadiusSm,
  },
  previewMetaText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  inputGroup: {
    marginBottom: 14,
  },
  labelWithBadge: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
    fontFamily: TYPOGRAPHY.titleFont,
  },
  aiDetectedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: METRICS.borderRadiusSm,
    marginBottom: 6,
  },
  aiDetectedBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.borderRadiusSm,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  highlightInput: {
    borderColor: COLORS.accent,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  fieldHelpText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  twoColumnRow: {
    flexDirection: "row",
    marginBottom: 14,
  },
  staticFieldBox: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.borderRadiusSm,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "center",
  },
  staticFieldText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  rentTypeChoiceRow: {
    flexDirection: "row",
    gap: 8,
  },
  rentTypeBtn: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingVertical: 10,
    borderRadius: METRICS.borderRadiusSm,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: "center",
  },
  rentTypeBtnActive: {
    borderColor: COLORS.accent,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  rentTypeBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  rentTypeBtnTextActive: {
    fontWeight: "700",
  },
  recUsageBox: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.borderRadiusSm,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 12,
    marginBottom: 16,
  },
  recUsageTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
    fontFamily: TYPOGRAPHY.titleFont,
  },
  recUsageList: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  actionBtnRow: {
    flexDirection: "row",
    gap: 8,
  },
  retakeBtn: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 14,
    borderRadius: METRICS.borderRadiusSm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  retakeBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  uploadConfirmBtn: {
    flex: 2,
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: METRICS.borderRadiusSm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadConfirmBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  ocrErrorText: { fontSize: 12, color: COLORS.textPrimary, lineHeight: 18 },
  ocrHintText: { fontSize: 11, color: COLORS.textSecondary, marginTop: 8 },
  progressTrack: {
    height: 6,
    backgroundColor: COLORS.background,
    borderRadius: 3,
    marginTop: 10,
    overflow: "hidden",
  },
  progressFill: { height: 6, backgroundColor: COLORS.accent },
  lowTextBox: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.borderRadiusMd,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
    padding: 14,
    marginBottom: 14,
  },
  lowTextTitle: { fontSize: 14, fontWeight: "700", color: COLORS.textPrimary, marginBottom: 4 },
  lowTextDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
  ocrTextInput: { minHeight: 90, textAlignVertical: "top", fontSize: 12, lineHeight: 18 },
  keywordRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  keywordChip: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: METRICS.borderRadiusSm,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  keywordChipText: { fontSize: 11, fontWeight: "700", color: COLORS.textPrimary },
  reExtractBtn: { alignSelf: "flex-start", marginTop: 8, paddingVertical: 4 },
  reExtractBtnText: { fontSize: 12, fontWeight: "600", color: COLORS.primary },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chipBtn: { flex: 0, paddingHorizontal: 12 },
  footnote: { fontSize: 11, color: COLORS.textSecondary, textAlign: "center", marginTop: 12 },
  doneContainer: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  doneIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.riskSafe,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  doneTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
    textAlign: "center",
    fontFamily: TYPOGRAPHY.titleFont,
  },
  doneDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 20,
  },
  donePreviewCard: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.borderRadiusMd,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: "center",
    marginBottom: 24,
  },
  doneThumb: {
    width: 70,
    height: 70,
    borderRadius: METRICS.borderRadiusSm,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  doneCardInfo: {
    flex: 1,
  },
  doneNeighborhoodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  doneNeighborhood: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  doneGradeBadge: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 3,
  },
  doneGradeText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.primary,
  },
  doneSpaceTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
    fontFamily: TYPOGRAPHY.titleFont,
    marginBottom: 2,
  },
  donePhoneText: {
    fontSize: 11,
    color: COLORS.accent,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
    marginBottom: 2,
  },
  donePriceText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  doneBtnGroup: {
    width: "100%",
    gap: 10,
  },
  donePrimaryBtn: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: METRICS.borderRadiusSm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  donePrimaryBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  doneSecondaryBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 14,
    borderRadius: METRICS.borderRadiusSm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  doneSecondaryBtnText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  doneCloseTextBtn: {
    paddingVertical: 10,
    alignItems: "center",
  },
  doneCloseText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
});
