"""Postgres connection helper for the CompCleared backend.

Replaces the old SQLite connection pattern. Uses psycopg3 with dict_row
so fetchone() / fetchall() return dicts (matching the old sqlite3.Row behavior).
"""
import os
import psycopg
from psycopg.rows import dict_row

# Connection string is set via DATABASE_URL env var in production.
# Format: postgresql://user:password@host/dbname
DATABASE_URL = os.environ.get('DATABASE_URL')

# Render provides DATABASE_URL starting with "postgres://" but psycopg3 wants
# "postgresql://". Normalize the scheme.
if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)


def get_db():
    """Open a new Postgres connection with dict_row factory.

    Returns a connection that auto-commits/rolls back via context manager.
    Use as: `with get_db() as conn: with conn.cursor() as c: ...`
    """
    if not DATABASE_URL:
        raise RuntimeError('DATABASE_URL is not set. Configure it in your env vars.')
    conn = psycopg.connect(DATABASE_URL, row_factory=dict_row)
    return conn
