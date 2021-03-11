import { useLocation } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { FormControl, InputLabel, Input, Button, TextField } from '@material-ui/core';
import { useForm, Controller } from "react-hook-form";
import Grid from '@material-ui/core/Grid';
import { ListDocuments } from "./ListDocuments";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { Divider } from '@material-ui/core';

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
					</Grid>
				</form>
				<ListDocuments containerName={location.state.id}></ListDocuments>
			
		</div>
	);
};

export default StudentForm
