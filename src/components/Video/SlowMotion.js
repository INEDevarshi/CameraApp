import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';

export const handleSlowMotionVideo = selectedVideo => {
  return new Promise((resolve, reject) => {
    if (!selectedVideo || !selectedVideo) {
      reject('Invalid selected video.');
      return;
    }

    let originalVideoUri = selectedVideo;
    const timestamp = new Date().getTime();
    const defaultFileName = `slow_motion_${timestamp}.mp4`;
    const outputFileName = selectedVideo.localFileName || defaultFileName;

    let outputVideoPath = `${RNFS.CachesDirectoryPath}/${outputFileName}`;

    let speedFactor = 2.5;

    // Additional parameters to improve video quality
    let additionalParams = '-b:v 2M -pix_fmt yuv420p';

    // Execute FFmpeg command for slow-motion
    FFmpegKit.execute(
      `-i ${originalVideoUri} -vf setpts=${speedFactor}*PTS -r 30 ${additionalParams} ${outputVideoPath}`,
    )
      .then(async session => {
        const returnCode = await session.getReturnCode();

        if (ReturnCode.isSuccess(returnCode)) {
          // Resolve the Promise with the outputVideoPath
          resolve(outputVideoPath);
          console.log('Slow-motion conversion completed successfully.');
        } else if (ReturnCode.isCancel(returnCode)) {
          reject('Slow-motion conversion canceled');
        } else {
          reject(
            `Slow-motion conversion failed with return code: ${returnCode}`,
          );
        }
      })
      .catch(error => {
        reject(`Error executing FFmpeg command: ${error}`);
      });
  });
};
