import time
from flask import Flask, request

from .utils import discover_bulbs, Bulb, lightup_bulb

app = Flask(__name__)

bulb = Bulb("")


@app.route("/get_bulbs")
def get_yeelight_bulbs():
    bulb_data = discover_bulbs()
    bulb._ip = bulb_data[0]["ip"]
    if not bulb.music_mode:
        bulb.start_music(bulb_data[0]["port"])
    return {"bulbs": bulb_data}


@app.route("/light_on", methods=["GET", "POST"])
def lumos():
    if request.method == "POST":
        print(request.json)
        lightup_bulb(
            bulb,
            request.json["ip"],
            request.json["color"],
            request.json["brightness"]
        )
        return "Response received"


@app.route("/light_off", methods=["GET", "POST"])
def nox():
    if request.method == "POST":
        bulb.turn_off()
    return "Response received"
