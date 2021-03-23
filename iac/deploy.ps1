$ErrorActionPreference = 'Continue'

$location = 'australiaeast'
$resourceGroupName = 'student-app-rg'
$deploymentName = 'student-app--deployment'
$gitDeployPassword = 'M1cr0s@ft'
$gitDeployUser = 'cbellee-git-deploy'

$clientId = '1c0ddb7a-f862-455d-9e4f-8c64fc4cd489'
$authority = "https://login.microsoftonline.com/3d49be6f-6e38-404b-bbd4-f61c1a2d25bf"

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
	-sqlAdminPassword 'M1cr0soft'

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
Get-Content -Path ../client/.env | Foreach-Object { $temp = $_ -split '='; $configMap[$temp[0]] = $temp[1] }

$configMap['REACT_APP_CLIENT_ID'] = $clientId
$configMap['REACT_APP_AUTHORITY'] = $authority
$configMap['REACT_APP_REDIRECT_URI'] = $storageAccount.PrimaryEnpoints.web
$configMap['REACT_APP_POST_LOGOUT_REDIRECT_URI'] = $storageAccount.PrimaryEnpoints.web
$configMap['REACT_APP_API_ENDPOINT'] = "https://$($functionName).azurewebsites.net/api"

# clear .env file
Set-Content -Path ../client/.env -Value '' -NoNewline

# write each hashtable key/value pair as a new line 
foreach ($item in $configMap.GetEnumerator()) {
	Add-Content -Path ../client/.env -Value "$($item.Key)=$($item.Value)"
}

# build react app
npm --prefix ../client run build

# upload react web site to static 
Get-ChildItem -Path ../client/build -Recurse | 
	Set-AzStorageBlobContent -Container '$web' -Context $ctx -Properties @{"ContentType" = "text/html"} -Force

# deploy azure function using git
az webapp deployment user set --user-name $gitDeployUser --password $gitDeployPassword
az webapp deployment source config-local-git --resource-group $resourceGroupName --name $functionName
git remote add azure "https://$($functionName).scm.azurewebsites.net/$($functionName).git"
git push azure main

