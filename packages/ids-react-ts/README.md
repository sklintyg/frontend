# `@frontend/ids-react-ts`

React components generated from [@inera/ids-core](design.inera.se) WebComponents using [@lit-labs/react](https://github.com/lit/lit/tree/main/packages/labs/react)

## Generate index files

Install ctix globaly

```bash
npm install -g ctix
```

Generate index files for this project:

```bash
pnpm --filter @frontend/ids-react-ts ctix create -s false -a ./src  -p ./tsconfig.json -w --noBackup
```
