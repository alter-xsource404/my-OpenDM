# OpenDM

![OpenDM's main window, laid out like a classic download manager](docs/screenshot.png)

A free, open-source download manager for Windows, macOS and Linux, inspired by tools like IDM.
One Python file, no dependencies for the basics.

- **Faster downloads:** splits files across up to 32 connections, and when one connection finishes early it takes over half of the slowest remaining piece (dynamic segmentation).
- **Pause and resume:** survives restarts. Failed connections retry automatically.
- **Queue, speed limit, scheduler:** global and per-download speed limits you can change mid-download; run only between chosen hours (overnight windows work); optionally exit or shut down when finished.
- **Categories and auto-sorting:** downloads are sorted into `Video`, `Documents`, `Music`, `Compressed`, `Images`, `Programs` and `General` folders by file type (or by website), using the file's real name even when the server only reveals it after the download starts. A sidebar filters the list by category, *Unfinished* and *Finished*, with live counts. Add, rename and edit categories, or move a download with right-click > *Move to category*.
- **System tray:** an icon with a quick menu (show, pause/resume all, speed limit, open folder, quit), a tooltip with the live status, balloon notifications when a download finishes or fails, and *close to tray* so downloads carry on in the background.
- **A classic download-manager window:** menu bar (Tasks, File, Downloads, View, Help, Registration), an icon toolbar, a navigation tree (All Downloads with its categories, Unfinished, Finished, Grabber projects, Queues) and a sortable list with File Name, Q, Size, Status, Time left, Transfer rate, Last Try and Description columns.
- **Queues and a site grabber:** keep downloads in named queues you can start and stop together, and scan any web page for the images, videos, documents or archives it links to.
- **Live speed graph:** a 60-second speed chart (all downloads, or just the one you select) with Now / Peak / Avg, plus a segment map showing which parts of the file each connection has filled.
- **Video downloads:** HLS (`.m3u8`) streams with quality selection, AES-128 decryption, and optional ffmpeg muxing to `.mp4`.
- **Browser integration:** a Chrome/Edge/Brave/Firefox extension that takes over downloads, adds a right-click menu, and shows a **floating video panel** with a quality picker for videos it finds on the page.
- **GUI and CLI.**

OpenDM is an independent project. It is clean-room code written from public specifications (HTTP/1.1 Range requests, HLS). It contains no code from, and is not affiliated with, any commercial download manager.

## Install

**Option A: download a build** from the [Releases](../../releases) page (Windows `.exe`, macOS `.app`, Linux binary).

**Option B: run from source** (Python 3.9+, tkinter included with most Python installs):

```
python opendm.py                 # GUI
pip install cryptography         # optional: only for AES-encrypted HLS streams
```

On Debian/Ubuntu you may need `sudo apt install python3-tk`. Install [ffmpeg](https://ffmpeg.org) if you want videos merged into `.mp4`.

## Usage

```
python opendm.py                                  # open the GUI
python opendm.py URL [URL ...] -n 8 -o ~/Downloads   # CLI: 8 connections
python opendm.py STREAM.m3u8 -q 720 -l 500        # video, max 720p, limit 500 KB/s
python opendm.py -p 6801                          # GUI, browser API on another port
```

Other options: `--sort` (CLI only: sort into category sub-folders of `-o`), `--minimized` (start in the tray), `--version`.

### The window

| Part | What it does |
|---|---|
| **Menu bar** | *Tasks*: add a download, add all links from the clipboard, run the site grabber, export/import the list, exit. *File*: open, open folder, move/rename, redownload, properties, copy address. *Downloads*: resume, stop, delete, move to a category or queue, start/stop queue, speed limiter, scheduler, categories, options. *View*: show or hide the toolbar, categories pane, speed graph and status bar; sort. *Help*, and *Registration* (OpenDM is free, so this just says so and shows the MIT license). |
| **Toolbar** | Add URL, Resume, Stop, Stop All, Delete, Delete C. (completed), Options, Scheduler, Start Queue, Stop Queue, Grabber and Browser (extension pairing). Buttons grey out when they don't apply. |
| **Navigation tree** | *All Downloads* with a folder per category, *Unfinished*, *Finished*, *Grabber projects* (one entry per project) and *Queues*. Counts are live. Right-click a queue to start, stop, rename or delete it. Drag the divider to resize. |
| **List** | **File Name**, **Q** (place in its queue), **Size**, **Status** (`Complete`, `45.30%`, `Stopped 12.0%`, `Queued`...), **Time left** (`2 min 15 sec`), **Transfer rate** (`1.5 MBytes/sec`), **Last Try** (`Oct 21 11:03:12 2026`), **Description** (the source site; edit it in Properties). Click a title to sort. |

Add downloads with **Add URL** (`Ctrl+N`): paste links, optionally pick a category and queue, then **Start Download** or **Download Later** (it waits in its queue until you start it). Double-click a finished file to open it; right-click for Open, Resume, Stop, Delete, Move to category/queue, Limit speed, Redownload, Properties and Copy address.

**Queues.** Every download belongs to a queue (`Main download queue` by default; create more with *Downloads > New queue*). *Start Queue* / *Stop Queue* act on the queue selected in the tree. Queues organise and start/stop work; the number of simultaneous downloads and the scheduler window apply to everything.

**Site grabber** (*Tasks > Run site grabber*). Enter a page address, choose what to look for (images, video, documents, archives...) and whether to follow that site's links one level, press *Explore*, tick the files you want and download them. They are grouped as a *Grabber project* in the tree. It reads normal HTML pages; pages that build their links with JavaScript show nothing.

**Keyboard:** `Ctrl+N` add, `Ctrl+R` resume, `Ctrl+S` stop, `Del` delete, `Enter` open, `Alt+Enter` properties, `F2` rename, `F5` refresh, `Ctrl+A` select all, `Ctrl+C` copy address.

### Categories

Open *Downloads > Categories* (or right-click a category in the tree) to edit them. Each category has a name, file types (`mp4, mkv`), an optional save folder (empty means `<download folder>/<name>`; relative folders are relative to the download folder) and optional websites (`school.example`: everything from that site goes here, even `.mp4` files). Rules are checked top to bottom, websites before file types, and **General** catches everything else. Turn auto-sorting off with the checkbox to keep everything in one folder (the category is still shown and filterable).

Right-click a download > **Move to category** to override it: before it starts that changes where it will be saved; once it has finished the file is moved. A half-downloaded file can't be moved. Deleting or renaming a category updates the downloads that used it.

### System tray

Needs the optional add-on: `pip install pystray pillow` (included in the Windows and Linux builds). Turn it on or off in *Downloads > Options*.

- Menu: Show OpenDM (also double-click), Pause all, Resume all, Speed limit (No limit / 256 KB/s / 512 KB/s / 1 MB/s / 5 MB/s), Open download folder, Quit.
- The window's close button hides OpenDM to the tray instead of quitting (switch off in Options). Use *Quit OpenDM* in the tray menu to exit.
- Balloon notifications appear when a download finishes or fails while the window is hidden or not in front.
- Not available on macOS (the library needs the thread the window uses). On GNOME, install the *AppIndicator* extension to see tray icons. If the tray can't start, OpenDM keeps working and Options says why.

## Browser extension

1. Start OpenDM and click **Browser setup** to see your pairing token.
2. **Chrome / Edge / Brave:** open `chrome://extensions`, enable *Developer mode*, *Load unpacked*, choose the `extension/` folder.
   **Firefox:** in `extension/`, replace `manifest.json` with `manifest.firefox.json`, then `about:debugging` → *This Firefox* → *Load Temporary Add-on*. (Before publishing to addons.mozilla.org, change the placeholder id `opendm@example.org` in that manifest.)
3. Open the extension's options, paste the token, press **Save & test**.

Downloads you click are handed to OpenDM (if OpenDM isn't running, the browser keeps them). Right-click a link for *Download link with OpenDM*.

**Floating video panel.** When a page plays a video, a round OpenDM bubble with a count appears on the page. Click it to open the panel (drag it anywhere; it remembers its position):

- Every detected video is listed. For HLS streams the panel reads the stream's available qualities and lets you pick one (for example *720p60 · 2.8 Mbps*), or leave it on *Best available*. Press **Download** and OpenDM fetches exactly that rendition.
- **Direct video files show their real quality.** The panel reads each file's header (without downloading it) and shows resolution, length, size and whether it has sound, e.g. `720p · 0:12 · 5.0 MB`. Best quality is listed first. Pieces of a stream (init/segment files) are hidden, and sites that serve one video as many `?bytestart=…&byteend=…` pieces appear as a single entry.
- **Names come from the video's caption**, cleaned up (`(2) Funny dog - YouTube` becomes `Funny dog`), in an editable box. The quality is added to the file name.
- **Picture and sound in two files?** Facebook, Instagram and other DASH-style sites serve a silent video and a separate audio file, and the player joins them. If you download just one you get a file with no video (audio only) or no sound. When the panel finds a silent video and the audio track of the same length, it shows `+ sound` and an **Add the sound** checkbox (on by default). OpenDM downloads both in parallel and merges them into one `.mp4`. This needs [ffmpeg](https://ffmpeg.org); without it OpenDM keeps `… (video only).mp4` and `… (audio only).m4a` side by side so nothing is lost.
- Hovering a large `<video>` also shows a **Download video** button, like other download managers.
- `–` minimizes it, `×` hides it on that site. The toolbar popup can turn the panel off globally or per site, and open it manually.
- The panel can't read streams the page hides behind `blob:` URLs without a network request OpenDM can see; play the video first so the stream shows up. It can't run on browser-internal pages or extension stores.

## Security model

OpenDM's browser API listens on `127.0.0.1:6800` only. A request must carry the pairing token (stored in `~/.opendm/token`), must not come from a web page (requests with a website `Origin` are rejected), and must have a localhost `Host` header (blocks DNS rebinding). Only `http(s)` URLs are accepted. Cookies sent by the extension are kept in memory, are sent only to the original host (never forwarded on cross-host redirects), and are never written to disk, so a login-protected download cannot resume after OpenDM restarts unless you send it again from the browser. Keep your token private.

## Limitations

- HLS **live streams** and **DRM-protected** streams (Widevine, FairPlay, SAMPLE-AES) are not supported, and OpenDM does not attempt to circumvent DRM.
- Video+audio merging needs ffmpeg, and pairing relies on both tracks having been loaded by the page (play the video for a few seconds first).
- **DASH** (`.mpd`) and site-specific extractors (YouTube etc.) are not included.
- The scheduler works only while OpenDM is running.
- The tray icon isn't available on macOS, and on GNOME it needs the AppIndicator extension.
- Please respect copyright and each website's terms of service. You are responsible for what you download.

## Development

```
python -m unittest discover -s tests -v      # core app: local servers, no internet needed
xvfb-run -a python tests/gui_smoke.py          # drives the real window (needs a display; skips without one)
(cd tests/js && npm install && npm test)      # extension: background logic + floating panel (jsdom)
pip install pillow && python tools/make_icons.py   # regenerate all icons from code (assets/, extension/icons/, window + panel icons)
pip install -r requirements-build.txt && python build.py   # standalone app for your OS (dist/)
```

CI runs the tests on Windows, macOS and Linux. Pushing a tag like `v1.2.0` builds all three apps and attaches them, plus the extension zip, to a GitHub Release.

Ideas for contributions: DASH support, a proper packaged extension for the Chrome/Firefox stores, clipboard monitoring, per-site login profiles, torrent/magnet hand-off, translations.

## License

MIT, see [LICENSE](LICENSE).
