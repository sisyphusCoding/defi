
import { Contract } from 'ethers'

import { EXCHANGE_ADDRESS, EXCHANGE_ABI, TOKEN_ADDRESS, TOKEN_ABI } from '../constants'



export const getEtherBalance = async (
  provider: any,
  address: any,
  contract = false) => {

  try {
    if (contract) {
      const balance = await provider.getBalance(EXCHANGE_ADDRESS)
      return balance
    } else {
      const balance = await provider.getBalance(address)
      return balance
    }
  }
  catch (error) {
    console.log(error)
    return 0
  }


}




export const getCDTokensBalance = async (
  provider: any,
  address: any) => {
  try {
    const tokenContract = new Contract(
      TOKEN_ADDRESS,
      TOKEN_ABI,
      provider
    )

    const balanceOfCDTokens = await tokenContract.balanceOf(address)
    return balanceOfCDTokens
  }
  catch (error) {
    console.log(error)
  }

}



export const getLPTokensBalance = async (
  provider: any,
  address: any
) => {
  try {
    const exchangeContract = new Contract(
      EXCHANGE_ADDRESS,
      EXCHANGE_ABI,
      provider
    )
    const balanceOfLPTokens = await exchangeContract.balanceOf(address)
    return balanceOfLPTokens
  }
  catch (error) { console.log(error) }
}

export const getReserveTokens = async (provider: any) => {
  try {
    const exchangeContract = new Contract(
      EXCHANGE_ADDRESS,
      EXCHANGE_ABI,
      provider
    )

    const reserve = await exchangeContract.getReserve()
    return reserve

  } catch (error) {
    console.log(error)
  }
}



