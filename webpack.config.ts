import * as path from 'path';
import * as webpack from 'webpack';
import { TSConfigJSON } from 'types-tsconfig';
import { readFileSync } from 'fs';

const tsconfig = JSON.parse(readFileSync('./tsconfig.json').toString()) as TSConfigJSON;
tsconfig.include = [ 'src/**/*.ts' ];

export default {
  target: 'node',
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, './'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  resolve: { extensions: [ '.ts', '.js' ] },
  optimization: { minimize: true },
  module: {
    rules: [
      {
        test: /\.ts$/u,
        exclude: /node_modules/u,
        use: [ { loader: 'ts-loader' } ],
      },
    ],
  },
  cache: {
    type: 'filesystem',
    buildDependencies: { config: [ __filename ] },
  },
  plugins: [],
} as webpack.Configuration;
