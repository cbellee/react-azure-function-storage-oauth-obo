param sqlAdminUserName string
param sqlAdminPassword string
param dbName string = 'studentdb'
param containers array = [
  '1000'
  '1001'
  '1002'
  '1003'
]
param tags object = {
  costcenter: 1234567890
}

var prefix = uniqueString(resourceGroup().id)
var sqlServerName = concat(prefix, '-sqlserver')
var webStorageAccountName = concat('webstor', prefix)
var docsStorageAccountName = concat('docsstor', prefix)
var funcStorageAccountName = concat('funcstor', prefix)
var appInsightsName = uniqueString(concat(prefix, '-insights'))
var appServicePlanName = concat(prefix, '-asp')
var appName = concat(prefix, '-func')
var webStorageContainerName = '$web'

resource sqlServer 'Microsoft.Sql/servers@2020-08-01-preview' = {
  name: sqlServerName
  tags: tags
  location: resourceGroup().location
  properties: {
    administratorLogin: sqlAdminUserName
    administratorLoginPassword: sqlAdminPassword
    version: '12.0'
  }
}

resource sqlServerFirewallRule 'Microsoft.Sql/servers/firewallRules@2020-08-01-preview' = {
  name: '${sqlServer.name}/allAzureServicesFirewallRule'
  properties: {
    endIpAddress: '0.0.0.0'
    startIpAddress: '0.0.0.0'
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
    minimumTlsVersion: 'TLS1_2'
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

resource funcStorage 'Microsoft.Storage/storageAccounts@2020-08-01-preview' = {
  location: resourceGroup().location
  kind: 'Storage'
  name: funcStorageAccountName
  sku: {
    name: 'Standard_LRS'
    tier: 'Standard'
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
    minimumTlsVersion: 'TLS1_2'
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

resource blobContainers 'Microsoft.Storage/storageAccounts/blobServices/containers@2019-06-01' = [for container in containers: {
  name: '${docsStorage.name}/default/${container}'
}]

resource webStorageContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2020-08-01-preview' = {
  name: concat(webStorageAccountName, '/default/', webStorageContainerName)
  properties: {
    publicAccess: 'None'
  }
  dependsOn: [
    webStorage
  ]
}

resource appServicePlan 'Microsoft.Web/serverfarms@2020-10-01' = {
  name: appServicePlanName
  location: resourceGroup().location
  kind: 'linux'
  sku: {
    name: 'B1'
    capacity: 1
  }
  properties: {
    reserved: true
  }
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
    serverFarmId: appServicePlan.id
    reserved: true
    siteConfig: {
      cors: {
        supportCredentials: true
        allowedOrigins: [
          substring(webStorage.properties.primaryEndpoints.web, 0, length(webStorage.properties.primaryEndpoints.web) - 1)
        ]
      }
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${funcStorage.name};AccountKey=${listKeys(funcStorage.id, funcStorage.apiVersion).keys[0].value};EndpointSuffix=${environment().suffixes.storage}'
          // value: 'DefaultEndpointsProtocol=https;AccountName=${funcStorage.name};AccountKey=${listKeys(funcStorage.id, funcStorage.apiVersion)};EndpointSuffix=core.windows.net'
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
output funcStorageAccountName string = funcStorageAccountName
output webStorageEndpoint string = substring(webStorage.properties.primaryEndpoints.web, 0, - length(webStorage.properties.primaryEndpoints.web) -1)
output functionName string = functionApp.name
output sqlDatabaseName string = sqlDb.properties.databaseId
output sqlServerFqdn string = sqlServer.properties.fullyQualifiedDomainName
output sqlServerName string = sqlServerName
