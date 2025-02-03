import { cn } from "@/lib/utils"

export function LoadingDots() {
  return (
    <div className="inline-flex gap-x-2">
      <span
        className={cn("animate-loading-dots inline-flex size-3 rounded-full bg-black")}
      />
      <span
        className={cn(
          "animate-loading-dots inline-flex size-3 rounded-full bg-black delay-100"
        )}
      />
      <span
        className={cn(
          "animate-loading-dots inline-flex size-3 rounded-full bg-black delay-200"
        )}
      />
    </div>
  )
}
