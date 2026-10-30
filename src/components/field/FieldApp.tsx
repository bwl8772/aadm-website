import { CommandScopeProvider, useViewInvalidated } from "./commands";
import FieldHeader from "./FieldHeader";
import FieldHome from "./FieldHome";
import type { MyFieldView } from "./field-types";
import NextStepBanner from "./NextStepBanner";

/**
 * My Field shell. `view` is the parsed MyFieldView; `null` means the backend
 * could not be reached (contract state "Unavailable": no commands allowed).
 */
export default function FieldApp({ view }: { view: MyFieldView | null }) {
	useViewInvalidated("home");
	return (
		<CommandScopeProvider value={{ generated_at: view?.generated_at }}>
			<FieldHeader
				active="home"
				viewerInitials={view?.viewer.initials}
				captureAvailable={view?.capture.available ?? false}
			/>
			<NextStepBanner />
			<main
				id="main"
				className="min-h-screen w-full min-w-0 bg-surface-deep px-4 py-8 sm:px-7 sm:py-10"
			>
				{view ? (
					<FieldHome view={view} />
				) : (
					<div data-field-screen="home" data-field-state="unavailable">
						<h1 className="text-2xl font-bold text-foreground">
							My Field is unavailable
						</h1>
						<p className="mt-3 text-text-secondary">
							The Field service did not answer. No commands can be sent until it
							does.
						</p>
					</div>
				)}
			</main>
		</CommandScopeProvider>
	);
}
