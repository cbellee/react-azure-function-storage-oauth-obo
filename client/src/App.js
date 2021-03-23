import { Switch, Route } from "react-router-dom";
import Grid from "@material-ui/core/Grid";

// MSAL imports
import { MsalProvider } from "@azure/msal-react";

// Sample app imports
import { PageLayout } from "./ui-components/PageLayout";
import { Home } from "./pages/Home";
import { ListStudents } from "./ui-components/ListStudents";
import { StudentForm } from "./ui-components/StudentForm";
import { createMuiTheme } from '@material-ui/core/styles';
import { MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
	overrides: {
		MuiGrid: {
			root: {
				paddingTop: "20px",
				marginLeft: "10px"
			}
		}
	}
});

function App({ pca }) {
	return (
		<MsalProvider instance={pca}>
			<MuiThemeProvider theme={theme}>
				<PageLayout>
					<Grid container justify="center">
						<Pages />
					</Grid>
				</PageLayout>
			</MuiThemeProvider>
		</MsalProvider>
	);
}

function Pages() {
	return (
		<Switch>
			<Route path="/liststudents">
				<ListStudents />
			</Route>
			<Route path="/studentform">
				<StudentForm />
			</Route>
			<Route path="/">
				<Home />
			</Route>
		</Switch>
	)
}

export default App;
