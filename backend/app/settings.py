from __future__ import annotations

import os

from dotenv import load_dotenv


load_dotenv()


ZHIPU_API_KEY = os.getenv("ZHIPU_API_KEY", "").strip()
ZHIPU_API_KEY_FALLBACK = os.getenv("ZHIPU_API_KEY_FALLBACK", "").strip()
ZHIPU_MODEL = os.getenv("ZHIPU_MODEL", "glm-4.7-flash").strip() or "glm-4.7-flash"
