import { Switch, Route, useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";

// MSAL imports
import { MsalProvider } from "@azure/msal-react";

// Sample app imports
import { PageLayout } from "./ui-components/PageLayout";
import { Home } from "./pages/Home";
import { Document } from "./pages/Document";

function App({ pca }) {
	return (
		<MsalProvider instance={pca}>
			<PageLayout>
				<Grid container justify="center">
					<Pages />
				</Grid>
			</PageLayout>
		</MsalProvider>
	);
}

function Pages() {
	return (
		<Switch>
			<Route path="/document">
				<Document />
			</Route>
			<Route path="/">
				<Home />
			</Route>
		</Switch>
	)
}

export default App;
