import { HardhatRuntimeEnvironment } from "hardhat/types";
import { RitiProtocol } from "../typechain-types";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";


var m_w = 123456789;
var m_z = 987654321;
var mask = 0xffffffff;

// Takes any integer
function seed(i:number) {
    m_w = (123456789 + i) & mask;
    m_z = (987654321 - i) & mask;
}

// Returns number between 0 (inclusive) and 1.0 (exclusive),
// just like Math.random().
function random()
{
    m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
    var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
    result /= 4294967296;
    return result;
}

const seedData = async function (hre: HardhatRuntimeEnvironment) {

    const { deployer } = await hre.getNamedAccounts();
  
    const yourContract: RitiProtocol = await hre.ethers.getContract("RitiProtocol", deployer);

    const deployerSigner = await hre.ethers.getSigner(deployer);

    const deployerPushApi = await PushAPI.initialize(
      deployerSigner, 
      { 
          env: CONSTANTS.ENV.STAGING 
     });

  
    //  await deployerPushApi.channel.create({
    //   name: "RitiProtocol Channel | Eth india",
    //   description: "Eth India, team EtherYogis.",
    //   icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC",
    //   url: "https://push.org",
    //  });

     const addedDelegate = await deployerPushApi.channel.delegate.add(
      `eip155:11155111:${yourContract.address}`,
     );

    await yourContract.createRiti(
        {
          "lastUpdated": 1,
          "startTime": 1,
          "maxRefreshCount": 10,
          "stakeAmount": 1000000000,
          "frequency": 0,
          "platformConfig": {
            "platformName": "Leetcode"
          }
        },
        {
          gasLimit: 1000000
        }
    );
  
    await yourContract.createRiti(
      {
        "lastUpdated": 1,
        "startTime": 1,
        "maxRefreshCount": 10,
        "stakeAmount": 1000000000,
        "frequency": 0,
        "platformConfig": {
          "platformName": "Cultfit"
        }
      },
      {
        gasLimit: 1640000
      }
    );
  
      await yourContract.createRiti(
        {
          "lastUpdated": 1,
          "startTime": 1,
          "maxRefreshCount": 10,
          "stakeAmount": 1000000000,
          "frequency": 0,
          "platformConfig": {
            "platformName": "Cycling",
          }
        },
        {
          gasLimit: 1640000
        }
    );

    // sleep for 20s
     await new Promise(r => setTimeout(r, 10000));    

    const accounts = await hre.getNamedAccounts();
    console.log(accounts);
    const objectKeys = Object.keys(accounts);
  
  
      for (let i = 0; i < objectKeys.length; i++) {
  
        const account = accounts[objectKeys[i]];
        const accountPushApi = await PushAPI.initialize(
          deployerSigner, 
          { 
              env: CONSTANTS.ENV.STAGING 
        });


        const response = await accountPushApi.notification.subscribe(
          `eip155:11155111:0xdb184BC69B61b279c541189b5D698b31618dF1De`,
        );

        console.log(response);
        
        const yourContract: RitiProtocol = await hre.ethers.getContract("RitiProtocol", account);

        for(let j=0;j<3;j++){
          // 4
          // call join reeti with j, and pass user info as address and username as account object key
          // pay value that is in config of contract
          console.log("Joining Riti", j, "for user", account);

          const ritiCur = await yourContract.getRiti(j);
          // console.log(ritiCur);
          await yourContract.joinRiti(j, {
            userAddress: account,
            platformUsername: objectKeys[i],
          }, 
            {
              value: ritiCur.config.stakeAmount,
              from: account,
            }
          );
        }
      }

      await new Promise(r => setTimeout(r, 10000));
  
      // call refresh on riti for maxRefreshCount times, do it for all ritis, have timeout of 3s between each refresh.
      // call all of them togeather, not sepeartely
  
      let ritiCount = 3; 
      let randomValuesMap = new Map<number, Map<string, number>>();
  
  
      for(let i=0; i<ritiCount; i++){
        const yourContract: RitiProtocol = await hre.ethers.getContract("RitiProtocol", deployer);
        const riti = await yourContract.getRiti(i);
        const ritiUsers = riti.userInfo;

        console.log(riti.userInfo);
      
        let userRandomValuesMap = new Map();
        // Assign a random value between 0 and 1 for each user in the riti
        for(let user of ritiUsers) {
          await new Promise(r => setTimeout(r, 500));
          userRandomValuesMap.set(user.userAddress, Math.random() + 0.1)
        }
      
        randomValuesMap.set(i, userRandomValuesMap);
      }
    
    console.log(randomValuesMap);
   while(true){
        let isUpdated  = false;
        await new Promise(r => setTimeout(r, 4000));
  
        for(let i=0;i<ritiCount;i++){
          const yourContract: RitiProtocol = await hre.ethers.getContract("RitiProtocol", deployer);
          const riti = await yourContract.getRiti(i);
          if(riti.state.status == 2){
            continue;
          }
          isUpdated= true;
          const ritiUsers = riti.userInfo;

          console.log(ritiUsers);
        
          let refreshRitiData: RitiProtocol.UserRitiInformationStruct[] = [];

          const time = Date.now();
    
            // generate ramdom RitiCompletionDataStruct for all users
            for(let j =0; j<ritiUsers.length; j++) {
              const user = ritiUsers[j];
                const randomValue = Math.random();
                const randomm = randomValue <= (randomValuesMap.get(i)?.get(user.userAddress)!!);
                // console.log(user.platformUsername);
                console.log(user.platformUsername + (randomm ? " completed" : " not completed") + " task on " + riti.config.platformConfig.platformName + " at time "  + time
                );

                refreshRitiData.push({
                  userAddress: user.userAddress,
                  isComplete: randomm
                });
            }
            
            await yourContract.refreshRiti({
              ritiId: i,
              data: {
                dataCollectionTimestamp: time,
                completionStatus: refreshRitiData
              }
            },
            {
              gasLimit: 1640000
            }
            );
          }
         
      if(!isUpdated){
        break;
      }
    }
  
  };

const hre = require("hardhat");

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
seedData(hre).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});