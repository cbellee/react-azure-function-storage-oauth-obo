import React from "react";
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { apiConfig } from "../authConfig";
import { callListBlobApi, callGetBloblApi } from "../utils/AzureStorageApiCall";
import DownloadIcon from '@material-ui/icons/CloudDownload';

const columns: GridColDef[] = [
	{ field: 'id', headerName: 'ID', hide: true },
	{ field: 'name', headerName: 'Name', width: 200 },
	{ field: 'container', headerName: 'Container', width: 200 },
	{ field: 'download', headerName: 'Download', width: 200,
	renderCell: (params: GridCellParams) => (
		<DownloadIcon
		color="secondary"
		
		target="_blank"
		onClick={() => {callGetBloblApi(`${apiConfig.getEndpoint}/download`, params.getValue('name'))}}
		>Download</DownloadIcon>
	)},
  ];

export const DocumentData = ({ documentData }) => {
	return (
		<div style={{ height: '80vh', width: '95vw' }}>
		  <DataGrid rows={documentData} columns={columns} pageSize={5} />
		</div>
	  );
};
