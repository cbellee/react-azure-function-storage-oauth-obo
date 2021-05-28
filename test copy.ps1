function Replace-Tokens
{
  param(
    [string]$inputFile,
    [string]$outputFile,
    [hashtable]$tokenHash
  )

  $file = Get-Content $inputFile
  foreach ($line in $file) {
    foreach ($t in $tokenHash.GetEnumerator()) {
      if ($line -match $t.Name) {
        $line -replace $t.Name, $t.Value | Add-Content -Path $outputFile
        Write-Host "replaced `'$($t.Name)`' with `'$($t.Value)`'"
      }
    }
  }
}

# patch .env.prod file
$tokenHash = @{
  '{REACT_CLIENT_ID}'="3333333"
  '{AAD_AUTHORITY}'="4444444"
  '{BLOB_READ_SCOPE}'="555555"
  '{SQL_READ_WRITE_SCOPE}'="66666666"
  '{BACKEND_API_ENDPOINT}'="777777777"
  '{REDIRECT_URI}'="888888888"
  '{POST_LOGOUT_REDIRECT_URI}'="999999999"
}

New-Item -ItemType File -Path ./.env.test1 -Force
Replace-Tokens -InputFile './.env.test' -OutputFile './.env.test1' -TokenHash $tokenHash
