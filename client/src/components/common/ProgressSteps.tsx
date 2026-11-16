import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { Check } from "lucide-react-native";
import { COLORS, METRICS, TYPOGRAPHY } from "../../constants/theme";

interface ProgressStepsProps {
  currentStep: number; // 1 ~ 5
  style?: ViewStyle;
  compact?: boolean;
}

const STEPS = [
  { step: 1, label: "공간 찾기" },
  { step: 2, label: "계약 전 진단" },
  { step: 3, label: "소유자 협의" },
  { step: 4, label: "지원 신청" },
  { step: 5, label: "창업" },
];

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  currentStep,
  style,
  compact = false,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.stepsRow}>
        {STEPS.map((item, index) => {
          const isDone = item.step < currentStep;
          const isCurrent = item.step === currentStep;

          return (
            <React.Fragment key={item.step}>
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.circle,
                    isDone && styles.circleDone,
                    isCurrent && styles.circleCurrent,
                  ]}
                >
                  {isDone ? (
                    <Check size={12} color={COLORS.surface} strokeWidth={2.2} />
                  ) : (
                    <Text
                      style={[
                        styles.circleText,
                        isCurrent && styles.circleTextCurrent,
                      ]}
                    >
                      {item.step}
                    </Text>
                  )}
                </View>
                {!compact && (
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.stepLabel,
                      isCurrent && styles.stepLabelCurrent,
                      isDone && styles.stepLabelDone,
                    ]}
                  >
                    {item.label}
                  </Text>
                )}
              </View>
              {index < STEPS.length - 1 && (
                <View
                  style={[
                    styles.line,
                    compact ? styles.lineCompact : null,
                    index + 1 < currentStep && styles.lineDone,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
      {compact && (
        <View style={styles.compactLabelRow}>
          <Text style={styles.compactCurrentText}>
            현재 단계: <Text style={styles.compactStepHighlight}>{STEPS[currentStep - 1]?.label || ""}</Text>
          </Text>
          <Text style={styles.compactStepCount}>{currentStep}/5단계</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    width: "100%",
  },
  stepsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: METRICS.borderRadiusFull,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: "center",
    justifyContent: "center",
  },
  circleDone: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  circleCurrent: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  circleText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
    fontVariant: TYPOGRAPHY.fontVariantTabular,
  },
  circleTextCurrent: {
    color: COLORS.surface,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.line,
    marginHorizontal: 4,
    marginBottom: 16,
  },
  lineCompact: {
    marginBottom: 0,
  },
  lineDone: {
    backgroundColor: COLORS.primary,
  },
  stepLabel: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: "500",
  },
  stepLabelCurrent: {
    color: COLORS.accent,
    fontWeight: "700",
  },
  stepLabelDone: {
    color: COLORS.textPrimary,
  },
  compactLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  compactCurrentText: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  compactStepHighlight: {
    color: COLORS.accent,
    fontWeight: "700",
  },
  compactStepCount: {
    fontFamily: TYPOGRAPHY.bodyFont,
    fontSize: 11,
    color: COLORS.textSecondary,
    fontVariant: TYPOGRAPHY.fontVariantTabular,
  },
});
