const fs = require("fs");
const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const idl = require("image-downloader");
const ffmpeg = require("ffmpeg");
const id3 = require("node-id3");
const asyncPool = require("tiny-async-pool");

//playlist or solo video
async function downloadMusic(playlist) {
    //index count for keeping track
    let i=0;

    //cookie is required to prevent miniget error 429
    //* youtube.com -> ctrl+shift+i -> network -> ctrl+r -> click any request -> headers tab -> scroll down to request headers -> cookie -> right click -> copy value -> paste here in quotes
    const cookie = "YSC=CRd1ZwJPRUE; VISITOR_INFO1_LIVE=od8OPc8iKKU; PREF=tz=America.New_York; SID=6gfhNlrzZhbGSwe2i09llELlU7kWDegYPsxYZUW09i8IsdX7kSBoII9mhXbJcyD-6zk6jg.; __Secure-3PSID=6gfhNlrzZhbGSwe2i09llELlU7kWDegYPsxYZUW09i8IsdX7levQO8ZcynKE9HpPraOuWA.; HSID=A9NdmYg-nSIoNa8MT; SSID=A7MB15vAkal-cN47J; APISID=rf9Kup0ooWFfOjlh/A4WgUy-ypdpFmcHGF; SAPISID=7ClBjmq9hTvVT0eS/A7kaNYClZFItxe_wB; __Secure-3PAPISID=7ClBjmq9hTvVT0eS/A7kaNYClZFItxe_wB; LOGIN_INFO=AFmmF2swRQIgP5NrP0Dor0MlwVSBezDArI6i3AbQEamNm76fF7Wsq8MCIQDtG2zOH32p8kjiFvZseSFhotv-IeQYs-yTaUIb7Ah7Wg:QUQ3MjNmeTFLRWhwYzItbk5lYVVZeFN6a2hDdUhmdEhGVFloU3JONjNHUDhjZnRVUF9tNzFaVWxqOEpOTnVfdE1ISml6eElWRjFiUFZQQ2t5dHEwUncxZmx3ZTZ2Rzc4cWdYdC1XV2NfV2VoTmpEdVNRa1VyTE1TTmpWbE5QY212M1RSYTJMY1ZDUWNWZ0pOTDFKcDFHS09FVmZwYkFFaHNGSkNFaEZlUEFpY1pYOGo0Y2JFbkVJ; wide=0; SIDCC=AJi4QfEujd0tEfUpL4k5CLqMmIo_Dqz9NDigDHTKTctAvslYJkyXOQRqDlJnivPQCPzoYUDYSPE; __Secure-3PSIDCC=AJi4QfErCY6SYOFR77RqZrhxhgt4jT8t5vHRpm-SeyKNUte5oJmDfFZicBwzc_4mKPsi4C72IBBF";

    //get playlist
    const pl = await ytpl(playlist, { pages: "Infinity" });
    console.log(pl.items);

    //create directories
    let af = "./music";
    let mf = `./music_medium`;

    if (!fs.existsSync(af)) {
        fs.mkdirSync(af);
    }
    if (!fs.existsSync(mf)) {
        fs.mkdirSync(mf);
    }

    //download function
    const download = item => new Promise(async resolve => {
        i++;
        console.log(`${i}, ${item.title}`);

        //prep info
        let an = `${item.author.name} - ${item.title}`;
        const info = await ytdl.getInfo(item.url, { requestOptions: { headers: { 'Cookie': cookie } } });

        //removing illegal file symbols
        an = an.replace(/[/\\?&%*:|"<>]/g, "-");

        //extensions
        let vn = `${an.replace(/ /g, "_")}.mp4`; //remove spaces bc ffmpeg is wack and does not account for whitespace in input
        let imgn = `${an}.jpg`;
        an += ".mp3";

        //check if exist
        if (fs.existsSync(`${af}/${an}`)) {
            console.log(`${an} exists already!!`);
            resolve(item);
            return;
        }

        //download video stream
        ytdl.downloadFromInfo(info, { filter: format => format.container === "mp4", quality: "highest", requestOptions: { headers: { 'Cookie': cookie } } })
            .pipe(fs.createWriteStream(`./${mf}/${vn}`))
            .on("finish", async () => {
                //extracts mp3
                let a = await new ffmpeg(`./${mf}/${vn}`);
                await a.fnExtractSoundToMP3(`"./${af}/${an}"`);
                console.log(`Finished ${an}. Editing its metadata...`);

                //download video thumbnail
                let options = {
                    url: `https://img.youtube.com/vi/${ytdl.getVideoID(item.url)}/maxresdefault.jpg`,
                    dest: `./${mf}/${imgn}`
                }
                try{
                    await idl.image(options);
                }
                catch(error){
                    console.log(`Error getting image for ${an}`);
                }

                //set metadata + cover art
                let tags = {
                    title: item.title,
                    artist: item.author.name,
                    APIC: `${mf}/${imgn}`
                }
                const success = id3.write(tags, `./${af}/${an}`);
                if (success) console.log(`Finished ${an}. Deleting mediums...`);
                else console.log(success);

                //remove mediums
                if(fs.existsSync(`./${mf}/${vn}`)) fs.rmSync(`${mf}/${vn}`);
                if(fs.existsSync(`./${mf}/${imgn}`)) fs.rmSync(`./${mf}/${imgn}`);

                resolve(item);
            })
            .on("error", (error) => {
                console.log(error);
            })
    })

    //promise pool for limiting parallel downloads
    await asyncPool(3, pl.items, download);
}

downloadMusic("https://www.youtube.com/playlist?list=PLGzwBHV9xpJPMmrbMHOm9q9Pt-huRmx8W");