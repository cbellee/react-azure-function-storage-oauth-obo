import { useEffect, useState } from "react";

// Msal imports
import { MsalAuthenticationTemplate, useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";
import { apiConfig } from "../apiConfig";

// App imports
import { Loading } from "./Loading";
import { ErrorComponent } from "./ErrorComponent";
import { StudentDocument } from "./StudentDocument";

// Material-ui imports
import Paper from "@material-ui/core/Paper";
import { callListBlobApi } from "../utils/AzureApiCall";

// var containerName = 'test-container';

const StudentDocumentContent = ({ containerName }) => {
	const { inProgress } = useMsal();
	const [documentData, setDocumentData] = useState(null);
	var endpoint = `${apiConfig.endpoint}/blob/list?container=${containerName}`;

	useEffect(() => {
		if (inProgress === InteractionStatus.None) {
			callListBlobApi(endpoint)
				.then(response => setDocumentData(response));
		}
	}, [inProgress]);

	return (
		<div>
			{ documentData ? <StudentDocument documentData={documentData} /> : null}
		</div>
	);
};

export function ListDocuments({ containerName }) {
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
			<StudentDocumentContent containerName={containerName} />
		</MsalAuthenticationTemplate>
	)
};