import os
import sys

# Garante que tanto a raiz quanto ./backend funcionem como working directory no Railpack/Railway
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
if os.path.isdir(backend_dir) and backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app  # noqa: E402, F401
