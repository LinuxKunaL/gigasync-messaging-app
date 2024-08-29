import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import { User } from "../../database/model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadFile = (file, _id, type) => {
  const fileName = `${file.name.split(".")[0]}-${Date.now()}.${
    file.name.split(".")[1]
  }`.replace(/[^a-zA-Z0-9.]+/g, "-");

  if (file.type.includes("image")) {
    const filepath = path.join(__dirname, `../data/${type}-${_id}`, "images");

    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath, { recursive: true });
    }

    fs.writeFile(`${filepath}/${fileName}`, file.buffer, (Err) => {
      console.log(Err);
    });

    return {
      size: file.size,
      type: file.type,
      name: fileName,
    };
  }

  if (file.type.includes("video")) {
    // const filepathWithOriginalName = path.join(
    //   __dirname,
    //   `../data/user-${_id}`,
    //   "videos",
    //   file.name
    // );

    const filepathWithNewName = path.join(
      __dirname,
      `../data/${type}-${_id}`,
      "videos"
    );

    if (!fs.existsSync(filepathWithNewName)) {
      fs.mkdirSync(filepathWithNewName, { recursive: true });
    }

    fs.writeFile(`${filepathWithNewName}/${fileName}`, file.buffer, (Err) => {
      console.log(Err);
    });

    /**
     * The @commented code block is setting up a @process to @convert a video file into the @m3u8
     *  format, which is commonly used for @streaming videos. Additionally, it generates a @thumbnail
     *  image from the video.
     */

    // exec(`mkdir ${filepathWithNewName}`, (err, stdout, stderr) => {
    //   console.log(err);
    // });

    // exec(
    //   `ffmpeg -i ${filepathWithOriginalName} -codec: copy -start_number 0 -hls_time 5 -hls_list_size 0 -f hls ${filepathWithNewName}/video.m3u8`,
    //   (err, stdout, stderr) => {
    //     console.log(err);
    //     exec(
    //       `ffmpeg -i ${filepathWithOriginalName} -ss 00:00:01.000 -vframes 1 -q:v 90 ${filepathWithNewName}/thumbnail.jpeg`,
    //       () => console.log("Thumbnail created")
    //     );
    //     setTimeout(() => {
    //       exec(`rm -rf ${filepathWithOriginalName}`);
    //     }, 2000);
    //   }
    // );

    return {
      size: file.size,
      type: file.type,
      name: fileName,
    };
  }

  if (file.type.includes("audio")) {
    const filepath = path.join(__dirname, `../data/${type}-${_id}`, "audios");

    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath, { recursive: true });
    }

    fs.writeFile(`${filepath}/${fileName}`, file.buffer, (Err) => {
      console.log(Err);
    });

    return {
      size: file.size,
      type: file.type,
      name: fileName,
    };
  }

  if (file.type.includes("recording")) {
    const recordingFilename = `recording-${Date.now()}.mp3`;

    const filepath = path.join(
      __dirname,
      `../data/${type}-${_id}`,
      "recordings"
    );

    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath, { recursive: true });
    }

    fs.writeFile(`${filepath}/${recordingFilename}`, file.buffer, (Err) => {
      console.log(Err);
    });

    return {
      size: file.size,
      type: file.type,
      name: recordingFilename,
    };
  }

  const filepath = path.join(__dirname, `../data/${type}-${_id}`, "files");

  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath, { recursive: true });
  }

  fs.writeFile(`${filepath}/${fileName}`, file.buffer, (Err) => {
    console.log(Err);
  });

  return {
    size: file.size,
    type: file.type,
    name: fileName,
  };
};

export { uploadFile };
