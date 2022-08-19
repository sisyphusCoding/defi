import { BigNumber, constants, providers } from 'ethers'
import Web3Modal from 'web3modal'
import type { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import { walletconnect } from 'web3modal/dist/providers/connectors'
const Home: NextPage = () => {

  const [loading,setLoading] = useState<boolean>(false)

  const [liquidityTab,setLiquidityTab] = useState<boolean>(true) 

  const zero = BigNumber.from(0)

  console.log(typeof zero)

  const [ehtBalance,setEthBalance] = useState(zero)

  const [reservedCD,setReservedCD] = useState(zero)

  const [etherBalanceContract,setEtherBalanceContract] = useState(zero)

  const [cdBalance,setCDBalance] = useState(zero)
 
  const [lpBalance,setLpBalance] = useState(zero) 

  const [addEther,setAddEther] = useState(zero)

  const [addCDTokens,setAddCDTokens] = useState(zero)

  const [removeEther,setRemoveEther] = useState(zero)

  const [removeCD,setRemoveCD] = useState(zero)

  const [removeLPTokens,setRemoveLPTokens] = useState('0')

  const [swapAmount,setSwapAmount] = useState('')

  const [tokenToBeReceivedAfterSwap,setTokenToBeReceivedAfterSwap] = useState(zero)

  const [ethSelected , setEthSelected] = useState<boolean>(true)

  const web3ModalRef = useRef<Web3Modal>()

  const [walletConnected,setWalletConnected] = useState<boolean>(false)

  const connectWallet = async() =>{
    try{
      await getProviderOrSigner()
      setWalletConnected(true)
    }catch(error){console.log(error)}
  } 

    

  const getProviderOrSigner = async(needSigner = false) =>{

      const provider = await web3ModalRef.current?.connect() 
       
      const web3Provider = new providers.Web3Provider(provider)

      const {chainId}  = await web3Provider.getNetwork()

      if(chainId !== 4){

      }

      if(needSigner){
        const signer = web3Provider.getSigner()
        return signer
      }

      return web3Provider

  }

  useEffect(()=>{
    if(!walletConnected){
      web3ModalRef.current = new Web3Modal({
        network:'rinkeby',
        providerOptions:{},
        disableInjectedProvider:false 
      })
    }
    connectWallet()
  },[walletConnected])


  return(
    <div
     className=' 
      flex flex-col lg:flex-row
      items-center justify-center
      grow min-w-full gap-4
      '>


    </div>
  )
}

export default Home
