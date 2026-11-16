import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  Modal 
} from "react-native";
import { 
  Calendar, 
  Shield, 
  Building2, 
  FileText, 
  Send, 
  Check, 
  Info, 
  ChevronRight,
  Handshake 
} from "lucide-react-native";
import { COLORS, METRICS, TYPOGRAPHY } from "../constants/theme";
import { useApp } from "../context/AppContext";
import { Header } from "../components/common/Header";
import { ChatRoom, ChatMessage } from "../types";

const STAGES = ["요청", "소유자 확인", "현장 방문", "조건 협의", "계약"];

export const ChatScreen: React.FC = () => {
  const { chats, setActiveTab } = useApp();
  
  // view: "LIST" | "ROOM"
  const [viewMode, setViewMode] = useState<"LIST" | "ROOM">("ROOM");
  const [activeRoom, setActiveRoom] = useState<ChatRoom>(chats[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(activeRoom.messages);
  const [inputText, setInputText] = useState("");

  // 현장 방문 일정 잡기 모달 상태
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2026.11.13(금) 오후 2:00");
  const [officerInvited, setOfficerInvited] = useState(activeRoom.officerJoined);

  const availableDates = [
    "2026.11.13(금) 오후 2:00",
    "2026.11.14(토) 오전 11:00",
    "2026.11.16(월) 오후 3:30",
  ];

  const handleSelectRoom = (room: ChatRoom) => {
    setActiveRoom(room);
    setMessages(room.messages);
    setOfficerInvited(room.officerJoined);
    setViewMode("ROOM");
  };

  const handleSendMessage = (customText?: string, attachment?: any) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "youth-me",
      senderName: "나 (청년 창업가)",
      senderRole: "YOUTH",
      text: textToSend,
      timestamp: "방금 전",
      attachmentType: attachment?.type,
      attachmentData: attachment?.data,
    };

    setMessages(prev => [...prev, newMsg]);
    if (!customText) setInputText("");

    // 소유자 자동 답장 시뮬레이션
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        senderId: "owner-auto",
        senderName: activeRoom.ownerName,
        senderRole: "OWNER",
        text: "네 대표님, 보내주신 내용 잘 확인했습니다. 정성껏 준비해주셔서 믿음이 가네요. 현장에서 뵙고 자세한 이야기 나누겠습니다.",
        timestamp: "방금 전",
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 1200);
  };

  // 현장 방문 일정 확정
  const handleConfirmSchedule = () => {
    setIsScheduleModalVisible(false);
    handleSendMessage(
      `[현장 방문 확정] 소유자님과 ${selectedDate}에 현장 방문 미팅 일정을 잡았습니다. 현장에서 뵙겠습니다.`
    );
  };

  // 청년창창센터 담당자 초대
  const handleInviteOfficer = () => {
    if (officerInvited) return;
    setOfficerInvited(true);
    const officerMsg: ChatMessage = {
      id: `msg-officer-${Date.now()}`,
      senderId: "officer-01",
      senderName: "이수진 매니저 (태백시 청년창창센터)",
      senderRole: "OFFICER",
      text: "안녕하세요. 태백시 청년창창센터 공간매칭 전담 매니저입니다. 청년 창업가와 소유자님의 안심 계약을 위해 현장 방문 시 시설 점검 및 시 보조금(최대 4,500만원) 지원 서류 검토를 동행 지원하겠습니다.",
      timestamp: "방금 전",
    };
    setMessages(prev => [...prev, officerMsg]);
  };

  // 1. 협의 목록 화면
  if (viewMode === "LIST") {
    return (
      <View style={styles.container}>
        <Header title="소유자 협의 목록" />
        <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
          <View style={styles.listIntro}>
            <View style={styles.listIntroHeader}>
              <Handshake size={18} color={COLORS.accent} strokeWidth={1.75} style={{ marginRight: 6 }} />
              <Text style={styles.listIntroTitle}>믿고 맡길 수 있는 연결</Text>
            </View>
            <Text style={styles.listIntroDesc}>
              진단 리포트와 청년 프로필로 소유자와 협의하고, 청년창창센터가 함께합니다.
            </Text>
          </View>

          {chats.map((room) => (
            <TouchableOpacity
              key={room.id}
              style={styles.roomCard}
              onPress={() => handleSelectRoom(room)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: room.spaceImage }} style={styles.roomCardThumb} />
              <View style={styles.roomCardContent}>
                <View style={styles.roomCardTop}>
                  <Text style={styles.roomCardOwner}>{room.ownerName}</Text>
                  <View style={styles.roomCardStatusPill}>
                    <Text style={styles.roomCardStatusText}>{room.status}</Text>
                  </View>
                </View>
                <Text style={styles.roomCardSpaceTitle} numberOfLines={1}>
                  {room.spaceTitle}
                </Text>
                <Text style={styles.roomCardLastMsg} numberOfLines={1}>
                  {room.lastMessage}
                </Text>
              </View>
              <Text style={styles.roomCardTime}>{room.lastMessageTime}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  // 2. 협의 상세 = 채팅 화면
  return (
    <View style={styles.container}>
      <Header 
        title={`${activeRoom.ownerName.split(" ")[0]}님과의 협의`} 
        onBack={() => setViewMode("LIST")}
      />

      {/* 상단 진행 단계 바 (요청 → 소유자 확인 → 현장 방문 → 조건 협의 → 계약) */}
      <View style={styles.stepStatusBar}>
        <View style={styles.stepProgressRow}>
          {STAGES.map((stg, idx) => {
            const isPassed = idx < activeRoom.currentStepIndex;
            const isCurrent = idx === activeRoom.currentStepIndex;
            return (
              <React.Fragment key={stg}>
                <View style={styles.stageItem}>
                  <View style={[
                    styles.stageDot,
                    isPassed && styles.stageDotPassed,
                    isCurrent && styles.stageDotCurrent,
                  ]}>
                    {isPassed ? (
                      <Check size={12} color="#FFFFFF" strokeWidth={2} />
                    ) : (
                      <Text style={[
                        styles.stageDotText,
                        isCurrent && styles.stageDotTextActive,
                      ]}>
                        {idx + 1}
                      </Text>
                    )}
                  </View>
                  <Text style={[
                    styles.stageText,
                    isCurrent && styles.stageTextCurrent,
                  ]}>
                    {stg}
                  </Text>
                </View>
                {idx < STAGES.length - 1 && (
                  <View style={[
                    styles.stageBarLine,
                    idx < activeRoom.currentStepIndex && styles.stageBarLinePassed,
                  ]} />
                )}
              </React.Fragment>
            );
          })}
        </View>

        {/* 동행 배너 */}
        {officerInvited && (
          <View style={styles.officerBadgeBanner}>
            <Shield size={14} color={COLORS.primary} strokeWidth={1.75} style={{ marginRight: 6 }} />
            <Text style={styles.officerBadgeText}>
              <Text style={{ fontWeight: "700" }}>태백시 청년창창센터</Text> 전담 매니저 동행 중
            </Text>
          </View>
        )}
      </View>

      {/* 대화 메시지 스크롤뷰 */}
      <ScrollView 
        style={styles.chatScroll} 
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => {
          const isMe = msg.senderRole === "YOUTH";
          const isOfficer = msg.senderRole === "OFFICER";

          return (
            <View 
              key={msg.id} 
              style={[
                styles.messageWrap,
                isMe ? styles.messageWrapMe : styles.messageWrapOther,
                isOfficer && styles.messageWrapOfficer
              ]}
            >
              {!isMe && (
                <Text style={styles.senderLabel}>
                  {msg.senderName}
                </Text>
              )}

              <View style={[
                styles.speechBubble,
                isMe ? styles.speechBubbleMe : styles.speechBubbleOther,
                isOfficer && styles.speechBubbleOfficer
              ]}>
                <Text style={[styles.msgText, isMe && styles.msgTextMe]}>
                  {msg.text}
                </Text>

                {/* 첫 메시지 자동 첨부: 진단 리포트 카드 */}
                {msg.attachmentType === "REPORT" && (
                  <View style={styles.reportAttachmentCard}>
                    <View style={styles.attachCardHeaderRow}>
                      <FileText size={15} color={COLORS.accent} strokeWidth={1.75} style={{ marginRight: 5 }} />
                      <Text style={styles.attachCardHeader}>진단 리포트 첨부됨</Text>
                    </View>
                    <Text style={styles.attachItem}>• 종합 적합도: 88점 (우수)</Text>
                    <Text style={styles.attachItem}>• 진단 요약: 골조 양호, 배관/전기 승압 필요</Text>
                    <Text style={styles.attachItem}>• 예상 수리비: 약 1,450만원</Text>
                    <TouchableOpacity 
                      style={styles.viewReportBtn}
                      onPress={() => setActiveTab("AI_REVIEW")}
                    >
                      <Text style={styles.viewReportBtnText}>리포트 전체 보기</Text>
                      <ChevronRight size={14} color={COLORS.primary} strokeWidth={1.75} />
                    </TouchableOpacity>
                  </View>
                )}

                {/* 첫 메시지 자동 첨부: 청년 창업 프로필 카드 */}
                {msg.attachmentType === "PROFILE" && (
                  <View style={styles.profileAttachmentCard}>
                    <Text style={styles.attachCardHeader}>청년 창업가 운영 약속 프로필</Text>
                    <Text style={styles.attachItem}>• 창업가: 박도현 (28세 / F&B 경력 4년)</Text>
                    <Text style={styles.attachItem}>• 창업 업종: 탄광 문화 수제맥주 브루펍</Text>
                    <Text style={styles.attachItem}>• 약속 조건: 최소 3년 이상 장기 운영 보장</Text>
                    <Text style={styles.attachItem}>• 관리 계획: 벽돌 외관 보존 및 시설 개보수</Text>
                  </View>
                )}
              </View>

              <Text style={styles.msgTime}>{msg.timestamp}</Text>
            </View>
          );
        })}
      </ScrollView>

      {/* 퀵 액션 버튼 바 (현장 방문 일정 잡기 / 담당자 동행) */}
      <View style={styles.actionToolBar}>
        <TouchableOpacity 
          style={styles.scheduleActionBtn}
          onPress={() => setIsScheduleModalVisible(true)}
          activeOpacity={0.8}
        >
          <Calendar size={14} color={COLORS.primary} strokeWidth={1.75} style={{ marginRight: 5 }} />
          <Text style={styles.scheduleActionText}>현장 방문 일정 잡기</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.officerActionBtn, officerInvited && styles.officerActionBtnDisabled]}
          onPress={handleInviteOfficer}
          disabled={officerInvited}
          activeOpacity={0.8}
        >
          <Building2 size={14} color={COLORS.textSecondary} strokeWidth={1.75} style={{ marginRight: 5 }} />
          <Text style={styles.officerActionText}>
            {officerInvited ? "담당자 동행 참여 중" : "청년창창센터 담당자 동행 요청"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 하단 메시지 입력창 */}
      <View style={styles.chatInputBar}>
        <TextInput
          style={styles.chatTextInput}
          placeholder="소유자님께 궁금한 점이나 의견을 남겨보세요."
          placeholderTextColor={COLORS.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => handleSendMessage()}
        />
        <TouchableOpacity 
          style={styles.chatSendBtn}
          onPress={() => handleSendMessage()}
          activeOpacity={0.85}
        >
          <Send size={15} color="#FFFFFF" strokeWidth={1.75} />
        </TouchableOpacity>
      </View>

      {/* 현장 방문 일정 잡기 모달 */}
      <Modal
        visible={isScheduleModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsScheduleModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.scheduleModalBox}>
            <Text style={styles.modalTitle}>현장 방문 일정 선택</Text>
            <Text style={styles.modalSub}>소유자님과 함께 공간을 직접 살펴볼 일정을 선택하세요.</Text>

            <View style={styles.dateOptionList}>
              {availableDates.map((dateStr) => {
                const isSelected = selectedDate === dateStr;
                return (
                  <TouchableOpacity
                    key={dateStr}
                    style={[styles.dateOptionCard, isSelected && styles.dateOptionSelected]}
                    onPress={() => setSelectedDate(dateStr)}
                  >
                    <Text style={[styles.dateOptionText, isSelected && styles.dateOptionTextSelected]}>
                      {dateStr}
                    </Text>
                    {isSelected && <Check size={16} color={COLORS.accent} strokeWidth={2} />}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.modalNoticeBox}>
              <Info size={14} color={COLORS.primary} strokeWidth={1.75} style={{ marginRight: 6 }} />
              <Text style={styles.modalNoticeText}>
                청년창창센터 담당자도 일정에 맞춰 현장에 함께 방문합니다.
              </Text>
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity 
                style={styles.modalCancelBtn}
                onPress={() => setIsScheduleModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalConfirmBtn}
                onPress={handleConfirmSchedule}
              >
                <Text style={styles.modalConfirmText}>일정 확정 및 전송</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  listIntro: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: METRICS.borderRadiusMd,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  listIntroHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  listIntroTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    fontFamily: TYPOGRAPHY.titleFont,
  },
  listIntroDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    fontFamily: TYPOGRAPHY.bodyFont,
  },
  roomCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.borderRadiusMd,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: "center",
  },
  roomCardThumb: {
    width: 64,
    height: 64,
    borderRadius: METRICS.borderRadiusSm,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  roomCardContent: {
    flex: 1,
  },
  roomCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  roomCardOwner: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    fontFamily: TYPOGRAPHY.titleFont,
  },
  roomCardStatusPill: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: METRICS.borderRadiusSm,
  },
  roomCardStatusText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "700",
  },
  roomCardSpaceTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  roomCardLastMsg: {
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  roomCardTime: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginLeft: 6,
    fontVariant: ["tabular-nums"],
  },
  stepStatusBar: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  stepProgressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stageItem: {
    alignItems: "center",
  },
  stageDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: "center",
    justifyContent: "center",
  },
  stageDotPassed: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stageDotCurrent: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  stageDotText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textSecondary,
    fontVariant: ["tabular-nums"],
  },
  stageDotTextActive: {
    color: "#FFFFFF",
  },
  stageText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  stageTextCurrent: {
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  stageBarLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.line,
    marginHorizontal: 3,
    marginBottom: 14,
  },
  stageBarLinePassed: {
    backgroundColor: COLORS.primary,
  },
  officerBadgeBanner: {
    backgroundColor: COLORS.background,
    borderRadius: METRICS.borderRadiusSm,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  officerBadgeText: {
    fontSize: 11,
    color: COLORS.textPrimary,
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageWrap: {
    marginBottom: 14,
    maxWidth: "84%",
  },
  messageWrapMe: {
    alignSelf: "flex-end",
  },
  messageWrapOther: {
    alignSelf: "flex-start",
  },
  messageWrapOfficer: {
    alignSelf: "center",
    maxWidth: "94%",
  },
  senderLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  speechBubble: {
    borderRadius: METRICS.borderRadiusMd,
    padding: 12,
  },
  speechBubbleMe: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 2,
  },
  speechBubbleOther: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderBottomLeftRadius: 2,
  },
  speechBubbleOfficer: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.riskSafe,
    borderLeftWidth: 3,
  },
  msgText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 19,
  },
  msgTextMe: {
    color: "#FFFFFF",
  },
  msgTime: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 4,
    alignSelf: "flex-end",
    fontVariant: ["tabular-nums"],
  },
  reportAttachmentCard: {
    backgroundColor: COLORS.background,
    borderRadius: METRICS.borderRadiusSm,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  attachCardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  profileAttachmentCard: {
    backgroundColor: COLORS.background,
    borderRadius: METRICS.borderRadiusSm,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  attachCardHeader: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
    fontFamily: TYPOGRAPHY.titleFont,
  },
  attachItem: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  viewReportBtn: {
    backgroundColor: COLORS.surface,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: METRICS.borderRadiusSm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  viewReportBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.primary,
    marginRight: 4,
  },
  actionToolBar: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    gap: 8,
  },
  scheduleActionBtn: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: 9,
    borderRadius: METRICS.borderRadiusSm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  scheduleActionText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
  },
  officerActionBtn: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: 9,
    borderRadius: METRICS.borderRadiusSm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  officerActionBtnDisabled: {
    opacity: 0.6,
  },
  officerActionText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  chatInputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
  },
  chatTextInput: {
    flex: 1,
    height: 38,
    backgroundColor: COLORS.background,
    borderRadius: METRICS.borderRadiusSm,
    paddingHorizontal: 12,
    fontSize: 13,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  chatSendBtn: {
    backgroundColor: COLORS.primary,
    width: 38,
    height: 38,
    borderRadius: METRICS.borderRadiusSm,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  scheduleModalBox: {
    width: "100%",
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.borderRadiusMd,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
    fontFamily: TYPOGRAPHY.titleFont,
  },
  modalSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 14,
  },
  dateOptionList: {
    gap: 8,
    marginBottom: 14,
  },
  dateOptionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: METRICS.borderRadiusSm,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.background,
  },
  dateOptionSelected: {
    borderColor: COLORS.accent,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  dateOptionText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
    fontVariant: ["tabular-nums"],
  },
  dateOptionTextSelected: {
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  modalNoticeBox: {
    backgroundColor: COLORS.background,
    borderRadius: METRICS.borderRadiusSm,
    padding: 10,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  modalNoticeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    flex: 1,
  },
  modalBtnRow: {
    flexDirection: "row",
    gap: 8,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: 12,
    borderRadius: METRICS.borderRadiusSm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  modalConfirmBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: METRICS.borderRadiusSm,
    alignItems: "center",
  },
  modalConfirmText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
