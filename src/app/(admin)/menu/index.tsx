import { View, FlatList, ActivityIndicator, Text } from "react-native";
import ProductListItem from "@/src/components/ProductListItem";
import { useProductList } from "@/src/api/products";

export default function MenuScreen() {
  const { data: products, error, isLoading } = useProductList();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch products</Text>;
  }
  return (
    <View>
      {/* <ProductListItem product={products[5]} />
      <ProductListItem product={products[1]} /> */}

      <FlatList
        data={products} // array of items that we want to render. the source data file
        renderItem={({ item }) => <ProductListItem product={item} />} // a function. tells flatlist how EACH item from the array should be rendered
        numColumns={2}
        contentContainerStyle={{ gap: 10, padding: 10 }} // gap on rows, gap AROUND the container
        columnWrapperStyle={{ gap: 10 }} // gap on columns
      />
    </View>
  );
}
