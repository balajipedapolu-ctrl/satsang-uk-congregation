#!/bin/bash
# Rebuild the narrated MP4 tutorial from scratch (macOS; no ffmpeg needed).
# Uses: Google Chrome (render slides), `say` (voiceover), swiftc + AVFoundation (encode).
set -e
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
COUNT=7

echo "1/4 · generating slides…"
python3 make_slides.py

echo "2/4 · rendering slide PNGs…"
for i in $(seq 1 $COUNT); do
  "$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size=1280,720 --screenshot="$PWD/slide$i.png" "file://$PWD/slide$i.html" >/dev/null 2>&1
done

echo "3/4 · generating narration (say)…"
python3 - <<'PY'
import json, subprocess
for i,t in enumerate(json.load(open("narration.json")), 1):
    subprocess.run(["say","-v","Samantha","-r","170","-o",f"narr{i}.aiff",t], check=True)
PY

echo "4/4 · encoding MP4 (swift/AVFoundation)…"
swiftc assemble.swift -o assemble 2>/dev/null
./assemble $COUNT "../SkyHaven_Tutorial.mp4"

echo "✅ ../SkyHaven_Tutorial.mp4"
