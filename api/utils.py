from yeelight import discover_bulbs, Bulb
from typing import List


def lightup_bulb(bulb: Bulb, ip: str, color: List[int]):
    """
    This method is used to, surprise surprise, light up a bulb with
    selected color

    :param bulb: Bulb object from yeelight lib
    :param ip: bulb's ip as str
    :param color: list with colors as [r, g, b]
    :return: None
    """
    bulb._ip = ip
    bulb.turn_on()
    bulb.set_rgb(color[0], color[1], color[2])
    bulb.set_brightness(30)
