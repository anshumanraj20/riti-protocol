# <img width="58px" src="https://devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2Fbecdb269b9ea4e708c7d96329563e478%2Fprojects%2F3e3a7bacbe0e48c88d45b43d20d89fd1%2F2b9bb50f-9d0e-4da5-96ca-1ffb3b9c15de.jpeg&w=1440&q=75"/> Riti Protocol - Habit-making-as-a-Service

<h4 align="center">
  <a href="https://devfolio.co/projects/riti-protocol-habitmakingasaservice-a9c1">Devfolio link</a> 
</h4>

🧪 Effortlessly integrate habit formation into your application. Enable users to compete with each other and reap rewards for their commitment!

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/scaffold-eth/scaffold-eth-2.git
cd scaffold-eth-2
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.
