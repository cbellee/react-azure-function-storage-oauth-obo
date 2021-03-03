import { useEffect, useState } from "react";

// Msal imports
import { MsalAuthenticationTemplate, useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionType } from "@azure/msal-browser";
import { apiConfig, loginRequest } from "../authConfig";

// App imports
import { Loading } from "../ui-components/Loading";
import { ErrorComponent } from "../ui-components/ErrorComponent";
import { DocumentData } from "../ui-components/DocumentData";

// Material-ui imports
import Paper from "@material-ui/core/Paper";
import { callListBlobApi } from "../utils/AzureStorageApiCall";

const DocumentContent = () => {
	const { inProgress } = useMsal();
	const [documentData, setDocumentData] = useState(null);
	const endpoint = `${apiConfig.listEndpoint}`;

	useEffect(() => {
		if (inProgress === InteractionStatus.None) {
			callListBlobApi(apiConfig.listEndpoint)
				.then(response => setDocumentData(response));
		}
	}, [inProgress]);

	return (
		<Paper>
			{ documentData ? <DocumentData documentData={documentData} /> : null}
		</Paper>
	);
};

export function Document() {
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
			<DocumentContent />
		</MsalAuthenticationTemplate>
	)
};