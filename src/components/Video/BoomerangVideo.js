import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';

export const handleBoomerangVideo = selectedVideo => {
  return new Promise(async (resolve, reject) => {
    if (!selectedVideo || !selectedVideo) {
      reject('Invalid selected video.');
      return;
    }
    let originalVideoUri = selectedVideo;
    const timestamp = new Date().getTime();
    const defaultFileName = `slow_motion_${timestamp}.mp4`;
    const outputFileName = selectedVideo.localFileName || defaultFileName;

    let outputVideoPath = `${RNFS.CachesDirectoryPath}/${outputFileName}`;

    let duration = 6;
    const speedFactor = 0.7; // Increase this value to speed up the video

    // Additional parameters to improve video quality
    // const boomerangCommand = `-i ${originalVideoUri} -filter_complex "[0:v]reverse,setpts=${
    //   speedFactor / 1
    // }*PTS[fifo];[0:v][fifo]concat=n=2:v=1[v]" -map "[v]" -r 30 -y ${outputVideoPath}`;
    // const boomerangCommand = `-i ${originalVideoUri} -filter_complex "[0:v]setpts=${speedFactor / 1}*PTS[fast];[fast]reverse[fifo];[0:v][fifo]concat=n=2:v=1[v]" -map "[v]" -r 30 -y ${outputVideoPath}`;
    const boomerangCommand = `-ss 0 -t ${duration} -an -i ${originalVideoUri} -y -filter_complex "[0]setpts=${speedFactor}*PTS,split[b][c];[c]reverse[r];[b][r]concat" -b:v 10M -c:a copy ${outputVideoPath}`;

    // Execute FFmpeg command for slow-motion
    FFmpegKit.execute(boomerangCommand)
      .then(async session => {
        const returnCode = await session.getReturnCode();

        if (ReturnCode.isSuccess(returnCode)) {
          // Update state with the URI of the slow-motion video
          resolve(outputVideoPath);
          console.log('Boomrange conversion completed successfully.');
        } else if (ReturnCode.isCancel(returnCode)) {
          reject('Boomrange conversion canceled');
        } else {
          reject(`Boomrange conversion failed with return code: ${returnCode}`);
        }
      })
      .catch(error => {
        reject('Error executing FFmpeg command:', error);
      });
  });
};
