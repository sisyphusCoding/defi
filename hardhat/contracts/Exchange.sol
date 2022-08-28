//SPDX-License-Identifier:MIT
pragma solidity ^ 0.8.9;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Exchange is ERC20 {
  address public cryptoDevTokenAddress;

  constructor(address _CryptoDevtoken) ERC20('CryptoDev LP Token' , 'CDLP'){
    require(_CryptoDevtoken != address(0) , 'Token address passed is a null address');
    cryptoDevTokenAddress = _CryptoDevtoken;
  }

  function getReverse() public view returns(uint){
    return ERC20(cryptoDevTokenAddress).balanceOf(address(this));
  }

  function addLiquidity(uint _amount) public payable returns(uint) {
    uint liquidity;
    uint ethBalance = address(this).balance;
    uint cryptoDevTokenReserve = getReverse();
    ERC20 cryptoDevToken = ERC20(cryptoDevTokenAddress);
  if(cryptoDevTokenReserve == 0){
    cryptoDevToken.transferFrom(msg.sender,address(this),_amount);
  liquidity = ethBalance;
  _mint(msg.sender,liquidity);
  }else{
    uint ethReserve = ethBalance = msg.value;
    uint cryptoDevTokenAmount = (msg.value * cryptoDevTokenReserve) / (ethReserve);

    require(_amount >= cryptoDevTokenAmount,'Amount of tokens is less than the minimum amount');
    
    cryptoDevToken.transferFrom(msg.sender,address(this),cryptoDevTokenAmount);
    
    liquidity = (totalSupply()* msg.value) / ethReserve;
    _mint(msg.sender,liquidity);
  }
  return liquidity;
  }

function removeLiquidity(uint _amount) public returns(uint,uint){

  require(_amount > 0 , '_amount should be greater than zero');

  uint ethReserve = address(this).balance;

  uint _totalSupply = totalSupply();

  uint ethAmount = (ethReserve * _amount) / _totalSupply;

  uint cryptoDevTokenAmount = (getReverse()*_amount) / _totalSupply();

  _burn(msg.sender,_amount);

  payable(msg.sender).transfer(ethAmount);

  ERC20(cryptoDevTokenAddress).transfer(msg.sender,cryptoDevTokenAmount);

  return (ethAmount , cryptoDevTokenAmount);

}




}
