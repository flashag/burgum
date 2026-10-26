$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$snapshot = @{}
$appIds = Get-ChildItem (Join-Path $projectRoot '_posts') -Filter '*.markdown' |
    Select-String -Pattern '^steam_id:\s*"(\d+)"' |
    ForEach-Object { $_.Matches[0].Groups[1].Value } |
    Sort-Object -Unique
if (-not $appIds) {
    throw 'No quoted steam_id fields were found in _posts.'
}

foreach ($appId in $appIds) {
    $response = Invoke-RestMethod "https://store.steampowered.com/api/appdetails?appids=$appId&l=english"
    if (-not $response.$appId.success) {
        throw "Steam did not return data for app $appId."
    }
    $game = $response.$appId.data
    $relativeDirectory = "img/portfolio/steam/$appId"
    $assetDirectory = Join-Path $projectRoot $relativeDirectory
    New-Item -ItemType Directory -Force $assetDirectory | Out-Null
    Invoke-WebRequest $game.header_image -OutFile (Join-Path $assetDirectory 'capsule.jpg')
    $screenshots = @()
    $index = 0
    foreach ($shot in $game.screenshots) {
        $index++
        Invoke-WebRequest $shot.path_full -OutFile (Join-Path $assetDirectory "screenshot-$index.jpg")
        Invoke-WebRequest $shot.path_thumbnail -OutFile (Join-Path $assetDirectory "thumbnail-$index.jpg")
        $screenshots += @{
            full = $shot.path_full
            thumbnail = $shot.path_thumbnail
            image = "/$relativeDirectory/screenshot-$index.jpg"
            thumb = "/$relativeDirectory/thumbnail-$index.jpg"
        }
    }
    $snapshot[$appId] = @{
        name = $game.name
        source = "https://store.steampowered.com/app/$appId/"
        header_image = $game.header_image
        capsule = "/$relativeDirectory/capsule.jpg"
        short_description = $game.short_description
        release_date = $game.release_date.date
        coming_soon = $game.release_date.coming_soon
        developers = @($game.developers)
        publishers = @($game.publishers)
        genres = @($game.genres | ForEach-Object { $_.description })
        screenshots = $screenshots
    }
    $releaseDate = [datetime]::MinValue
    $hasDate = [datetime]::TryParse($game.release_date.date, [System.Globalization.CultureInfo]::InvariantCulture, [System.Globalization.DateTimeStyles]::None, [ref]$releaseDate)
    if (-not $hasDate -and -not $game.release_date.coming_soon) {
        throw "Could not parse the released game's date: $($game.name)"
    }
    $releaseOrder = if ($hasDate) { $releaseDate.ToString('yyyy-MM-dd') } else { '9999-12-31' }
    Get-ChildItem (Join-Path $projectRoot '_posts') -Filter '*.markdown' | ForEach-Object {
        $postText = [System.IO.File]::ReadAllText($_.FullName)
        if ($postText -match ('(?m)^steam_id:\s*"' + $appId + '"')) {
            if ($postText -match '(?m)^release_order:') {
                $postText = [regex]::Replace($postText, '(?m)^release_order:[^\r\n]*', "release_order: `"$releaseOrder`"")
            } else {
                $postText = $postText -replace '(?m)^layout: game', "layout: game`nrelease_order: `"$releaseOrder`""
            }
            [System.IO.File]::WriteAllText($_.FullName, $postText, [System.Text.UTF8Encoding]::new($false))
        }
    }
    Write-Output "Updated $($game.name): capsule and $index screenshots."
}

$json = $snapshot | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText((Join-Path $projectRoot '_data/steam.json'), $json, [System.Text.UTF8Encoding]::new($false))
