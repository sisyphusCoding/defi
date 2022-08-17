//SPDX-License-Identifier:MIT

pragma solidity ^ 0.8.9;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Exchange is ERC20 {

 address public cryptoDevTokenAddress;

 constructor(address _CryptoDevtoken) ERC20('CryptoDEV LP Token' , 'CDLP'){
   require(_CryptoDevtoken != address(0) , 'Token address is null');
   cryptoDevTokenAddress = _CryptoDevtoken;

 }

 function getReserve() public view return (uint){
   return ERC20(cryptoDevTokenAddress).balanceOf(address(this));
 }

 
 function addLiquidity(uint _amount) public payable returns(uint){
  uint liquidity;
  uint ethBalance = address(this).balance;
  uint cryptoDevTokenReserve = getReserve();
  ERC20 cryptoDevToken = ERC20(cryptoDevTokenAddress);

  if(cryptoDevTokenReserve == 0){
    cryptoDevToken.transferFrom(msg.sender , address(this), _amount);    
    liquidity = ethBalance;
    _mint(msg.sender,liquidity)
  }else{
    uint ethReverse = ethBalance = msg.value;
  }

 }

  
}
