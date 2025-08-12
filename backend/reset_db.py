from app.database import engine, Base
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text("DROP SCHEMA public CASCADE;"))
    conn.execute(text("CREATE SCHEMA public;"))
    conn.commit()

print("✅ Schema dropped & recreated.")

Base.metadata.create_all(bind=engine)
print("✅ Tables created successfully!")
