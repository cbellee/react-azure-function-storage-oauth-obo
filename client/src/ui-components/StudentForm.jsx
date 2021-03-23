import { useLocation } from "react-router-dom";
import { TextField } from '@material-ui/core';
import { useForm, Controller } from "react-hook-form";
import Grid from '@material-ui/core/Grid';
import { ListDocuments } from "./ListDocuments";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

export const StudentForm = () => {

	const location = useLocation();

	const { handleSubmit, control, errors: fieldsErrors, register } = useForm({
		defaultValues: location.state
	});

	const onSubmitEditStudent = async data => {
		// save changes to database
	}

	console.log('props: ', location.state.firstName);
	return (
		<div>
			<Typography variant="h5"> Student</Typography>
			<Divider></Divider>
			<form onSubmit={handleSubmit(onSubmitEditStudent)}>
				<Grid container justify="center" spacing={4} xs={12} margin={2}>
					<Grid item xs={6}>
						<Controller
							control={control}
							name="firstName"
							render={(
								{ onChange, onBlur, value, name, ref }
							) => (
								<TextField
									inputRef={ref}
									label="First Name"
									value={value}
									onChange={(e) => onChange(e.target.value)}
									fullWidth={true}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={6}>
						<Controller
							control={control}
							name="middleName"
							render={(
								{ onChange, onBlur, value, name, ref }
							) => (
								<TextField
									inputRef={ref}
									label="Middle Name"
									value={value}
									onChange={(e) => onChange(e.target.value)}
									fullWidth={true}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={6}>
						<Controller
							control={control}
							name="lastName"
							render={(
								{ onChange, onBlur, value, name, ref }
							) => (
								<TextField
									inputRef={ref}
									label="Last Name"
									value={value}
									onChange={(e) => onChange(e.target.value)}
									fullWidth={true}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={6}>
						<Controller
							control={control}
							name="email"
							render={(
								{ onChange, onBlur, value, name, ref }
							) => (
								<TextField
									inputRef={ref}
									label="Email"
									value={value}
									onChange={(e) => onChange(e.target.value)}
									fullWidth={true}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={6}>
						<Controller
							control={control}
							name="phoneNumber"
							render={(
								{ onChange, onBlur, value, name, ref }
							) => (
								<TextField
									inputRef={ref}
									label="Phone"
									value={value}
									onChange={(e) => onChange(e.target.value)}
									fullWidth={true}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={6}>
						<Controller
							control={control}
							name="dateOfBirth"
							render={(
								{ onChange, onBlur, value, name, ref }
							) => (
								<TextField
									inputRef={ref}
									label="Date Of Birth"
									value={value}
									onChange={(e) => onChange(e.target.value)}
									fullWidth={true}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={6}>
						<Controller
							control={control}
							name="className"
							render={(
								{ onChange, onBlur, value, name, ref }
							) => (
								<TextField
									inputRef={ref}
									label="Class Name"
									value={value}
									onChange={(e) => onChange(e.target.value)}
									fullWidth={true}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={6}>
						<Controller
							control={control}
							name="teacherName"
							render={(
								{ onChange, onBlur, value, name, ref }
							) => (
								<TextField
									inputRef={ref}
									label="Teacher Name"
									value={value}
									onChange={(e) => onChange(e.target.value)}
									fullWidth={true}
								/>
							)}
						/>
					</Grid>
					<Grid item
						container
						direction="column"
						alignItems="flex-end"
						justify="flex-start" >
						<Button style={{ flex: 1 }} justify="space-between" variant="contained" color="primary">Submit</Button>
					</Grid>
				</Grid>
			</form>
			<Typography variant="h5">Documents</Typography>
			<Divider></Divider>
			<ListDocuments containerName={location.state.id}></ListDocuments>
		</div>
	);
};

export default StudentForm
