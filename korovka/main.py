from requests import status_codes
from fastapi import FastAPI, Header, HTTPException
from korovka.models import DisplayMood
from korovka.models import User, Dashboard, Mood, DashboardMood, MoodBody
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
MONGODB_ENV = os.getenv("MONGODB_ENV") if os.getenv("MONGODB_ENV") else "dev"

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
        profile_pic_url=user_json['images'][0]['url'] if user_json['images'] else '',
        display_name=user_json['display_name'],
        spotify_id=user_json['id'],
        liked=[]
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
    user_moods = [await engine.find_one(Mood, Mood.id == bson.ObjectId(mood)) for mood in user.moods]
    liked_moods = [await engine.find_one(Mood, Mood.id == bson.ObjectId(mood)) for mood in user.liked]
    dashboard = Dashboard(
        user_email=user.email,
        moodz=[
            DashboardMood(
                id=str(m.id),
                name=m.name,
                created_on=m.created_date,
                likes=m.likes,
                # liked=str(m.id) in user.liked,
                vibes=[{'name': m, 'colors': vibes[m]} for m in m.vibes],
                songs=m.songs,
                description=m.description
            ) for m in user_moods],
        liked_moodz=[
            DashboardMood(
                id=str(m.id),
                name=m.name,
                created_on=m.created_date,
                likes=m.likes,
                # liked=str(m.id) in user.liked,
                vibes=[{'name': m, 'colors': vibes[m]} for m in m.vibes],
                description=m.description
            ) for m in liked_moods
        ]
    )
    return dashboard


vibes = {
    'Uplifting': ['yellow-100', 'yellow-300'],
    'Romantic': ['red-200', 'red-400'],
    'Calm': ['blue-200', 'blue-400'],
    'Fresh': ['green-300', 'green-500'],
    'Eclectic': ['purple-300', 'purple-500'],
    'Energetic': ['orange-400', 'orange-600']
}


@app.get('/api/vibes')
async def get_vibes():
    return [{'name': k, 'colors': v} for k, v in vibes.items()]


@app.post('/api/mood')
async def create_mood(mood: MoodBody, access_token: str = Header(None, convert_underscores=False)):
    user_email = get_email(token_to_id, access_token)
    if user_email is None:
        raise HTTPException(status_code=400, detail='Failed to get user id from cache')
    curr_user = await engine.find_one(User, User.email == user_email)
    new_mood = Mood(
        likes=1,
        author=curr_user,
        vibes=mood.vibes,
        name=mood.name,
        description=mood.description,
        songs=mood.songs
    )
    await engine.save(new_mood)
    curr_user.moods.append(str(new_mood.id))
    curr_user.liked.insert(0, str(new_mood.id))
    await engine.save(curr_user)
    return new_mood


@app.post('/api/mood/{mood_id}/edit')
async def edit_mood(mood_id: str, update: MoodBody, access_token: str = Header(None, convert_underscores=False)):
    user_email = get_email(token_to_id, access_token)
    if user_email is None:
        raise HTTPException(status_code=400, detail='Failed to get user id from cache')
    curr_user = await engine.find_one(User, User.email == user_email)
    mood = await engine.find_one(Mood, Mood.id == bson.ObjectId(mood_id))
    if mood is None:
        raise HTTPException(status_code=404, detail='Mood with id ' + mood_id + 'not found.')
    if mood.author.email != curr_user.email:
        raise HTTPException(status_code=405, detail='User does not have permission to edit this mood.')
    mood.description = update.description
    mood.name = update.name
    mood.vibes = update.vibes
    mood.songs = update.songs
    await engine.save(mood)
    curr_user.moods.remove(mood_id)
    curr_user.moods.insert(0, str(mood.id))
    return {'status': 'success'}


@app.delete('/api/mood/{mood_id}')
async def delete_mood(mood_id: str, access_token: str = Header(None, convert_underscores=False)):
    user_email = get_email(token_to_id, access_token)
    if user_email is None:
        raise HTTPException(status_code=400, detail='Failed to get user id from cache')
    curr_user = await engine.find_one(User, User.email == user_email)
    mood = await engine.find_one(Mood, Mood.id == bson.ObjectId(mood_id))
    if mood is None:
        raise HTTPException(status_code=404, detail='Mood with id ' + mood_id + 'not found.')
    if mood.author != curr_user:
        raise HTTPException(status_code=405, detail='User does not have permission to delete this mood.')
    curr_user.moods.remove(mood_id)
    try:
        curr_user.liked.remove(mood_id)
    except ValueError:
        print("User did not like the post in the first place!")
    await engine.delete(mood)
    await engine.save(curr_user)
    return {'status': 'Deleted successfully'}


<<<<<<< HEAD
@app.get('/api/mood/{mood_id}', response_model=DisplayMood)
=======
@app.get('/api/mood/{mood_id}', response_model=Mood)
>>>>>>> d9fa75f7dd5771cbada9ac842aac64135c94a57a
async def get_mood(mood_id: str):
    mood = await engine.find_one(Mood, Mood.id == bson.ObjectId(mood_id))
    if mood is None:
        raise HTTPException(status_code=404, detail='Mood with id {} not found.'.format(mood_id))
<<<<<<< HEAD
    m = DisplayMood(
        id=str(mood.id),
        name=mood.name,
        created_on=mood.created_date,
        likes=mood.likes,
        # liked=str(mood.id) in user.liked,
        vibes=[{'name': m, 'colors': vibes[m]} for m in mood.vibes],
        songs=mood.songs,
        description=mood.description,
        author=mood.author.display_name,
        img_url=mood.author.profile_pic_url
    )
    return m
=======
    return mood
>>>>>>> d9fa75f7dd5771cbada9ac842aac64135c94a57a


@app.get('/api/songs/search')
async def search_songs(query: str, access_token: str = Header(None, convert_underscores=False)):
    search_resp = requests.get(
        'https://api.spotify.com/v1/search',
        params={'type': 'track', 'q': query, 'limit': 5},
        headers={
            'Authorization': "Bearer " + access_token
        }
    )
    if search_resp.status_code != 200:
        raise HTTPException(status_code=404, detail="Failed API calls")
    songs = []
    for s in search_resp.json()['tracks']['items']:
        new_song = {}
        new_song['name'] = s['name']
        new_song['id'] = s['id']
        new_song['album'] = s['album']['name']
        new_song['artists'] = ", ".join([a['name'] for a in s['artists']])
        for i in s['album']['images']:
            if i['height'] == 64:
                new_song['image_url'] = i['url']
        songs.append(new_song)
    return songs

@app.get('/api/songs/{id}')
async def get_song_by_id(id: str, access_token: str = Header(None, convert_underscores=False)):
    song_resp = requests.get(
        'https://api.spotify.com/v1/tracks/{}'.format(id),
        headers={
            'Authorization': "Bearer " + access_token
        }
    )
    if song_resp.status_code != 200:
        raise HTTPException(status_code=404, detail="Failed API calls")
    song_json = song_resp.json()
    song = {
        'name': song_json['name'],
        'id': id,
        'album': song_json['album']['name'],
        'artists': ", ".join([a['name'] for a in song_json['artists']])
    }
    for i in song_json['album']['images']:
        if i['height'] == 64:
            song['image_url'] = i['url']
    return song


@app.get('/api/mood/{mood_id}/recommendations')
async def get_mood_recommendations(mood_id: str, access_token: str = Header(None, convert_underscores=False)):
    user_email = get_email(token_to_id, access_token)
    if user_email is None:
        raise HTTPException(status_code=400, detail='Failed to get user id from cache')
    curr_user = await engine.find_one(User, User.email == user_email)
    mood = await engine.find_one(Mood, Mood.id == bson.ObjectId(mood_id))
    if mood is None:
        raise HTTPException(status_code=404, detail='Mood with id ' + mood_id + ' not found.')
    if mood.author.email != curr_user.email:
        raise HTTPException(status_code=405, detail='User does not have permission to delete this mood.')
    s_tracks = mood.songs[:5]
    reqs_resp = requests.get(
        'https://api.spotify.com/v1/recommendations',
        params={
            'limit': 10,
            'seed_tracks': ",".join(s_tracks)
        },
        headers={
            'Authorization': "Bearer " + access_token
        }
    )
    songs = []
    for s in reqs_resp.json()['tracks']:
        new_song = {}
        new_song['name'] = s['name']
        new_song['id'] = s['id']
        new_song['album'] = s['album']['name']
        new_song['artists'] = ", ".join([a['name'] for a in s['artists']])
        for i in s['album']['images']:
            if i['height'] == 64:
                new_song['image_url'] = i['url']
        songs.append(new_song)
    return songs


@app.get('/api/mood/{mood_id}/like')
async def like_mood(mood_id: str, access_token: str = Header(None, convert_underscores=False)):
    user_email = get_email(token_to_id, access_token)
    if user_email is None:
        raise HTTPException(status_code=400, detail='Failed to get user id from cache')
    curr_user = await engine.find_one(User, User.email == user_email)
    mood = await engine.find_one(Mood, Mood.id == bson.ObjectId(mood_id))
    if mood is None:
        raise HTTPException(status_code=404, detail='Mood with id ' + mood_id + ' not found.')
    if str(mood.id) in curr_user.liked:
        mood.likes -= 1
        curr_user.liked.remove(str(mood.id))
    else:
        mood.likes += 1
        curr_user.liked.insert(0, str(mood.id))
    await engine.save_all([mood, curr_user])
    return {'status': 'completed'}


