import katex from 'katex';
import { createElement, useMemo } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

type FormulaViewProps = {
  formula: string;
  size?: 'small' | 'regular' | 'large';
  color?: string;
  style?: StyleProp<ViewStyle>;
  displayMode?: boolean;
};

export function FormulaView({ formula, size = 'regular', color, style, displayMode = true }: FormulaViewProps) {
  const html = useMemo(
    () => katex.renderToString(formula, {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: false,
    }),
    [displayMode, formula],
  );

  const className = `mr-katex mr-katex--${size}`;
  const htmlNode = createElement('span', {
    className,
    style: color ? { color } : undefined,
    dangerouslySetInnerHTML: { __html: html },
  } as never);

  return <View style={[styles.container, style]}>{htmlNode}</View>;
}

const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 24,
  },
} as const;
