param sqlAdminUserName string
param sqlAdminPassword string
param dbName string = 'studentdb'
param tags object = {
  costcenter: 1234567890
}

var prefix = uniqueString(resourceGroup().id)
var serverName = concat(prefix, '-sqlserver')
var webStorageAccountName = concat('webstor', prefix)
var docsStorageAccountName = concat('docstor', prefix)
var appInsightsName = uniqueString(concat(prefix, '-insights'))
var appName = concat(prefix, '-func')
var webStorageContainerName = '$web'

resource sqlServer 'Microsoft.Sql/servers@2020-08-01-preview' = {
  name: serverName
  tags: tags
  location: resourceGroup().location
  properties: {
    administratorLogin: sqlAdminUserName
    administratorLoginPassword: sqlAdminPassword
    version: '12.0'
  }
}

resource sqlDb 'Microsoft.Sql/servers/databases@2020-08-01-preview' = {
  name: '${sqlServer.name}/${dbName}'
  location: resourceGroup().location
  tags: tags
  sku: {
    capacity: 5
    name: 'Basic'
    tier: 'Basic'
  }
  properties: {
    createMode: 'Default'
  }
}

resource webStorage 'Microsoft.Storage/storageAccounts@2020-08-01-preview' = {
  location: resourceGroup().location
  kind: 'StorageV2'
  name: webStorageAccountName
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
    allowSharedKeyAccess: true
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

resource docsStorage 'Microsoft.Storage/storageAccounts@2020-08-01-preview' = {
  location: resourceGroup().location
  kind: 'StorageV2'
  name: docsStorageAccountName
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
    allowSharedKeyAccess: true
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

resource webStorageContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2020-08-01-preview' = {
  name: concat(webStorageAccountName, '/default/', webStorageContainerName)
  properties: {
    publicAccess: 'None'
  }
  dependsOn: [
    webStorage
  ]
}

resource appInsights 'Microsoft.Insights/components@2020-02-02-preview' = {
  name: appInsightsName
  location: resourceGroup().location
  kind: 'web'
  tags: tags
  properties: {
    Application_Type: 'web'
  }
}

resource functionApp 'Microsoft.Web/sites@2020-06-01' = {
  location: resourceGroup().location
  name: appName
  kind: 'functionapp,linux'
  properties: {
    reserved: true
    siteConfig: {
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: concat('DefaultEndpointsProtocol=https;AccountName=', webStorageAccountName, ';AccountKey=', listKeys(webStorageAccountName, '2019-06-01').keys[0].value)
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '10.14'
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
    webStorage
    appInsights
  ]
}

output webStorageAccountName string = webStorageAccountName
output docsStorageAccountName string = docsStorageAccountName
output functionName string = functionApp.name
output sqlDatabaseName string = sqlDb.properties.databaseId
output sqlServerName string = sqlServer.name
