import React from "react";
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { apiConfig } from "../apiConfig";
import { callGetBloblApi } from "../utils/AzureApiCall";
import DownloadIcon from '@material-ui/icons/CloudDownload';
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

const columns = [
	{ field: 'id', headerName: 'ID', hide: true },
	{ field: 'name', headerName: 'Name', width: 200 },
	{ field: 'container', headerName: 'Container', width: 200 },
	{
		field: 'download', headerName: 'Download', width: 200,
		renderCell: (params) => (
			<DownloadIcon
				color="secondary"
				target="_blank"
				onClick={() => { callGetBloblApi(`${apiConfig.blobEndpoint}/blob`, params.getValue('name')) }}
			>Download</DownloadIcon>
		)
	},
];

export const StudentDocument = ({ documentData }) => {
	return (
		<div>
			<DataGrid rows={documentData} autoHeight={true} columns={columns} pageSize={5} />
		</div>
	);
};
