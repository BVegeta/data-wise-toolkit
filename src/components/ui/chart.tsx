// Simplified chart component to avoid TypeScript issues
import * as React from "react"
import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config?: any
    children: React.ReactNode
  }
>(({ children, className, config, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      {children}
    </div>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />
})
ChartTooltip.displayName = "ChartTooltip"

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />
})
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />
})
ChartLegend.displayName = "ChartLegend"

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />
})
ChartLegendContent.displayName = "ChartLegendContent"

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
}