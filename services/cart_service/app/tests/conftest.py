from __future__ import annotations

import sys
from pathlib import Path


# Ensure imports like `from src...` resolve when pytest is run from repo root.
APP_ROOT = Path(__file__).resolve().parents[1]
if str(APP_ROOT) not in sys.path:
    sys.path.insert(0, str(APP_ROOT))
