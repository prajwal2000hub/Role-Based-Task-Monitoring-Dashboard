from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List
from datetime import datetime, timedelta
from sqlalchemy import create_engine, Column, Integer, String, Text, Enum, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import random
import enum

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


DATABASE_URL = "sqlite:///./robot_monitoring.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Enums
class RoleEnum(str, enum.Enum):
    admin = "admin"
    employee = "employee"

class StatusEnum(str, enum.Enum):
    in_progress = "in_progress"
    completed = "completed"
    failed = "failed"

# Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(Enum(RoleEnum))

class Robot(Base):
    __tablename__ = "robots"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text)

class RobotTaskLog(Base):
    __tablename__ = "robot_task_logs"
    id = Column(Integer, primary_key=True, index=True)
    robot_id = Column(Integer, ForeignKey("robots.id"))
    task_id = Column(Integer, ForeignKey("tasks.id"))
    status = Column(Enum(StatusEnum))
    remarks = Column(Text)
    timestamp = Column(DateTime)

class UserRobotAccess(Base):
    __tablename__ = "user_robot_access"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    robot_id = Column(Integer, ForeignKey("robots.id"))

Base.metadata.create_all(bind=engine)

# Seeding data
def seed_data():
    db = SessionLocal()
    if db.query(User).count() == 0:
        users = [
            User(username=f"user{i}", password="pass123", role=random.choice(list(RoleEnum)))
            for i in range(1, 6)
        ]
        db.add_all(users)

    if db.query(Robot).count() == 0:
        robots = [Robot(name=f"Robot_{i}") for i in range(1, 21)]
        db.add_all(robots)

    if db.query(Task).count() == 0:
        tasks = [Task(name=f"Task_{i}", description=f"Description for task {i}") for i in range(1, 11)]
        db.add_all(tasks)

    db.commit()

    user_ids = [u.id for u in db.query(User).filter(User.role == RoleEnum.employee).all()]
    robot_ids = [r.id for r in db.query(Robot).all()]

    if db.query(UserRobotAccess).count() == 0:
        access = [
            UserRobotAccess(user_id=random.choice(user_ids), robot_id=random.choice(robot_ids))
            for _ in range(30)
        ]
        db.add_all(access)

    task_ids = [t.id for t in db.query(Task).all()]

    if db.query(RobotTaskLog).count() == 0:
        logs = [
            RobotTaskLog(
                robot_id=random.choice(robot_ids),
                task_id=random.choice(task_ids),
                status=random.choice(list(StatusEnum)),
                remarks=f"Auto remark {i}",
                timestamp=datetime.utcnow() - timedelta(seconds=random.randint(0, 3600))
            ) for i in range(1, 101)
        ]
        db.add_all(logs)

    db.commit()
    db.close()

seed_data()

# OAuth2 simulation
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
fake_tokens = {
    "admin-token": {"username": "user1", "role": "admin"},
    "employee-token": {"username": "user2", "role": "employee"},
}

def get_current_user(token: str = Depends(oauth2_scheme)):
    user = fake_tokens.get(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

# Pydantic model
class RobotTaskLogOut(BaseModel):
    id: int
    robot_id: int
    task_id: int
    status: StatusEnum
    remarks: str
    timestamp: datetime

    class Config:
        orm_mode = True

@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    for token, user in fake_tokens.items():
        if form_data.username == user["username"]:
            return {"access_token": token, "token_type": "bearer"}
    raise HTTPException(status_code=400, detail="Incorrect username or password")

@app.get("/logs", response_model=List[RobotTaskLogOut])
def get_logs(current_user: dict = Depends(get_current_user)):
    db = SessionLocal()
    try:
        if current_user["role"] == "admin":
            logs = db.query(RobotTaskLog).all()
        else:
            user = db.query(User).filter(User.username == current_user["username"]).first()
            allowed_robot_ids = [access.robot_id for access in db.query(UserRobotAccess).filter_by(user_id=user.id).all()]
            logs = db.query(RobotTaskLog).filter(RobotTaskLog.robot_id.in_(allowed_robot_ids)).all()
        return logs
    finally:
        db.close()
