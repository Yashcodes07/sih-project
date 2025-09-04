"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Home() {
  const router = useRouter();

  return (
    <>
   
    <section className="relative min-h-[100vh] flex items-center justify-center bg-white px-6 md:px-16">
      <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl w-full">
        
        {/* Left Side - Map */}
        <div className="flex justify-center">
          <div className="bg-white/20 backdrop-blur-md shadow-2xl rounded-2xl p-6">
            <img
              className="h-[65vh] w-auto object-contain drop-shadow-xl"
              src="/jharkhand.png"
              alt="Jharkhand Map"
            />
          </div>
        </div>

        {/* Right Side - Text */}
        <div className="flex flex-col gap-6 text-center md:text-left">
          <h1 className="text-black font-extrabold text-4xl md:text-6xl leading-tight drop-shadow-lg">
            Report Civic Issues, <br /> Make Your City Better
          </h1>
          <p className="text-black/70 text-xl text-semibold md:text-xl max-w-lg">
            Empowering citizens of Jharkhand to report and resolve civic problems faster. 
            Together, we can create cleaner and safer cities.
          </p>
          
          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            {/* <button className="px-6 py-3 bg-white text-red-500 font-semibold rounded-xl shadow-lg hover:bg-red-100 transition">
              Report an Issue
            </button> */}
            <button  onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-transparent border border-black text-black/65 font-semibold rounded-xl hover:bg-white/20 transition">
              View Reported Issues
            </button>
             
          </div>
        </div>
      </div>
    </section>
          <section className="min-h-[90vh] grid grid-cols-2 mx-auto bg-white">
        {/* <div className="flex justify-center flex-col ml-[5vw] gap-2 mt-20 text-white h-[84vh] px-5 md:px-0 text-xs md:text-base"> */}
        <div className="flex items-center justify-center flex-col  mt-20 mr-[10vw]">
          <span>
            <img className="ml-8 invertImg h-[75vh] w-[24vw]" src="/phones.png" alt="" />
          </span>
        </div>
        <div className="flex justify-center flex-col ml-[2vw] gap-2 mt-10">
          <p className="text-blue-800 font-bold text-5xl mr-10">Join The Revolution </p>
       
          <p className="text-gray-700 text-2xl">Empowering citizens of Jharkhand to report and resolve civic problems faster. 
            Together, we can create cleaner and safer cities.</p>
          <div className="input flex gap-4 ">
            <Link href="/">
              <div className="flex space-x-4">
                <a href="https://www.apple.com/in/app-store/" target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                    alt="Download on the App Store"
                    className="h-12"
                  />
                </a>
                <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Get it on Google Play"
                    className="h-12"
                  />
                </a>
              </div>


            </Link>
          </div>
        </div>
        {/* </div> */}
      </section>
       </>
  );
}
