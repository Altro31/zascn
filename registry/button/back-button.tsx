'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Props {
	path?: string;
}

export function BackButton({ path }: Props) {
	const router = useRouter();

	const handleBack = () => router.back();

	return path ? (
		<Button
			variant='outline'
			asChild
		>
			<Link href={path}>← Volver</Link>
		</Button>
	) : (
		<Button
			variant='outline'
			onClick={handleBack}
		>
			← Volver
		</Button>
	);
}
