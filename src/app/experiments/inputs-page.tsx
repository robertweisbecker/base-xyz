import { ExperimentPage, ExperimentSection } from "./experiment-page";
import {
	ChoiceControlSizeComparison,
	ChoiceControlStateMatrix,
	ValueControlSizeComparison,
	ValueControlStateMatrix,
} from "./inputs-control-examples";
import { EnvironmentForm } from "./inputs-composed-form";
import { ComparisonContainer, ComparisonSubsection, ExperimentGroup } from "./inputs-comparison-layout";
import { CrossComponentRow, FieldSizingMatrix, FieldStateMatrix } from "./inputs-fields-examples";
import { InputGroupVariations, InputPaddingComparison } from "./inputs-input-group-examples";
import { comparisonLabelReset } from "./inputs-page.styles";

export function InputsPage() {
	return (
		<ExperimentPage
			description="Visual parity checks for field sizing, state styling, input-group composition, and control alignment."
			title="Inputs">
			<style>{comparisonLabelReset}</style>

			<ExperimentGroup
				description="Compare the shared field contract across component families before composing complete forms."
				title="Fields">
				<ComparisonContainer
					description="Compare component geometry across the shared small, medium, and large size scale."
					id="field-sizing"
					title="Sizing">
					<FieldSizingMatrix />
					<ComparisonSubsection
						description="Compare a standalone field, composed input group, and action at medium size."
						nested
						title="Cross-component row">
						<CrossComponentRow />
					</ComparisonSubsection>
				</ComparisonContainer>

				<ComparisonContainer
					description="One medium-size matrix keeps the common resting, filled, invalid, read-only, and disabled treatments visible together."
					id="field-states"
					title="States">
					<FieldStateMatrix />
				</ComparisonContainer>
			</ExperimentGroup>

			<ExperimentSection
				description="Realistic compositions exercise inline addons, actions, input types, and multiline content."
				title="Input Group">
				<InputGroupVariations />

				<ComparisonSubsection title="Input padding">
					<InputPaddingComparison />
				</ComparisonSubsection>
			</ExperimentSection>

			<ExperimentGroup
				description="Compare binary choice controls separately from compact controls that represent a changing value."
				title="Controls">
				<ComparisonContainer id="choice-control-sizing" title="Radio and checkbox sizing">
					<ChoiceControlSizeComparison />
				</ComparisonContainer>
				<ComparisonContainer id="choice-control-states" title="Radio and checkbox states">
					<ChoiceControlStateMatrix />
				</ComparisonContainer>
				<ComparisonContainer id="value-control-sizing" title="Switch and slider sizing">
					<ValueControlSizeComparison />
				</ComparisonContainer>
				<ComparisonContainer id="value-control-states" title="Switch and slider states">
					<ValueControlStateMatrix />
				</ComparisonContainer>
			</ExperimentGroup>

			<ExperimentSection
				description="The original product-shaped example remains available after the focused visual comparisons."
				title="Composed form">
				<EnvironmentForm />
			</ExperimentSection>
		</ExperimentPage>
	);
}
