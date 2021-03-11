import { LogLevel } from "@azure/msal-browser";
// Browser check variables
// If you support IE, our recommendation is that you sign-in using Redirect APIs
// If you as a developer are testing using Edge InPrivate mode, please add "isEdge" to the if check
const ua = window.navigator.userAgent;
const msie = ua.indexOf("MSIE ");
const msie11 = ua.indexOf("Trident/");
const msedge = ua.indexOf("Edge/");
const firefox = ua.indexOf("Firefox");
const isIE = msie > 0 || msie11 > 0;
const isEdge = msedge > 0;
const isFirefox = firefox > 0; // Only needed if you need to support the redirect flow in Firefox incognito

// Config object to be passed to Msal on creation
export const msalConfig = {
	auth: {
		clientId: "1c0ddb7a-f862-455d-9e4f-8c64fc4cd489",
		authority: "https://login.microsoftonline.com/3d49be6f-6e38-404b-bbd4-f61c1a2d25bf",
		redirectUri: "http://localhost:3000",
		postLogoutRedirectUri: "/"
	},
	cache: {
		storeAuthStateInCookie: isIE || isEdge || isFirefox
	},
	system: {
		loggerOptions: {
			loggerCallback: (level, message, containsPii) => {
				if (containsPii) {
					return;
				}
				switch (level) {
					case LogLevel.Error:
						console.error(message);
						return;
					case LogLevel.Info:
						console.info(message);
						return;
					case LogLevel.Verbose:
						console.debug(message);
						return;
					case LogLevel.Warning:
						console.warn(message);
						return;
					default:
						return;
				}
			}
		}
	}
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest = {
	scopes: ["api://038554c4-271d-4c8f-ae72-56d3d23db9fc/storage.blob.read", "api://038554c4-271d-4c8f-ae72-56d3d23db9fc/sql.db.readwrite"]
};
