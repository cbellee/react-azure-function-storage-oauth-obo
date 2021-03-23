import { useEffect, useState } from "react";

// Msal imports
import { MsalAuthenticationTemplate, useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";
import { apiConfig } from "../apiConfig";

// App imports
import { Loading } from "./Loading";
import { ErrorComponent } from "./ErrorComponent";
import { StudentsDataGrid } from "./StudentsDataGrid";

// Material-ui imports
import Paper from "@material-ui/core/Paper";
import { callQueryAzureDbApi } from "../utils/AzureApiCall";
import { Typography } from "@material-ui/core";
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

const StudentListContent = () => {
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
			{ dbData ? <StudentsDataGrid dbData={dbData} /> : null}
		</Paper>
	);
};

export function ListStudents() {
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
			<Grid container xs={12} >
				<Grid item xs={12}>
					<Typography variant="h5">Students</Typography>
					<Divider></Divider>
				</Grid>
				<Grid item xs={12}>
					<StudentListContent />
				</Grid>
			</Grid>
		</MsalAuthenticationTemplate>
	)
};