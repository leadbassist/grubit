import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";

export const useAdminOrderList = ({ archived = false }) => {
    return useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
          const { data, error } = await supabase
            .from("orders")
            .select("*")
            .in('status', ['New', 'Cooking', 'Delivering']);
          if (error) {
            throw new Error(error.message);
          }
          return data;
        },
    });
}

export const useMyOrderList = () => {
    const { session } = useAuth();
    const id = session?.user.id;
    // console.log(id);

    return useQuery({
        queryKey: ["orders", { userId: id }],
        queryFn: async () => {
            if (!id) return null;
          const { data, error } = await supabase.from("orders").select("*").eq('user_id', id);
          if (error) {
            throw new Error(error.message);
          }
          return data;
        },
    });
}