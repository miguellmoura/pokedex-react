import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import HomeScreen from "./src/screens/HomeScreen";
import DetalhesScreen from "./src/screens/DetalhesScreen";
import { FavoritosProvider } from "./src/context/FavoritosContext";
import FavoritesScreen from "./src/screens/FavoritesScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <FavoritosProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Detalhes" component={DetalhesScreen} />
          <Stack.Screen name="Favoritos" component={FavoritesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritosProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
