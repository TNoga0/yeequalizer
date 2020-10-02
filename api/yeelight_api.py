import time
from flask import Flask, request

from .utils import discover_bulbs, Bulb, lightup_bulb

app = Flask(__name__)

bulb = Bulb("")


@app.route("/get_bulbs")
def get_yeelight_bulbs():
    return {"bulbs": discover_bulbs()}


@app.route("/light_on", methods=["GET", "POST"])
def let_there_be_light():
    if request.method == "POST":
        lightup_bulb(bulb, request.json["ip"], request.json["color"])
        time.sleep(2)
        bulb.turn_off()
        return "Response received"
