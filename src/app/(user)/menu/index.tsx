import { View, FlatList } from "react-native";
import products from "@/assets/data/products";
import ProductListItem from "@/src/components/ProductListItem";

export default function MenuScreen() {
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
