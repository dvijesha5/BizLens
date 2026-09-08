import subprocess
import sys
import os

if __name__ == '__main__':
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    cmd = [sys.executable, 'manage.py', 'runserver', '--noreload', '127.0.0.1:8000']
    print(f"Launching Django server: {' '.join(cmd)}")
    p = subprocess.Popen(cmd, cwd=backend_dir)
    print(f"Django server PID: {p.pid}")
    p.wait()
