import { BigNumber, constants, providers } from 'ethers'
import toast, { Toaster } from 'react-hot-toast'
import Web3Modal from 'web3modal'
import type { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import { walletconnect } from 'web3modal/dist/providers/connectors'
import { id } from 'ethers/lib/utils'
const Home: NextPage = () => {

  interface thisProvider extends providers.Web3Provider {
    getAddress(): Promise<string>
  }

  interface thisSigner extends providers.JsonRpcSigner {
    getAddress(): Promise<string>
  }

  const [loading, setLoading] = useState<boolean>(false)

  const [liquidityTab, setLiquidityTab] = useState<boolean>(true)

  const zero = BigNumber.from(0)

  console.log(typeof zero)

  const [ehtBalance, setEthBalance] = useState(zero)

  const [reservedCD, setReservedCD] = useState(zero)

  const [etherBalanceContract, setEtherBalanceContract] = useState(zero)

  const [cdBalance, setCDBalance] = useState(zero)

  const [lpBalance, setLpBalance] = useState(zero)

  const [addEther, setAddEther] = useState(zero)

  const [addCDTokens, setAddCDTokens] = useState(zero)

  const [removeEther, setRemoveEther] = useState(zero)

  const [removeCD, setRemoveCD] = useState(zero)

  const [removeLPTokens, setRemoveLPTokens] = useState('0')

  const [swapAmount, setSwapAmount] = useState('')

  const [tokenToBeReceivedAfterSwap, setTokenToBeReceivedAfterSwap] = useState(zero)

  const [ethSelected, setEthSelected] = useState<boolean>(true)

  const web3ModalRef = useRef<Web3Modal>()

  const [walletConnected, setWalletConnected] = useState<boolean>(false)

  const connectWallet = async () => {
    try {
      await getProviderOrSigner()
      setWalletConnected(true)
    } catch (error) { console.log(error) }
  }



  const getProviderOrSigner = async (needSigner = false) => {

    const provider = await web3ModalRef.current?.connect()

    const web3Provider = new providers.Web3Provider(provider)

    const { chainId } = await web3Provider.getNetwork()

    if (chainId !== 4) {
      toast.error('Connect To Rinkeby', { id: 'thisError' })
    } else {
      toast.success('Connected to Rinkeby', { id: 'thisSuccess' })
    }

    if (needSigner) {
      const signer = web3Provider.getSigner() as thisSigner
      return signer
    }

    return web3Provider as thisProvider

  }

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: 'rinkeby',
        providerOptions: {},
        disableInjectedProvider: false
      })
    }
    connectWallet()
  }, [walletConnected])


  const renderButton = () => {
    if (!walletConnected) {
      return (
        <button
          className='thisButton'
          onClick={connectWallet}
        >
          Connect your Wallet
        </button>
      )
    }
  }

  return (
    <div
      className=' 
      p-5
      overflow-hidden
      min-w-[90vmin]
      lg:min-w-[100vmin]
      min-h-[50vmin]
      max-h-[95vmin]
      rounded-2xl
      shadow-2xl
      bg-zinc-200 bg-opacity-40
      dark:bg-black dark:bg-opacity-20
      flex flex-col lg:flex-row
      lg:items-stretch 
      justify-between
      items-center
        gap-4
      '>
      <Toaster
        position="top-left" toastOptions={{
          error: {
            iconTheme: { primary: '#eee', secondary: '#555' },
            style: { background: '#EB1D36', color: '#eee' }
          }
        }} />

      <section
        className='
        flex flex-col items-start justify-start
        gap-3
        p-5
        lg:w-1/2 w-full
        '
      >
        <h1
          className='
          text-xl
          md:text-2xl
          lg:text-3xl
          tracking-tighter
          '
        >
          Welcome to Crypto Devs Exchange!
        </h1>
        <h3
          className='
          text-xs md:text-sm lg:text-lg
          tracking-tight'
        >
          Exchange Ethereum <span className='font-bold' >&#60;&#62;</span> Crypto Dev Tokens
        </h3>
      </section>


    </div>
  )
}

export default Home
