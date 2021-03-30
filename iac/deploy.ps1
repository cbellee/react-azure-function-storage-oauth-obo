$ErrorActionPreference = 'Stop'

$location = 'australiaeast'
$resourceGroupName = 'student-app-rg'
$deploymentName = 'student-app-deployment'
$clientId = '1c0ddb7a-f862-455d-9e4f-8c64fc4cd489'
$authority = "https://login.microsoftonline.com/3d49be6f-6e38-404b-bbd4-f61c1a2d25bf"
$dbName = 'studentdb'
[bool]$isDev = $false

# transpile bicep DSL to JSON arm template
bicep build ./main.bicep --outfile ./main.json

# create resource group
New-AzResourceGroup -Name $resourceGroupName -Location $location -Force

# deploy azure infrastruture
$deployment = New-AzResourceGroupDeployment `
	-ResourceGroupName $resourceGroupName `
	-Name $deploymentName `
	-TemplateFile ./main.json `
	-sqlAdminUserName 'dbadmin' `
	-sqlAdminPassword 'M1cr0soft' `
	-dbName $dbName

# enable sql AAD RBAC
Set-AzSqlServerActiveDirectoryAdministrator `
	-ResourceGroupName $resourceGroupName `
	-ServerName $deployment.Outputs.sqlServerName.value `
	-DisplayName "DBAdmin_Account" `
	-ObjectId '57963f10-818b-406d-a2f6-6e758d86e259'

# enable static web hosting on storage account
$storageAccount = Get-AzStorageAccount -ResourceGroupName $resourceGroupName -AccountName $deployment.Outputs.webStorageAccountName.value
$ctx = $storageAccount.Context
Enable-AzStorageStaticWebsite -Context $ctx -IndexDocument index.html 
$storageAccount = Get-AzStorageAccount -ResourceGroupName $resourceGroupName -AccountName $deployment.Outputs.webStorageAccountName.value

$functionName = $deployment.Outputs.functionName.value

# patch react .env file at root of ./client directory
$configMap = @{}
Get-Content -Path ../client/.env | 
Foreach-Object { $temp = $_ -split '='; $configMap[$temp[0]] = $temp[1] }

$configMap['REACT_APP_CLIENT_ID'] = $clientId
$configMap['REACT_APP_AUTHORITY'] = $authority


if ($isDev) {
	$configMap['REACT_APP_API_ENDPOINT'] = "http://localhost:7071/api"
	$configMap['REACT_APP_REDIRECT_URI'] = "http://localhost:3000"
	$configMap['REACT_APP_POST_LOGOUT_REDIRECT_URI'] = "http://localhost:3000/logout"
}
else {
	$configMap['REACT_APP_API_ENDPOINT'] = "https://$($functionName).azurewebsites.net/api"
	$configMap['REACT_APP_REDIRECT_URI'] = $storageAccount.PrimaryEndpoints.web
	$configMap['REACT_APP_POST_LOGOUT_REDIRECT_URI'] = $storageAccount.PrimaryEndpoints.web
}

# clear .env file
Set-Content -Path ../client/.env -Value '' -NoNewline

# write each hashtable key/value pair as a new line 
foreach ($item in $configMap.GetEnumerator()) {
	Add-Content -Path ../client/.env -Value "$($item.Key)=$($item.Value)"
}

# build front-end react app
npm --prefix ../client run build

if (!$isDev) {
	# upload front-end react app to static web atorage
	Get-ChildItem -Path ../client/build -Recurse | 
	Set-AzStorageBlobContent -Container '$web' -Context $ctx -Properties @{"ContentType" = "text/html" } -Force

	# patch back-end node function app config files
	$authConfig = Get-Content -Path ../server/auth.json | ConvertFrom-Json
	$authConfig.storageAccountName = $deployment.Outputs.docsStorageAccountName.value

	$dbConfig = Get-Content -Path ../server/db.json | ConvertFrom-Json
	$dbConfig.serverName = $deployment.Outputs.sqlServerFqdn.value
	$dbConfig.dbName = $dbName

	# write file changes
	$authConfig | ConvertTo-Json | Out-File -FilePath ../server/auth.json
	$dbConfig | ConvertTo-Json | Out-File -FilePath ../server/db.json 

	# create zip file containing azure funtion files
	Compress-Archive -Path ../server/* -DestinationPath ./function.zip -Force -CompressionLevel Fastest -Confirm:$false

	# deploy back-end azure function using zip deploy method
	az functionapp deployment source config-zip -g "$($resourceGroupName)" -n "$($functionName)" --src ./function.zip
}
