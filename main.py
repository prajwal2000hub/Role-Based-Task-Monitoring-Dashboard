from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from datetime import datetime, timedelta
from pydantic import BaseModel
import sqlite3

app = FastAPI()
SECRET_KEY = "secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy users
users = {
    "admin": {"username": "admin", "password": "admin123", "role": "admin"},
    "employee1": {"username": "employee1", "password": "emp123", "role": "employee"},
    "employee2": {"username": "employee2", "password": "emp123", "role": "employee"},
    "employee3": {"username": "employee3", "password": "emp123", "role": "employee"},
}


# Database setup
def init_db():
    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()

    employees = ['employee1', 'employee2', 'employee3']
    statuses = ['pending', 'completed']

    for task in ['a', 'b', 'c']:
        cursor.execute(f"""
            CREATE TABLE IF NOT EXISTS task_{task} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                description TEXT,
                status TEXT,
                assigned_to TEXT
            )
        """)
        cursor.execute(f"DELETE FROM task_{task}")  # Clear old data

        # Insert dummy data
        for i in range(3):
            for status in statuses:
                assigned_to = employees[(i + len(status)) % len(employees)]
                cursor.execute(f"""
                    INSERT INTO task_{task} (description, status, assigned_to)
                    VALUES (?, ?, ?)
                """, (f"Task {task.upper()} description {i} ", status, assigned_to))

    conn.commit()
    conn.close()


init_db()

# Auth utils
def create_token(username: str, role: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": username, "role": role, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"username": payload["sub"], "role": payload["role"]}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Login API
@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users.get(form_data.username)
    if not user or user["password"] != form_data.password:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return {"access_token": create_token(user["username"], user["role"]), "token_type": "bearer"}

# Task API
@app.get("/tasks/{task_name}")
def get_task_data(task_name: str, user: dict = Depends(get_current_user)):
    task = task_name.lower()
    if task not in ["a", "b", "c"]:
        raise HTTPException(status_code=400, detail="Invalid task")

    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()

    if user["role"] == "employee":
        cursor.execute(f"SELECT * FROM task_{task} WHERE assigned_to = ?", (user["username"],))
    else:
        cursor.execute(f"SELECT * FROM task_{task}")

    data = cursor.fetchall()
    conn.close()
    return [{"id": row[0], "description": row[1], "status": row[2]} for row in data]

# Reports
@app.get("/report/{task_name}")
def get_report(task_name: str, user: dict = Depends(get_current_user)):
    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()
    cursor.execute(f"SELECT status, COUNT(*) FROM task_{task_name.lower()} GROUP BY status")
    data = cursor.fetchall()
    conn.close()
    return {"task": task_name.upper(), "report": [{"status": r[0], "count": r[1]} for r in data]}
