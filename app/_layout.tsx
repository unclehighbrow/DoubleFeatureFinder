import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { ListingsContext, ManualContext } from "@/constants/Context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [listings, setListings] = useState(null);
  const [manual, setManual] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ManualContext.Provider value={{ manual, setManual }}>
      <ListingsContext.Provider value={{ listings, setListings }}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "Search",
            }}
          />
          <Stack.Screen
            name="SearchResults"
            options={{
              title: "Search Results",
            }}
          />
          <Stack.Screen
            name="DoubleFeatures"
            options={{
              title: "Double Features",
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ListingsContext.Provider>
    </ManualContext.Provider>
  );
}
