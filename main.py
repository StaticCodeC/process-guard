import os 
from watcher import ProcessWatcher
from pathlib import Path
import sys
import json 
BASE_DIR = Path(__file__).parent  
logs_path = BASE_DIR/'logs'
config_path = BASE_DIR/'config.json'


def main():
    if not logs_path.is_dir():
        os.makedirs('/home/omar/process_guard/logs')


    if not config_path.exists():
        print("ERROR: config.json not found")
        print("Please create config.json in the project root")
        sys.exit(1)

    
    print("╔════════════════════════════════╗")
    print("║     PROCESS GUARD v1.0         ║")
    print("║   System Security Monitor      ║")
    print("╚════════════════════════════════╝")

    try:
        watcher = ProcessWatcher(config_path)
        watcher.monitor()

    except json.JSONDecodeError:
        print("ERROR: Invalid JSON in config.json")
        sys.exit(1)

    except KeyError:
        print("ERROR: Missing required fields in config.json")
        sys.exit(1)

if __name__ == "__main__":
    main()