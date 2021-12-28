from typing import Optional
from odmantic import Field, Model, Reference
from pydantic import BaseModel
from typing import List, Dict, Any
import datetime

class User(Model):
    email: str = Field(primary_field=True)
    logins: int
    created_date: str = str(datetime.datetime.now())
    last_login_date: str = str(datetime.datetime.now())
    spotify_id: str
    display_name: str
    profile_pic_url: str


class Mood(Model):
    name: str
    description: str
    likes: List[str]
    vibes: List[str]
    created_date: str = str(datetime.datetime.now())
    author: User = Reference()


class MoodBody(BaseModel):
    name: str
    vibes: List[str]
    description: str


class DashboardMood(BaseModel):
    name: str
    likes: int
    created_on: str = str(datetime.datetime.now())
    vibes: List[Dict[str, Any]]


class Dashboard(BaseModel):
    user_email: str
    moodz: List[DashboardMood]

