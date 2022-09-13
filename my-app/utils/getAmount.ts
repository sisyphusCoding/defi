
import assert from 'assert'
import { Contract } from 'ethers'
import { Provider } from 'web3modal'

import { EXCHANGE_ADDRESS, EXCHANGE_ABI, TOKEN_ADDRESS, TOKEN_ABI } from '../constants'



export const getEtherBalance = async (
  provider:any,
  address:any,
  exchangeContract:boolean = false
) => {
  try{
    let thisAddress
    if(exchangeContract){
      thisAddress = EXCHANGE_ADDRESS
    }else{
      thisAddress= address
    }
    const balance = await provider.getBalance(thisAddress)
    return balance
  }
  catch(error){console.log(error)}
} 


export const getCDTokensBalance = async(
  provider:any,
  address:any
) =>{
  try{
    const tokenContract = new Contract(
      TOKEN_ADDRESS,
      TOKEN_ABI,
      provider
    )
    const balanceOfCryptoDevToken = await tokenContract.balanceOf(address)
    return balanceOfCryptoDevToken
  }
  catch(error){
    console.log(error)
  }
}


export const getLPTokensBalance = async(
  provider:any,
  address:any
) =>{


  try{
    const exchangeContract = new Contract(
      EXCHANGE_ADDRESS,
      EXCHANGE_ABI,
      provider
    )
    const balanceOfLPTokens = await exchangeContract.balanceOf(address)

    return balanceOfLPTokens 
  }
  catch(error){console.log(error)}

}


export const getReserveOfCDTokens = async(provider:any) =>{
  try{
      const exchangeContract = new Contract(
        EXCHANGE_ADDRESS,
        EXCHANGE_ABI,
        provider
      )


      const reserve = await exchangeContract.getReserve()

      return reserve

  }
  catch(error){console.log(error)}
}
