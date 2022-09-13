pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Exchange is ERC20 {


  address public cryptoDevTokenAddress;

  constructor(address _CryptoDevToken) ERC20('CryptoDev LP Token' , 'CDLP'){
    require(_CryptoDevToken != address(0), 'Token address passed is a null address');
    cryptoDevTokenAddress = _CryptoDevToken;
  }

  function getReserve() public view returns(uint){
    return ERC20(cryptoDevTokenAddress).balanceOf(address(this));
  }


  function addLiquidity() public payable returns(uint){
    uint liquidity;
    uint ethBalance = address(this).balance;
    uint cryptoDevTokenReserve = getReserve();
    ERC20 cryptoDevToken = ERC20(cryptoDevTokenAddress);

    if(cryptoDevTokenReserve == 0 ){
      cryptoDevToken.transferFrom(msg.sender,address(this) , _amount);
      liquidity = ethBalance;
      _mint(msg.sender,liquidity);
    }else{
      uint ethReserve = ethBalance - msg.value; 
      
      uint cryptoDevTokenAmount  = (msg.value * cryptoDevTokenReserve);

      require(_amount >= cryptoDevTokenAmount,'Amount of token sent is less than minimum token required');

      cryptoDevToken.transferFrom(msg.sender,address(this) , cryptoDevTokenAmount);

      liquidity = (totalSupply() * msg.value ) / ethReserve;
    }
  }



  function removeLiquidity(uint _amount ) public returns(uint , uint){
    require(_amount > 0 , '_amount should not be zero');
    
    uint ethReserve = address(this).balance;
    uint _totalSupply = totalSupply();


    uint ethAmount = (ethReserve * _amount) / _totalSupply;

    uint cryptoDevTokenAmount = (getReserve() * _amount) / _totalSupply;

    _burn(msg.sender,_amount); 

    payable(msg.sender).transfer(ethAmount);
  }



  function getAmountOfTokens(
    uint256 inputAmount,
    uint256 inputReserve,
    uint256 outputReserve
  ) public pure returns (uint256){
      
    require(inputReserve > 0 && outputReserve > 0,
        'invalid reserve'
           );

    uint256 inputAmountWithFee = inputAmount * 99;       


    uint256 num = outputReserve * inputAmountWithFee; 

    uint256 den = (inputReserve * 100) + inputAmountWithFee; 

    return num / den ;
            
  } 

  function ethToCrytoDevToken(uint _minToken) public payable {

    uint256 tokenReserve = getReserve();

    uint256 tokensBought = getAmountOfTokens(
      msg.value, 
      address(this).balance - msg.value, 
      tokenReserve);

    require(tokensBought >= _minToken,'insufficient tokens amount');  
      ERC20(cryptoDevTokenAddress).transfer(msg.sender,tokensBought);
    }

  function cryptoDevTokenToEth(
    uint _tokensSold,
    uint _mint
  ) public {

    uint256 tokenReserve = getReserve();

    uint ethBought = getAmountOfTokens(
    _tokensSold,
    tokenReserve, 
    address(this).balance);

    require(ethBought >= _minEth , 'insufficient output amount');

    ERC20(cryptoDevTokenAddress).transferFrom(
      msg.sender,
      address(this).
      _tokensSold
    );

    payable(msg.sender).transfer(ethBought);

  }
}

