from requests import status_codes
from fastapi import FastAPI, Header, HTTPException
from models import User, Dashboard, Mood, DashboardMood, MoodBody
from odmantic import AIOEngine
from motor.motor_asyncio import AsyncIOMotorClient
import os
import datetime
import requests
from fastapi.middleware.cors import CORSMiddleware
from utils import get_email
import bson

app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGODB_USERNAME = os.getenv("MONGODB_USERNAME")
MONGODB_PWD = os.getenv("MONGODB_PWD")
MONGODB_URL_PRE = os.getenv("MONGODB_URL_PRE")
MONGODB_ENV = "dev"

client = AsyncIOMotorClient("mongodb+srv://{}:{}@{}.mongodb.net/moozika_{}?retryWrites=true&w=majority".format(
    MONGODB_USERNAME,
    MONGODB_PWD,
    MONGODB_URL_PRE,
    MONGODB_ENV
))
engine = AIOEngine(motor_client=client, database=f'moozika_{MONGODB_ENV}')

token_to_id = {'BQAAAreO99EVEYSvTn2RYEHl0R6yBL1iGOvIGOlJrR2wCMbfU8VI2Yk3LGBxxwcYYYcidP6i3WzcJoQqTx8Y2INlDr_pUR3yNP6rYvtZJxmHfvv7eGjrHwVjmjHHoJvHpHfVhB6GiLf34EVjkOKuYmUyCo-uWo_h5qO_riq_UD_bSeyibaPKp2fh0zbt9jYtXUJFehzKo4JMpdmLEfp47M7YdHGA&token_type=Bearer&expires_in=3600': 'teonys@nyu.edu'}

@app.post("/api/user", response_model=User)
async def init_user(access_token: str = Header(None, convert_underscores=False)):
    print("Access token:" + access_token)
    resp = requests.get(
        "https://api.spotify.com/v1/me",
        headers={
            'Authorization': "Bearer " + access_token
        }
    )
    if resp.status_code != 200:
        print(resp.json())
        raise HTTPException(status_code=401, detail={"error": "Spotify Authorization Failed", 'spotify_api_msg': resp.json()['error']['message']})
    user_json = resp.json()
    curr_user = await engine.find_one(User, User.email == user_json['email'])
    if curr_user is not None:
        print("User already exists, incrementing logins")
        curr_user.logins += 1
        curr_user.last_login_date = datetime.datetime.utcnow().isoformat()
        curr_user.profile_pic_url = user_json['images'][0]['url'] if 'images' in user_json.keys() else ''
        curr_user.display_name = user_json['display_name']
        await engine.save(curr_user)
        token_to_id[access_token] = curr_user.email
        return curr_user
    new_user = User(
        email=user_json['email'],
        logins=1,
        created_date=datetime.datetime.utcnow().isoformat(),
        last_login_date=datetime.datetime.utcnow().isoformat(),
        profile_pic_url = user_json['images'][0]['url'] if user_json['images'] else '',
        display_name = user_json['display_name'],
        spotify_id = user_json['id']
    )
    await engine.save(new_user)
    token_to_id[access_token] = new_user.email
    print("Created new user")
    return new_user


@app.get('/api/dashboard', response_model=Dashboard)
async def dashboard(access_token: str = Header(None, convert_underscores=False)):
    user_email = get_email(token_to_id, access_token)
    if user_email is None:
        raise HTTPException(status_code=400, detail='Failed to get user id from cache')
    user = await engine.find_one(User, User.email == user_email)
    dashboard = Dashboard(
        user_email=user.email,
        moodz=[
            DashboardMood(
                name="Doomer",
                likes=5,
                vibes=[{'name': v, 'colors': vibes[v]} for v in ["Uplifting"]],
            ),
            DashboardMood(
                name="Korra is cute",
                likes=2,
                vibes=[{'name': v, 'colors': vibes[v]} for v in ["Uplifting"]],
            )
        ]
    )
    return dashboard

vibes = {'Uplifting': ['yellow-200', 'yellow-300'], 'Romantic': ['red-300', 'red-400']}

@app.get('/api/vibes')
async def get_vibes():
    return [{k: v} for k, v in vibes.items()]


@app.post('/api/mood')
async def create_mood(mood: MoodBody, access_token: str = Header(None, convert_underscores=False)):
    user_email = get_email(token_to_id, access_token)
    if user_email is None:
        raise HTTPException(status_code=400, detail='Failed to get user id from cache')
    curr_user = await engine.find_one(User, User.email == user_email)
    new_mood = Mood(
        likes=[],
        author=curr_user,
        vibes=mood.vibes,
        name=mood.name,
        description=mood.description
    )
    await engine.save(new_mood)
    return new_mood

@app.delete('/api/mood/{mood_id}')
async def delete_mood(mood_id: str, access_token: str = Header(None, convert_underscores=False)):
    user_email = get_email(token_to_id, access_token)
    if user_email is None:
        raise HTTPException(status_code=400, detail='Failed to get user id from cache')
    curr_user = await engine.find_one(User, User.email == user_email)
    mood = await engine.find_one(Mood, Mood.id == mood_id)
    if mood is None:
        raise HTTPException(status_code=404, detail='Mood with id ' + mood_id + 'not found.')
    if mood.author is not curr_user:
        raise HTTPException(status_code=405, detail='User does not have permission to delete this mood.')
    await engine.delete(mood)
    return {'status': 'Deleted successfully'}

@app.get('/api/mood/{mood_id}', response_model=Mood)
async def get_mood(mood_id: str):
    mood = await engine.find_one(Mood, Mood.id == bson.ObjectId(mood_id))
    return mood


@app.get('/api/songs/search')
async def search_songs(query: str, access_token: str = Header(None, convert_underscores=False)):
    search_resp = requests.get('https://api.spotify.com/v1/search',
        params={'type': 'track', 'q': query, 'limit': 5},
        headers={
            'Authorization': "Bearer " + access_token
        }
    )
    songs = []
    for s in search_resp.json()['tracks']['items']:
        new_song = {}
        new_song['name'] = s['name']
        new_song['id'] = s['id']
        new_song['album'] = s['album']['name']
        new_song['artists'] = ",".join([a['name'] for a in s['artists']])
        for i in s['album']['images']:
            if i['height'] == 64:
                new_song['image_url'] = i['url']
        songs.append(new_song)
    return songs