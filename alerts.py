import datetime
import json 
from pathlib import Path

class Colors:
    RED = '\033[91m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

BASE_DIR = Path(__file__).parent
logs_path = BASE_DIR / 'logs'


def log_alert(message , severity="WARNING"):
    times = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_file = logs_path / "security_alerts.log"
    with open(log_file, "a") as file:
        file.write(f"[{times}] [{severity}] {message}\n")



def print_alert(message , severity):
    print(f"{Colors.BOLD}{Colors.RED} {severity} {message} {Colors.RESET}")



def create_alert(process_name , pid, reason , details):
    
    alert_message = f"Process {process_name} (PID: {pid} - {reason}: {details})"

    log_alert(alert_message)
    print_alert(alert_message,severity="WARNING")
    
    




