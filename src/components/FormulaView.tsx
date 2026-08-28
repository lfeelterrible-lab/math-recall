import { Text, type StyleProp, type TextStyle } from 'react-native';

type FormulaViewProps = {
  formula: string;
  size?: 'small' | 'regular' | 'large';
  color?: string;
  style?: StyleProp<TextStyle>;
  displayMode?: boolean;
};

export function FormulaView({ formula, color, style }: FormulaViewProps) {
  return <Text style={[{ color, fontFamily: 'serif', fontSize: 18 }, style]}>{formula}</Text>;
}
