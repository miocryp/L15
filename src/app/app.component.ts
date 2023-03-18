import { Component } from '@angular/core';
import { ethers } from 'ethers';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  blockNumber: number | string | undefined;
  constructor() {
    this.blockNumber = "loading...";
    const provider = ethers.getDefaultProvider('goerli');
    provider.getBlock('latest').then((block) => {
      this.blockNumber = block.number;
    })
  }
}
