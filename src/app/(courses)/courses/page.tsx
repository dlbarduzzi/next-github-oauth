import { cn } from "@/lib/utils"

export default function Page() {
  return (
    <div className="bg-white">
      <div className="space-y-4 p-4">
        <div>Page content.</div>
        <ul
          role="list"
          className={cn(
            "grid grid-cols-1 gap-5 gap-x-4 md:grid-cols-2 lg:grid-cols-3",
            "xl:grid-cols-4 2xl:grid-cols-5"
          )}
        >
          {Array.from({ length: 13 }).map((_, index) => (
            <li key={index} className="relative">
              <div className="rounded-lg bg-gray-100">
                <div className="aspect-[10/7]" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
