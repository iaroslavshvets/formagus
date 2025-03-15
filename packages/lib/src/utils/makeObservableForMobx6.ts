// require as import might not work in case of mobx@5 used during bundling in userland
// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/consistent-type-imports
export const makeObservableForMobx6: (typeof import('mobx'))['makeObservable'] = require('mobx').makeObservable;
