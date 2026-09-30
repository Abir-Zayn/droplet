import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    type Insets,
    Pressable,
    type StyleProp,
    StyleSheet,
    type ViewStyle,
} from "react-native";

export type AppBackButtonProps = {
    onPress?: () => void;
    color?: string;
    size?: number;
    disabled?: boolean;
    hitSlop?: Insets | number;
    style?: StyleProp<ViewStyle>;
};

export function AppBackButton({
    onPress,
    color = "#E7EAF0",
    size = 24,
    disabled = false,
    hitSlop = 8,
    style,
}: AppBackButtonProps) {
    const router = useRouter();

    const handlePress = () => {
        if (disabled) return;
        if (onPress) {
            onPress();
        } else if (router.canGoBack()) {
            router.back();
        }
    };

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            accessibilityState={{ disabled }}
            disabled={disabled}
            hitSlop={hitSlop}
            onPress={handlePress}
            style={({ pressed }) => [
                styles.button,
                pressed && styles.pressed,
                disabled && styles.disabled,
                style,
            ]}
        >
            <MaterialIcons
                name="arrow-back"
                size={size}
                color={color}
            />
        </Pressable>
    );
}

export default AppBackButton;

const styles = StyleSheet.create({
    button: {
        padding: 8,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        borderCurve: "continuous",
    },
    pressed: {
        opacity: 0.7,
    },
    disabled: {
        opacity: 0.4,
    },
});