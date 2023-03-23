import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Wallet, ethers, utils } from 'ethers';

const API_URL = "http://localhost:3000/contract-address";

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
}
