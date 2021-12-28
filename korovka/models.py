from typing import Optional
from odmantic import Field, Model, Reference
from pydantic import BaseModel
from typing import List, Dict, Any
import datetime
import bson

class User(Model):
    email: str = Field(primary_field=True)
    logins: int
    created_date: str = str(datetime.datetime.now())
    last_login_date: str = str(datetime.datetime.now())
    spotify_id: str
    display_name: str
    profile_pic_url: str
    moods: List[str]
    liked: List[str]


class Mood(Model):
    name: str
    description: str
    likes: int
    vibes: List[str]
    songs: List[str]
    created_date: str = str(datetime.datetime.now())
    author: User = Reference()


class MoodBody(BaseModel):
    name: str
    vibes: List[str]
    songs: List[str]
    description: str


class DashboardMood(BaseModel):
    id: str
    name: str
    likes: int
    liked: Optional[bool]
    created_on: str = str(datetime.datetime.now())
    vibes: List[Dict[str, Any]]
    songs: Optional[List[str]]
    description: str

class DisplayMood(BaseModel):
    id: str
    name: str
    likes: int
    liked: Optional[bool]
    created_on: str = str(datetime.datetime.now())
    vibes: List[Dict[str, Any]]
    songs: Optional[List[str]]
    description: str
    author: str
    img_url: str

class Dashboard(BaseModel):
    user_email: str
    moodz: List[DashboardMood]
    liked_moodz: List[DashboardMood]

