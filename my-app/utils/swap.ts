import { Contract, Signer } from 'ethers'
import { AmdDependency } from 'typescript'

import { EXCHANGE_ADDRESS, EXCHANGE_ABI, TOKEN_ADDRESS, TOKEN_ABI } from '../constants'



export const getAmountOfTokensRecievedFromSwap = async (
  _swapAmountWei: any,
  provider: any,
  ethSelected: any,
  ethBalance: any,
  reservedCD: any
) => {
  const exchangeContract = new Contract(
    EXCHANGE_ADDRESS,
    EXCHANGE_ABI,
    provider
  )

  let amountOfTokens

  if (ethSelected) {
    amountOfTokens = await exchangeContract.getAmountOfTokens(
      _swapAmountWei,
      ethBalance,
      reservedCD
    )
  } else {
    amountOfTokens = await exchangeContract.getAmountOfTokens(
      _swapAmountWei,
      reservedCD,
      ethBalance
    )
  }

  return amountOfTokens


}



export const swapTokens = async (
  signer: any,
  swapAmountWei: any,
  tokenToBeRecievedAfterSwap: any,
  ethSelected: any
) => {

  const exchangeContract = new Contract(
    EXCHANGE_ADDRESS,
    EXCHANGE_ABI,
    signer
  )

  const tokenContract = new Contract(
    TOKEN_ADDRESS,
    TOKEN_ABI,
    signer
  )

  let tx;

  if (ethSelected) {
    tx = await exchangeContract.ethToCryptoDevToken(
      tokenToBeRecievedAfterSwap, {
      value: swapAmountWei
    }
    )
  } else {
    tx = await tokenContract.approve(
      EXCHANGE_ADDRESS,
      swapAmountWei.toString()
    )

    await tx.wait()

    tx = await exchangeContract.cryptoDevTokenToEth(
      swapAmountWei,
      tokenToBeRecievedAfterSwap
    )

  }

  await tx.wait()
}
