import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { COLORS } from "../constants/theme";
import { useApp } from "../context/AppContext";
import { Header } from "../components/common/Header";
import { HighlightBox } from "../components/common/HighlightBox";

export const OwnerHomeScreen: React.FC = () => {
  const { ownerActiveTab, setRole, chats, spaces } = useApp();
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // 공간 등록 폼 상태
  const [title, setTitle] = useState("");
  const [dong, setDong] = useState("철암동");
  const [area, setArea] = useState("");
  const [rentCondition, setRentCondition] = useState("무상임대 협의 (초기 1~2년)");

  const handleRegister = () => {
    setRegisterSuccess(true);
    setTimeout(() => {
      setRegisterSuccess(false);
      setTitle("");
      setArea("");
    }, 2500);
  };

  return (
    <View style={styles.container}>
      <Header title="소유자 모드" />

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* 소유자가 얻는 이점 안내 (요구사항) */}
        <View style={styles.benefitBanner}>
          <Text style={styles.benefitTitle}>🏡 비어있는 공간, 청년과 함께 살려보세요</Text>
          <Text style={styles.benefitDesc}>
            빈자리 태백은 낯선 청년에게 무작정 임대하는 것이 아닙니다.{"\n"}
            AI가 검토한 구체적 사업 계획과 태백시 청년창창센터 담당자 동행으로 안심할 수 있습니다.
          </Text>
          <View style={styles.benefitGrid}>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🧹</Text>
              <Text style={styles.benefitItemTitle}>관리 부담 감소</Text>
              <Text style={styles.benefitItemSub}>방치된 건물 노후화 및 누수 방지</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>📋</Text>
              <Text style={styles.benefitItemTitle}>검증된 창업 계획</Text>
              <Text style={styles.benefitItemSub}>AI 검토 리포트로 타당성 확인</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🏛️</Text>
              <Text style={styles.benefitItemTitle}>지원기관 동행</Text>
              <Text style={styles.benefitItemSub}>청년창창센터 매니저 현장 참여</Text>
            </View>
          </View>
        </View>

        {/* 1. 받은 협의 요청 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>📬 도착한 청년 협의 요청 (2건)</Text>

          {chats.map((chat) => (
            <View key={chat.id} style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <View>
                  <Text style={styles.requestSpaceTitle}>{chat.spaceTitle}</Text>
                  <Text style={styles.requestYouth}>신청 청년: {chat.youthName}</Text>
                </View>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>{chat.status}</Text>
                </View>
              </View>

              <HighlightBox
                title="청년이 첨부한 AI 창업 검토 요약"
                icon={<Text>📊</Text>}
              >
                {`• 추천 업종: 로컬 F&B / 수제맥주 브루펍\n• 운영 기간 약속: 최소 3년 이상\n• 리모델링 계획: 외관 보존 및 배관 개보수`}
              </HighlightBox>

              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.acceptBtn} activeOpacity={0.8}>
                  <Text style={styles.acceptBtnText}>✓ 협의 수락 (채팅 열기)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.holdBtn} activeOpacity={0.8}>
                  <Text style={styles.holdBtnText}>보류</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* 2. 유휴공간 등록 단계형 폼 */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>➕ 내 빈집·빈상가 등록하기</Text>
          <View style={styles.formCard}>
            <Text style={styles.formLabel}>공간 명칭 또는 특징</Text>
            <TextInput
              style={styles.formInput}
              placeholder="예: 철암역 앞 붉은 벽돌 창고"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.formLabel}>소재지 동네</Text>
            <View style={styles.dongWrap}>
              {["철암동", "황지동", "장성동", "문곡소도동", "상장동", "삼수동"].map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.dongChip, dong === d && styles.dongChipActive]}
                  onPress={() => setDong(d)}
                >
                  <Text style={[styles.dongChipText, dong === d && styles.dongChipTextActive]}>
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.formLabel}>전용면적 (평 또는 m²)</Text>
            <TextInput
              style={styles.formInput}
              placeholder="예: 약 25평 (82.5㎡)"
              value={area}
              onChangeText={setArea}
            />

            <Text style={styles.formLabel}>희망 임대 조건</Text>
            <TextInput
              style={styles.formInput}
              value={rentCondition}
              onChangeText={setRentCondition}
            />

            <TouchableOpacity 
              style={styles.submitBtn}
              onPress={handleRegister}
              activeOpacity={0.85}
            >
              <Text style={styles.submitBtnText}>유휴공간 등록 신청하기</Text>
            </TouchableOpacity>

            {registerSuccess && (
              <View style={styles.successBanner}>
                <Text style={styles.successText}>✓ 공간이 등록되었습니다. 청년 매칭을 시작합니다!</Text>
              </View>
            )}
          </View>
        </View>

        {/* 청년 모드로 돌아가기 */}
        <TouchableOpacity
          style={styles.switchYouthBtn}
          onPress={() => setRole("YOUTH")}
        >
          <Text style={styles.switchYouthText}>🌱 청년 창업가 모드로 돌아가기</Text>
        </TouchableOpacity>

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
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  benefitDesc: {
    fontSize: 12,
    color: "#94A3B8",
    lineHeight: 18,
    marginBottom: 14,
  },
  benefitGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  benefitItem: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 3,
    alignItems: "center",
  },
  benefitIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  benefitItemTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  benefitItemSub: {
    fontSize: 9,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  requestCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  requestSpaceTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    maxWidth: 220,
  },
  requestYouth: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
    marginTop: 2,
  },
  statusPill: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusPillText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
  },
  btnRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 8,
  },
  acceptBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  acceptBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  holdBtn: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  holdBtnText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  formLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
    marginTop: 8,
  },
  formInput: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  dongWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  dongChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    marginRight: 6,
    marginBottom: 6,
  },
  dongChipActive: {
    backgroundColor: COLORS.primary,
  },
  dongChipText: {
    fontSize: 11,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  dongChipTextActive: {
    color: "#FFFFFF",
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  successBanner: {
    backgroundColor: "#ECFDF5",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  successText: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "700",
  },
  switchYouthBtn: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  switchYouthText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
});
