
import { Contract, providers, utils, BigNumber } from 'ethers'
import { EXCHANGE_ADDRESS, EXCHANGE_ABI, TOKEN_ADDRESS, TOKEN_ABI } from '../constants'



export const removeLiquidity = async (
  signer: any,
  removeLPTokensWEI: any
) => {
  const exchangeContract = new Contract(
    EXCHANGE_ADDRESS,
    EXCHANGE_ABI,
    signer
  )
  const tx = await exchangeContract.removeLiquidity(removeLPTokensWEI)
  await tx.wait()
}


export const getTokensAfterRemove = async (
  provider: any,
  removeLPTokensWEI: any,
  _ethBalance: any,
  cryptoDevTokensReserve: any
) => {
  try {
    const exchangeContract = new Contract(
      EXCHANGE_ADDRESS,
      EXCHANGE_ABI,
      provider
    )

    const _totalSupply = await exchangeContract.totalSupply()

    const _removeEther = _ethBalance.mul(removeLPTokensWEI).div(_totalSupply)
    const _removeCD = cryptoDevTokensReserve
      .mul(removeLPTokensWEI)
      .div(_totalSupply)

    return { _removeEther, _removeCD }


  } catch (error) {
    console.log(error)
  }

}
