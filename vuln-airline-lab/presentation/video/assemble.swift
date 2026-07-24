// Assemble slideN.png + narrN.aiff into a narrated MP4 using AVFoundation.
// Usage: swiftc assemble.swift -o assemble && ./assemble <count> <out.mp4>
import AVFoundation
import AppKit
import CoreVideo

let args = CommandLine.arguments
let count = args.count > 1 ? Int(args[1])! : 7
let outPath = args.count > 2 ? args[2] : "SkyHaven_Tutorial.mp4"
let dir = FileManager.default.currentDirectoryPath
let W = 1280, H = 720
let fps: Int32 = 15
let padding = 0.7            // seconds of silence held after each narration
let timescale: Int32 = 600

func log(_ s: String) { FileHandle.standardError.write((s + "\n").data(using: .utf8)!) }

// ---- load per-slide narration durations (reliable, synchronous) ----
var durations: [Double] = []
for i in 1...count {
    let url = URL(fileURLWithPath: "\(dir)/narr\(i).aiff")
    let f = try! AVAudioFile(forReading: url)
    durations.append(Double(f.length) / f.processingFormat.sampleRate + padding)
}
log("Slide durations: \(durations.map { String(format: "%.1f", $0) })")

// ---- CGImage -> CVPixelBuffer ----
func pixelBuffer(_ cg: CGImage) -> CVPixelBuffer {
    let attrs: [String: Any] = [
        kCVPixelBufferCGImageCompatibilityKey as String: true,
        kCVPixelBufferCGBitmapContextCompatibilityKey as String: true]
    var pb: CVPixelBuffer?
    CVPixelBufferCreate(kCFAllocatorDefault, W, H, kCVPixelFormatType_32ARGB,
                        attrs as CFDictionary, &pb)
    let buf = pb!
    CVPixelBufferLockBaseAddress(buf, [])
    let ctx = CGContext(data: CVPixelBufferGetBaseAddress(buf), width: W, height: H,
        bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(buf),
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Big.rawValue)!
    ctx.draw(cg, in: CGRect(x: 0, y: 0, width: W, height: H))
    CVPixelBufferUnlockBaseAddress(buf, [])
    return buf
}

func cgImage(_ path: String) -> CGImage {
    let img = NSImage(contentsOfFile: path)!
    var rect = CGRect(x: 0, y: 0, width: W, height: H)
    return img.cgImage(forProposedRect: &rect, context: nil, hints: nil)!
}

// ================= PASS 1: write silent video =================
let silentURL = URL(fileURLWithPath: "\(dir)/_silent.mp4")
try? FileManager.default.removeItem(at: silentURL)
let writer = try! AVAssetWriter(outputURL: silentURL, fileType: .mp4)
let vSettings: [String: Any] = [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: W, AVVideoHeightKey: H,
    AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: 4_000_000]]
let vInput = AVAssetWriterInput(mediaType: .video, outputSettings: vSettings)
vInput.expectsMediaDataInRealTime = false
let adaptor = AVAssetWriterInputPixelBufferAdaptor(
    assetWriterInput: vInput,
    sourcePixelBufferAttributes: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32ARGB])
writer.add(vInput)
writer.startWriting()
writer.startSession(atSourceTime: .zero)

let frameDur = CMTime(value: Int64(timescale / fps), timescale: timescale)
var frameCount: Int64 = 0
for i in 1...count {
    let buf = pixelBuffer(cgImage("\(dir)/slide\(i).png"))
    let frames = Int((durations[i - 1] * Double(fps)).rounded(.up))
    for _ in 0..<frames {
        while !vInput.isReadyForMoreMediaData { usleep(2000) }
        let pts = CMTime(value: frameCount * Int64(timescale / fps), timescale: timescale)
        adaptor.append(buf, withPresentationTime: pts)
        frameCount += 1
    }
    log("slide \(i): \(frames) frames")
}
vInput.markAsFinished()
let sem = DispatchSemaphore(value: 0)
writer.finishWriting { sem.signal() }
sem.wait()
log("silent video written (\(frameCount) frames)")

// ================= PASS 2: mux narration into final MP4 =================
let comp = AVMutableComposition()
let vAsset = AVURLAsset(url: silentURL)
let vTrack = comp.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)!
let srcV = vAsset.tracks(withMediaType: .video).first!
try! vTrack.insertTimeRange(CMTimeRange(start: .zero, duration: vAsset.duration), of: srcV, at: .zero)

let aTrack = comp.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid)!
var cursor = CMTime.zero
for i in 1...count {
    let aAsset = AVURLAsset(url: URL(fileURLWithPath: "\(dir)/narr\(i).aiff"))
    if let src = aAsset.tracks(withMediaType: .audio).first {
        try! aTrack.insertTimeRange(CMTimeRange(start: .zero, duration: aAsset.duration), of: src, at: cursor)
    }
    // advance cursor by the full slide duration (narration + padding)
    cursor = CMTimeAdd(cursor, CMTime(seconds: durations[i - 1], preferredTimescale: timescale))
}

let finalURL = URL(fileURLWithPath: outPath.hasPrefix("/") ? outPath : "\(dir)/\(outPath)")
try? FileManager.default.removeItem(at: finalURL)
let export = AVAssetExportSession(asset: comp, presetName: AVAssetExportPresetHighestQuality)!
export.outputURL = finalURL
export.outputFileType = .mp4
let sem2 = DispatchSemaphore(value: 0)
export.exportAsynchronously { sem2.signal() }
sem2.wait()
if export.status == .completed {
    try? FileManager.default.removeItem(at: silentURL)
    log("DONE → \(finalURL.path)")
} else {
    log("EXPORT FAILED: \(String(describing: export.error))")
    exit(1)
}
