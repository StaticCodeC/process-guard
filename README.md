# 🛡️ Process Guard

System process security monitor for Linux - Detects suspicious process behavior in real-time.

## Features

- Real-time CPU and memory monitoring
- Suspicious executable path detection
- Automated logging with timestamps
- Configurable thresholds

## Quick Start
```bash
# Install dependencies
pip install psutil --break-system-packages

# Run (with sudo for full access)
sudo python3 main.py
```

## Configuration

Edit `config.json` to customize:
```json
{
  "monitoring": {
    "scan_interval": 5,
    "cpu_threshold": 80.0,
    "memory_threshold": 1024
  },
  "security": {
    "whitelist_paths": ["/usr/bin/", "/usr/lib/", "/bin/"]
  }
}
```

## Example Output
```
Process Guard started - Monitoring system...
Scanned 351 processes
[WARNING] High CPU usage: miner (PID 1234) using 95.7%
[WARNING] Suspicious path: script.py (PID 5678) running from /tmp/malware.py
2 alert(s) detected
```

## Project Structure
```
process_guard/
├── main.py       # Entry point
├── watcher.py    # Monitoring logic
├── alerts.py     # Alert system
├── config.json   # Configuration
└── logs/         # Security logs
```

## Testing

Generate a test alert:
```bash
# Terminal 1: Run Process Guard
sudo python3 main.py

# Terminal 2: Create suspicious process
echo "import time; time.sleep(100)" > /tmp/test.py
python3 /tmp/test.py &
```

## Author

Omar Abou-El-Faraj - Computer Science Student @ Université de Moncton

## License

MIT License
