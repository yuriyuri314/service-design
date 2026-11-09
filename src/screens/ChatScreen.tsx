import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from "react-native";
import { COLORS } from "../constants/theme";
import { useApp } from "../context/AppContext";
import { Header } from "../components/common/Header";
import { ChatRoom } from "../types";

const STAGES = ["요청", "소유자 확인", "현장 방문", "조건 협의", "계약"];

export const ChatScreen: React.FC = () => {
  const { chats } = useApp();
  const [selectedChat, setSelectedChat] = useState<ChatRoom>(chats[0]);
  const [inputText, setInputText] = useState("");
  const [chatMessages, setChatMessages] = useState(selectedChat.messages);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: "youth-me",
      senderName: "나 (청년 창업가)",
      senderRole: "YOUTH" as const,
      text: inputText,
      timestamp: "방금 전",
    };
    setChatMessages(prev => [...prev, newMsg]);
    setInputText("");
  };

  return (
    <View style={styles.container}>
      <Header title="소유자 협의" />

      {/* 협의 목록 탭 (2개 채팅방 전환) */}
      <View style={styles.roomSelector}>
        {chats.map((room) => {
          const isActive = room.id === selectedChat.id;
          return (
            <TouchableOpacity
              key={room.id}
              style={[styles.roomTab, isActive && styles.roomTabActive]}
              onPress={() => {
                setSelectedChat(room);
                setChatMessages(room.messages);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.roomTabText, isActive && styles.roomTabTextActive]}>
                {room.ownerName.split(" ")[0]}님 ({room.status})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 협의 상세 채팅 헤더: 진행 단계 표시 (요청 → 소유자 확인 → 현장 방문 → 조건 협의 → 계약) */}
      <View style={styles.stageBar}>
        <View style={styles.stageRow}>
          {STAGES.map((stg, idx) => {
            const isPassed = idx < selectedChat.currentStepIndex;
            const isCurrent = idx === selectedChat.currentStepIndex;
            return (
              <React.Fragment key={stg}>
                <View style={styles.stageItem}>
                  <View style={[
                    styles.stageCircle,
                    isPassed && styles.stageCirclePassed,
                    isCurrent && styles.stageCircleCurrent,
                  ]}>
                    <Text style={[
                      styles.stageCircleText,
                      (isPassed || isCurrent) && styles.stageCircleTextActive,
                    ]}>
                      {isPassed ? "✓" : idx + 1}
                    </Text>
                  </View>
                  <Text style={[
                    styles.stageLabel,
                    isCurrent && styles.stageLabelCurrent,
                  ]}>
                    {stg}
                  </Text>
                </View>
                {idx < STAGES.length - 1 && (
                  <View style={[
                    styles.stageLine,
                    idx < selectedChat.currentStepIndex && styles.stageLinePassed,
                  ]} />
                )}
              </React.Fragment>
            );
          })}
        </View>

        {/* 담당자 동행 배너 */}
        <View style={styles.officerNotice}>
          <Text style={styles.officerNoticeText}>
            🛡️ <Text style={{ fontWeight: "700" }}>태백시 청년창창센터</Text> 전담 매니저 동행 중
          </Text>
        </View>
      </View>

      {/* 메시지 리스트 */}
      <ScrollView style={styles.messageScroll} contentContainerStyle={styles.messageContent}>
        {chatMessages.map((msg) => {
          const isMe = msg.senderRole === "YOUTH";
          const isOfficer = msg.senderRole === "OFFICER";

          return (
            <View 
              key={msg.id} 
              style={[
                styles.messageRow, 
                isMe ? styles.messageRowMe : styles.messageRowOther,
                isOfficer && styles.messageRowOfficer
              ]}
            >
              {!isMe && (
                <Text style={styles.senderName}>
                  {msg.senderName} {isOfficer ? "🏛️" : ""}
                </Text>
              )}

              <View style={[
                styles.bubble,
                isMe ? styles.bubbleMe : styles.bubbleOther,
                isOfficer && styles.bubbleOfficer
              ]}>
                <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>
                  {msg.text}
                </Text>

                {/* AI 리포트 첨부 카드 */}
                {msg.attachmentType === "REPORT" && (
                  <View style={styles.attachCard}>
                    <Text style={styles.attachTitle}>📊 첨부된 AI 창업 검토 리포트</Text>
                    <Text style={styles.attachSub}>• 적합도 점수: 88점 (우수)</Text>
                    <Text style={styles.attachSub}>• 예상 수리비: 약 1,450만원</Text>
                    <Text style={styles.attachSub}>• 권장: 탄광 문화 수제맥주 브루펍</Text>
                  </View>
                )}

                {/* 청년 프로필 첨부 카드 */}
                {msg.attachmentType === "PROFILE" && (
                  <View style={styles.attachCard}>
                    <Text style={styles.attachTitle}>🌱 청년 창업가 운영 약속 프로필</Text>
                    <Text style={styles.attachSub}>• 창업팀: 박도현 (28세, F&B 경력 4년)</Text>
                    <Text style={styles.attachSub}>• 운영 계획: 최소 3년 장기 운영</Text>
                    <Text style={styles.attachSub}>• 건물 보존: 붉은 벽돌 외관 살림</Text>
                  </View>
                )}
              </View>

              <Text style={styles.timestampText}>{msg.timestamp}</Text>
            </View>
          );
        })}
      </ScrollView>

      {/* 하단 제안 액션 바 (현장 방문 일정 잡기 / 담당자 초대) */}
      <View style={styles.quickActionRow}>
        <TouchableOpacity style={styles.quickBtn} activeOpacity={0.7}>
          <Text style={styles.quickBtnText}>📅 현장 방문 일정 잡기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn} activeOpacity={0.7}>
          <Text style={styles.quickBtnText}>🏛️ 청년창창센터 담당자 상담</Text>
        </TouchableOpacity>
      </View>

      {/* 입력창 */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.inputField}
          placeholder="소유자님께 메시지를 남겨보세요..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendBtnText}>전송</Text>
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
  roomSelector: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  roomTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    marginRight: 8,
  },
  roomTabActive: {
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  roomTabText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  roomTabTextActive: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  stageBar: {
    backgroundColor: COLORS.surface,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  stageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stageItem: {
    alignItems: "center",
  },
  stageCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  stageCirclePassed: {
    backgroundColor: COLORS.primarySoft,
  },
  stageCircleCurrent: {
    backgroundColor: COLORS.primary,
  },
  stageCircleText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  stageCircleTextActive: {
    color: "#FFFFFF",
  },
  stageLabel: {
    fontSize: 9,
    color: COLORS.textTertiary,
    marginTop: 3,
  },
  stageLabelCurrent: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  stageLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 4,
    marginBottom: 12,
  },
  stageLinePassed: {
    backgroundColor: COLORS.primary,
  },
  officerNotice: {
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 8,
    alignItems: "center",
  },
  officerNoticeText: {
    fontSize: 11,
    color: "#1D4ED8",
  },
  messageScroll: {
    flex: 1,
  },
  messageContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageRow: {
    marginBottom: 12,
    maxWidth: "82%",
  },
  messageRowMe: {
    alignSelf: "flex-end",
  },
  messageRowOther: {
    alignSelf: "flex-start",
  },
  messageRowOfficer: {
    alignSelf: "center",
    maxWidth: "92%",
  },
  senderName: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  bubble: {
    borderRadius: 14,
    padding: 12,
  },
  bubbleMe: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 2,
  },
  bubbleOther: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderBottomLeftRadius: 2,
  },
  bubbleOfficer: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  bubbleText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 19,
  },
  bubbleTextMe: {
    color: "#FFFFFF",
  },
  timestampText: {
    fontSize: 10,
    color: COLORS.textTertiary,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  attachCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  attachTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 4,
  },
  attachSub: {
    fontSize: 11,
    color: "#374151",
    lineHeight: 16,
  },
  quickActionRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  quickBtn: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  quickBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  inputField: {
    flex: 1,
    height: 40,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 14,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginLeft: 8,
  },
  sendBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
