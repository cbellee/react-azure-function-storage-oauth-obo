import { DataGrid } from '@material-ui/data-grid';
import { apiConfig } from "../apiConfig";
import { callGetBloblApi } from "../utils/AzureApiCall";
import DownloadIcon from '@material-ui/icons/CloudDownload';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const columns = [
	{ field: 'id', headerName: 'ID', hide: true },
	{ field: 'name', headerName: 'Name', width: 200 },
	{ field: 'container', headerName: 'Container', width: 200 },
	{
		field: 'download', headerName: 'Download', width: 200,
		renderCell: (params) => (
			<DownloadIcon
				color="primary"
				target="_blank"
				onClick={() => { callGetBloblApi(`${apiConfig.blobEndpoint}/blob`, params.getValue('name')) }}
			>Download</DownloadIcon>
		)
	},
];

export const StudentDocument = ({ documentData }) => {
	return (
		<div>
			<Grid container spacing={6} xs={12} margin={0}>
				<Grid container >
					<DataGrid rows={documentData} autoHeight={true} columns={columns} pageSize={5} />
				</Grid>
				<Grid 
					container
					direction="column"
					alignItems="flex-end"
					justify="flex-start" >
					<Button  variant="contained" color="primary">Upload</Button>
				</Grid>
			</Grid>
		</div>
	);
};
