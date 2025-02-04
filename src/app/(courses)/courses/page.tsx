import { cn } from "@/lib/utils"

export default function Page() {
  return (
    <div className="bg-white">
      <div className="space-y-4 p-4">
        <div>Page content.</div>
        <div
          className={cn(
            "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3",
            "xl:grid-cols-4 2xl:grid-cols-5"
          )}
        >
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="h-44 w-full rounded-md border border-gray-200 bg-gray-100"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
