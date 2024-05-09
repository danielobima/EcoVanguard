require('dotenv').config()

TETHER_ADDRESS = process.env.TETHER_ADDRESS
USDC_ADDRESS = process.env.USDC_ADDRESS
WRAPPED_BITCOIN_ADDRESS = process.env.WRAPPED_BITCOIN_ADDRESS
WETH_ADDRESS = process.env.WETH_ADDRESS
FACTORY_ADDRESS = process.env.FACTORY_ADDRESS
SWAP_ROUTER_ADDRESS = process.env.SWAP_ROUTER_ADDRESS
NFT_DESCRIPTOR_ADDRESS = process.env.NFT_DESCRIPTOR_ADDRESS
POSITION_DESCRIPTOR_ADDRESS = process.env.POSITION_DESCRIPTOR_ADDRESS
POSITION_MANAGER_ADDRESS = process.env.POSITION_MANAGER_ADDRESS
USDT_USDC_500 = process.env.USDT_USDC_500
PTK_ADDRESS = process.env.PTK_ADDRESS
PTK_USDC_500 = process.env.PTK_USDT_500


const artifacts = {
    NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
    Usdt: require("../artifacts/contracts/Tether.sol/Tether.json"),
    Usdc: require("../artifacts/contracts/UsdCoin.sol/UsdCoin.json"),
    UniswapV3Pool: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"),
};


const { Contract } = require("ethers")
const { Token } = require('@uniswap/sdk-core')
const { Pool, Position, nearestUsableTick } = require('@uniswap/v3-sdk')

async function getPoolData(poolContract) {
    const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
        poolContract.tickSpacing(),
        poolContract.fee(),
        poolContract.liquidity(),
        poolContract.slot0(),
    ])

    return {
        tickSpacing: tickSpacing,
        fee: fee,
        liquidity: liquidity,
        sqrtPriceX96: slot0[0],
        tick: slot0[1],
    }
}

async function main() {
    const [_owner,] = await ethers.getSigners();
    const provider = ethers.provider

    //token contracts
    const ptkAbi = require('../addedArtifacts/Ptk.json');
    const usdcContract = new Contract(TETHER_ADDRESS, artifacts.Usdc.abi, provider)
    const ptkContract = new Contract(PTK_ADDRESS, ptkAbi.abi, provider)

    //Connect to the token contracts
    await usdcContract.connect(_owner).approve(POSITION_MANAGER_ADDRESS, ethers.utils.parseEther('1000'))
    await ptkContract.connect(_owner).approve(POSITION_MANAGER_ADDRESS, ethers.utils.parseEther('1000'))

    //This the contract of the liquidity pool
    const polyPoolContract = new Contract(PTK_USDC_500, artifacts.UniswapV3Pool.abi, provider);

    const ptkPoolData = await getPoolData(polyPoolContract)
    console.log(ptkPoolData)

    const UsdtToken = new Token(84532, TETHER_ADDRESS, 18, 'USDT', 'Tether')
    const ptkToken = new Token(84532, PTK_ADDRESS, 18, 'PTK', 'PolyCoin')

    const polyPool = new Pool(
        UsdtToken,
        ptkToken,
        ptkPoolData.fee,
        ptkPoolData.sqrtPriceX96.toString(),
        ptkPoolData.liquidity.tostring(),
        ptkPoolData.tick

    )

    const positionPtk = new Position({
        pool: polyPool,
        liquidity: ethers.utils.parseEther('1'),
        tickLower: nearestUsableTick(ptkPoolData.tick, ptkPoolData.tickSpacing) - ptkPoolData.tickSpacing * 2,
        tickUpper: nearestUsableTick(ptkPoolData.tick, ptkPoolData.tickSpacing) + ptkPoolData.tickSpacing * 2,
    })

    const { amount0: amount0Desired, amount1: amount1Desired } = positionPtk.mintAmounts

    params = {
        token0: TETHER_ADDRESS,
        token1: PTK_ADDRESS,
        fee: ptkPoolData.fee,
        tickLower: nearestUsableTick(ptkPoolData.tick, ptkPoolData.tickSpacing) - ptkPoolData.tickSpacing * 2,
        tickUpper: nearestUsableTick(ptkPoolData.tick, ptkPoolData.tickSpacing) + ptkPoolData.tickSpacing * 2,
        amount0Desired: amount0Desired.toString(),
        amount1Desired: amount1Desired.toString(),
        amount0Min: 0,
        amount1Min: 0,
        recipient: _owner.address,
        deadline: Math.floor(Date.now() / 1000) + (60 * 10)
    }

    const nonfungiblePositionManager = new Contract(
        POSITION_MANAGER_ADDRESS,
        artifacts.NonfungiblePositionManager.abi,
        provider
    )

    const tx = await nonfungiblePositionManager.connect(_owner).mint(
        params,
        { gasLimit: '1000000' }
    )
    await tx.wait()
}

/*
  npx hardhat run --network localhost scripts/04_addLiquidity.js
*/

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });