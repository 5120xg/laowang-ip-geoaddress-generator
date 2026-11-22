import { useQuery } from "@tanstack/react-query";
import { fetchCurrentIP } from "@/services/ipService";

export default function useIP() {
  const query = useQuery({
    queryKey: ["current-ip"],
    queryFn: fetchCurrentIP,
    staleTime: Infinity,
  });

  return {
    ip: query.data ?? "",
    isLoading: query.isLoading,
    error: query.error,
  };
}
