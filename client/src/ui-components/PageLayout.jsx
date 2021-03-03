import Typography from "@material-ui/core/Typography";
import NavBar from "./NavBar";

export const PageLayout = (props) => {
    return (
        <>
            <NavBar />
            <Typography variant="h5">
            </Typography>
            <br/>
            <br/>
            {props.children}
        </>
    );
};