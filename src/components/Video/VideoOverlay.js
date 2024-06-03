import {FFmpegKit, ReturnCode, FFmpegSession} from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const addOverlay = (selectedVideo, overlayImages, overlayDurations) => {
  return new Promise(async (resolve, reject) => {
    // Define paths for input video and output video
    const inputVideoPath = selectedVideo;
    const timestamp = new Date().getTime();
    const outputFileName = `output_${timestamp}.mp4`;
    const outputVideoPath = `${RNFS.CachesDirectoryPath}/${outputFileName}`;

    //   const command = `-i ${inputVideoPath} -i ${overlayImages[0].imageUrl} -filter_complex [0][1]overlay=x=${overlayImages[0].x}:y=${overlayImages[0].y} -f mp4 ${outputVideoPath}`;
    const overlayImage = overlayImages;
    const width = wp(25);
    const height = hp(15);
    const xPosition = overlayImages[0].x;
    const yPosition = overlayImages[0].y;

    // const command = `-i ${inputVideoPath} -i ${overlayImage.imageUrl} -filter_complex [1:v]scale=${width}:${height}[scaled_overlay];[0:v][scaled_overlay]overlay=x=${xPosition}:y=${yPosition} -f mp4 ${outputVideoPath}`;
    // const command = `-i ${inputVideoPath} -i ${overlayImage.imageUrl} -filter_complex [1:v]scale=${width}:${height}:force_original_aspect_ratio=decrease[scaled_overlay];[0:v][scaled_overlay]overlay=x=${xPosition}:y=${yPosition} -b:v 10M -c:a copy ${outputVideoPath}`;

    const command = `-i ${inputVideoPath} -i ${overlayImage[0].imageUrl} -i ${overlayImage[1].imageUrl} -filter_complex "[1:v]scale=w=${overlayImage[0].scale}*${width}:h=${overlayImage[0].scale}*${height}:force_original_aspect_ratio=decrease[scaled_overlay1];[2:v]scale=w=${overlayImage[1].scale}*${width}:h=${overlayImage[1].scale}*${height}:force_original_aspect_ratio=decrease[scaled_overlay2];[0:v][scaled_overlay1]overlay=x=${overlayImage[0].x}:y=${overlayImage[0].y}[temp1];[temp1][scaled_overlay2]overlay=x=${overlayImage[1].x}:y=${overlayImage[1].y}" -b:v 10M -c:a copy ${outputVideoPath}`;

    // Execute FFmpeg command for slow-motion
    FFmpegKit.execute(command)
      .then(async session => {
        const returnCode = await session.getReturnCode();

        if (ReturnCode.isSuccess(returnCode)) {
          // Update state with the URI of the slow-motion video
          resolve(outputVideoPath);
          console.log('overLay conversion completed successfully.');
        } else if (ReturnCode.isCancel(returnCode)) {
          reject('overLay conversion canceled');
        } else {
          reject(`overLay conversion failed with return code: ${returnCode}`);
        }
      })
      .catch(error => {
        reject('Error executing FFmpeg command:', error);
      });
  });
};
