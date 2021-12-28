from fastapi import FastAPI, Header, HTTPException
import requests
import bson

def get_email(cache: dict, token: str):
    if token in cache.keys():
        return cache[token]
    else:
        resp = requests.get(
            "https://api.spotify.com/v1/me",
            headers={
                'Authorization': "Bearer " + token
            }
        )
        if resp.status_code != 200:
            print(resp.json())
            raise HTTPException(status_code=401, detail={"error": "Spotify Authorization Failed", 'spotify_api_msg': resp.json()['error']['message']})
        cache[token] = resp.json()['email']
        return cache[token]
