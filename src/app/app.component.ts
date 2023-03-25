import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BigNumber, Contract, Wallet, ethers, utils } from 'ethers';
import tokenJson from '../assets/MyToken.json';


const API_URL = "http://localhost:3000/contract-address";
const API_URL_MINT = "http://localhost:3000/request-tokens";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  blockNumber: number | string| undefined;
  provider: ethers.providers.BaseProvider;
  userWallet: Wallet | undefined;
  userEthBalance: number | undefined;
  userTokenBalance: number | undefined;
  tokenContractAddress: string | undefined;
  tokenContract: Contract | undefined;
  tokenTotalSupply: number | string | undefined;

  constructor( private http: HttpClient) {
    this.provider = ethers.getDefaultProvider('goerli');
    }

  getTokenAddress() {
    return this.http.get<{address: string}>(API_URL);
  }


  syncBlock() {
    this.provider.getBlock('latest').then((block) => {
    this.blockNumber = block.number;
  });
  this.getTokenAddress().subscribe((response) => {
    this.tokenContractAddress = response.address;
    this.updateTokenInfo();
  })
}

  updateTokenInfo() {
    if (!this.tokenContractAddress) return;
    //this.blockNumber = new Contract(this.tokenContractAdress, abi, this.userWallet ?? this.provider);
    this.tokenContract = new Contract(
      this.tokenContractAddress,
      tokenJson.abi,
      this.userWallet ?? this.provider
    );
    this.tokenTotalSupply = 'Loading...';
    this.tokenContract['totalSupply']().then((totalSupplyBN: BigNumber) => {
        const totalSupplyStr = utils.formatEther(totalSupplyBN);
        this.tokenTotalSupply = parseFloat(totalSupplyStr);
      })
    }

  clearBlock() {
      this.blockNumber = 0;
  }

  createWallet() {
    this.userWallet = Wallet.createRandom().connect(this.provider);
    this.userWallet.getBalance().then((balanceBN) => {
      const balanceStr = utils.formatEther(balanceBN);
      this.userEthBalance = parseFloat(balanceStr);
    });
  }

  requestTokens(amount: string) {
    //console.log("TODO: request token from the backend passing the address");
    const body = {address: this.userWallet?.address, amount: amount};
   this.http.post<{result: string}>(API_URL_MINT, body).subscribe((result) => {
    console.log('Request' + amount + 'tokens for address ' + this.userWallet?.address
    );
    console.log('Transaction hash:' + result.result);
  })
  }
}
