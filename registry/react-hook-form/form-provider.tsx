import {
	FormProvider as Form,
	SubmitHandler,
	UseFormReturn,
} from 'react-hook-form';

// ----------------------------------------------------------------------

type Props = {
	id?: string;
	children: React.ReactNode;
	methods: UseFormReturn<any>;
	onSubmit: SubmitHandler<any>;
	onError?: (errors: any) => void;
	autocomplete?: string | undefined;
	className?: string;
};

export default function FormProvider({
	id,
	children,
	onSubmit,
	methods,
	autocomplete,
	className,
}: Props) {
	const handleFormSubmit = (data: any) => {
		return onSubmit(data);
	};



	return (
		<Form {...methods}>
			<form
				id={id}
				onSubmit={methods.handleSubmit(handleFormSubmit)}
				autoComplete={autocomplete}
				className={className}
			>
				{children}
				{/* ...existing code... */}
			</form>
		</Form>
	);
}
