import { error } from 'console'
import exp from 'constants'
import { Contract, Signer } from 'ethers'

import { EXCHANGE_ADDRESS, EXCHANGE_ABI, TOKEN_ADDRESS, TOKEN_ABI } from '../constants'

 
export const getAmountOfTokensReceivedFromSwap =  async (
  _swapAmountWei:any,
  provider:any,
  ethSelected:any,
  ethBalance:any,
  reservedCD:any
) => {


  const exchangeContract = new Contract(
    EXCHANGE_ADDRESS,
    EXCHANGE_ABI,
    provider
  )

  let amountOfTokens

  if(ethSelected) {
    amountOfTokens = await exchangeContract.getAmountOfTokens(
      _swapAmountWei,
      ethBalance,
      reservedCD
    )
  }else{
    amountOfTokens = await exchangeContract.getAmountOfTokens(
      _swapAmountWei,
      reservedCD,
      ethBalance
    )
  }
  return amountOfTokens
}


export const swapTokens = async ( 
signer:any,
swapAmountWei:any,
tokensToBeReceivedAfterSwap:any,
ethSelected:any
) =>{

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

  let tx

  if(ethSelected){
    tx = await exchangeContract.ethToCryptoDevToken(
      tokensToBeReceivedAfterSwap,
      {
        value:swapAmountWei
      }
    )
  }else{
    tx  = await exchangeContract.approve(
      EXCHANGE_ADDRESS,
      swapAmountWei.toString()
      )

    await tx.wait()

    tx = await exchangeContract.cryptoDevTokenToEth(
      swapAmountWei,
      tokensToBeReceivedAfterSwap
    )
    await tx.wait()
  } 
}
