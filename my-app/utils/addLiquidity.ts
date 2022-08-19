import { Contract, utils } from 'ethers'

import { EXCHANGE_ADDRESS, EXCHANGE_ABI, TOKEN_ADDRESS, TOKEN_ABI } from '../constants'


export const addLiquidity = async (
  signer: any,
  addCDAmountWEI: any,
  addEtherAmountWEI: any
) => {
  try {
    const tokenContract = new Contract(
      TOKEN_ADDRESS,
      TOKEN_ABI,
      signer
    )

    const exchangeContract = new Contract(
      EXCHANGE_ADDRESS,
      EXCHANGE_ABI,
      signer
    )

    let tx = await tokenContract.approve(
      EXCHANGE_ADDRESS,
      addCDAmountWEI.toString()
    )

    await tx.wait()

    tx = await exchangeContract.addLiquidity(addCDAmountWEI, {
      value: addEtherAmountWEI
    })

    await tx.wait()

  }
  catch (error) { console.log(error) }
}


export const calculateCD = async (
  _addEther: string = '0',
  etherBalContract: any,
  cdTokenReserve: any
) => {
  const _addEtherAmountWei = utils.parseEther(_addEther)

  const cryptoDevTokenAmount = _addEtherAmountWei
    .mul(cdTokenReserve)
    .div(etherBalContract)
    
    

  return cryptoDevTokenAmount
}
