import { BigNumber, constants, providers, Signer, utils } from 'ethers'
import{AnimatePresence, motion, Variants} from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import Web3Modal from 'web3modal'
import type { NextPage } from 'next'
import{BsCurrencyExchange} from 'react-icons/bs'
import {GrClose} from  'react-icons/gr'
import {
  FC,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore
} from 'react'
import Core from 'web3modal'
import { getCDTokensBalance, getEtherBalance, getLPTokensBalance, getReserveOfCDTokens } from '../utils/getAmount'
import { getAmountOfTokensReceivedFromSwap, swapTokens } from '../utils/swap'
import { addLiquidity, calculateCD } from '../utils/addLiquidity'
import { getTokensAfterRemove, removeLiquidity, withRemove } from '../utils/removeLiquidity'
import Image from 'next/image'


const Home: NextPage = () => {

  interface thisProvider extends providers.Web3Provider {
    getAddress(): Promise<string>
  }

  interface thisSigner extends providers.JsonRpcSigner {
    getAddress(): Promise<string>
  }

  const blurO :Variants = {
    hidden:{filter:'blur(10px)',opacity:0},
    show:{filter:'blur(0px)',opacity:1} ,
    exit:{filter:'blur(10px)' , opacity:0},
  }

  const slideIn :Variants = {
    hidden:{x:'-150%'},
    show:{x:'0%' , } ,
    exit:{x:'150%'},
  }

  const [start, setStart] = useState<boolean>(false)
  
  const [loading, setLoading] = useState<boolean>(false)

  const [liquidityTab , setLiquidityTab ] = useState<boolean>(true)

  const zero = BigNumber.from(0)
  
  const [ethBalance , setEthBalance ] = useState<any>(zero)

  const [reservedCD, setReservedCD] = useState<any>(zero)

  const [etherBalanceContract, setEtherBalanceContract] = useState<any>(zero)

  const [cdBalance, setCdBalance] = useState<any>(zero) 

  const [lpBalance, setLpBalance] = useState<any>(zero)

  const [addEther, setAddEther] = useState<any>(zero)

  const [addCDTokens, setAddCDTokens] = useState<any>(zero)

  const [removeEther, setRemoveEther] = useState<any>(zero)

  const [removeCD, setRemoveCD] = useState<any>(zero)


  const [removeLPTokens, setRemoveLPTokens] = useState<string>('0')

  const [swapAmount, setSwapAmount] = useState('') 


  const [tokenAfterSwap, setTokenAfterSwap] = useState<any>(zero)

  const [ethSelected, setEthSelected] = useState<boolean>(true)

  const web3ModalRef = useRef<Core>()

  const [walletConnected, setWalletConnected] = useState<boolean>(false)


  const connectWallet = async () => {
    try{
      await getProviderOrSigner()
      setWalletConnected(true)
    }
    catch(error){console.log(error)}
  }

  const getProviderOrSigner = async (needSigner:boolean = false) => {
  
    const provider = await web3ModalRef.current?.connect()

    const web3Provider = new providers.Web3Provider(provider)

    const {chainId} = await web3Provider.getNetwork()

    if(chainId === 4 ) {
      toast.success('Connected to Rinkeby',{id:'success'})
    } else {
      toast.error('Please connect to Rinkeby',{id:'error'})
    }


    if(needSigner){

      const signer  = web3Provider.getSigner() 

      return signer as thisSigner

    }

    return web3Provider as thisProvider


   
  }
  

  const getAmounts = async()=>{
    try{

      const provider = await getProviderOrSigner()

      const signer = await getProviderOrSigner(true)

      const address  = await signer.getAddress()

      const _ethBalance = await getEtherBalance(provider,address)

      const _cdBalance = await getCDTokensBalance(provider , address)

      const _lpBalance = await getLPTokensBalance(provider , address)

      const _reserveCD = await getReserveOfCDTokens(provider)

      const _ethBalanceContract = await getEtherBalance(provider , null , true)

      
      setEthBalance(_ethBalance)
      setCdBalance(_cdBalance)
      setLpBalance(_lpBalance)
      setReservedCD(_reserveCD)
      setEtherBalanceContract(_ethBalanceContract)

        
    }
    catch(error){console.error(error)}
  }


  const _swapTokens = async () => {

    try{
      const swapAmountWei = utils.parseEther(swapAmount)

      if(!swapAmountWei.eq(zero)){
        const signer = await getProviderOrSigner(true)
        setLoading(true)
        await swapTokens(
          signer,
          swapAmountWei,
          tokenAfterSwap,
          ethSelected
        )
        setLoading(false)
        await getAmounts()
        setSwapAmount('')
      }

    }
    catch(error){
      console.log(error)
      setLoading(false)
      setSwapAmount('')
    }
  }




  const _getAmountOfTokenReceivedFromSwap  = async(_swapAmount:any) => {

    try{

        const _swapAmountWEI = utils.parseEther(_swapAmount.toString())

        if(!_swapAmountWEI.eq(zero)){
        const provider = await getProviderOrSigner()

        const _ethBalance = await getEtherBalance(provider,null,true)

        const amountOfTokens = await getAmountOfTokensReceivedFromSwap(
          _swapAmountWEI,
          provider,
          ethSelected,
          _ethBalance,
          reservedCD
        )

        setTokenAfterSwap(amountOfTokens)

      } else{
        setTokenAfterSwap(zero)
      }

    }
    catch(error){
      console.log(error)
    }
  }


  const _addLiquidity = async () => {
    
    try{  
      const addEtherWEI = utils.parseEther(addEther.toString())

      if( !addCDTokens.eq(zero) &&  !addEtherWEI.eq(zero)){
        
        const signer = await getProviderOrSigner(true)

        setLoading(true)
      
        await addLiquidity(signer, addCDTokens , addEtherWEI)

        setLoading(false)

        setAddCDTokens(zero)

        await getAmounts()

       }else{setAddCDTokens(zero)}
    }
    catch(error){
      console.log(error)
      setLoading(false)
      setAddCDTokens(zero)
    }

  }

  const _removeLiquidity = async () =>{
    try{
      const signer = await getProviderOrSigner(true)
      const removeLPTokensWEI = utils.parseEther(removeLPTokens)

      setLoading(true)

      await removeLiquidity(signer,removeLPTokensWEI)

      setLoading(false)
      await getAmounts()
      setRemoveCD(zero)
      setRemoveEther(zero)

    }
    catch(error){
      console.log(error)
      setLoading(false)
      setRemoveCD(zero)
      setRemoveEther(zero)
    }
  }



  const _getTokensAfterRemove = async (_removeLPTokens:any) => {
    try{
      const provider = await getProviderOrSigner()

      
      const removeLPTokensWEI = utils.parseEther(_removeLPTokens)

      const _ethBalance = await getEtherBalance(provider , null , true)

      const cryptoDevTokenReserve = await getReserveOfCDTokens(provider)

      const {_removeEther,_removeCD } = await getTokensAfterRemove (
        
        provider,
        removeLPTokensWEI,
        _ethBalance,
        cryptoDevTokenReserve
      ) as any 

      setRemoveEther(_removeEther)
      setRemoveCD(_removeCD)


    }
    catch(error){
      console.log(error)
    }

  }


  //round to four decimal places
  const thisRound = (num:any) => {
    return  Math.round(num * 1e4)  / 1e4
    
  }

    useEffect(() => {
    
    if(!walletConnected){
        web3ModalRef.current = new Web3Modal({
        network:'rinkeby',
        providerOptions:{},
        disableInjectedProvider:false,
      })
    }

    connectWallet()
    getAmounts()

    }, [walletConnected])


  const renderButton = () => {
    if(!walletConnected){
      return(
      <button
         className='
          tracking-tighter
          text-sm md:text-base
          thisButton px-4 py-3 
          bg-sky-600
          text-zinc-300
          shadow-xl
           rounded-xl'
         >
          Connect Your Wallet
        </button>
      )
    }
    if(loading){
      return(
      <p className='animate-spin 
      h-14 w-14
      rounded-full 
      border-zinc-700   
      border-r-white border-4' />
      )
    }

    if(liquidityTab){
      return(
        <AnimatePresence exitBeforeEnter>
        <motion.section
          key={liquidityTab.toString()}   
          variants={blurO}    
          initial='hidden'
          animate='show'
          exit='exit'
          transition={{duration:1}}
         className='   
          w-full
          gap-4 
          p-5
          text-xs md:text-sm
          flex items-start justify-center flex-col'
         >
          <table 
          className='
            table-caption
            rounded-xl
            thisNeo
            p-4
            '
            >
            <thead >
              <tr>
                <th>You Have:</th>
              </tr>
            </thead>
              <tbody>
                <tr>
                  <td>
                {utils.formatEther(cdBalance)} 
                </td>
                  <td>
                  Crypto Dev Tokens
                </td>
              </tr>
                <tr>
                <td>{
                  thisRound(utils.formatEther(ethBalance))
                }
                </td>
                <td>Ether</td>
              </tr>
                <tr>
                <td>
                  {utils.formatEther(lpBalance)} 
                </td>
                  <td>
              Crypto Dev LP tokens
                </td>
              </tr>
            </tbody>
          </table>

          {utils.parseEther(reservedCD.toString()).eq(zero)?

          (<div
             className='flex items-center justify-center gap-5'
             >
            <input 
            className='
                shadow-xl
                bg-zinc-200
                rounded-xl
                px-4 py-3'
            type='number'
            placeholder='Amount of Ether'
            onChange={(e)=>setAddEther(e.target.value || '0')}
             />
           <input
            className='
                text-xs
                shadow-xl
                bg-zinc-200
                rounded-xl
                px-4 py-3
                '
            type='number'
            placeholder='Amount of CryptoDev tokens'
            onChange={
                (e)=>setAddCDTokens(
                  BigNumber.from(utils.parseEther(e.target.value||'0'))
                )} />
          <button 
                onClick={_addLiquidity}
                className='
                shadow-xl
                px-5 py-3
                bg-sky-700
                rounded-xl
                text-zinc-300
                thisButton'>
                Add 
              </button>
          </div>)
          :(
            <div className='p-5 min-w-full'>
              <input
                  className='                
                  text-xs
                  shadow-xl
                bg-zinc-200
                rounded-xl
                px-4 py-3'
                  placeholder='Amount of Ether'
                  type='number'
                  onChange={async (e)=>{
                    setAddEther(e.target.value || '0' ) ;
                    const _addCdTokens =  await calculateCD(
                      e.target.value  || '0' ,
                      etherBalanceContract,
                      reservedCD
                    )
                    setAddCDTokens(_addCdTokens)
                  }}
                  />
                <p
                 className='py-2'>
                You will need {`${utils.formatEther(addCDTokens)}`} CryptoDev Tokens
                </p>
                  <button
                    className='
                    bg-sky-700 text-zinc-300 
                    shadow-[0_5px_10px_rgba(0,0,0,.5)]
                    thisButton px-4 py-2 rounded-xl'
                    onClick={_addLiquidity}
                    >
                    Add
                  </button>
              </div>
          

      )}
          <div>
            <input 
                  className='                
                  text-xs
                  shadow-xl
                bg-zinc-200
                rounded-xl
                px-4 py-3'
             type='number'
             placeholder='Amount of LP Tokens'
             onChange={async (e)=> {
              setRemoveLPTokens(e.target.value || '0')
              await _getTokensAfterRemove(e.target.value || '0')
             }}/>

            <p
             className='py-4 '
             >
              You will get {utils.formatEther(removeCD)} Crypto
              Dev Tokens and {utils.formatEther(removeEther)} Ether
            </p>  

            <button
              className='
              thisButton 
              px-4 py-3 rounded-xl 
              bg-sky-700 
              shadow-[_0px_6px_10px_rgba(0,0,0,.5)]
              text-zinc-300
              '
              onClick={_removeLiquidity}
              >
              Remove Liquidity 
            </button>
          </div> 
        </motion.section>
      )
</AnimatePresence>)
    } else {

       return(  
        <AnimatePresence exitBeforeEnter>
        <motion.div
          key={liquidityTab.toString()}   
          variants={blurO}    
          initial='hidden'
          animate='show'
          exit='exit'
         className='w-full p-5 '

          transition={{duration:1}}
         >
          <input 
           type='number'
           placeholder='Amount'
           onChange={async (e) =>{
            setSwapAmount(e.target.value || '')
            await _getAmountOfTokenReceivedFromSwap(e.target.value || '0')
           }} 
            value={swapAmount}
           />
          <select 
           className=''
           name='dropDown'
           id='dropDown'
           onChange={async()=>{
            setEthSelected(!ethSelected)
            await _getAmountOfTokenReceivedFromSwap(0)
            setSwapAmount('')
            }}>
            <option value='eth'>Ethereum</option>
            <option value='cryptoDevToken'>Crypto Dev Token</option>
          </select>
        
      <br/>

        
      <p className='py-3'>
      {
        ethSelected? 
        `You will get ${utils.formatEther(tokenAfterSwap)} Crypto Dev Tokens 
        `:`You will get ${utils.formatEther(tokenAfterSwap)} Eth`
      }</p>
      <button
           className='
              thisButton 
              px-4 py-3 rounded-xl 
              bg-sky-700 
              shadow-[_0px_6px_10px_rgba(0,0,0,.5)]
              text-zinc-300
            ' onClick={_swapTokens}
           >
            Swap
          </button>
        </motion.div>
    </AnimatePresence>
       ) 

    }
  }


  return (
    <div
      className=" 
      p-5
      overflow-hidden
      min-w-[90vmin]
      lg:min-w-[100vmin]
      min-h-[50vmin]
      max-h-[95vmin]
      rounded-2xl
      shadow-2xl
      bg-zinc-200 
      bg-opacity-40
      dark:bg-black dark:bg-opacity-20
      flex flex-col lg:flex-row
      lg:items-stretch 
      justify-between
      items-center
        gap-4
      "
    >
      <Toaster
        position="top-left"
        toastOptions={{
          error: {
            iconTheme: { primary: '#eee', secondary: '#555' },
            style: { background: '#EB1D36', color: '#eee' }
          }
        }}
      />

      <section
        className="
        flex flex-col items-start justify-start
        gap-3
        p-5
        lg:w-1/2 w-full
        "
      >
        <h1
          className="
          text-xl
          md:text-2xl
          lg:text-3xl
          tracking-tighter
          "
        >
          Welcome to Crypto Devs Exchange!
        </h1>
        <h5></h5>
        <h3
          className="
          text-xs md:text-sm lg:text-lg
          tracking-tight"
        >
          Exchange Ethereum <span className="font-bold">&#60;&#62;</span> Crypto
          Dev Tokens
        </h3>

      <AnimatePresence exitBeforeEnter> 
        {!start? 
          <motion.button
              variants={blurO}
              initial='hidden' 
              animate='show'
              exit='exit'
              transition={{duration:1}}
            onClick={()=>setStart(true)}
          className='
          shadow-[0_5px_10px_rgba(0,0,0,.4)]
          bg-zinc-600 text-zinc-300 
          flex items-center justify-center gap-5
          thisButton px-4 py-2 rounded-xl'
          >
          <span>Exchange</span> 
          <span>
            <BsCurrencyExchange/>
          </span>
        </motion.button>
      :
          <motion.section
              variants={blurO}
              initial='hidden'
              animate='show'
              exit='exit'
              transition={{duration:1}}
          className='flex gap-4'  
          >
          <button 
            onClick={()=>{setLiquidityTab(true)}}
           className={`
              ${liquidityTab? 'bg-sky-900' :''}
              thisButton 
              px-4 py-2 rounded-xl 
              bg-sky-700 
              shadow-[_0px_6px_10px_rgba(0,0,0,.5)]
              text-zinc-300
          `}>
                  Liquidity
          </button>

          <button 
            onClick={()=>{setLiquidityTab(false)}}
           className={`

              ${!liquidityTab? 'bg-sky-900' :''}
              thisButton               
              px-4 py-2 rounded-xl 
              bg-sky-700 
              shadow-[_0px_6px_10px_rgba(0,0,0,.5)]
              text-zinc-300
            `}>
              Swap
          </button>
              <button 
              onClick={()=>setStart(false)}
              className='
              shadow-[0_5px_5px_rgba(0,0,0,.4)]
              bg-red-500 rounded-full p-2'>
              <GrClose/>
            </button>
        </motion.section>
      }
        </AnimatePresence>
          <section>  
        </section> 
      </section>
    <section>
    </section>
        <section 
        className='
        bg-zinc-100
        dark:bg-zinc-800
        min-h-[60vmin]
        relative
        thisNeo
        rounded-xl
        overflow-hidden
        lg:min-w-[55vmin] min-w-[90vmin]' 
      >
        <AnimatePresence>
        {start? 
        <motion.div
          className='
              absolute
              min-w-full 
              min-h-full
              flex items-center justify-center
              rounded-xl
              '
          key={start.toString()}   
          variants={slideIn}    
          initial='hidden'
          animate='show'
          exit='exit'
          transition={{duration:1.4}}
           >
            {renderButton()}
          </motion.div>
          :
        <motion.div
           key={start.toString()}   
          className=' absolute min-w-full'
          variants={slideIn}    
          initial='hidden'
          animate='show'
          transition={{duration:1.4}}
        exit='exit'
            >

        <ThisImage />
            </motion.div>
        }

        </AnimatePresence>
      </section>

    </div>
  )
}


const ThisImage:FC = () => {

  return(
      <div 
      className='lg:min-w-[50vmin] min-w-[50vmin] p-5' 
    >
          <Image 
          objectFit='contain'
          layout='responsive'
          height={100} width={100}
          src='/cryptodev.svg'
      />

        </div>
)
}



export default Home
