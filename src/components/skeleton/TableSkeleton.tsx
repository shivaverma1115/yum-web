
import { cn } from '@/lib/utils/helpers';
import { SkeletonBox } from './SkeletonToolkit';

interface TableSkeletonProps {
	columns: number;
	rows: number;
	showHeader?: boolean;
	compact?: boolean;
	firstColWidthClassName?: string;
	cellClassName?: string;
	className?: string;
	animated?: boolean;
	tone?: 'default' | 'soft' | 'inverse';
}

export function TableSkeleton({
	columns,
	rows,
	showHeader = true,
	compact = false,
	firstColWidthClassName = 'w-44',
	cellClassName,
	className,
	animated = true,
	tone = 'soft',
}: TableSkeletonProps) {
	const safeColumns = Math.max(columns, 1);
	const safeRows = Math.max(rows, 1);

	return (
		<div className={cn('overflow-x-auto', className)} aria-hidden>
			<table className="w-full min-w-[600px] border-collapse">
				{showHeader && (
					<thead>
						<tr className="border-b border-default-200">
							{Array.from({ length: safeColumns }).map((_, colIndex) => (
								<th
									// eslint-disable-next-line react/no-array-index-key
									key={colIndex}
									className={cn(
										'px-3 text-left',
										compact ? 'py-2.5' : 'py-4',
										colIndex === 0 ? firstColWidthClassName : 'w-[120px] text-center'
									)}
								>
									<SkeletonBox
										tone={tone}
										animated={animated}
										className={cn('skel-line', colIndex === 0 ? 'w-24' : 'mx-auto w-16')}
									/>
								</th>
							))}
						</tr>
					</thead>
				)}
				<tbody>
					{Array.from({ length: safeRows }).map((_, rowIndex) => (
						<tr
							// eslint-disable-next-line react/no-array-index-key
							key={rowIndex}
							className="border-b border-default-200"
						>
							{Array.from({ length: safeColumns }).map((__, colIndex) => (
								<td
									// eslint-disable-next-line react/no-array-index-key
									key={colIndex}
									className={cn(
										'px-3',
										compact ? 'py-2.5' : 'py-4',
										colIndex === 0 ? 'text-left' : 'text-center',
										cellClassName
									)}
								>
									<SkeletonBox
										tone={tone}
										animated={animated}
										className={cn(colIndex === 0 ? 'skel-table-cell-text w-52 max-w-full' : 'skel-table-cell-check mx-auto')}
									/>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

