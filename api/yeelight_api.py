import time
from flask import Flask, request

from .utils import discover_bulbs, Bulb

app = Flask(__name__)

bulb = Bulb("")


@app.route("/get_bulbs")
def get_yeelight_bulbs():
    return {"bulbs": discover_bulbs()}


@app.route("/light_on", methods=["GET", "POST"])
def let_there_be_light():
    if request.method == "POST":
        print(request.json)
        bulb._ip = str(request.json["ip"])

        bulb.turn_on()
        bulb.set_rgb(request.json["color"][0], request.json["color"][1],
                     request.json["color"][2])
        #
        bulb.set_brightness(50)
        time.sleep(2)
        bulb.turn_off()
        return "Response received"
