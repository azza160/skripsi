'use client'

import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const LevelBar = ({ currentLevel = 1, currentExp = 150, maxExp = 200 }) => {
  const percentage = Math.min((currentExp / maxExp) * 100, 100)

  return (
    <TooltipProvider delayDuration={80}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-0 select-none">
            {/* Big Level Circle */}
            <div className="relative z-10 flex items-center justify-center h-10 w-10 rounded-full border-2 border-primary bg-gradient-to-br from-background to-secondary shadow-lg mr-[-12px]">
              <div className="absolute inset-0 rounded-full bg-primary/10" />
              <span className="relative z-10 text-xl font-extrabold text-primary drop-shadow-sm">
                {currentLevel}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="flex-1 h-5 rounded-r-full rounded-l-none border-2 border-primary bg-gradient-to-r from-primary/10 to-secondary/40 shadow-inner overflow-hidden flex items-center">
              <div
                className="h-full rounded-r-full transition-all duration-700 ease-out bg-primary/80"
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          className="select-none px-4 py-3 text-sm rounded-lg shadow-xl bg-card border border-border text-card-foreground z-50"
          side="top"
          align="center"
          sideOffset={8}
        >
          <div className="flex flex-col gap-2 text-sm">
  <div className="flex items-center justify-between gap-4">
    <span className="text-muted-foreground">Current Level</span>
    <span className="font-semibold text-primary">{currentLevel}</span>
  </div>
  <div className="flex items-center justify-between gap-4">
    <span className="text-muted-foreground">Total EXP</span>
    <span className="font-semibold text-primary">{currentExp}</span>
  </div>
  <div className="flex items-center justify-between gap-4">
    <span className="text-muted-foreground">Next Level</span>
    <span className="font-semibold text-primary">
      {maxExp ? `${maxExp} EXP` : <span className="text-green-600">MAX Level</span>}
    </span>
  </div>
</div>

        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default LevelBar
