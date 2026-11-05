import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  PressableProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";

export type ButtonVariant = "primary" | "secondary" | "google" | "outline";

interface ButtonProps extends PressableProps {
  title?: string;
  children?: React.ReactNode;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
}

export function Button({
  title,
  children,
  variant = "primary",
  icon,
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
        if (title || icon) {
          return (
            <View style={styles.contentContainer}>
              {icon && <View style={styles.iconContainer}>{icon}</View>}
              {title && (
                <Text
                  style={[
                    styles.textBase,
                    textVariants[variant],
                    pressed && !disabled && textPressedVariants[variant],
                  ]}
                >
                  {title}
                </Text>
              )}
            </View>
          );
        }

        return children;
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginRight: 8,
  },
  textBase: {
    fontSize: 16,
    fontWeight: "600",
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
  google: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDDDDD",
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
  google: {
    backgroundColor: "#F5F5F5",
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
  google: {
    color: "#333333",
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
    color: "#FFFFFF",
  },
  secondary: {
    color: "#FFFFFF",
  },
  google: {
    color: "#000000",
  },
  outline: {
    color: "#388E3C",
  },
});
