LOCATION=australiaeast
RG_NAME='react-func-app-rg'
DEPLOY_NAME='react-func-app-deployment'

bicep build ./main.bicep

az group create --location $LOCATION --resource-group $RG_NAME

OUTPUT=$(az deployment group create \
	--resource-group $RG_NAME \
	--name $DEPLOY_NAME \
	--template-file main.json  \
	--parameters location=$LOCATION \
	--query 'properties.outputs' \
	-o json)

STORAGE_ACCOUNT_NAME=$(echo $OUTPUT | jq -r '.storageAccountName.value')
FUNCTION_URL=$(echo $OUTPUT | jq -r '.functionUrl.value')

echo "storageAccountName: ${STORAGE_ACCOUNT_NAME}"
echo "functuinUrl: https://${FUNCTION_URL}"

# enable static web storage
az storage blob service-properties update --account-name $STORAGE_ACCOUNT_NAME --static-website --index-document index.html --auth-mode login

# build react site
npm --prefix ../client run build

# upload react web site to static storage
az storage blob upload-batch --account-name $STORAGE_ACCOUNT_NAME --source ../client/build/ --destination '$web' --auth-mode login

# deploy azure function
