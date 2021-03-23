import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import WelcomeName from "./WelcomeName";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SignInSignOutButton from "./SignInSignOutButton";
import useStyles from "../styles/useStyles";
import { Link as RouterLink } from "react-router-dom";

const NavBar = () => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<Typography className={classes.title}>
						<Link component={RouterLink} to="/" color="inherit" variant="h6">Student Management Portal</Link>
					</Typography>
					<WelcomeName />
					<SignInSignOutButton />
				</Toolbar>
				<Tabs>
					<Tab label="Students" component={RouterLink} to="/liststudents"/>
				</Tabs>
			</AppBar>
		</div>
	);
};

export default NavBar;