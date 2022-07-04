import { UserEntity } from '~database/entities/user.entity';

const staticUserIds = [
  'f5df40c2-e699-4a0b-8694-6a5306a94342',
  'a4a41d21-a96c-4eb3-bbae-d91ef53c70b7',
  '6f409161-4a0a-4a7d-a2c6-b2a5de53b19b',
  'f8441c73-05b2-4259-a391-3d67c9b716b4',
  'd6867fed-1c24-4656-9867-2a0b33d9a9a9',
  'e5d1b017-b9c0-48f0-b23d-b703ac16a212',
  'e19b474f-4290-4d46-afb4-188f15fb9860',
  'c243705c-11d9-4346-b4a1-d4be91a47bd1',
  'dc6129b3-ed25-4ea8-b2fa-fcb3cc70757b',
  'ed098df3-cdfc-4bce-bca1-eb3c2dcc2486',
];

const staticUsernames = [
  'fidan',
  'fidan1',
  'fidan2',
  'fidan3',
  'fidan4',
  'meriton',
  'meriton1',
  'meriton2',
  'meriton3',
  'meriton4',
];

const staticDisplayNames = [
  'Fidan Sinani',
  'Fidan Sinani 1',
  'Fidan Sinani2',
  'Fidan Sinani3',
  'Fidan Sinani4',
  'Meriton Reqica',
  'Meriton Reqica1',
  'Meriton Reqica2',
  'Meriton Reqica3',
];

const staticRoles = [
  'ISSUER',
  'ISSUER',
  'USER',
  'USER',
  'USER',
  'USER',
  'USER',
  'ISSUER',
  'USER',
];

function prepareStaticUsers(): Partial<UserEntity>[] {
  const result: Partial<UserEntity>[] = [];

  for (let i = 0; i < staticUserIds.length; i += 1) {
    const username = staticUsernames[i];
    const displayName = staticDisplayNames[i];
    const type = staticRoles[i];

    result.push({
      id: staticUserIds[i],
      username,
      displayName,
      type,
      isVerified: true,
    });
  }

  return result;
}

export const staticUserSeeds = prepareStaticUsers();
