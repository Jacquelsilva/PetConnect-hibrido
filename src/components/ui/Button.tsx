import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  PressableProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

export type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps extends PressableProps {
  title?: string;
  children?: React.ReactNode;
  variant?: ButtonVariant;
}

export function Button({
  title,
  children,
  variant = "primary",
  style,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        buttonVariants[variant],
        pressed && !disabled && buttonPressedVariants[variant],
        disabled && styles.disabled,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
      {...rest}
    >
      {({ pressed }) => {
        // Se a prop 'title' for informada, renderiza o Text padrão
        if (title) {
          return (
            <Text
              style={[
                styles.textBase,
                textVariants[variant],
                pressed && !disabled && textPressedVariants[variant],
              ]}
            >
              {title}
            </Text>
          );
        }

        // Caso contrário, renderiza os filhos passados na tag
        return children;
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  textBase: {
    fontSize: 16,
    fontWeight: "bold",
  },
  disabled: {
    opacity: 0.5,
  },
});

const buttonVariants: Record<
  ButtonVariant,
  StyleProp<ViewStyle>
> = StyleSheet.create({
  primary: {
    backgroundColor: "#4CAF50",
  },
  secondary: {
    backgroundColor: "#6C757D",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#4CAF50",
  },
});

const buttonPressedVariants: Record<
  ButtonVariant,
  StyleProp<ViewStyle>
> = StyleSheet.create({
  primary: {
    backgroundColor: "#388E3C",
  },
  secondary: {
    backgroundColor: "#5A6268",
  },
  outline: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
  },
});

const textVariants: Record<
  ButtonVariant,
  StyleProp<TextStyle>
> = StyleSheet.create({
  primary: {
    color: "#FFFFFF",
  },
  secondary: {
    color: "#FFFFFF",
  },
  outline: {
    color: "#4CAF50",
  },
});

const textPressedVariants: Record<
  ButtonVariant,
  StyleProp<TextStyle>
> = StyleSheet.create({
  primary: {
    color: "#F0F0F0",
  },
  secondary: {
    color: "#F0F0F0",
  },
  outline: {
    color: "#388E3C",
  },
});
