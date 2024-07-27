import { type Config, DevnetRemoteConfig, AriadneQaRemoteConfig, StandaloneConfig, currentDir } from '../config';
import {
  DockerComposeEnvironment,
  GenericContainer,
  type StartedDockerComposeEnvironment,
  type StartedTestContainer,
  Wait,
} from 'testcontainers';
import path from 'path';
import * as api from '../api';
import * as Rx from 'rxjs';
import { nativeToken } from '@midnight-ntwrk/ledger';
import type { Logger } from 'pino';
import type { Wallet } from '@midnight-ntwrk/wallet-api';
import type { Resource } from '@midnight-ntwrk/wallet';

const GENESIS_MINT_WALLET_SEED = '0000000000000000000000000000000000000000000000000000000000000042';

export interface TestConfiguration {
  seed: string;
  entrypoint: string;
  dappConfig: Config;
}

export class LocalTestConfig implements TestConfiguration {
  seed = GENESIS_MINT_WALLET_SEED;
  entrypoint = 'dist/standalone.js';
  dappConfig = new StandaloneConfig();
}

export function parseArgs(required: string[]): TestConfiguration {
  let entry = '';
  if (required.includes('entry')) {
    if (process.env.TEST_ENTRYPOINT !== undefined) {
      entry = process.env.TEST_ENTRYPOINT;
    } else {
      throw new Error('TEST_ENTRYPOINT environment variable is not defined.');
    }
  }

  let seed = '';
  if (required.includes('seed')) {
    if (process.env.TEST_WALLET_SEED !== undefined) {
      seed = process.env.TEST_WALLET_SEED;
    } else {
      throw new Error('TEST_WALLET_SEED environment variable is not defined.');
    }
  }

  let cfg: Config = new AriadneQaRemoteConfig();
  let env = '';
  if (required.includes('env')) {
    if (process.env.TEST_ENV !== undefined) {
      env = process.env.TEST_ENV;
    } else {
      throw new Error('TEST_ENV environment variable is not defined.');
    }
    switch (env) {
      case 'ariadne-qa':
        cfg = new AriadneQaRemoteConfig();
        break;
      case 'devnet':
        cfg = new DevnetRemoteConfig();
        break;
      default:
        throw new Error(`Unknown env value=${env}`);
    }
  }

  return {
    seed,
    entrypoint: entry,
    dappConfig: cfg,
  };
}

export class TestEnvironment {
  private readonly logger: Logger;
  private env: StartedDockerComposeEnvironment | undefined;
  private dockerEnv: DockerComposeEnvironment | undefined;
  private container: StartedTestContainer | undefined;
  private wallet: (Wallet & Resource) | undefined;
  private testConfig: TestConfiguration;

  constructor(logger: Logger) {
    this.logger = logger;
    this.testConfig = new LocalTestConfig();
  }

  start = async (): Promise<TestConfiguration> => {
    if (process.env.RUN_ENV_TESTS === 'true') {
      this.testConfig = parseArgs(['seed', 'env']);
      this.logger.info(`Test wallet seed: ${this.testConfig.seed}`);
      this.logger.info('Proof server starting...');
      this.container = await TestEnvironment.getProofServerContainer();
      this.testConfig.dappConfig = {
        ...this.testConfig.dappConfig,
        proofServer: `http://${this.container.getHost()}:${this.container.getMappedPort(6300).toString()}`,
      };
    } else {
      this.testConfig = new LocalTestConfig();
      this.logger.info('Test containers starting...');
      const composeFile = process.env.COMPOSE_FILE ?? 'standalone.yml';
      this.logger.info(`Using compose file: ${composeFile}`);
      this.dockerEnv = new DockerComposeEnvironment(path.resolve(currentDir, '..'), composeFile)
        .withWaitStrategy(
          'counter-proof-server',
          Wait.forLogMessage('Actix runtime found; starting in Actix runtime', 1),
        )
        .withWaitStrategy('counter-node', Wait.forLogMessage(/Accepting new connection [\d]\/[\d]/, 1))
        .withWaitStrategy('counter-graphql-api', Wait.forLogMessage(/Transactions subscription started/, 1));
      this.env = await this.dockerEnv.up();

      this.testConfig.dappConfig = {
        ...this.testConfig.dappConfig,
        indexer: TestEnvironment.mapContainerPort(this.env, this.testConfig.dappConfig.indexer, 'counter-graphql-api'),
        indexerWS: TestEnvironment.mapContainerPort(
          this.env,
          this.testConfig.dappConfig.indexerWS,
          'counter-graphql-api',
        ),
        node: TestEnvironment.mapContainerPort(this.env, this.testConfig.dappConfig.node, 'counter-node'),
        proofServer: TestEnvironment.mapContainerPort(
          this.env,
          this.testConfig.dappConfig.proofServer,
          'counter-proof-server',
        ),
      };
    }
    this.logger.info(`Configuration:${JSON.stringify(this.testConfig)}`);
    this.logger.info('Test containers started');
    return this.testConfig;
  };

  static mapContainerPort = (env: StartedDockerComposeEnvironment, url: string, containerName: string) => {
    const mappedUrl = new URL(url);
    const container = env.getContainer(containerName);

    mappedUrl.port = String(container.getFirstMappedPort());

    return mappedUrl.toString().replace(/\/+$/, '');
  };

  static getProofServerContainer = async () =>
    await new GenericContainer('ghcr.io/midnight-ntwrk/proof-server:2.0.7')
      .withExposedPorts(6300)
      .withCommand(['midnight-proof-server --network devnet'])
      .withEnvironment({ RUST_BACKTRACE: 'full' })
      .withWaitStrategy(Wait.forLogMessage('Actix runtime found; starting in Actix runtime', 1))
      .start();

  shutdown = async () => {
    if (this.wallet !== undefined) {
      await this.wallet.close();
    }
    if (this.env !== undefined) {
      this.logger.info('Test containers closing');
      await this.env.down();
    }
    if (this.container !== undefined) {
      this.logger.info('Test container closing');
      await this.container.stop();
    }
  };

  getWallet = async () => {
    this.logger.info('Setting up wallet');
    this.wallet = await api.buildWalletAndWaitForFunds(this.testConfig.dappConfig, this.testConfig.seed);
    expect(this.wallet).not.toBeNull();
    const state = await Rx.firstValueFrom(this.wallet.state());
    expect(state.balances[nativeToken()].valueOf()).toBeGreaterThan(BigInt(0));
    return this.wallet;
  };
}
