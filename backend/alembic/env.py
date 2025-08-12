import sys
import os
from pathlib import Path
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool
from dotenv import load_dotenv

# ---------------------------------------------------------------------
# Allow Alembic to discover app models no matter how invoked
# ---------------------------------------------------------------------
current_file = Path(__file__).resolve()
sys.path.append(str(current_file.parents[2]))  # repo root
sys.path.append(str(current_file.parents[1]))  # backend

# ---------------------------------------------------------------------
# Load environment variables from .env (project root or backend)
# ---------------------------------------------------------------------
project_root = current_file.parents[2]
backend_dir = current_file.parents[1]
env_paths = [project_root / ".env", backend_dir / ".env"]
for p in env_paths:
    if p.exists():
        load_dotenv(p)
        break

# ---------------------------------------------------------------------
# Alembic config & logging
# ---------------------------------------------------------------------
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ---------------------------------------------------------------------
# Import your Base and all model modules
# Add new imports here as you extend AI/voice/multilingual/adaptive features!
# ---------------------------------------------------------------------
from app.database import Base
import app.models.survey          # noqa: F401
import app.models.user            # noqa: F401
import app.models.question        # noqa: F401
import app.models.response        # noqa: F401
import app.models.enumerator      # noqa: F401

# If you add these models in the future, import here as well:
# import app.models.translation   # for multilingual
# import app.models.voice         # for audio/voice data
# import app.models.adaptive      # for adaptive logic

target_metadata = Base.metadata

# ---------------------------------------------------------------------
# Database URL resolution (cloud + local compatible)
# ---------------------------------------------------------------------
def get_database_url():
    # env var wins
    env_url = os.getenv("SQLALCHEMY_DATABASE_URL")
    if env_url:
        return env_url
    # fallback to alembic.ini value
    ini_url = config.get_main_option("sqlalchemy.url")
    if ini_url:
        return ini_url
    # default: local SQLite file
    return "sqlite:///./survey.db"

db_url = get_database_url()
config.set_main_option("sqlalchemy.url", db_url)

# If using file-based SQLite, ensure directory exists for DB file
if db_url.startswith("sqlite:///"):
    raw_path = db_url.replace("sqlite:///", "", 1)
    db_path = Path(raw_path)
    if not db_path.is_absolute():
        db_path = (Path.cwd() / db_path).resolve()
    parent = db_path.parent
    if parent and not parent.exists():
        parent.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------------
# Migration runners (offline/online)
# ---------------------------------------------------------------------
def run_migrations_offline() -> None:
    url = get_database_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        render_as_batch=url.startswith("sqlite:///"),  # needed for SQLite
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        is_sqlite = db_url.lower().startswith("sqlite:///")
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            render_as_batch=is_sqlite,
        )
        with context.begin_transaction():
            context.run_migrations()

# ---------------------------------------------------------------------
# Execute
# ---------------------------------------------------------------------
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
