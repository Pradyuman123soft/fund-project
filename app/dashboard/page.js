"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
// import { fetchuser, updateProfile } from "@/actions/useractions";
import { createOrUpdateUser, getUser, deleteUser } from "@/actions/useractions";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";

export default function dashboard() {
  const { data: session } = useSession();
  // const [form, setform] = useState({});
  const [user, setUser] = useState(null);
  const { register, handleSubmit, setValue } = useForm();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    document.title = "Login - Get me a chai";
    // if (session) {
    //   getdata();
    // } else {
    //   router.push("/login");
    // }
    async function FetchData() {
      const userData = await getUser();
      if (userData) {
        setUser(userData);
        setValue("name", userData.name);
        setValue("username", userData.username);
        setValue("profilepic", userData.profilepic);
        setValue("coverpic", userData.coverpic);
        setValue("razorpayId", userData.razorpayId);
        setValue("razorpaySecret", userData.razorpaySecret);
      }
      setLoading(false);
    }
    FetchData();
  }, [setValue]);

  const onSubmit = async(data) => {
    const userData = {...data};
    const res = await createOrUpdateUser(userData);
    if(res.error){
      setMessage("Error in Updation and Creation");
    }else{
      setUser(res.user);
      setMessage("Signup successful");
      
        toast("Profile Updated!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
    }
  }

  const handleDelete = async() =>{
    await deleteUser();
    setUser(null);
    setMessage("user Deleted");
    toast("Profile Deleted!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  }

  // const getdata = async () => {
  //   if (session?.user?.email) {
  //     let Name = session.user.email.split("@")[0];
  //     let u = await fetchuser(Name);
  //     setform(u);
  //   } else {
  //     console.error("User Email not available");
  //   }
  // };
  // const handleChange = (e) => {
  //   setform({ ...form, [e.target.name]: e.target.value });
  // };

//   const handleSubmit1 = async (e) => {
//     e.preventDefault(); // Prevent the default form submission behavior
//     const formData = new FormData(e.target);
//     // e.target refers to the form element that triggered the event (usually in a submit event).
// // new FormData(e.target) creates a FormData object that collects all input values from the form, including text fields, checkboxes, and file uploads.
//     const plainData = Object.fromEntries(formData.entries());
//     // formData.entries() returns an iterator of key-value pairs (like name: value) from the form.
// // Object.fromEntries(...) converts the iterator into a plain JavaScript object.

//     if (session?.user?.email) {
//       let result = await updateProfile(plainData, session.user.name);

//       if (result.error) {
//         console.error(result.error);
//       } else {
//         toast("Profile Updated!", {
//           position: "top-right",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "light",
//           transition: Bounce,
//         });
//       }
//     } else {
//       console.error("User email not available");
//     }
//   };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition="Bounce"
      ></ToastContainer>
      <div className="container mx-auto flex flex-col gap-5 items-center">
        <h1 className="font-bold md:text-3xl text-2xl">
          Welcome To your Dashbard
        </h1>
        <div className="form">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <div className="flex flex-col md:w-96 w-64">
              <label htmlFor="Full Name">Full Name</label>
              <input
                {...register("name")}
                type="text"
                className="bg-slate-700 rounded-md pl-4"
                name="name"
                id="name"
              />
            </div>
            <div className="flex flex-col md:w-96 w-64">
              <label htmlFor="Full Name">Email</label>
              <input
                className="bg-slate-700 rounded-md pl-4"
                type="email"
                name="email"
                id="email"
                value={session?.user?.email }
                disabled
              />
            </div>
            <div className="flex flex-col md:w-96 w-64">
              <label htmlFor="Full Name">Username</label>
              <input
               {...register("username")}
                type="text"
                className="bg-slate-700 rounded-md pl-4"
                name="username"
                id="username"
              />
            </div>
            <div className="flex flex-col md:w-96 w-64">
              <label htmlFor="Full Name">Profile Pictue URL</label>
              <input
               {...register("profilepic")}
                type="url"
                className="bg-slate-700 rounded-md pl-4"
                name="profilepic"
                id="profilepic"
              />
            </div>
            <div className="flex flex-col md:w-96 w-64">
              <label htmlFor="Full Name">Cover Picture URL</label>
              <input
               {...register("coverpic")}
                type="url"
                className="bg-slate-700 rounded-md pl-4"
                name="coverpic"
                id="coverpic"
              />
            </div>
            <div className="flex flex-col md:w-96 w-64">
              <label htmlFor="Full Name">RazorPay ID</label>
              <input
                {...register("razorpayId")}
                type="text"
                className="bg-slate-700 rounded-md pl-4"
                name="razorpayId"
                id="razorpayId"
              />
            </div>
            <div className="flex flex-col md:w-96 w-64">
              <label htmlFor="Full Name">RazorPay Secret</label>
              <input
               {...register("razorpaySecret")}
                type="text"
                className="bg-slate-700 rounded-md pl-4"
                name="razorpaySecret"
                id="razorpaySecret"
              />
            </div>
            <div>
              <button
                type="submit"
                className="text-white bg-gradient-to-r md:w-96 w-64 from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                save
              </button>
            </div>
            <div>
              <button
                onClick={handleDelete}
                className="text-white bg-gradient-to-r md:w-96 w-64 from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Delete Data
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// export default Dashboard;
