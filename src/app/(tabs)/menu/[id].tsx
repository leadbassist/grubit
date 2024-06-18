import { View, Text } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";

const ProductDetailsScreen = () => {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Stack.Screen options={{ title: "Details: " + id }} />
      <Text>ProductDetailsScreen for id: {id}</Text>
    </View>
  );
};

export default ProductDetailsScreen;