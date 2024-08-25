import React, { DialogHTMLAttributes } from "react";
import Image from "next/image";
import Link from "next/link";
import PosterImage from "../components/assets/poster-image.png";
import type { NextPage } from "next";
import { BellIcon, BugAntIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";

const ScoreCard = () => {
  return (
    <div className="flex flex-col bg-base-100 px-4 py-4 text-center items-start max-w-md rounded-2xl w-60">
      <div className="flex items-center justify-center">
        <BugAntIcon className="h-8 w-8 fill-secondary" />
        <p className="ml-2 font-semibold">Create Riti</p>
      </div>
      <div className="flex items-center justify-between w-full font-bold text-lg">
        <div className="font-bold"></div>
        <div className="flex items-center justify-between ">
          <p className="m-4"></p>
        </div>
      </div>
    </div>
  );
};

const AddRitiButton = (): JSX.Element => {
  const inputRefs = {
    maxRefreshCount: React.useRef<HTMLInputElement>(null),
    frequency: React.useRef<HTMLInputElement>(null),
    startTime: React.useRef<HTMLInputElement>(null),
    platformName: React.useRef<HTMLInputElement>(null),
    stakeAmout: React.useRef<HTMLInputElement>(null),
  };

  const handleForm = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const dataToSubmit = {
      lastUpdated: new Date().toISOString(),
      startTime: inputRefs.startTime.current?.value,
      maxRefreshCount: inputRefs.maxRefreshCount.current?.value,
      stakeAmount: inputRefs.stakeAmout.current?.value,
      frequency: inputRefs.frequency.current?.value,
      platformConfig: {
        platformName: inputRefs.platformName.current?.value,
      },
    };
    console.log(dataToSubmit, "dataToSubmit");
  };
  return (
    <>
      <button
        className="btn"
        onClick={(): void => {
          const modal = document.getElementById("my_modal_1") as HTMLDialogElement;
          if (!modal) return;
          modal.showModal();
        }}
      >
        Create Riti +
      </button>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create Riti</h3>
          <div className="py-4">
            <p>Add Details to Create a Riti</p>
            {/* ---- */}
            <div className="w-full mt-5 sm:mt-8">
              <div className="mx-auto w-full sm:max-w-md md:max-w-lg flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Enter Max Refresh Count"
                    className="input input-accent w-full max-w-xs text-neutral placeholder:text-neutral/40"
                    ref={inputRefs.maxRefreshCount}
                  />
                  <input
                    type="text"
                    placeholder="Enter Frequency"
                    className="input input-accent w-full max-w-xs text-neutral placeholder:text-neutral/40"
                    ref={inputRefs.frequency}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Enter Start Time"
                  className="input input-accent w-full max-w-xs text-neutral placeholder:text-neutral/40"
                  ref={inputRefs.startTime}
                />
                <input
                  ref={inputRefs.platformName}
                  type="text"
                  placeholder="Enter Platform Name"
                  className="input input-accent w-full max-w-xs text-neutral placeholder:text-neutral/40"
                />
                <input
                  type="text"
                  placeholder="Enter Stake Amount"
                  className="input input-accent w-full max-w-xs text-neutral placeholder:text-neutral/40"
                  ref={inputRefs.stakeAmout}
                />
              </div>

              <button onClick={handleForm} className="btn btn-active btn-block max-w-[150px] mt-8">
                Create Riti+
              </button>
            </div>

            {/* ---- */}
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="flex-grow w-full px-8">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <AddRitiButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
