import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { createLogger } from './logger-utils.js';
import { DevnetRemoteConfig } from './config.js';
import * as api from './api.js';
import { toHex } from './conversion-utils.js';

export const currentDir = path.resolve(new URL(import.meta.url).pathname, '..');
import * as Rx from 'rxjs';


const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const config = new DevnetRemoteConfig();
const logger = await createLogger(config.logDir);
api.setLogger(logger)

// Serve static files
app.use(express.static(path.resolve(currentDir, '..', 'public')));

// Routes
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.resolve(currentDir, '..', 'public'));
});

app.get('/seed/:seed', (req: Request, res: Response) => {
    const {seed} = req.params
    logger.info(seed)
    res.sendFile(path.resolve(currentDir, '..', 'public'));
});

app.post('/add-wallet', async (req: Request, res: Response) => {
    const seed = toHex(api.randomBytes(32))
    logger.info(`New wallet seed is: ${seed}`);
    const wallet = await api.buildWalletAndWaitForFunds(config, seed);
    wallet.start();
    logger.info(`Your wallet started`);
    const state = await Rx.firstValueFrom(wallet.state());
    logger.info(`Your wallet seed is: ${seed}`);
    logger.info(`Your wallet address is: ${state.address}`);

    res.send({
        "seed": seed,
        "address": state.address,
    })
});

app.post('/seed/:seed/submit-sales', async (req: Request, res: Response) => {
    const { seed } = req.params
    const {  amount } = req.body;
    logger.info("Amount to sell: ", amount)
    logger.info("Seed to get wallet: ", seed)
    const wallet = await api.buildWalletAndWaitForFunds(config, seed);
    wallet.start();
    logger.info(`Your wallet started`);

    const providers = await api.configureProviders(wallet, config);
    logger.info(`Configured providers`);
    const counterContract = await api.deploy(providers)
    logger.info(`Deployed contract at address: ${counterContract.finalizedDeployTxData.contractAddress}`);
    
    const { txHash, blockHeight } = await api.increment(counterContract);
    logger.info(`Transaction ${txHash} added in block ${blockHeight}`);

    res.send({
        "contract_address": counterContract.finalizedDeployTxData.contractAddress,
        "transaction_hash": txHash,
        "block_height": blockHeight,
    })

})

interface FormData {
    seed: string;
}

app.post('/submit-seed', async (req: Request, res: Response) => {
    const {  seed }: FormData = req.body;
    logger.info('Name:', seed);

    res.send({"seed": seed})
});

// Start the server
app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`);
});
