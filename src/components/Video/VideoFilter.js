import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';

export const adjustVideoBrightnessContrast = async (
  selectedVideo,
  brightness,
  contrast,
) => {
  console.log('video path====', selectedVideo);
  console.log('brightness', brightness);
  console.log('contrast', contrast);

  if (!selectedVideo) {
    throw new Error('Invalid selected video.');
  }

  const originalVideoUri = selectedVideo;
  const outputFileName = `adjusted_${new Date().getTime()}.mp4`;
  const outputVideoPath = `${RNFS.CachesDirectoryPath}/${outputFileName}`;
  console.log('outputVideoPath', outputVideoPath);

  // Calculate adjustment factors
  const brightnessFactor = (brightness - 0.5) * 2;
  const contrastFactor = (contrast - 0.5) * 2;

  const inRange = Math.max(0, Math.min(2, brightnessFactor - contrastFactor));

  const ffmpegCommand = `-i ${originalVideoUri} -vf "scale=in_range=${inRange}:1.0,scale=out_range=0:${Math.min(
    brightnessFactor + contrastFactor,
    1.0,
  )}" -b:v 10M -c:a copy ${outputVideoPath}`;

  console.log('FFmpeg command:', ffmpegCommand);

  try {
    const session = await FFmpegKit.execute(ffmpegCommand);
    const returnCode = await session.getReturnCode();

    if (ReturnCode.isSuccess(returnCode)) {
      console.log(
        'Video brightness and contrast adjustment completed successfully.',
      );
      return `file://${outputVideoPath}`; // Resolve with output path
    } else if (ReturnCode.isCancel(returnCode)) {
      throw new Error('Video brightness and contrast adjustment canceled.');
    } else {
      throw new Error(
        `Video brightness and contrast adjustment failed with return code: ${returnCode}`,
      );
    }
  } catch (error) {
    console.error('Error executing FFmpeg command:', error);
    throw error;
  }
};
