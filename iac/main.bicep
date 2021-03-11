param location string
param tags object = {
  costcenter: 1234567890
}

var suffix = uniqueString(concat(substring(resourceGroup().id, 0, 6), substring(subscription().id, 0, 6)))
var storageAccountName = concat('stor', suffix)
var appInsightsName = uniqueString(concat('insights-', suffix))
var appName = concat('func-', suffix)
var storageContainerName = '$web'

resource storage 'Microsoft.Storage/storageAccounts@2020-08-01-preview' = {
  location: location
  kind: 'StorageV2'
  name: storageAccountName
  sku: {
    name: 'Standard_LRS'
    tier: 'Standard'
  }
  properties: {
    networkAcls: {
      bypass: 'AzureServices'
      virtualNetworkRules: []
      ipRules: []
      defaultAction: 'Allow'
    }
    accessTier: 'Hot'
    allowBlobPublicAccess: false
    allowSharedKeyAccess: false
    supportsHttpsTrafficOnly: true
    encryption: {
      services: {
        blob: {
          enabled: true
        }
      }
      keySource: 'Microsoft.Storage'
    }
  }
}

resource storageContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2020-08-01-preview' = {
  name: concat(storageAccountName, '/default/', storageContainerName)
  properties: {
    publicAccess: 'None'
  }
  dependsOn: [
    storage
  ]
}

resource appInsights 'Microsoft.Insights/components@2020-02-02-preview' = {
  name: appInsightsName
  location: location
  kind: 'web'
  tags: tags
  properties: {
    Application_Type: 'web'
  }
}

resource functionApp 'Microsoft.Web/sites@2020-06-01' = {
  location: location
  name: appName
  kind: 'functionapp,linux'
  properties: {
    reserved: true
    siteConfig: {
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: concat('DefaultEndpointsProtocol=https;AccountName=', storageAccountName, ';AccountKey=', listKeys(storageAccountName, '2019-06-01').keys[0].value)
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '10.19.0'
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~3'
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: reference(resourceId('microsoft.insights/components/', appInsightsName), '2015-05-01').InstrumentationKey
        }
      ]
    }
  }
  dependsOn: [
    storage
    appInsights
  ]
}

output storageAccountName string = storageAccountName
output functionName string = functionApp.name