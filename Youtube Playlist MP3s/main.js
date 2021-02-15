const fs = require("fs");
const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const progress = require("progress-stream");
const ffmpeg = require("ffmpeg");

//playlist or solo video
async function run() {
	const pl = await ytpl("https://www.youtube.com/playlist?list=PLGzwBHV9xpJPMmrbMHOm9q9Pt-huRmx8W", {pages: "Infinity"});
	if (!fs.existsSync(pl.title)) {
		const folder = fs.mkdirSync(pl.title);
	}
	
	let ec=0, failed=[];
	//check for unavailable videos
	pl.items.forEach(async (item) => {
		try {
			const vidID = ytdl.getVideoID(item.url);
			const info = await ytdl.getInfo(vidID);
			let format = ytdl.chooseFormat(info.formats, {quality: "highestaudio"});
		}
		catch (error) {
			console.log(`Error on ${item.title} by ${item.author.name}. Check the video, it might be unavailable`);
			console.log(error);
			failed+=`${item.title} by ${item.author.name}`;
			ec++;
		}
	});
	console.log(`Formatting errors on ${ec} videos${ec>0?`:\n${JSON.stringify(failed, null, 1)}`:""}`);
	if(ec>0) return;

	let c=0;
	pl.items.forEach(async (item) => {
		try{
			//formatting
			const vidID = ytdl.getVideoID(item.url);
			const info = await ytdl.getInfo(vidID);
			let format = ytdl.chooseFormat(info.formats, {quality: "highestaudio"});
			
			//remove illegal chars from filename
			let fn = `${item.author.name} - ${item.title}`;
			if(/[/\\?%*:|"<>]/g.test(fn)){
				fn = fn.replace(/[/\\?%*:|"<>]/g, "-")
			}
			
			//download streams
			const mp3 = ytdl(item.url, {format: format});
			const file = mp3.pipe(fs.createWriteStream(`${pl.title}/${fn}.mp3`));
			console.log(fn);
			c++;

			//progress
			let stat = fs.statSync(`${pl.title}/${fn}.mp3`);
			let str = progress({
				length: stat.size,
				time: 100 //ms
			})
			str.on("progress", (progress) => {
				console.log(progress);
			})
		}
		catch(error){
			console.log(`Error on ${item.title} by ${item.author.name}. Check the video, it might be unavailable`);
			console.log(error);
		}
	});
	console.log(`Estimated count: ${pl.estimatedItemCount}`);
	//implement progress stream
	//set album cover as thumbnail
	//set author and title
}

run();