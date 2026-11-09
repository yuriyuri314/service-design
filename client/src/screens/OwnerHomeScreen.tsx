import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Image,
  Alert,
  Platform 
} from "react-native";
import { COLORS } from "../constants/theme";
import { useApp } from "../context/AppContext";
import { Header } from "../components/common/Header";
import { HighlightBox } from "../components/common/HighlightBox";
import { RiskBadge } from "../components/common/RiskBadge";
import { Space, SpaceCondition } from "../types";

export const OwnerHomeScreen: React.FC = () => {
  const { ownerActiveTab, setOwnerActiveTab, setRole, chats, spaces, setActiveTab } = useApp();

  // 소유자가 등록한 내 공간 목록 상태
  const [mySpaces, setMySpaces] = useState<Space[]>([
    spaces[0], // 철암동 붉은 벽돌 상가
    spaces[2], // 장성동 구 사택
  ]);

  // 등록 단계형 폼 상태 (1: 사진, 2: 위치, 3: 면적/상태, 4: 조건)
  const [regStep, setRegStep] = useState(1);
  const [isRegistering, setIsRegistering] = useState(false);
  const [regPhotoAttached, setRegPhotoAttached] = useState(false);
  const [regTitle, setRegTitle] = useState("");
  const [regNeighborhood, setRegNeighborhood] = useState("철암동");
  const [regAddress, setRegAddress] = useState("");
  const [regAreaPyeong, setRegAreaPyeong] = useState("25");
  const [regCondition, setRegCondition] = useState<SpaceCondition>("MINOR_REPAIR");
  const [regRentType, setRegRentType] = useState<"FREE" | "MONTHLY">("FREE");
  const [regDeposit, setRegDeposit] = useState("300");
  const [regMonthly, setRegMonthly] = useState("0");
  const [regSuccess, setRegSuccess] = useState(false);

  // 협의 요청 상태
  const [requestList, setRequestList] = useState(chats);

  const handleCompleteRegister = () => {
    if (!regTitle.trim()) {
      Alert.alert("알림", "공간 이름을 입력해주세요.");
      return;
    }

    const newSpace: Space = {
      id: `space-owner-${Date.now()}`,
      title: regTitle,
      type: "VACANT_STORE",
      typeLabel: "빈 상가",
      neighborhood: regNeighborhood,
      address: regAddress || `태백시 ${regNeighborhood} 123`,
      areaM2: Math.round(Number(regAreaPyeong) * 3.3),
      areaPyeong: Number(regAreaPyeong),
      rentType: regRentType === "FREE" ? "FREE_NEGOTIATION" : "MONTHLY",
      rentTypeLabel: regRentType === "FREE" ? "무상임대 협의" : "월세",
      deposit: Number(regDeposit) || 0,
      monthlyRent: regRentType === "FREE" ? 0 : (Number(regMonthly) || 20),
      condition: regCondition,
      conditionLabel: regCondition === "READY" ? "바로 사용 가능" : regCondition === "MINOR_REPAIR" ? "일부 수리 필요" : "대규모 수리 필요",
      conditionGrade: regCondition === "READY" ? "A" : regCondition === "MINOR_REPAIR" ? "B" : "C",
      images: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
      ],
      tags: ["소유자 직접 등록", "청년 환영", regNeighborhood],
      canAiReview: true,
      canOwnerDiscuss: true,
      coordinates: { lat: 37.12, lng: 129.02 },
      nearbyAmenities: [{ name: "주민센터", distance: "도보 5분" }],
      ownerName: "나 (소유자)",
      ownerPhoneMasked: "010-****-****",
      description: "청년 창업가를 위해 직접 등록한 유휴공간입니다.",
      recommendedUses: ["로컬 카페 & 문화공간"]
    };

    setMySpaces(prev => [newSpace, ...prev]);
    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setIsRegistering(false);
      setRegStep(1);
      setOwnerActiveTab("MY_SPACE");
    }, 1500);
  };

  const handleAcceptRequest = (chatId: string) => {
    Alert.alert("협의 수락", "청년과의 1:1 협의 채팅방이 열렸습니다. 청년창창센터 담당자도 함께 참여합니다.");
    setRole("YOUTH");
    setActiveTab("CHAT");
  };

  const handleHoldRequest = (chatId: string) => {
    Alert.alert("보류 안내", "해당 청년 협의 요청을 보류 상태로 변경했습니다.");
    setRequestList(prev => prev.filter(c => c.id !== chatId));
  };

  return (
    <View style={styles.container}>
      <Header title="공간 소유자 모드" />

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* 소유자 탭: 1. 홈 (개요 & 이점) */}
        {ownerActiveTab === "HOME" && (
          <View>
            {/* 소유자가 얻는 3대 이점 배너 (필수 요구사항!) */}
            <View style={styles.benefitBanner}>
              <Text style={styles.benefitTag}>안심 임대 플랫폼</Text>
              <Text style={styles.benefitTitle}>
                방치된 빈집·빈상가,{"\n"}믿을 수 있는 청년에게 맡기세요
              </Text>
              <Text style={styles.benefitDesc}>
                빈자리 태백은 낯선 청년에게 무작정 임대하지 않습니다. 객관적인 AI 창업 검토 리포트와 태백시 청년창창센터의 현장 동행으로 건물 관리 부담을 덜어드립니다.
              </Text>

              <View style={styles.benefitCardGrid}>
                <View style={styles.benefitCard}>
                  <Text style={styles.benefitIcon}>🧹</Text>
                  <Text style={styles.benefitCardTitle}>관리 부담 감소</Text>
                  <Text style={styles.benefitCardDesc}>공실 방치로 인한 동파, 누수, 노후화를 막고 건물의 가치를 유지합니다.</Text>
                </View>

                <View style={styles.benefitCard}>
                  <Text style={styles.benefitIcon}>📊</Text>
                  <Text style={styles.benefitCardTitle}>검증된 사업 계획</Text>
                  <Text style={styles.benefitCardDesc}>AI가 검토한 예상 수리비, 손익분기점, 운영 기간 약속을 사전에 확인합니다.</Text>
                </View>

                <View style={styles.benefitCard}>
                  <Text style={styles.benefitIcon}>🏛️</Text>
                  <Text style={styles.benefitCardTitle}>지원기관 현장 동행</Text>
                  <Text style={styles.benefitCardDesc}>청년창창센터 전담 매니저가 현장 방문부터 시 보조금 매칭까지 함께합니다.</Text>
                </View>
              </View>
            </View>

            {/* 빠른 액션 바로가기 카드 */}
            <View style={styles.quickActionGroup}>
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => {
                  setOwnerActiveTab("MY_SPACE");
                  setIsRegistering(true);
                }}
              >
                <Text style={styles.quickActionIcon}>➕</Text>
                <View>
                  <Text style={styles.quickActionTitle}>새 유휴공간 등록하기</Text>
                  <Text style={styles.quickActionSub}>사진과 조건 입력으로 청년 매칭 시작</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => setOwnerActiveTab("REQUESTS")}
              >
                <Text style={styles.quickActionIcon}>📬</Text>
                <View>
                  <Text style={styles.quickActionTitle}>도착한 협의 요청 확인 ({requestList.length}건)</Text>
                  <Text style={styles.quickActionSub}>청년 창업 프로필 및 AI 리포트 검토</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 소유자 탭: 2. 내 공간 (등록 및 목록 관리) */}
        {ownerActiveTab === "MY_SPACE" && (
          <View>
            {!isRegistering ? (
              <View>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionHeading}>🏢 내가 등록한 유휴공간 ({mySpaces.length})</Text>
                  <TouchableOpacity 
                    style={styles.addBtn}
                    onPress={() => setIsRegistering(true)}
                  >
                    <Text style={styles.addBtnText}>+ 공간 등록</Text>
                  </TouchableOpacity>
                </View>

                {mySpaces.map((sp) => (
                  <View key={sp.id} style={styles.mySpaceCard}>
                    <Image source={{ uri: sp.images[0] }} style={styles.mySpaceThumb} />
                    <View style={styles.mySpaceInfo}>
                      <View style={styles.mySpaceTopRow}>
                        <Text style={styles.mySpaceNeighborhood}>{sp.neighborhood}</Text>
                        <RiskBadge 
                          level={sp.conditionGrade === "A" ? "SAFE" : sp.conditionGrade === "B" ? "CAUTION" : "DANGER"} 
                          label={`상태 ${sp.conditionGrade}급`}
                          size="sm"
                        />
                      </View>
                      <Text style={styles.mySpaceTitle} numberOfLines={1}>{sp.title}</Text>
                      <Text style={styles.mySpaceMeta}>{sp.areaPyeong}평 · {sp.rentTypeLabel}</Text>
                      <Text style={styles.mySpacePrice}>
                        {sp.rentType === "FREE_NEGOTIATION" ? "무상협의" : `월세 ${sp.deposit}/${sp.monthlyRent}만`}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              /* 유휴공간 등록 단계형 폼 (1: 사진, 2: 위치, 3: 면적/상태, 4: 조건) */
              <View style={styles.formContainer}>
                <View style={styles.formTopBar}>
                  <Text style={styles.formTitle}>유휴공간 등록 ({regStep}/4)</Text>
                  <TouchableOpacity onPress={() => setIsRegistering(false)}>
                    <Text style={styles.formCancelText}>닫기</Text>
                  </TouchableOpacity>
                </View>

                {/* 1단계: 사진 촬영 / 업로드 */}
                {regStep === 1 && (
                  <View style={styles.formStepBox}>
                    <Text style={styles.formStepHeading}>공간 사진을 등록해 주세요</Text>
                    <Text style={styles.formStepSub}>외관과 내부 사진을 등록하면 청년 검토 신청률이 3배 높아집니다.</Text>

                    <TouchableOpacity 
                      style={[styles.photoUploadBox, regPhotoAttached && styles.photoUploadBoxActive]}
                      onPress={() => setRegPhotoAttached(prev => !prev)}
                    >
                      <Text style={styles.uploadIconLarge}>📷</Text>
                      <Text style={styles.uploadTitleLarge}>
                        {regPhotoAttached ? "✓ 사진 4장 첨부 완료" : "스마트폰으로 현장 사진 촬영 / 선택"}
                      </Text>
                      <Text style={styles.uploadSubLarge}>
                        {regPhotoAttached ? "터치하면 사진을 다시 선택합니다." : "외관, 출입구, 내부 바닥/천장 사진"}
                      </Text>
                    </TouchableOpacity>

                    <Text style={styles.inputLabel}>공간 명칭</Text>
                    <TextInput
                      style={styles.inputField}
                      placeholder="예: 철암천변 햇살 드는 1층 단독 상가"
                      value={regTitle}
                      onChangeText={setRegTitle}
                    />
                  </View>
                )}

                {/* 2단계: 위치 (동네 선택) */}
                {regStep === 2 && (
                  <View style={styles.formStepBox}>
                    <Text style={styles.formStepHeading}>어디에 위치한 공간인가요?</Text>
                    <Text style={styles.formStepSub}>태백시 행정동을 선택해 주세요.</Text>

                    <View style={styles.dongChipGrid}>
                      {["철암동", "황지동", "장성동", "문곡소도동", "상장동", "삼수동"].map((dong) => {
                        const isSelected = regNeighborhood === dong;
                        return (
                          <TouchableOpacity
                            key={dong}
                            style={[styles.dongCard, isSelected && styles.dongCardSelected]}
                            onPress={() => setRegNeighborhood(dong)}
                          >
                            <Text style={[styles.dongCardText, isSelected && styles.dongCardTextSelected]}>
                              {dong}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    <Text style={styles.inputLabel}>상세 주소 (도로명)</Text>
                    <TextInput
                      style={styles.inputField}
                      placeholder="예: 강원특별자치도 태백시 동태백로 100"
                      value={regAddress}
                      onChangeText={setRegAddress}
                    />
                  </View>
                )}

                {/* 3단계: 면적 및 보존 상태 */}
                {regStep === 3 && (
                  <View style={styles.formStepBox}>
                    <Text style={styles.formStepHeading}>면적과 현재 건물 상태</Text>
                    <Text style={styles.formStepSub}>정확한 진단은 청년창창센터 현장 방문 시 함께 확인합니다.</Text>

                    <Text style={styles.inputLabel}>전용 면적 (평수)</Text>
                    <TextInput
                      style={styles.inputField}
                      keyboardType="numeric"
                      placeholder="예: 25"
                      value={regAreaPyeong}
                      onChangeText={setRegAreaPyeong}
                    />

                    <Text style={styles.inputLabel}>현재 보존 상태</Text>
                    <View style={styles.conditionRadioList}>
                      {[
                        { key: "READY", label: "A급: 바로 사용 가능 (보일러/전기 정상)" },
                        { key: "MINOR_REPAIR", label: "B급: 일부 수리 필요 (벽지, 배관 점검)" },
                        { key: "MAJOR_REPAIR", label: "C급: 대규모 수리 필요 (지붕, 단열, 철거)" },
                      ].map((item) => {
                        const isSelected = regCondition === item.key;
                        return (
                          <TouchableOpacity
                            key={item.key}
                            style={[styles.condRadioItem, isSelected && styles.condRadioItemSelected]}
                            onPress={() => setRegCondition(item.key as SpaceCondition)}
                          >
                            <Text style={[styles.condRadioText, isSelected && styles.condRadioTextSelected]}>
                              {item.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* 4단계: 희망 임대 조건 */}
                {regStep === 4 && (
                  <View style={styles.formStepBox}>
                    <Text style={styles.formStepHeading}>희망하시는 임대 조건</Text>
                    <Text style={styles.formStepSub}>착한 임대(무상 또는 반값)를 제안하시면 시 보조금 매칭 우선 대상이 됩니다.</Text>

                    <View style={styles.rentTypeChoiceRow}>
                      <TouchableOpacity
                        style={[styles.rentTypeBtn, regRentType === "FREE" && styles.rentTypeBtnActive]}
                        onPress={() => setRegRentType("FREE")}
                      >
                        <Text style={[styles.rentTypeBtnText, regRentType === "FREE" && styles.rentTypeBtnTextActive]}>
                          🎁 초기 무상임대 협의 (1~2년)
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.rentTypeBtn, regRentType === "MONTHLY" && styles.rentTypeBtnActive]}
                        onPress={() => setRegRentType("MONTHLY")}
                      >
                        <Text style={[styles.rentTypeBtnText, regRentType === "MONTHLY" && styles.rentTypeBtnTextActive]}>
                          💵 일반 월세 계약
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.inputLabel}>보증금 (만원)</Text>
                    <TextInput
                      style={styles.inputField}
                      keyboardType="numeric"
                      value={regDeposit}
                      onChangeText={setRegDeposit}
                    />

                    {regRentType === "MONTHLY" && (
                      <View>
                        <Text style={styles.inputLabel}>희망 월세 (만원)</Text>
                        <TextInput
                          style={styles.inputField}
                          keyboardType="numeric"
                          value={regMonthly}
                          onChangeText={setRegMonthly}
                        />
                      </View>
                    )}

                    {regSuccess && (
                      <View style={styles.successBannerBox}>
                        <Text style={styles.successBannerText}>✓ 유휴공간이 등록되었습니다! 청년 매칭을 시작합니다.</Text>
                      </View>
                    )}
                  </View>
                )}

                {/* 이전 / 다음 버튼 바 */}
                <View style={styles.formNavRow}>
                  {regStep > 1 ? (
                    <TouchableOpacity
                      style={styles.formPrevBtn}
                      onPress={() => setRegStep(prev => prev - 1)}
                    >
                      <Text style={styles.formPrevBtnText}>◀ 이전</Text>
                    </TouchableOpacity>
                  ) : <View style={{ width: 60 }} />}

                  <TouchableOpacity
                    style={styles.formNextBtn}
                    onPress={() => {
                      if (regStep < 4) {
                        setRegStep(prev => prev + 1);
                      } else {
                        handleCompleteRegister();
                      }
                    }}
                  >
                    <Text style={styles.formNextBtnText}>
                      {regStep < 4 ? "다음 단계 →" : "✓ 유휴공간 등록 완료"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* 소유자 탭: 3. 협의 요청 (청년 요청 수락/보류 관리) */}
        {ownerActiveTab === "REQUESTS" && (
          <View>
            <Text style={styles.sectionHeading}>📬 도착한 청년 협의 요청 ({requestList.length}건)</Text>
            <Text style={styles.sectionSub}>청년이 제출한 AI 검토 리포트와 사업 운영 계획을 확인하고 협의를 진행하세요.</Text>

            {requestList.map((chat) => (
              <View key={chat.id} style={styles.requestCardItem}>
                <View style={styles.requestCardHeader}>
                  <View>
                    <Text style={styles.requestSpaceName}>{chat.spaceTitle}</Text>
                    <Text style={styles.requestYouthName}>신청 청년: {chat.youthName}</Text>
                  </View>
                  <View style={styles.requestStepBadge}>
                    <Text style={styles.requestStepBadgeText}>{chat.status}</Text>
                  </View>
                </View>

                {/* 청년이 첨부한 AI 검토 리포트 요약 카드 */}
                <HighlightBox
                  title="첨부된 AI 창업 검토 리포트 핵심 요약"
                  icon={<Text>📊</Text>}
                >
                  {`• 추천 업종: 탄광 문화 수제맥주 브루펍\n• 운영 기간 약속: 최소 3년 이상 장기 운영\n• 예상 시설 개선비: 약 1,450만원 (태백시 지원사업 신청 예정)\n• 건물 관리 계획: 벽돌 외관 원형 보존 및 배관 전면 교체`}
                </HighlightBox>

                <View style={styles.requestBtnRow}>
                  <TouchableOpacity 
                    style={styles.requestAcceptBtn}
                    onPress={() => handleAcceptRequest(chat.id)}
                  >
                    <Text style={styles.requestAcceptBtnText}>✓ 협의 수락 (채팅방 열기)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.requestHoldBtn}
                    onPress={() => handleHoldRequest(chat.id)}
                  >
                    <Text style={styles.requestHoldBtnText}>보류</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 소유자 탭: 4. 마이페이지 (청년 모드 복귀 및 설정) */}
        {ownerActiveTab === "MY_PAGE" && (
          <View>
            <View style={styles.profileBox}>
              <Text style={styles.profileEmoji}>🏡</Text>
              <Text style={styles.profileName}>태백 공간 소유자 님</Text>
              <Text style={styles.profileSub}>등록 공간 2개 · 진행 중인 협의 2건</Text>
            </View>

            <View style={styles.settingsGroup}>
              <TouchableOpacity
                style={styles.switchModeCard}
                onPress={() => {
                  setRole("YOUTH");
                  setActiveTab("HOME");
                }}
              >
                <View>
                  <Text style={styles.switchModeTitle}>🌱 청년 창업가 모드로 전환</Text>
                  <Text style={styles.switchModeSub}>공간 찾기, AI 리포트, 지원사업 신청</Text>
                </View>
                <Text style={styles.switchModeArrow}>→</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.switchModeCard}
                onPress={() => Alert.alert("알림 설정", "신규 청년 협의 요청 알림이 켜졌습니다.")}
              >
                <View>
                  <Text style={styles.switchModeTitle}>🔔 협의 알림 설정</Text>
                  <Text style={styles.switchModeSub}>새로운 청년 협의 요청 시 알림</Text>
                </View>
                <Text style={styles.switchModeArrow}>→</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

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
  benefitBanner: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  benefitTag: {
    color: "#60A5FA",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 4,
  },
  benefitTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 28,
    marginBottom: 8,
  },
  benefitDesc: {
    fontSize: 12,
    color: "#94A3B8",
    lineHeight: 18,
    marginBottom: 16,
  },
  benefitCardGrid: {
    gap: 10,
  },
  benefitCard: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    padding: 12,
  },
  benefitIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  benefitCardTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  benefitCardDesc: {
    fontSize: 11,
    color: "#CBD5E1",
    lineHeight: 16,
  },
  quickActionGroup: {
    gap: 10,
    marginBottom: 20,
  },
  quickActionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  quickActionIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  quickActionSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  sectionSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 14,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  mySpaceCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  mySpaceThumb: {
    width: 75,
    height: 75,
    borderRadius: 10,
    marginRight: 12,
  },
  mySpaceInfo: {
    flex: 1,
  },
  mySpaceTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  mySpaceNeighborhood: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  mySpaceTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  mySpaceMeta: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginBottom: 2,
  },
  mySpacePrice: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.primary,
  },
  formContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  formTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 10,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  formCancelText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  formStepBox: {
    marginBottom: 10,
  },
  formStepHeading: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  formStepSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 14,
  },
  photoUploadBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  photoUploadBoxActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    borderStyle: "solid",
  },
  uploadIconLarge: {
    fontSize: 32,
    marginBottom: 6,
  },
  uploadTitleLarge: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  uploadSubLarge: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
    marginTop: 6,
  },
  inputField: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  dongChipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  dongCard: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dongCardSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dongCardText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  dongCardTextSelected: {
    color: "#FFFFFF",
  },
  conditionRadioList: {
    gap: 8,
  },
  condRadioItem: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  condRadioItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  condRadioText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  condRadioTextSelected: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  rentTypeChoiceRow: {
    gap: 8,
    marginBottom: 12,
  },
  rentTypeBtn: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  rentTypeBtnActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  rentTypeBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  rentTypeBtnTextActive: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  successBannerBox: {
    backgroundColor: "#ECFDF5",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  successBannerText: {
    color: "#059669",
    fontSize: 12,
    fontWeight: "800",
  },
  formNavRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 14,
  },
  formPrevBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  formPrevBtnText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  formNextBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  formNextBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  requestCardItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  requestCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  requestSpaceName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    maxWidth: 220,
  },
  requestYouthName: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
    marginTop: 2,
  },
  requestStepBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  requestStepBadgeText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
  },
  requestBtnRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  requestAcceptBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  requestAcceptBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  requestHoldBtn: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  requestHoldBtnText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  profileBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  profileEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  profileSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  settingsGroup: {
    gap: 10,
  },
  switchModeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  switchModeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  switchModeSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  switchModeArrow: {
    fontSize: 16,
    color: COLORS.textTertiary,
  },
});
