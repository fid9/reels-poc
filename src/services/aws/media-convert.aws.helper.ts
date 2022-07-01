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
                      InterlaceMode: 'PROGRESSIVE',
                      NumberReferenceFrames: 3,
                      Syntax: 'DEFAULT',
                      Softness: 0,
                      GopClosedCadence: 1,
                      GopSize: 48,
                      Slices: 1,
                      GopBReference: 'DISABLED',
                      SlowPal: 'DISABLED',
                      SpatialAdaptiveQuantization: 'ENABLED',
                      TemporalAdaptiveQuantization: 'ENABLED',
                      FlickerAdaptiveQuantization: 'DISABLED',
                      EntropyEncoding: 'CABAC',
                      Bitrate: 4500000,
                      FramerateControl: 'SPECIFIED',
                      RateControlMode: 'CBR',
                      CodecProfile: 'HIGH',
                      Telecine: 'NONE',
                      MinIInterval: 0,
                      AdaptiveQuantization: 'HIGH',
                      CodecLevel: 'LEVEL_4_1',
                      FieldEncoding: 'PAFF',
                      SceneChangeDetect: 'ENABLED',
                      QualityTuningLevel: 'SINGLE_PASS_HQ',
                      FramerateConversionAlgorithm: 'DUPLICATE_DROP',
                      UnregisteredSeiTimecode: 'DISABLED',
                      GopSizeUnits: 'FRAMES',
                      ParControl: 'INITIALIZE_FROM_SOURCE',
                      NumberBFramesBetweenReferenceFrames: 3,
                      RepeatPps: 'DISABLED',
                      HrdBufferSize: 9000000,
                      HrdBufferInitialFillPercentage: 90,
                      FramerateNumerator: 24000,
                      FramerateDenominator: 1001,
                    },
                  },
                  AfdSignaling: 'NONE',
                  DropFrameTimecode: 'ENABLED',
                  RespondToAfd: 'NONE',
                  ColorMetadata: 'INSERT',
                },
                AudioDescriptions: [
                  {
                    AudioTypeControl: 'FOLLOW_INPUT',
                    CodecSettings: {
                      Codec: 'AAC',
                      AacSettings: {
                        AudioDescriptionBroadcasterMix: 'NORMAL',
                        Bitrate: 96000,
                        RateControlMode: 'CBR',
                        CodecProfile: 'LC',
                        CodingMode: 'CODING_MODE_2_0',
                        RawFormat: 'NONE',
                        SampleRate: 48000,
                        Specification: 'MPEG4',
                      },
                    },
                    LanguageCodeControl: 'FOLLOW_INPUT',
                  },
                ],
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
