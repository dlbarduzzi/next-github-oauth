import { useQuery } from "@tanstack/react-query"
import { getCourses } from "@/features/courses/actions/courses"

export function useGetCourses({ enabled = true }: { enabled: boolean }) {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => getCourses(),
    retry: 0,
    staleTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
    enabled,
  })
}
