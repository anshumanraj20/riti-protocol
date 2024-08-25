import { useEffect } from "react";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import PosterImage from "../components/assets/poster-image.png";
import { CONSTANTS, PushAPI } from "@pushprotocol/restapi";
import type { NextPage } from "next";
import "wagmi";
import { useAccount } from "wagmi";
import { BellIcon, BugAntIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useEthersSigner } from "~~/hooks/useeEthersSigner";

interface NotifT {
  message: string;
  title: string;
}
interface StreamT {
  message: {
    notification: {
      body: string;
      title: string;
    };
  };
}

const ScoreCard = ({
  name,
  ritiId,
  progPercent,
  currentStreak,
}: {
  name: string;
  ritiId: bigint;
  progPercent: bigint;
  currentStreak: bigint;
}) => {
  const { address } = useAccount();

  const scoreResp = useScaffoldContractRead({
    contractName: "RitiProtocol",
    functionName: "getScoresForRiti",
    args: [ritiId],
  });

  const sortedbyScore = Array.from(scoreResp.data || []).sort((a, b) => {
    return Number(b.score) - Number(a.score);
  });

  // position in array becomes rank, by addresss,  find by address
  const rankByAddress = sortedbyScore.findIndex(score => {
    return score.userAddress === address;
  });

  return (
    <Link href={`/riti/${ritiId}`}>
      <div
        style={{
          minWidth: "300px",
        }}
        className="flex flex-col bg-base-100 px-4 py-4 text-center items-start max-w-md rounded-2xl"
      >
        <div className="flex items-center justify-center">
          <BugAntIcon className="h-8 w-8 fill-secondary" />
          <p className="ml-2 font-semibold">{name}</p>
        </div>
        <div className="flex items-center justify-between w-full font-bold text-lg">
          <div className="font-bold">{Number(progPercent)}%</div>
          <div className="flex items-center justify-between">
            <p>🔥{Number(currentStreak)}</p>
            <p className="m-4">#{rankByAddress + 1}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Home: NextPage = () => {
  const { address } = useAccount();

  const getUserRitisResp = useScaffoldContractRead({
    contractName: "RitiProtocol",
    functionName: "getUserRitis",
    args: [address],
  });

  const getAllRitisResp = useScaffoldContractRead({
    contractName: "RitiProtocol",
    functionName: "getAllRitis",
  });

  const signer = useEthersSigner();
  const [notifications, setNotifications] = React.useState<NotifT[]>([]);

  const [realTimeNotif, setRealTimeNotif] = React.useState<{ body: string; title: string }[]>([]);

  // const userAlice = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.STAGING });

  useEffect(() => {
    if (realTimeNotif.length > 0) {
      setTimeout(() => {
        setRealTimeNotif(prev => prev.slice(1));
      }, 5000);
    }
  }, [realTimeNotif]);

  useEffect(() => {
    if (!signer) return;
    async function connect() {
      const user = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.STAGING });

      // // channel creation
      const response = await user.notification.list("INBOX");
      console.log("notif ", response);
      setNotifications(response);

      // await user.notification.subscribe(`eip155:11155111:0xdb184BC69B61b279c541189b5D698b31618dF1De`);

      const stream = await user.initStream([CONSTANTS.STREAM.NOTIF], {
        filter: {
          channels: ["*"], // pass in specific channels to only listen to those
          chats: ["*"], // pass in specific chat ids to only listen to those
        },
        connection: {
          retries: 3, // number of retries in case of error
        },
        raw: false, // enable true to show all data
      });

      // Listen for notifications events
      stream.on(CONSTANTS.STREAM.NOTIF, (data: StreamT) => {
        console.log(data, "-- stream data --", data);
        setRealTimeNotif(prev => [...prev, data.message.notification]);
      });

      // Connect stream, Important to setup up listen events first
      stream.connect();

      // send notif to channel
      console.log("user", await user.channel.info());
    }
    connect();
  }, [signer]);

  return (
    <>
      <MetaHeader />
      <div
        style={{
          position: "absolute",
          right: "0",
          left: "0",
          maxWidth: "460px",
          bottom: "0px",
        }}
      >
        {realTimeNotif.map(notif => {
          return (
            <div role="alert" className="alert shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-info shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <div>
                <h3 className="font-bold">{notif.title}</h3>
                <div className="text-xs">{notif.body}</div>
              </div>
              {/* <button className="btn btn-sm">See</button> */}
            </div>
          );
        })}
      </div>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="flex-grow w-full px-8">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <h2 className="font-bold text-xl">Your Ritis</h2>
            {getUserRitisResp.data?.map(riti => {
              if (riti.config.maxRefreshCount < 1) return;
              return (
                <ScoreCard
                  name={riti.config.platformConfig.platformName}
                  ritiId={riti.id}
                  progPercent={(riti.state.refreshCount / riti.config.maxRefreshCount) * BigInt(100)}
                  currentStreak={riti.state.refreshCount}
                />
              );
            })}
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
            <div
              style={{
                height: "390px",
                overflowY: "scroll",
              }}
              className="flex flex-col bg-base-100 p-4 text-center items-start max-w-xl rounded-md"
            >
              <h2 className="font-bold text-xl">Your Updates</h2>

              {notifications.map(notif => {
                return (
                  <div className="mt-4 w-full">
                    <div className="flex justify-between">
                      <p className="font-semibold my-1">{notif.title}</p>
                      <div className="flex items-center">
                        {/* <CalendarIcon className="h-6 w-6 fill-secondary" /> */}
                        {/* <div className="ml-3 mr-3">10 Dec</div> */}
                        <BellIcon className="ml-2 h-6 w-6 fill-secondary" />
                      </div>
                    </div>
                    <p className="font-light my-1 text-start">{notif.message} </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
