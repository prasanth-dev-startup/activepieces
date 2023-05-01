import assert from 'node:assert'
import { argv } from 'node:process'
import { rm, writeFile } from 'node:fs/promises'
import { getAvailablePieceNames } from './utils/get-available-piece-names'
import { exec } from './utils/exec'
import { readProjectJson, writeProjectJson } from './utils/files'
import chalk from 'chalk';

const validatePieceName = async (pieceName: string) => {
  assert(pieceName, 'pieceName is not provided')

  const pieceNamePattern = /^[A-Za-z0-9\-]+$/
  assert(pieceNamePattern.test(pieceName), 'piece name should contain alphanumeric characters and hyphens only')

  const pieces = await getAvailablePieceNames()
  const nameAlreadyExists = pieces.some(p => p === pieceName)
  assert(!nameAlreadyExists, 'piece name already exists')
}

const nxGenerateNodeLibrary = async (pieceName: string) => {
  const nxGenerateCommand = `
    npx nx generate @nrwl/node:library ${pieceName} \
      --directory=pieces/private \
      --importPath=@activepieces/piece-${pieceName} \
      --publishable \
      --buildable \
      --standaloneConfig \
      --strict \
      --unitTestRunner=none
  `

  await exec(nxGenerateCommand)
}

const removeUnusedFiles = async (pieceName: string) => {
  await rm(`packages/pieces/private/${pieceName}/.babelrc`)
  await rm(`packages/pieces/private/${pieceName}/src/lib/pieces-private-${pieceName}.ts`)
}

const generateIndexTsFile = async (pieceName: string) => {
  const pieceNameCamelCase = pieceName
    .split('-')
    .map((s, i) => {
      if (i === 0) {
        return s
      }

      return s[0].toUpperCase() + s.substring(1)
    })
    .join('')

  const indexTemplate = `
import { createPiece } from "@activepieces/pieces-framework";
import packageJson from "../package.json";

export const ${pieceNameCamelCase} = createPiece({
  name: "${pieceName}",
  displayName: "${capitalizeFirstLetter(pieceName)}",
  logoUrl: "https://cdn.activepieces.com/pieces/${pieceName}.png",
  version: packageJson.version,
  authors: [],
  actions: [],
  triggers: [],
});
`

  await writeFile(`packages/pieces/private/${pieceName}/src/index.ts`, indexTemplate)
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}


const updateProjectJsonConfig = async (pieceName: string) => {
  const projectJson = await readProjectJson(`packages/pieces/private/${pieceName}`)

  assert(projectJson.targets?.build?.options, '[updateProjectJsonConfig] targets.build.options is required');

  projectJson.targets.build.options.buildableProjectDepsInPackageJsonType = 'dependencies'
  await writeProjectJson(`packages/pieces/private/${pieceName}`, projectJson)
}

const setupGeneratedLibrary = async (pieceName: string) => {
  await removeUnusedFiles(pieceName)
  await generateIndexTsFile(pieceName)
  await updateProjectJsonConfig(pieceName)
}

const main = async () => {
  const [, , pieceName] = argv

  await validatePieceName(pieceName)
  await nxGenerateNodeLibrary(pieceName)
  await setupGeneratedLibrary(pieceName)
  console.log(chalk.green('✨  Done!'));
  console.log(chalk.yellow(`The piece has been generated at: packages/pieces/private/${pieceName}`));
  console.log(chalk.blue("Don't forget to add the piece to the list of pieces in packages/pieces/private/apps/src/index.ts"));
}

main()
