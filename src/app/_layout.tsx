import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { configurarRed } from "../lib/network";
import { persister, queryClient } from "../lib/queryClient";
import { guardarRegistro } from "../lib/registro";

SplashScreen.preventAutoHideAsync();
configurarRed();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24,
      }}
      onSuccess={async () => {
        await guardarRegistro("Caché restaurada");
        await queryClient.resumePausedMutations();
      }}
    >
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AppTabs />
        <AnimatedSplashOverlay />
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
}
