$port = 8080
$path = "C:\Users\AM\.gemini\antigravity\scratch\asistencia-escolar-app"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://*:$port/")

try {
  $listener.Start()
  Write-Host "Servidor web local activo en http://localhost:$port/"
  Write-Host "Acceso desde el celular (misma red Wi-Fi): http://192.168.130.85:$port/"
} catch {
  Write-Host "No se pudo iniciar con http://*:, intentando con http://localhost:..."
  $listener = New-Object System.Net.HttpListener
  $listener.Prefixes.Add("http://localhost:$port/")
  $listener.Start()
  Write-Host "Servidor web local activo en http://localhost:$port/"
}

$mimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".png"  = "image/png"
}

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $request = $context.Request
  $response = $context.Response

  $rawUrl = $request.Url.LocalPath
  if ($rawUrl -eq "/") { $rawUrl = "/index.html" }

  $filePath = Join-Path $path $rawUrl.Replace("/", "\")

  if (Test-Path $filePath -PathType Leaf) {
    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
    $contentType = $mimeTypes[$ext]
    if (-not $contentType) { $contentType = "application/octet-stream" }

    $bytes = [System.IO.File]::ReadAllBytes($filePath)
    $response.ContentType = $contentType
    $response.ContentLength64 = $bytes.Length
    $response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $response.StatusCode = 404
    $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
    $response.OutputStream.Write($buffer, 0, $buffer.Length)
  }

  $response.Close()
}
