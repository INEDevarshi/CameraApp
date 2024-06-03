import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';

export const cropVideo = (selectedVideo, aspectRatio) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Define paths for input video and output video
      const inputVideoPath = selectedVideo;
      const timestamp = new Date().getTime();
      const outputFileName = `output_${timestamp}.mp4`;
      const outputVideoPath = `${RNFS.CachesDirectoryPath}/${outputFileName}`;

      // Aspect ratio presets
      const aspectRatioPresets = {
        '1:1': '1:1',
        '3:4': '3:4',
        '3:2': '3:2',
        '16:9': '16:9',
        // Add more aspect ratio presets as needed
      };

      // Get width and height based on the selected aspect ratio
      let width, height;
      if (aspectRatioPresets.hasOwnProperty(aspectRatio)) {
        const [aspectWidth, aspectHeight] = aspectRatioPresets[aspectRatio]
          .split(':')
          .map(Number);
        width = `'min(iw*${aspectWidth}/ih,ih)'`;
        height = `'min(ih*${aspectHeight}/iw,iw)'`;
      } else {
        reject('Invalid aspect ratio provided.');
        return;
      }

      // Construct FFmpeg command
      //   const command = `-i ${inputVideoPath} -vf "scale=${width}:${height}" -b:v 10M -c:a copy ${outputVideoPath}`;
      const command = `-i ${inputVideoPath} -vf "scale=${width}:${height}" -c:v libx264 -b:v 5M -pix_fmt yuv420p ${outputVideoPath}`;

      // Execute FFmpeg command for cropping
      FFmpegKit.execute(command)
        .then(async session => {
          const returnCode = await session.getReturnCode();

          if (ReturnCode.isSuccess(returnCode)) {
            // Update state with the URI of the cropped video
            resolve(outputVideoPath);
            console.log('cropVideo conversion completed successfully.');
          } else if (ReturnCode.isCancel(returnCode)) {
            reject('cropVideo conversion canceled');
          } else {
            reject(
              `cropVideo conversion failed with return code: ${returnCode}`,
            );
          }
        })
        .catch(error => {
          reject('Error executing FFmpeg command:', error);
        });
    } catch (error) {
      reject('Error in cropVideo function:', error);
    }
  });
};
