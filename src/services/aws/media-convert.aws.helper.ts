import MediaConvert from 'aws-sdk/clients/mediaconvert';

import { MediaConvertAwsConfig } from '~modules/app/app.config';

export class MediaConvertAwsHelper {
  static generateCreateJobParams(
    config: MediaConvertAwsConfig,
    reelId: string,
  ): MediaConvert.CreateJobRequest {
    return {
      Role: config.roleArn,
      Settings: {
        OutputGroups: [
          {
            Name: 'CMAF Group',
            OutputGroupSettings: {
              Type: 'CMAF_GROUP_SETTINGS',
              CmafGroupSettings: {
                Destination: `s3://${config.outputBucketName}/`,
                SegmentLength: 10,
                FragmentLength: 2,
              },
            },
            Outputs: [
              {
                VideoDescription: {
                  ScalingBehavior: 'DEFAULT',
                  TimecodeInsertion: 'DISABLED',
                  AntiAlias: 'ENABLED',
                  Sharpness: 50,
                  CodecSettings: {
                    Codec: 'H_264',
                    H264Settings: {
                      Bitrate: 4500000,
                    },
                  },
                },
                // AudioDescriptions: [
                //   {
                //     AudioTypeControl: 'FOLLOW_INPUT',
                //     CodecSettings: {
                //       Codec: 'AAC',
                //       AacSettings: {
                //         AudioDescriptionBroadcasterMix: 'NORMAL',
                //         Bitrate: 96000,
                //         RateControlMode: 'CBR',
                //         CodecProfile: 'LC',
                //         CodingMode: 'CODING_MODE_2_0',
                //         RawFormat: 'NONE',
                //         SampleRate: 48000,
                //         Specification: 'MPEG4',
                //       },
                //     },
                //     LanguageCodeControl: 'FOLLOW_INPUT',
                //   },
                // ],
                ContainerSettings: {
                  Container: 'CMFC',
                },
                NameModifier: '_1',
              },
            ],
          },
        ],
        Inputs: [
          {
            AudioSelectors: {
              'Audio Selector 1': {
                Tracks: [1],
                Offset: 0,
                DefaultSelection: 'DEFAULT',
                SelectorType: 'TRACK',
                ProgramSelection: 1,
              },
            },
            VideoSelector: {
              ColorSpace: 'FOLLOW',
            },
            FilterEnable: 'AUTO',
            PsiControl: 'USE_PSI',
            FilterStrength: 0,
            DeblockFilter: 'DISABLED',
            DenoiseFilter: 'DISABLED',
            TimecodeSource: 'EMBEDDED',
            FileInput: `s3://${config.inputBucketName}/${reelId}`,
          },
        ],
        TimecodeConfig: {
          Source: 'ZEROBASED',
        },
      },
    };
  }
}
