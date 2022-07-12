import MediaConvert from 'aws-sdk/clients/mediaconvert';

import { MediaConvertAwsConfig } from '~modules/app/app.config';

export class MediaConvertAwsHelper {
  static generateCreateJobParams(
    config: MediaConvertAwsConfig,
    objectId: string,
  ): MediaConvert.CreateJobRequest {
    return {
      Role: config.roleArn,
      Settings: {
        Inputs: [
          {
            TimecodeSource: 'ZEROBASED',
            VideoSelector: {},
            AudioSelectors: {
              'Audio Selector 1': {
                DefaultSelection: 'DEFAULT',
              },
            },
            FileInput: `s3://${config.inputBucketName}/${objectId}`,
          },
        ],
        OutputGroups: [
          {
            Name: 'CMAF',
            OutputGroupSettings: {
              Type: 'CMAF_GROUP_SETTINGS',
              CmafGroupSettings: {
                SegmentLength: 10,
                FragmentLength: 2,
                Destination: `s3://${config.outputBucketName}/`,
              },
            },
            Outputs: [
              {
                VideoDescription: {
                  CodecSettings: {
                    Codec: 'H_264',
                    H264Settings: {
                      RateControlMode: 'QVBR',
                      SceneChangeDetect: 'TRANSITION_DETECTION',
                      MaxBitrate: 4500000,
                    },
                  },
                },
                ContainerSettings: {
                  Container: 'CMFC',
                },
              },
              {
                AudioDescriptions: [
                  {
                    CodecSettings: {
                      Codec: 'AAC',
                      AacSettings: {
                        Bitrate: 96000,
                        CodingMode: 'CODING_MODE_2_0',
                        SampleRate: 48000,
                      },
                    },
                    AudioSourceName: 'Audio Selector 1',
                  },
                ],
                ContainerSettings: {
                  Container: 'CMFC',
                },
              },
            ],
          },
        ],
        TimecodeConfig: {
          Source: 'ZEROBASED',
        },
      },
    };
  }
}
