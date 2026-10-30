import FieldHeader from "./FieldHeader";
import type { MyFieldModel } from "./field-types";
import FieldHome from "./FieldHome";

export default function FieldApp({ model = null }: { model?: MyFieldModel | null }) {
	return (
		<>
			<FieldHeader active="home" />
			<main
				id="main"
				className="min-h-screen w-full min-w-0 bg-surface-deep px-4 py-8 sm:px-7 sm:py-10"
			>
				<FieldHome model={model} />
			</main>
		</>
	);
}
