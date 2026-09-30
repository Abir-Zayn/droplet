import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import React, { useEffect, useState } from "react";
import { ImageSourcePropType } from "react-native";

type MaterialIconName = Parameters<typeof MaterialIcons.getImageSource>[0];

function useIconSource(name: MaterialIconName, size = 24, color = "#000") {
    const [src, setSrc] = useState<ImageSourcePropType>();
    useEffect(() => {
        MaterialIcons.getImageSource(name, size, color).then(setSrc);
    }, [name, size, color]);
    return src;
}

export default function TabLayout() {
    return (
        <NativeTabs
            backgroundColor="#0B0E14"
            tintColor="#4A9EFF"
            iconColor={{ default: "#5C5F68", selected: "#4A9EFF" }}
            labelStyle={{
                default: { color: "#5C5F68" },
                selected: { color: "#4A9EFF" },
            }}
        >

            <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Icon src={useIconSource("home")} />
                <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="transactions">
                <NativeTabs.Trigger.Icon src={useIconSource("list")} />
                <NativeTabs.Trigger.Label>Transactions</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="assistant">
                <NativeTabs.Trigger.Icon src={useIconSource("psychology")} />
                <NativeTabs.Trigger.Label>Assistant</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="profile">
                <NativeTabs.Trigger.Icon src={useIconSource("person")} />
                <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>

        </NativeTabs>
    )
}