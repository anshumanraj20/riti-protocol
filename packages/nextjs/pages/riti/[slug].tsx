import { useEffect } from "react";
import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import PosterImage from "../../components/assets/poster-image.png";
import type { NextPage } from "next";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "wagmi";
import { useAccount } from "wagmi";
import { BellIcon, BugAntIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const userNames = ["Akshay", "Manthan", "Riya", "Deployer"];

const Home: NextPage = () => {
  const { address } = useAccount();

  const getUserRitisResp = useScaffoldContractRead({
    contractName: "RitiProtocol",
    functionName: "getUserRitis",
    args: [address],
  });

  console.log("getUserRitisResp", getUserRitisResp.data);


  const {
    query: { slug },
  } = useRouter();

  const currentRiti = getUserRitisResp.data?.find(riti => {
    return riti.id === BigInt(Number(slug));
  });

  let progress;
  if (currentRiti?.state.refreshCount && currentRiti?.config.maxRefreshCount && currentRiti?.config.maxRefreshCount > 0) {
    progress = currentRiti?.state.refreshCount / currentRiti?.config.maxRefreshCount;
  }

  const earningType = Number(progress) === 1 ? "Final" : "Expected";

  const getAllRitisResp = useScaffoldContractRead({
    contractName: "RitiProtocol",
    functionName: "getAllRitis",
  });


  const scoreResp = useScaffoldContractRead({
    contractName: "RitiProtocol",
    functionName: "getScoresForRiti",
    args: [BigInt(Number(slug))],
  });

  const userEarnings = useScaffoldContractRead({
    contractName: "RitiProtocol",
    functionName: "getEarningsForAllUsersInRiti",
    args: [BigInt(Number(slug))],
  });

  console.log(userEarnings.data, "userEarnings.data");

  const findEarningByAddress = (address: string) => {
    const obj = userEarnings.data?.find(earning => {
      return earning.userAddress === address;
    });
    return Number(obj?.earning || 0);
  };

  const sortedbyScore = Array.from(scoreResp.data || []).sort((a, b) => {
    return Number(b.score) - Number(a.score);
  });

  const getCurrentRitiData = getUserRitisResp.data?.find(riti => {
    return riti.id === BigInt(Number(slug));
  });

  const ritiDatesForMonth = getCurrentRitiData?.state.ritiCompletions.slice(0, 30).map(ritiCompletion => {
    return ritiCompletion.completionStatus;
  });
  const calendarValues = ritiDatesForMonth?.map((ritiDate, idx) => {
    return {
      date: `2023-12-${idx}`,
      count: 1,
    };
  });

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="flex-grow w-full px-8 py-12">
          <div className="flex justify-center items-start gap-12 flex-col sm:flex-row">
            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Score</th>
                    <th>Rank</th>
                    <th>Earning - {earningType}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  {sortedbyScore?.map((score, idx) => {
                    return (
                      <tr>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle w-12 h-12">
                                <img
                                  src={`https://ui-avatars.com/api/?name=${userNames[idx]}&background=random&rounded=true&size=128`}
                                  alt="Avatar Tailwind CSS Component"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{score.userAddress.toString()}</div>
                              <div className="text-sm text-neutral">{userNames[idx]}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">{score.score.toString()}</td>
                        <td className="text-center">{idx + 1}</td>

                        <td className="text-center">{findEarningByAddress(score.userAddress)} WEI</td>

                        {/* <th>
                    <button className="btn btn-ghost btn-xs">details</button>
                  </th> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div
              style={{
                width: "500px",
              }}
            >
              <CalendarHeatmap
                startDate={new Date("2023-10-01")}
                endDate={new Date("2023-12-30")}
                values={Array.from(calendarValues || [])}
              />
            </div>
          </div>
        </div>
        {/* <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/pages/index.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              RitiProtocol.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p>
        </div> */}

        <div className="flex-grow w-full px-8 py-12">
          <div className="flex justify-center items-start gap-12 flex-col sm:flex-row">
            {/* card */}
            <div className="flex flex-row bg-base-100 text-center items-center rounded-md p-2 max-w-xl">
              <div className="">
                <Image width={400} height={270} src={PosterImage} alt="join poster" />
              </div>
              <div
                className="ml-2"
                style={{
                  maxHeight: "380px",
                  overflowY: "scroll",
                }}
              >
                <div className="hover:bg-secondary hover:rounded-lg text-start py-2 px-3">
                  <p className="font-semibold">Frontend Challenge</p>
                  <p className="font-normal	text-neutral">Re-usable components built using Radix UI and Tailwind CSS</p>
                </div>

                {getAllRitisResp.data?.map(riti => {
                  return (
                    <div className="hover:bg-secondary hover:rounded-lg text-start py-2 px-3">
                      <p className="font-semibold">{riti.config.platformConfig.platformName}</p>
                      <p className="font-normal	text-neutral">
                        Re-usable components built using Radix UI and Tailwind CSS
                      </p>
                    </div>
                  );
                })}

                {/* <div className="hover:bg-secondary hover:rounded-lg text-start py-2 px-3">
                  <p className="font-semibold">Frontend Challenge</p>
                  <p className="font-normal	text-neutral">Re-usable components built using Radix UI and Tailwind CSS</p>
                </div>

                <div className="hover:bg-secondary hover:rounded-lg text-start py-2 px-3">
                  <p className="font-semibold">Frontend Challenge</p>
                  <p className="font-normal	text-neutral">Re-usable components built using Radix UI and Tailwind CSS</p>
                </div> */}
              </div>
            </div>
            <div className="flex flex-col bg-base-100 p-4 text-center items-start max-w-xl rounded-md">
              <h2 className="font-bold text-xl">Community</h2>

              <div className="mt-4">
                <div className="flex justify-between">
                  <p className="font-semibold my-1">The Cinnamon Challenge by Groove</p>
                  <div className="flex items-center">
                    <CalendarIcon className="h-6 w-6 fill-secondary" />
                    <div className="ml-3 mr-3">10 Dec</div>
                    | <BellIcon className="ml-2 h-6 w-6 fill-secondary" />
                  </div>
                </div>
                <p className="font-light my-1 text-start">
                  Full | Mid-tempo funk groove with flute, trombone & crazy horn breaks
                </p>
              </div>

              {/* card repeat */}
              <div className="mt-4">
                <div className="flex justify-between">
                  <p className="font-semibold my-1">The Cinnamon Challenge by Groove</p>
                  <div className="flex items-center">
                    <CalendarIcon className="h-6 w-6 fill-secondary" />
                    <div className="ml-3 mr-3">10 Dec</div>
                    | <BellIcon className="ml-2 h-6 w-6 fill-secondary" />
                  </div>
                </div>
                <p className="font-light my-1 text-start">
                  Full | Mid-tempo funk groove with flute, trombone & crazy horn breaks
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
