from __future__ import annotations
import ctypes
import json
from typing import Dict, Iterable, List
from time import sleep
import os

import backend.player.vlc as vlc


class MalformedMessageException(Exception):
    pass


class PlayData:
    playing: bool
    volume: int
    timepoint: float
    duration: float
    track: str
    artist: str
    album: str
    thumbnail: bytes

    def __init__(
        self,
        playing: bool,
        volume: int,
        timepoint: float,
        duration: float,
        track: str,
        artist: str,
        album: str,
        thumbnail: bytes
    ) -> None:
        self.playing = playing
        self.volume = volume
        self.timepoint = timepoint
        self.duration = duration
        self.track = track
        self.artist = artist
        self.album = album
        self.thumbnail = thumbnail

    def to_json(self) -> str:
        return json.dumps({
            'playing': self.playing,
            'volume': self.volume,
            'timepoint': self.timepoint,
            'duration': self.duration,
            'track': self.track,
            'artist': self.artist,
            'album': self.album,
            'thumbnail': self.thumbnail
        })

    @staticmethod
    def from_json(data: str) -> PlayData:
        fields: Dict[str, type] = {
            'playing': bool,
            'volume': int,
            'timepoint': float,
            'duration': float,
            'track': str,
            'artist': str,
            'album': str,
            'thumbnail': bytes
        }
        try:
            d = json.loads(data)
            for f, t in fields.items():
                if f not in d or not isinstance(d[f], t):
                    raise MalformedMessageException()
            return PlayData(
                d['playing'],
                d['volume'],
                d['timepoint'],
                d['duration'],
                d['track'],
                d['artist'],
                d['album'],
                d['thumbnail']
            )
        except Exception:
            raise MalformedMessageException()


def configure_device_out(player: vlc.MediaPlayer):
    output_ll: vlc.AudioOutputDevice = player.audio_output_device_enum()
    cout = output_ll
    dlist: List[vlc.AudioOutputDevice] = []
    while cout:
        print(f"{cout.contents.device}: {cout.contents.description}")
        dlist.append(cout)
        cout = cout.contents.next
    c = int(input("Device:"))
    player.audio_output_device_set(None, dlist[c].contents.device)


def list_renderers(instance: vlc.Instance) -> List[vlc.Renderer]:
    renderers: Dict[str, vlc.Renderer] = {}

    def _add_renderer(event: vlc.Event):
        r: vlc.Renderer = vlc.Renderer(event.u.item.item)
        r.hold()
        print(f"Found renderer: {r.name()}")
        renderers[r.name()] = r

    def _del_renderer(event: vlc.Event):
        r: vlc.Renderer = vlc.Renderer(event.u.item.item)
        if r.name() in renderers:
            print(f'Lost renderer: {r.name()}')
            r.release()
            del renderers[r.name()]

    buffer: ctypes.POINTER(ctypes.POINTER(vlc.RdDescription)) = ctypes.POINTER(ctypes.POINTER(vlc.RdDescription))()
    buf_addr = ctypes.cast(ctypes.addressof(buffer), ctypes.POINTER(ctypes.POINTER(ctypes.POINTER(vlc.RdDescription))))
    rc: int = instance.renderer_discoverer_list_get(buf_addr)
    rlist = buffer.contents

    discoverers: List[vlc.RendererDiscoverer] = []
    for i in range(rc):
        obj = rlist[i]
        disc: vlc.RendererDiscoverer = instance.renderer_discoverer_new(obj.name)
        discoverers.append(disc)

        events: vlc.EventManager = disc.event_manager()
        events.event_attach(vlc.EventType.RendererDiscovererItemAdded, _add_renderer)
        events.event_attach(vlc.EventType.RendererDiscovererItemDeleted, _del_renderer)
        disc.start()

    sleep(2)
    for d in discoverers:
        d.stop()
        d.release()

    return list(renderers.values())


def main():
    os.add_dll_directory(os.getcwd())

    instance = vlc.Instance()
    player: vlc.MediaPlayer = instance.media_player_new()

    renderers: List[vlc.Renderer] = list_renderers(instance)
    for i, r in enumerate(renderers):
        print(f"{i}: {r.name()}")
    r = renderers[int(input("Select renderer: "))]
    player.set_renderer(r)
    
    media: vlc.Media = instance.media_new("audio/song.mp3")
    player.set_media(media)

    player.play()
    input("Press enter to quit")
    player.stop()


if __name__ == '__main__':
    main()
