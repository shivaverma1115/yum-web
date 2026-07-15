import type { ElementType, HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils/helpers';

export type SkeletonTone = 'default' | 'soft' | 'inverse';
export type SkeletonRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

const toneClasses: Record<SkeletonTone, string> = {
	default: 'skel-tone-default',
	soft: 'skel-tone-soft',
	inverse: 'skel-tone-inverse',
};

const radiusClasses: Record<SkeletonRadius, string> = {
	none: 'rounded-none',
	sm: 'rounded',
	md: 'rounded-md',
	lg: 'rounded-lg',
	xl: 'rounded-xl',
	full: 'rounded-full',
};


export interface SkeletonBoxProps extends HTMLAttributes<HTMLElement> {
	as?: ElementType;
	animated?: boolean;
	tone?: SkeletonTone;
	radius?: SkeletonRadius;
}

export function SkeletonBox({
	as: Component = 'div',
	animated = true,
	tone = 'default',
	radius = 'md',
	className,
	...props
}: SkeletonBoxProps) {
	return (
		<Component
			aria-hidden
			className={cn('skel', toneClasses[tone], radiusClasses[radius], animated && 'skel-animated', className)}
			{...props}
		/>
	);
}

interface SkeletonTextProps {
	lines?: number;
	widths?: Array<string | number>;
	lineClassName?: string;
	containerClassName?: string;
	animated?: boolean;
	tone?: SkeletonTone;
}

function getLineWidth(width: string | number | undefined) {
	if (typeof width === 'number') {
		return { style: { width: `${width}%` } };
	}

	if (typeof width === 'string' && width.trim().endsWith('%')) {
		return { style: { width } };
	}

	return { className: width ?? 'w-full' };
}

export function SkeletonText({
	lines = 2,
	widths,
	lineClassName,
	containerClassName,
	animated = true,
	tone = 'default',
}: SkeletonTextProps) {
	return (
		<div className={cn('space-y-2', containerClassName)} aria-hidden>
			{Array.from({ length: lines }).map((_, index) => {
				const widthProps = getLineWidth(widths?.[index]);

				return (
					<SkeletonBox
						// eslint-disable-next-line react/no-array-index-key
						key={index}
						tone={tone}
						animated={animated}
						radius="md"
						className={cn('skel-line', widthProps.className, lineClassName)}
						style={widthProps.style}
					/>
				);
			})}
		</div>
	);
}

type SkeletonAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const avatarSizeClasses: Record<SkeletonAvatarSize, string> = {
	xs: 'skel-avatar-xs',
	sm: 'skel-avatar-sm',
	md: 'skel-avatar-md',
	lg: 'skel-avatar-lg',
	xl: 'skel-avatar-xl',
};

interface SkeletonAvatarProps {
	size?: SkeletonAvatarSize;
	rounded?: boolean;
	className?: string;
	animated?: boolean;
	tone?: SkeletonTone;
}

export function SkeletonAvatar({
	size = 'md',
	rounded = true,
	className,
	animated = true,
	tone = 'default',
}: SkeletonAvatarProps) {
	return (
		<SkeletonBox
			tone={tone}
			animated={animated}
			radius={rounded ? 'full' : 'lg'}
			className={cn(avatarSizeClasses[size], className)}
		/>
	);
}

type SkeletonCardVariant = 'default' | 'banner' | 'list-item';

const cardVariantClasses: Record<SkeletonCardVariant, string> = {
	default: 'skel-card',
	banner: 'skel-card-banner',
	'list-item': 'skel-card-list',
};

interface SkeletonCardProps {
	variant?: SkeletonCardVariant;
	className?: string;
	header?: ReactNode;
	footer?: ReactNode;
	children?: ReactNode;
	padded?: boolean;
	animated?: boolean;
}

export function SkeletonCard({
	variant = 'default',
	className,
	header,
	footer,
	children,
	padded = true,
	animated = true,
}: SkeletonCardProps) {
	return (
		<div
			aria-hidden
			className={cn(
				cardVariantClasses[variant],
				padded && (variant === 'banner' ? 'p-6 md:p-8' : 'p-5 md:p-6'),
				animated && 'skel-animated',
				className
			)}
		>
			{header}
			{children}
			{footer}
		</div>
	);
}

interface SkeletonListProps {
	rows?: number;
	rowClassName?: string;
	containerClassName?: string;
	showLeading?: boolean;
	showTrailing?: boolean;
	lineCount?: number;
	animated?: boolean;
	tone?: SkeletonTone;
}

export function SkeletonList({
	rows = 3,
	rowClassName,
	containerClassName,
	showLeading = true,
	showTrailing = true,
	lineCount = 2,
	animated = true,
	tone = 'default',
}: SkeletonListProps) {
	return (
		<div className={cn('space-y-3', containerClassName)} aria-hidden>
			{Array.from({ length: rows }).map((_, index) => (
				<div
					// eslint-disable-next-line react/no-array-index-key
					key={index}
					className={cn('skel-card-list flex items-center gap-3 p-4', rowClassName)}
				>
					{showLeading && <SkeletonAvatar size="md" tone={tone} animated={animated} />}
					<div className="min-w-0 flex-1">
						<SkeletonText
							lines={lineCount}
							widths={['70%', '45%']}
							animated={animated}
							tone={tone}
							lineClassName="skel-line-sm"
						/>
					</div>
					{showTrailing && (
						<div className="shrink-0 space-y-2">
							<SkeletonBox tone={tone} animated={animated} className="skel-line-sm w-16" />
							<SkeletonBox tone={tone} animated={animated} className="skel-line-sm w-10" />
						</div>
					)}
				</div>
			))}
		</div>
	);
}

