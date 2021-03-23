import React from "react";
import { useHistory } from "react-router-dom";
import { DataGrid } from '@material-ui/data-grid';

export const StudentsDataGrid = ({ dbData }) => {
	const [selection, setSelection] = React.useState([]);

	const sortModel = [
		{
			field: "firstName",
			sort: "asc"
		}
	];

	const history = useHistory();

	const onSelectionChanged = (event) => {
		setSelection(event.data);
		history.push({
			pathname: '/studentform',
			state: event.data
		});
	};

	const columns = [
		{
			field: 'id', headerName: 'ID', hide: true
			/* 			renderCell: (params) => (
							<Link href={`editstudent?id=${params.value}`} to={{ pathname: 'editstudent/', query: { id: params.value } }}>edit</Link>
						), */
		},
		{ field: 'firstName', headerName: 'Name', width: 120 },
		{ field: 'lastName', headerName: 'Surname', width: 150 },
		{ field: 'email', headerName: 'Email', width: 250 },
		{ field: 'phoneNumber', headerName: 'Phone', width: 150 },
		{ field: 'dateOfBirth', headerName: 'DOB', type: 'date', width: 200 },
		{ field: 'className', headerName: 'Class', width: 100 },
		{ field: 'teacherName', headerName: 'Teacher', width: 200 }
	];

	return (
		<div style={{ height: '40vw', width: '95vw' }}>
			<DataGrid rows={dbData} columns={columns} pageSize={10} sortingOrder={["desc", "asc"]} sortModel={sortModel} onRowSelected={onSelectionChanged} />
		</div>
	);
};
