---
id: com-port-testing
title: "Testing COM Ports and RS-485 with PowerShell"
description: "How to list available COM ports, send and receive raw bytes over a serial port, and test communication with an industrial device without any extra tools."
date: "2026-05-14"
tags: ["powershell", "rs485"]
featured: true
references:
  - title: "Microsoft Docs — System.IO.Ports.SerialPort"
    url: "https://learn.microsoft.com/en-us/dotnet/api/system.io.ports.serialport"
---

## Why test with PowerShell

Before you start writing Python code or configuring a library — it's worth checking whether the COM port works at all and whether the device responds. PowerShell has a built-in `System.IO.Ports.SerialPort` class that gives direct access to the serial port with no additional installs.

Useful when:
- You're not sure which COM port is your device
- You want a quick "is this device alive?" check before writing code
- You're debugging a communication problem and want to rule out the software layer

## List available COM ports

```powershell
# All COM ports on the system
[System.IO.Ports.SerialPort]::GetPortNames()

# With more detail — including the device description
Get-WMIObject Win32_PnPEntity |
    Where-Object { $_.Name -match "COM\d+" } |
    Select-Object Name, DeviceID
```

The second method shows device names (e.g. "USB-SERIAL CH340 (COM8)"), which makes it easier to identify the right port.

## Opening the port and sending data

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

## Sending raw bytes (Modbus/Flowbus)

For binary protocols use `Write()` with a byte array, not `WriteLine()`:

```powershell
# Example: Modbus RTU frame — read register 0, slave 1
# 01 03 00 00 00 01 84 0A
$request = [byte[]](0x01, 0x03, 0x00, 0x00, 0x00, 0x01, 0x84, 0x0A)
$port.Write($request, 0, $request.Length)

Start-Sleep -Milliseconds 200

# Read response
$buffer = New-Object byte[] 256
$bytesRead = $port.Read($buffer, 0, 256)
$response  = $buffer[0..($bytesRead - 1)]

# Display as hex
$hex = ($response | ForEach-Object { $_.ToString("X2") }) -join " "
Write-Host "Response: $hex"
```

## Scanning for Modbus devices on the bus

If you don't know which slave address the device uses:

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

# Scan addresses 1–10
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
            Write-Host "Found device at address $addr"
        }
    } catch {
        # timeout — no device at this address
    }
}
```

## ASCII test (for text-based devices)

Some devices (older scales, terminals) use ASCII. In that case you can use `ReadLine()`:

```powershell
$port.NewLine = "`r`n"   # or "`r" depending on the device

$port.WriteLine("?")     # ASCII query
Start-Sleep -Milliseconds 500

$response = $port.ReadExisting()
Write-Host "Response: $response"
```

## Closing the port

Always close the port when you're done:

```powershell
$port.Close()
$port.Dispose()
```

An unclosed port stays held by the PowerShell process — other programs (Python, LOGO!, Modbus Poll) won't be able to open it until you close the session or release the resource.

## Pitfalls

1. **Port busy** — if `$port.Open()` throws "Access is denied", the port is open in another process. Check Device Manager and other running applications.

2. **ReadTimeout** — without a ReadTimeout set, `Read()` can wait forever. Always set a timeout before opening the port.

3. **Baud rate** — Windows lets you open the port at any baud rate, but the device won't respond if you set the wrong value. No response ≠ no device.

4. **Echo** — some USB-RS485 converters echo your own bytes back. In the response you'll see your request + the device's reply. Discard the first N bytes (N = request length).
