const ytdlpl = require("yt-dl-playlist");

var dl = new ytdlpl({
    outputPath: "./music",
    ffmpegPath: "/Programs/ffmpeg",
    maxParallelDownload: 2,
    fileNameGenerator: (videoTitle) => {
        return 'a-new-file-name.mp3'
    }
})

//dl.on('start', (fileInfo) => console.log(fileInfo))
dl.on('progress', (fileInfo) => console.log(fileInfo))
dl.on('complete', (fileInfo) => console.log("Done"))
dl.on('error', (fileInfo) => console.log(fileInfo.error))

dl.download("Wu8halh9DXs");