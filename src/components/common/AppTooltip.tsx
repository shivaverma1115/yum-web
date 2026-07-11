"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils/helpers";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-is-mobile";

type AppTooltipProps = {
	children: React.ReactNode;

	/** Tooltip text or JSX */
	content: React.ReactNode;

	/** Position */
	side?: "top" | "bottom" | "left" | "right";

	/** Alignment */
	align?: "start" | "center" | "end";

	/** Offset from trigger */
	sideOffset?: number;

	/** Disable tooltip */
	disabled?: boolean;

	/** Custom class — merged after default dark styles */
	contentClassName?: string;

	/** Optional class for the arrow square (e.g. match a light tooltip via `!bg-white`) */
	arrowClassName?: string;

	/** Show arrow */
	showArrow?: boolean;

	/**
	 * Force click (popover) vs hover (tooltip).
	 * When omitted, uses viewport: mobile → popover, desktop → tooltip.
	 */
	isMobile?: boolean;
};

export function AppTooltip({
	children,
	content,
	side = "top",
	align = "center",
	sideOffset = 6,
	disabled = false,
	contentClassName,
	arrowClassName,
	showArrow = true,
	isMobile: isMobileProp,
}: AppTooltipProps) {
	const isMobileDetected = useIsMobile();
	const useClickMode = isMobileProp ?? isMobileDetected;

	if (disabled || !content) {
		return <>{children}</>;
	}

	// 📱 Mobile / click → Popover
	if (useClickMode) {
		return (
			<Popover>
				<PopoverTrigger asChild>{children}</PopoverTrigger>

				<PopoverContent
					side={side}
					align={align}
					sideOffset={sideOffset}
					collisionPadding={12}
					className={cn(
						"z-[100] w-auto max-w-xs rounded-md px-3 py-2 text-sm shadow-md",
						"bg-gray-900 text-white dark:bg-gray-800",
						contentClassName
					)}
				>
					{content}

					{showArrow ? (
						<PopoverPrimitive.Arrow
							width={12}
							height={6}
							className={cn("fill-gray-900 dark:fill-gray-800", arrowClassName)}
						/>
					) : null}
				</PopoverContent>
			</Popover>
		);
	}

	// 🖥️ Desktop → Tooltip (hover)
	return (
		<TooltipPrimitive.Provider delayDuration={200}>
			<Tooltip>
				<TooltipTrigger asChild>{children}</TooltipTrigger>

				<TooltipContent
					side={side}
					align={align}
					sideOffset={sideOffset}
					collisionPadding={12}
					className={cn(
						/* Above modals (z-50); portaled via ui/tooltip */
						"z-[100] overflow-visible rounded-lg border-0 bg-black px-3 py-2 text-sm font-medium leading-snug text-white shadow-lg",
						contentClassName
					)}
				>
					{content}

					{showArrow ? (
						<TooltipPrimitive.Arrow
							width={12}
							height={6}
							className={cn("fill-black", arrowClassName)}
						/>
					) : null}
				</TooltipContent>
			</Tooltip>
		</TooltipPrimitive.Provider>
	);
}
