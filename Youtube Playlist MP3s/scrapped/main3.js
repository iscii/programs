const fs = require("fs");
const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const idl = require("image-downloader");
const ffmpeg = require("ffmpeg");
const id3 = require("node-id3");
//const ffmetadata = require("ffmetadata");
//const request = require("request").defaults({encoding:null});
/* const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath); */
//const progress = require("progress-stream");

//playlist or solo video
async function downloadMusic() {
	//maybe i can download it as mp4 first, then extract audio using ffmpeg... or use fluent ffmpeg to extract audio during stream?
	let file = "Music_A/video.mp4";
	ytdl("https://www.youtube.com/watch?v=Wu8halh9DXs&ab_channel=EXO-Topic", {filter: format => format.container === "mp4", quality: "highest"})
		.pipe(fs.createWriteStream(file))
		.on("finish", async () => {
			let a = await new ffmpeg(file);
			a.fnExtractSoundToMP3("Music_A/sound.mp3");
		})
}

async function testFfmpeg() {
	// #1
	try{
		ytdl("https://www.youtube.com/watch?v=3gS9aqJhyOw&ab_channel=JordyChandra", {quality: "highestaudio"})
			.pipe(fs.createWriteStream("hi.mp3"))
			.on("finish", async () => {
				let a = await new ffmpeg("hi.mp3"); //ffmpeg inputs commands to the cli so we need to enclose the paths in quotes cos they don't do that automatically
				a.setAudioBitRate(128).save('"Music A/hi.mp3"', function(error, file){
					console.log(error);
				})
			})
	}
	catch(error){
		console.log(error);
	}

	// #2
	if (!fs.existsSync(pl.title.replace(" ", "_"))) {
		const folder = fs.mkdirSync(pl.title.replace(" ", "_"));
	}
	try{
		let a = await new ffmpeg("./Music_A/hi a.mp3", function(error){
			console.log(error);
		}); //ffmpeg inputs commands to the cli so we need to enclose the paths in quotes cos they don't do that automatically
		a.setAudioBitRate(128).save('"Music A/bye.mp3"', function(error, file){
			console.log(error);
		})
	}
	catch(error){
		console.log("Err",error);
	}

	// #3
	ytdl("https://www.youtube.com/watch?v=3gS9aqJhyOw&ab_channel=JordyChandra", {quality: "highestaudio"})
		.pipe(fs.createWriteStream("Music_A/hi.mp3"))
		.on("finish", async () => {
			const vidID = ytdl.getVideoID("https://www.youtube.com/watch?v=3gS9aqJhyOw&ab_channel=JordyChandra");
			const info = await ytdl.getBasicInfo(vidID);
			//`https://img.youtube.com/vi/${vidID}/maxresdefault.jpg`
			idl.image({url: `https://img.youtube.com/vi/${vidID}/maxresdefault.jpg`, dest: "Music_A/img.jpg"})
				.then(({filename}) => {
					let options = {
						attachments: [filename],	
					};
					let metadata = {
						artist: info.artist
					};
					ffmetadata.read("Music_A/hi.webm", function(err, data) {
						if (err) console.error("Error reading metadata", err);
						else console.log(data);
					});
					ffmetadata.write("Music_A/hi.webm", metadata, options, function(err) {
						if (err) console.error("Error writing cover art", err);
						else console.log("Cover art added");
					});
				})
				.catch((error) => {
					console.log("Error adding image", error);
				})
			}
		)
	// #4
	ytdl("https://www.youtube.com/watch?v=9dQjwLAj3OI&ab_channel=BillyCobb")
		.pipe(fs.createWriteStream('Music_A/video2.mp4'));
	ytdl("https://youtu.be/mPx83NL1b3k")
		.pipe(fs.createWriteStream('Music_A/video3.mp4'));
	//const pl = await ytpl("https://www.youtube.com/playlist?list=PLGzwBHV9xpJPMmrbMHOm9q9Pt-huRmx8W", { pages: "Infinity" });
	ytdl("https://youtu.be/chaBa4c5fNU")
		.pipe(fs.createWriteStream("Music_A/hi.mp4"))
		.on("finish", async () => {
			const vidID = ytdl.getVideoID("https://www.youtube.com/watch?v=3gS9aqJhyOw&ab_channel=JordyChandra");
			const info = await ytdl.getBasicInfo(vidID);
			//`https://img.youtube.com/vi/${vidID}/maxresdefault.jpg`
			/* idl.image({url: `https://img.youtube.com/vi/${vidID}/maxresdefault.jpg`, dest: "Music_A/img.jpg"})
				.then(({filename}) => {
					const filepath = "./Music_A/hi.mp4";
					const tags = {
						title: "gaming",
						artist: "hi",
					}
					const success = id3.write(tags, filepath);
					console.log(success);
					console.log((id3.read(filepath)));

				})
				.catch((error) => {
					console.log("Error adding image", error);
				}) */
			}
		)
	// #original
	/* let ec = 0, failed = [];
	//check for unavailable videos
	pl.items.forEach(async (item) => {
		try {
			const vidID = ytdl.getVideoID(item.url);
			const info = await ytdl.getInfo(vidID);
			let format = ytdl.chooseFormat(info.formats, { quality: "highestaudio" });
		}
		catch (error) {
			console.log(`Error on ${item.title} by ${item.author.name}. Check the video, it might be unavailable`);
			console.log(error);
			failed += `${item.title} by ${item.author.name}`;
			ec++;
		}
	});
	console.log(`Formatting errors on ${ec} videos${ec > 0 ? `:\n${JSON.stringify(failed, null, 1)}` : ""}`);
	if (ec > 0) return;
	
	let c = 0;
	pl.items.forEach(async (item) => {
		try {
			//remove illegal chars from filename
			let fn = `${item.author.name} - ${item.title}`;
			if (/[/\\?%*:|"<>]/g.test(fn)) {
				fn = fn.replace(/[/\\?%*:|"<>]/g, "-")
			}

			//download streams
			const info = await ytdl.getInfo(item.url, { quality: "highestaudio" });
			let stream = ytdl.downloadFromInfo(info, { quality: "highestaudio" });
			stream
				.pipe(fs.createWriteStream(`${pl.title}/${fn}.mp3`))
				.on("error", (err) => {
					console.log("Error", err);
				})
				.on("finish", async () => {
					console.log(`Finished downloading ${fn}. Editing its data...`);
					try {
						let path = `"${pl.title}/${fn}.mp3"`;
						console.log(path);
						let audio = await new ffmpeg(path);
						audio
							.setCodec("libmp3lame");
							.save(`"${pl.title}/save/${fn}.mp3"`, function (error, file) {
								console.log(`Saved ${fn}`);
								console.log(error);
							})
					}
					catch (error) {
						console.log("Error", error);
					}
				});
			console.log(`Downloading ${fn}`);
		}
		catch (error) {
			console.log(`Error on ${item.title} by ${item.author.name}. Check the video, it might be unavailable`);
			console.log(error);
		}
	}); */
	console.log(`Estimated count: ${pl.estimatedItemCount}`);
}

downloadMusic ();