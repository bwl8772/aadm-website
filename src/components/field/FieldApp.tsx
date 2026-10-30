import FieldHeader from "./FieldHeader";
import FieldHome from "./FieldHome";

export default function FieldApp() {
	return (
		<>
			<FieldHeader active="home" />
			<main
				id="main"
				className="mx-auto w-full min-w-0 max-w-5xl px-4 py-10 sm:px-8 sm:py-16"
			>
				<FieldHome />
			</main>
		</>
	);
}
