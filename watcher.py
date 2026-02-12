import psutil 
from pathlib import Path
import json 
import time 
from alerts import create_alert



class ProcessWatcher:
    def __init__(self, config):
        # Charge config
        # Initialiser les seuils
        with open(config ,'r' , encoding='utf-8') as f:
            data = json.load(f)
            self.scan_interval = data['monitoring']['scan_interval']
            self.cpu_threshold = data['monitoring']['cpu_threshold']
            self.memory_threshold = data['monitoring']['memory_threshold']


            self.log_file = data['alerts']['log_file']

            self.auto_kill = data['security']['auto_kill_enabled']
            self.whitelist_paths = data['security']['whitelist_paths']
    
    def scan_processes(self):
        # Retourner tous les processus actifs
        actif_process = []
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_info', 'exe']):
            try:
                info = proc.info
                pid = info['pid']
                name = info['name']
                cpu = proc.cpu_percent(interval=0.1)  # % CPU
                mem = info['memory_info'].rss / (1024**2)  # MB
                exe_path = info.get('exe', None)  # Chemin complet
                #Create a dictionary process_data
                process_data = {
                'pid': pid,
                'name': name,
                'cpu': cpu,
                'mem': mem,
                'exe': exe_path
                }   
                actif_process.append(process_data)

            except psutil.AccessDenied:
                pass
            except psutil.NoSuchProcess:
                pass

        return actif_process

    
    
    def check_cpu_usage(self, process):
        # Vérifier si CPU > seuil
        cpu = process['cpu']
        return cpu > self.cpu_threshold
            
        
    def check_memory_usage(self, process):
        # Vérifier si RAM > seuil
        memory = process['mem']
        return memory > self.memory_threshold
          
    
    def check_suspicious_path(self, process):
        exe = process['exe']
        name = process['name']
    
    
        kernel_patterns = [
        'k', 'rcu_', 'migration/', 'watchdog', 'cpuhp/', 'idle_inject/',
        'irq/', 'scsi_', 'jbd2/', 'systemd-userwork', 'card', 'psimon'
        ]
    
        if exe is None:
            
            if name.startswith('[') and name.endswith(']'):
                return False
        
            
            for pattern in kernel_patterns:
                if name.startswith(pattern):
                    return False
        
            
            return True
    
        else:
            
            for safe_path in self.whitelist_paths:
                if exe.startswith(safe_path):
                    return False
            return True


    def analyze_process(self, process):
        """Analyser un processus et retourner les données d'alerte"""
        alerts = []
    
        # Check 1: CPU
        if self.check_cpu_usage(process):
            alert_data = {
                'process_name': process['name'],
                'pid': process['pid'],
                'reason': 'High CPU',
                'details': f"{process['cpu']:.1f}%"
            }
            alerts.append(alert_data)
    
        # Check 2: Memory
        if self.check_memory_usage(process):
            alert_data = {
                'process_name': process['name'],
                'pid': process['pid'],
                'reason': 'Excessive Memory',
                'details': f"{process['mem']:.1f} MB"
            }
            alerts.append(alert_data)
    
        # Check 3: Path
        if self.check_suspicious_path(process):
            if process['exe'] is None:
                details = "No executable path"
            else:
                details = f"Running from {process['exe']}"
        
            alert_data = {
                'process_name': process['name'],
                'pid': process['pid'],
                'reason': 'Suspicious Path',
                'details': details
            }
            alerts.append(alert_data)
    
        return alerts

    def monitor(self):
    
        print("Process Guard started - Monitoring system...")
        print(f"Scan interval: {self.scan_interval} seconds")
        print("Press Ctrl+C to stop\n")
    
        try:
            while True:
                # 1. Scanner tous les processus
                processes = self.scan_processes()
                print(f"Scanned {len(processes)} processes")
            
                # 2. Analyser chaque processus
                alert_count = 0
                for process in processes:
                    alertes = self.analyze_process(process)
                
                    if alertes:  # Si liste pas vide
                        for alerte in alertes:
                        # alerte est maintenant un dictionnaire
                            create_alert(
                            alerte['process_name'],
                            alerte['pid'],
                            alerte['reason'],
                            alerte['details']
                        )
                        alert_count += 1
            
                # 3. Feedback
                if alert_count > 0:
                    print(f"{alert_count} alert(s) detected")
                else:
                    print("No alerts detected")
            
                # 4. Attendre
                print(f"Next scan in {self.scan_interval} seconds...\n")
                time.sleep(self.scan_interval)
    
        except KeyboardInterrupt:
            print("\n Process Guard stopped by user")
        




