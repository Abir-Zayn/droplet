import { useAuth } from "@clerk/expo";
import { Redirect, Slot } from "expo-router";

export default function RootLayout() {
    const { isSignedIn, isLoaded } = useAuth()


    // sync user state with Clerk to ensure that user saved on Supabase.
    if (!isLoaded) {
        return null
    }

    if (isSignedIn) {
        return <Redirect href="/(root)/(tabs)" />
    }

    return <Slot />
}