function Replace-Tokens
{
  param(
    [string]$inputFile,
    [string]$outputFile,
    [string]$token,
    [string]$tokenValue
  )

  (Get-Content $inputFile) | foreach-object { $_ -replace $token, $tokenValue } | Set-Content $outputFile
  Write-Host "Processed: " + $inputFile
}

Replace-Tokens -InputFile $PSScriptRoot/client/.env -OutputFile $PSScriptRoot/client/.env.prod -Token '{REACT_CLIENT_ID}' -TokenValue "https://some.path.to.somewhere"
Replace-Tokens -InputFile $PSScriptRoot/client/.env -OutputFile $PSScriptRoot/client/.env.prod -Token '{REACT_CLIENT_ID}' -TokenValue "https://some.path.to.somewhere"
Replace-Tokens -InputFile $PSScriptRoot/client/.env -OutputFile $PSScriptRoot/client/.env.prod -Token '{REACT_CLIENT_ID}' -TokenValue "https://some.path.to.somewhere"
Replace-Tokens -InputFile $PSScriptRoot/client/.env -OutputFile $PSScriptRoot/client/.env.prod -Token '{REACT_CLIENT_ID}' -TokenValue "https://some.path.to.somewhere"
Replace-Tokens -InputFile $PSScriptRoot/client/.env -OutputFile $PSScriptRoot/client/.env.prod -Token '{REACT_CLIENT_ID}' -TokenValue "https://some.path.to.somewhere"
Replace-Tokens -InputFile $PSScriptRoot/client/.env -OutputFile $PSScriptRoot/client/.env.prod -Token '{REACT_CLIENT_ID}' -TokenValue "https://some.path.to.somewhere"
Replace-Tokens -InputFile $PSScriptRoot/client/.env -OutputFile $PSScriptRoot/client/.env.prod -Token '{REACT_CLIENT_ID}' -TokenValue "https://some.path.to.somewhere"
Replace-Tokens -InputFile $PSScriptRoot/client/.env -OutputFile $PSScriptRoot/client/.env.prod -Token '{REACT_CLIENT_ID}' -TokenValue "https://some.path.to.somewhere"
Replace-Tokens -InputFile $PSScriptRoot/client/.env -OutputFile $PSScriptRoot/client/.env.prod -Token '{REACT_CLIENT_ID}' -TokenValue "https://some.path.to.somewhere"