import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import Typography from "@material-ui/core/Typography";

export function Home() {
  return (
      <>
          <AuthenticatedTemplate>
          </AuthenticatedTemplate>

          <UnauthenticatedTemplate>
            <Typography variant="h6">
              <center>Please sign-in.</center>
            </Typography>
          </UnauthenticatedTemplate>
      </>
  );
}