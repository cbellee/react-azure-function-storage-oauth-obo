import { useEffect, useState } from "react";

// Msal imports
import { MsalAuthenticationTemplate, useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";
import { apiConfig } from "../apiConfig";

// App imports
import { Loading } from "./Loading";
import { ErrorComponent } from "./ErrorComponent";
import { StudentData } from "./StudentsDataGrid";

// Material-ui imports
import Paper from "@material-ui/core/Paper";
import { callQueryAzureDbApi } from "../utils/AzureApiCall";

const EditStudentContent = () => {
	const { inProgress } = useMsal();
	const [dbData, setDbData] = useState(null);

	useEffect(() => {
		if (inProgress === InteractionStatus.None) {
			callQueryAzureDbApi(`${apiConfig.endpoint}/db`)
				.then(response => setDbData(response));
		}
	}, [inProgress]);

	return (
		<Paper>
			{ dbData ? <StudentData dbData={dbData} /> : null}
		</Paper>
	);
};

export function EditStudentData() {
	const authRequest = {
		...loginRequest
	};

	return (
		<MsalAuthenticationTemplate
			interactionType={InteractionType.Popup}
			authenticationRequest={authRequest}
			errorComponent={ErrorComponent}
			loadingComponent={Loading}
		>
			<EditStudentContent />
		</MsalAuthenticationTemplate>
	)
};