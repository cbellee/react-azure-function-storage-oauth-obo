$LOCATION=australiaeast
$RG_NAME='react-func-app-rg'
$DEPLOY_NAME='react-func-app-deployment'
$GIT_DEPLOY_PASSWORD='M1cr0s@ft'
$GIT_DEPLOY_USER='cbellee-git-deploy'

bicep build ./main.bicep

az group create --location $LOCATION --resource-group $RG_NAME

$OUTPUT= az deployment group create `
	--resource-group $RG_NAME `
	--name $DEPLOY_NAME `
	--template-file main.json `
	--parameters location=$LOCATION `
	--query 'properties.outputs' `
	-o json

$STORAGE_ACCOUNT_NAME=$OUTPUT.storageAccountName.value
$FUNCTION_NAME=$OUTPUT.functionName.value

"storageAccountName: $STORAGE_ACCOUNT_NAME"
"functionName: $FUNCTION_NAME"

# enable static web hosting on storage account
az storage blob service-properties update --account-name $STORAGE_ACCOUNT_NAME --static-website --index-document index.html --auth-mode login

# build react site
npm --prefix ../client run build

# upload react web site to static storage
az storage blob upload-batch --account-name $STORAGE_ACCOUNT_NAME --source ../client/build/ --destination '$web' --auth-mode login

# deploy azure function using git
az webapp deployment user set --user-name $GIT_DEPLOY_USER --password $GIT_DEPLOY_PASSWORD
az webapp deployment source config-local-git --resource-group $RG_NAME --name $FUNCTION_NAME
git remote add azure "https://$FUNCTION_NAME.scm.azurewebsites.net/$FUNCTION_NAME.git"
git push azure main
