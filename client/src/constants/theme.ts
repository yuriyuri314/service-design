import { Platform } from "react-native";

export const APP_NAME = "빈자리 태백";
export const APP_SLOGAN = "계약 전에 따져보고, 혼자 말고 함께";
export const APP_SUBTITLE = "강원도 태백시 청년 빈집·유휴공간 창업 매칭 플랫폼";

export const COLORS = {
  // 탄광 도시 태백의 담백하고 실제적인 톤앤매너
  primary: "#2A2A28",       // 탄광 차콜 (메인 텍스트·주요 버튼)
  accent: "#B5452E",        // 붉은 벽돌 (유일한 포인트 색. 강조·CTA·선택 상태)
  background: "#F4F0E8",    // 종이 크림
  surface: "#FBF9F4",       // 밝은 크림 면
  line: "#D9D3C7",          // 구분선·테두리

  // 텍스트 계열
  textPrimary: "#2A2A28",   // 본문 및 주요 정보
  textSecondary: "#6E6A62", // 읽어야 하는 모든 안내·설명 문구
  textTertiary: "#9A958B",  // 비활성 상태·장식선에만 사용 (읽어야 하는 글자에는 쓰지 않음)

  // 상태 색상 (위험도 표시)
  riskSafe: "#4F6B4A",      // 고원 녹색 (안전)
  riskCaution: "#C08A2E",   // 주의
  riskDanger: "#8E2A1E",    // 진한 적갈색 (위험. CTA accent와 구분)
};

export const METRICS = {
  standardWidth: 390,
  standardHeight: 844,
  borderRadiusSm: 4,
  borderRadiusMd: 6,
  borderRadiusLg: 8,
  borderRadiusFull: 9999,
};

export const TYPOGRAPHY = {
  titleFont: Platform.select({
    web: "NotoSerifKR_700Bold, 'Noto Serif KR', serif",
    default: "NotoSerifKR_700Bold",
  }),
  titleFontSemiBold: Platform.select({
    web: "NotoSerifKR_600SemiBold, 'Noto Serif KR', serif",
    default: "NotoSerifKR_600SemiBold",
  }),
  bodyFont: Platform.select({
    web: "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif",
    default: "Pretendard",
  }),
  fontVariantTabular: ['tabular-nums'] as const,
};
