---
title: "Linux dla SOC — komendy których używam najczęściej"
description: "Zestawienie komend Linux przydatnych w analizie bezpieczeństwa, monitorowaniu sieci i reagowaniu na incydenty."
date: "2026-04-20"
tags: ["linux", "cybersecurity", "soc", "networking"]
featured: true
---

## Analiza połączeń sieciowych

```bash
# Aktywne połączenia z procesami
ss -tulnp

# Tylko nasłuchujące porty
ss -lntp

# Połączenia do konkretnego IP
ss -tnp dst 10.0.0.1

# Alternatywa (starsza, ale dostępna wszędzie)
netstat -tulnp
```

## Logi systemowe

```bash
# Ostatnie logi kernela
dmesg -T | tail -50

# Logi auth (logowania, sudo, ssh)
journalctl -u ssh -f
tail -f /var/log/auth.log

# Logi w czasie rzeczywistym z filtrem
journalctl -f | grep -i "fail\|error\|denied"

# Logi z konkretnego przedziału czasu
journalctl --since "2026-04-20 08:00" --until "2026-04-20 12:00"
```

## Procesy i zasoby

```bash
# Procesy posortowane po CPU
ps aux --sort=-%cpu | head -20

# Co otworzył konkretny proces
lsof -p <PID>

# Który proces używa portu
lsof -i :8080
fuser 8080/tcp

# Zużycie dysku
du -sh /* 2>/dev/null | sort -rh | head -20
```

## Analiza plików i hasha

```bash
# SHA256 pliku
sha256sum plik.bin

# Znajdź pliki zmodyfikowane w ostatnich 24h
find /etc -mtime -1 -type f

# Znajdź pliki z setuid
find / -perm -4000 -type f 2>/dev/null

# Strings z pliku binarnego
strings plik.bin | grep -i "password\|key\|token"
```

## Sieć i ruch

```bash
# Capture ruchu na interfejsie (bez tcpdump GUI)
tcpdump -i eth0 -w /tmp/capture.pcap

# Tylko ruch HTTP
tcpdump -i eth0 port 80 or port 443

# Podejrzyj ruch DNS
tcpdump -i eth0 port 53 -n

# Traceroute (gdy icmp blokowany)
traceroute -T -p 443 8.8.8.8
```

## Szybka analiza incydentu

```bash
# Kto jest zalogowany
who
w
last | head -20

# Historia komend bieżącego użytkownika
history | tail -50

# Zaplanowane zadania
crontab -l
ls /etc/cron.*

# Pliki autoryzowanych kluczy SSH
cat ~/.ssh/authorized_keys
find / -name "authorized_keys" 2>/dev/null
```
