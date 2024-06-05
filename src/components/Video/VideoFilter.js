import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';

export const adjustVideoBrightnessContrast = (
  selectedVideo,
  brightness,
  contrast,
  saturation,
) => {
  console.log('video path====', selectedVideo);
  console.log('brightness', brightness);
  console.log('contrast', contrast);
  return new Promise((resolve, reject) => {
    if (!selectedVideo) {
      reject('Invalid selected video.');
      return;
    }

    const originalVideoUri = selectedVideo;
    const outputFileName = `adjusted_${new Date().getTime()}.mp4`;
    const outputVideoPath = `${RNFS.CachesDirectoryPath}/${outputFileName}`;
    console.log('outputVideoPath', outputVideoPath);

    // Calculate the brightness adjustment factor
    const brightnessFactor = (brightness - 0.5) * 2;

    // Calculate the contrast adjustment factor
    const contrastFactor = (contrast - 0.5) * 2;

    const ffmpegCommand = `-i ${originalVideoUri} -vf "eq=brightness=${brightness}:contrast=${contrast}:saturation=${saturation}" -b:v 10M -c:a copy ${outputVideoPath}`;

    // Execute FFmpeg command
    FFmpegKit.execute(ffmpegCommand)
      .then(async session => {
        const returnCode = await session.getReturnCode();

        if (ReturnCode.isSuccess(returnCode)) {
          resolve(`file://${outputVideoPath}`); // Resolve the Promise with the output video path
          console.log(
            'Video brightness and contrast adjustment completed successfully.',
          );
        } else if (ReturnCode.isCancel(returnCode)) {
          reject('Video brightness and contrast adjustment canceled.');
        } else {
          reject(
            `Video brightness and contrast adjustment failed with return code: ${returnCode}`,
          );
        }
      })
      .catch(error => {
        reject(`Error executing FFmpeg command: ${error}`);
      });
  });
};
