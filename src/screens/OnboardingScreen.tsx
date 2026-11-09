import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions, 
  Platform 
} from "react-native";
import { APP_NAME, APP_SLOGAN, COLORS } from "../constants/theme";
import { useApp } from "../context/AppContext";
import { UserRole } from "../types";

export const OnboardingScreen: React.FC = () => {
  const { completeOnboarding, setRole } = useApp();
  
  // phase: "SPLASH" | "SLIDES" | "ROLE_SELECT" | "INTEREST_SETUP"
  const [phase, setPhase] = useState<"SPLASH" | "SLIDES" | "ROLE_SELECT" | "INTEREST_SETUP">("SPLASH");
  const [slideIndex, setSlideIndex] = useState(0);

  // 관심 설정 상태
  const [selectedRole, setSelectedRole] = useState<UserRole>("YOUTH");
  const [businessType, setBusinessType] = useState("F&B / 로컬 카페 & 브루펍");
  const [budget, setBudget] = useState("3,000만 ~ 5,000만원");
  const [neighborhood, setNeighborhood] = useState("철암동");

  const slides = [
    {
      title: "1. 판단",
      subtitle: "계약 전에 쓸 수 있을지, 버틸 수 있을지",
      desc: "공간 상태 진단부터 숨은 수리비(배관/전기), 상권 분석과 손익분기점까지 AI 창업 검토 리포트 한 장으로 객관적 근거를 만듭니다.",
      emoji: "📊",
      badgeColor: "#10B981",
    },
    {
      title: "2. 연결",
      subtitle: "소유자와의 협의, 청년 혼자 감당하지 않게",
      desc: "검증된 AI 리포트와 청년 프로필로 소유자의 신뢰를 얻고, 청년창창센터 전담 매니저가 현장 방문부터 임대료 협의까지 동행합니다.",
      emoji: "🤝",
      badgeColor: "#5271FF",
    },
    {
      title: "3. 신청",
      subtitle: "공간 확보와 지원사업 신청을 한 흐름으로",
      desc: "확보된 공간 리포트 내용을 그대로 불러와 지원사업 양식에 맞춘 AI 사업계획서 초안을 완성하고 지원금을 신청합니다.",
      emoji: "🚀",
      badgeColor: "#8B5CF6",
    },
  ];

  // 1) 스플래시 화면
  if (phase === "SPLASH") {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.splashCenter}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>강원도 태백시</Text>
          </View>
          <Text style={styles.splashLogoTitle}>{APP_NAME}</Text>
          <View style={styles.sloganBox}>
            <Text style={styles.splashSlogan}>{APP_SLOGAN}</Text>
          </View>
          <Text style={styles.splashDesc}>
            빈집·유휴공간 창업 매칭 & AI 검토 플랫폼
          </Text>
        </View>

        <TouchableOpacity
          style={styles.splashBtn}
          onPress={() => setPhase("SLIDES")}
          activeOpacity={0.85}
        >
          <Text style={styles.splashBtnText}>빈자리 태백 알아보기 →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 2) 온보딩 3장 슬라이드
  if (phase === "SLIDES") {
    const cur = slides[slideIndex];
    return (
      <View style={styles.slideContainer}>
        <View style={styles.slideTopBar}>
          <Text style={styles.slideCounter}>{slideIndex + 1} / 3</Text>
          <TouchableOpacity onPress={() => setPhase("ROLE_SELECT")}>
            <Text style={styles.skipText}>건너뛰기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.slideMain}>
          <View style={styles.slideEmojiCircle}>
            <Text style={styles.slideEmoji}>{cur.emoji}</Text>
          </View>
          <View style={[styles.slidePill, { backgroundColor: cur.badgeColor }]}>
            <Text style={styles.slidePillText}>{cur.title}</Text>
          </View>
          <Text style={styles.slideSubTitle}>{cur.subtitle}</Text>
          <Text style={styles.slideDesc}>{cur.desc}</Text>
        </View>

        {/* 인디케이터 도트 */}
        <View style={styles.dotsRow}>
          {slides.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                slideIndex === idx && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* 하단 버튼 */}
        <View style={styles.slideBtnRow}>
          {slideIndex > 0 ? (
            <TouchableOpacity
              style={styles.prevBtn}
              onPress={() => setSlideIndex(prev => prev - 1)}
            >
              <Text style={styles.prevBtnText}>이전</Text>
            </TouchableOpacity>
          ) : <View style={{ width: 80 }} />}

          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => {
              if (slideIndex < 2) {
                setSlideIndex(prev => prev + 1);
              } else {
                setPhase("ROLE_SELECT");
              }
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.nextBtnText}>
              {slideIndex < 2 ? "다음 →" : "시작하기"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 3) 역할 선택 화면
  if (phase === "ROLE_SELECT") {
    return (
      <View style={styles.setupContainer}>
        <Text style={styles.setupHeading}>어떤 목적으로{"\n"}방문하셨나요?</Text>
        <Text style={styles.setupSub}>나중에 마이페이지에서 언제든 모드를 바꿀 수 있어요.</Text>

        <View style={styles.roleCardGroup}>
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === "YOUTH" && styles.roleCardActive,
            ]}
            onPress={() => setSelectedRole("YOUTH")}
            activeOpacity={0.8}
          >
            <View style={styles.roleCardHeader}>
              <Text style={styles.roleCardIcon}>🌱</Text>
              <View style={[styles.radioCircle, selectedRole === "YOUTH" && styles.radioActive]}>
                {selectedRole === "YOUTH" && <View style={styles.radioDot} />}
              </View>
            </View>
            <Text style={styles.roleCardTitle}>창업하려는 청년</Text>
            <Text style={styles.roleCardDesc}>
              태백의 빈 공간을 찾고, AI로 사업성을 검토하며, 지원사업을 함께 신청하고 싶어요.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === "OWNER" && styles.roleCardActive,
            ]}
            onPress={() => setSelectedRole("OWNER")}
            activeOpacity={0.8}
          >
            <View style={styles.roleCardHeader}>
              <Text style={styles.roleCardIcon}>🏡</Text>
              <View style={[styles.radioCircle, selectedRole === "OWNER" && styles.radioActive]}>
                {selectedRole === "OWNER" && <View style={styles.radioDot} />}
              </View>
            </View>
            <Text style={styles.roleCardTitle}>공간 소유자</Text>
            <Text style={styles.roleCardDesc}>
              비어있는 집이나 상가를 청년에게 임대하고, 믿을 수 있는 관리와 창업을 지원받고 싶어요.
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            setRole(selectedRole);
            if (selectedRole === "YOUTH") {
              setPhase("INTEREST_SETUP");
            } else {
              completeOnboarding();
            }
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.actionBtnText}>
            {selectedRole === "YOUTH" ? "관심 분야 설정하기 →" : "소유자 모드로 시작하기"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 4) 청년 선택 시 관심 설정 화면
  const businessTypes = [
    "F&B / 로컬 카페 & 브루펍",
    "수공예 / 도예·목공 공방",
    "아웃도어 기어 & 투어",
    "독립서점 & 문화살롱",
    "청년 코워킹 & 스튜디오",
    "로컬 푸드 팝업 식당",
  ];

  const budgets = [
    "1,000만원 이하 (소자본)",
    "1,000만 ~ 3,000만원",
    "3,000만 ~ 5,000만원",
    "5,000만원 이상",
  ];

  const neighborhoods = ["철암동", "황지동", "장성동", "문곡소도동", "상장동", "삼수동"];

  return (
    <ScrollView style={styles.setupContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.setupHeading}>창업 관심사 설정</Text>
      <Text style={styles.setupSub}>
        청년 맞춤형 유휴공간과 추천 지원사업을 매칭해 드립니다.
      </Text>

      {/* 1. 업종 */}
      <View style={styles.inputSection}>
        <Text style={styles.inputSectionTitle}>하고 싶은 업종</Text>
        <View style={styles.pillWrap}>
          {businessTypes.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.setupPill, businessType === item && styles.setupPillActive]}
              onPress={() => setBusinessType(item)}
            >
              <Text style={[styles.setupPillText, businessType === item && styles.setupPillTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 2. 예산 범위 */}
      <View style={styles.inputSection}>
        <Text style={styles.inputSectionTitle}>예산 범위</Text>
        <View style={styles.pillWrap}>
          {budgets.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.setupPill, budget === item && styles.setupPillActive]}
              onPress={() => setBudget(item)}
            >
              <Text style={[styles.setupPillText, budget === item && styles.setupPillTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 3. 희망 동네 */}
      <View style={styles.inputSection}>
        <Text style={styles.inputSectionTitle}>희망 동네 (태백시)</Text>
        <View style={styles.pillWrap}>
          {neighborhoods.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.setupPill, neighborhood === item && styles.setupPillActive]}
              onPress={() => setNeighborhood(item)}
            >
              <Text style={[styles.setupPillText, neighborhood === item && styles.setupPillTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.actionBtn, { marginVertical: 24 }]}
        onPress={() => {
          completeOnboarding({ businessType, budget, neighborhood });
        }}
        activeOpacity={0.85}
      >
        <Text style={styles.actionBtnText}>빈자리 태백 시작하기 ✨</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: 24,
    justifyContent: "space-between",
  },
  splashCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 14,
  },
  logoBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  splashLogoTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: -0.8,
    marginBottom: 12,
  },
  sloganBox: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderStyle: "dashed",
    marginBottom: 14,
  },
  splashSlogan: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  splashDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  splashBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: Platform.OS === "ios" ? 16 : 8,
  },
  splashBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  slideContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: 24,
    justifyContent: "space-between",
  },
  slideTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  slideCounter: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textTertiary,
  },
  skipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  slideMain: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  slideEmojiCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F4F6FB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  slideEmoji: {
    fontSize: 44,
  },
  slidePill: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 10,
  },
  slidePillText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  slideSubTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
    textAlign: "center",
    letterSpacing: -0.4,
    marginBottom: 12,
  },
  slideDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 20,
  },
  slideBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Platform.OS === "ios" ? 16 : 8,
  },
  prevBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  prevBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  nextBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  setupContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: 24,
  },
  setupHeading: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    marginTop: 10,
    marginBottom: 6,
    lineHeight: 32,
  },
  setupSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 24,
    lineHeight: 18,
  },
  roleCardGroup: {
    marginBottom: 24,
  },
  roleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    marginBottom: 14,
  },
  roleCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  roleCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  roleCardIcon: {
    fontSize: 24,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: {
    borderColor: COLORS.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  roleCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  roleCardDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  actionBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  inputSection: {
    marginBottom: 20,
  },
  inputSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  pillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  setupPill: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 8,
    marginBottom: 8,
  },
  setupPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  setupPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  setupPillTextActive: {
    color: "#FFFFFF",
  },
});
