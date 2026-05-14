---
title: "Testowanie portów COM i RS-485 z PowerShell"
description: "Jak sprawdzić dostępne porty COM, wysłać i odebrać surowe bajty przez port szeregowy oraz przetestować komunikację z urządzeniem przemysłowym bez żadnych dodatkowych narzędzi."
date: "2026-05-14"
tags: ["powershell", "serial", "rs485", "troubleshooting", "windows"]
featured: true
---

## Po co testować z PowerShell

Zanim zaczniesz pisać kod w Pythonie albo konfigurować bibliotekę — warto sprawdzić czy port COM w ogóle działa i czy urządzenie odpowiada. PowerShell ma wbudowaną klasę `System.IO.Ports.SerialPort` która daje bezpośredni dostęp do portu szeregowego bez żadnych dodatkowych instalacji.

Przydatne gdy:
- Nie masz pewności który port COM to twoje urządzenie
- Chcesz szybko sprawdzić czy urządzenie "żyje" zanim napiszesz kod
- Debugujesz problem z komunikacją i chcesz wyeliminować warstwę oprogramowania

## Sprawdź dostępne porty COM

```powershell
# Lista wszystkich portów COM w systemie
[System.IO.Ports.SerialPort]::GetPortNames()

# Bardziej szczegółowo — z opisem urządzenia
Get-WMIObject Win32_PnPEntity |
    Where-Object { $_.Name -match "COM\d+" } |
    Select-Object Name, DeviceID
```

Drugi sposób pokazuje nazwy urządzeń (np. "USB-SERIAL CH340 (COM8)") co ułatwia identyfikację właściwego portu.

## Otwieranie portu i wysyłanie danych

```powershell
$port = New-Object System.IO.Ports.SerialPort

$port.PortName  = "COM8"
$port.BaudRate  = 9600
$port.DataBits  = 8
$port.Parity    = [System.IO.Ports.Parity]::None
$port.StopBits  = [System.IO.Ports.StopBits]::One
$port.ReadTimeout  = 1000   # ms
$port.WriteTimeout = 1000   # ms

$port.Open()
```

## Wysyłanie surowych bajtów (Modbus/Flowbus)

Do protokołów binarnych używaj `Write()` z tablicą bajtów, nie `WriteLine()`:

```powershell
# Przykład: ramka Modbus RTU — odczyt rejestru 0, slave 1
# 01 03 00 00 00 01 84 0A
$request = [byte[]](0x01, 0x03, 0x00, 0x00, 0x00, 0x01, 0x84, 0x0A)
$port.Write($request, 0, $request.Length)

Start-Sleep -Milliseconds 200

# Odczyt odpowiedzi
$buffer = New-Object byte[] 256
$bytesRead = $port.Read($buffer, 0, 256)
$response  = $buffer[0..($bytesRead - 1)]

# Wyświetl jako hex
$hex = ($response | ForEach-Object { $_.ToString("X2") }) -join " "
Write-Host "Odpowiedź: $hex"
```

## Skanowanie urządzeń Modbus na magistrali

Jeśli nie wiesz pod jakim adresem slave siedzi urządzenie:

```powershell
function Get-ModbusCRC {
    param([byte[]]$data)
    $crc = 0xFFFF
    foreach ($b in $data) {
        $crc = $crc -bxor $b
        for ($i = 0; $i -lt 8; $i++) {
            if ($crc -band 0x0001) {
                $crc = ($crc -shr 1) -bxor 0xA001
            } else {
                $crc = $crc -shr 1
            }
        }
    }
    return [byte[]]([byte]($crc -band 0xFF), [byte](($crc -shr 8) -band 0xFF))
}

# Skanuj adresy 1–10
for ($addr = 1; $addr -le 10; $addr++) {
    $pdu  = [byte[]]($addr, 0x03, 0x00, 0x00, 0x00, 0x01)
    $crc  = Get-ModbusCRC $pdu
    $frame = $pdu + $crc

    $port.Write($frame, 0, $frame.Length)
    Start-Sleep -Milliseconds 100

    try {
        $buf  = New-Object byte[] 64
        $n    = $port.Read($buf, 0, 64)
        if ($n -gt 0) {
            Write-Host "Znaleziono urządzenie na adresie $addr"
        }
    } catch {
        # timeout — brak urządzenia pod tym adresem
    }
}
```

## Test ASCII (dla urządzeń tekstowych)

Niektóre urządzenia (starsze wagi, terminale) używają ASCII. Wtedy możesz użyć `ReadLine()`:

```powershell
$port.NewLine = "`r`n"   # lub "`r" zależnie od urządzenia

$port.WriteLine("?")     # zapytanie w formacie ASCII
Start-Sleep -Milliseconds 500

$response = $port.ReadExisting()
Write-Host "Odpowiedź: $response"
```

## Zamykanie portu

Zawsze zamykaj port po zakończeniu:

```powershell
$port.Close()
$port.Dispose()
```

Niezamknięty port zostaje zajęty przez proces PowerShell — inne programy (Python, LOGO!, Modbus Poll) nie będą mogły go otworzyć dopóki nie zamkniesz sesji lub nie zwolnisz zasobu.

## Pułapki

1. **Port zajęty** — jeśli `$port.Open()` rzuca wyjątek "Access is denied", port jest otwarty przez inny proces. Sprawdź Menedżer urządzeń i inne uruchomione aplikacje.

2. **ReadTimeout** — bez ustawionego ReadTimeout `Read()` może czekać w nieskończoność. Zawsze ustawiaj timeout przed otwarciem portu.

3. **Baudrate** — Windows pozwoli otworzyć port z dowolnym baudrate, ale urządzenie nie odpowie jeśli ustawisz złą wartość. Brak odpowiedzi ≠ brak urządzenia.

4. **echo** — niektóre konwertery USB-RS485 odsyłają własne bajty z powrotem (echo). W odpowiedzi zobaczysz swoje żądanie + odpowiedź urządzenia. Odrzuć pierwsze N bajtów (N = długość żądania).
