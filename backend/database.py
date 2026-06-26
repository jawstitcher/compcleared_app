"""Postgres connection helper for the CompCleared backend.

Replaces the old SQLite connection pattern. Uses psycopg3 with dict_row
so fetchone() / fetchall() return dicts (matching the old sqlite3.Row behavior).
"""
import os
import psycopg
from psycopg.rows import dict_row

def get_database_url():
    """Read and normalize the database URL at connection time."""
    database_url = os.environ.get('DATABASE_URL')

    # Render provides DATABASE_URL starting with "postgres://" but psycopg3 wants
    # "postgresql://". Normalize the scheme.
    if database_url and database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)

    return database_url


def get_db():
    """Open a new Postgres connection with dict_row factory.

    Returns a connection that auto-commits/rolls back via context manager.
    Use as: `with get_db() as conn: with conn.cursor() as c: ...`
    """
    database_url = get_database_url()
    if not database_url:
        raise RuntimeError('DATABASE_URL is not set. Configure it in your env vars.')
    conn = psycopg.connect(database_url, row_factory=dict_row)
    return conn
