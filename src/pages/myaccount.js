import { React, useEffect, useState }from 'react'
import Head from 'next/head';


import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdClose } from 'react-icons/md';


function Myaccount() {
  const router = useRouter()

  useEffect(() => {
    const myUser = JSON.parse(localStorage.getItem('myUser'))
    if(!myUser){
      router.push('/')
    }
    if(myUser && myUser.token){
      setUser(myUser)
      setEmail(myUser.email)
      fetchUser(myUser.token);
    }
  }, [])

  const [src, setSrc] = useState('https://t3.ftcdn.net/jpg/03/34/83/22/360_F_334832255_IMxvzYRygjd20VlSaIAFZrQWjozQH6BQ.jpg');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      const blob = new Blob([file])
      const img = URL.createObjectURL(blob);
      setSrc(img);
    }
  };


  const handleClickContainer = () => {
    const inputElement = document.getElementById('imageInput');
    inputElement.click();
  };


  const [user, setUser] = useState({value: null})
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [phoneno, setphoneNo] = useState('')
  const [streetAddress, setstreetAddress] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [taxRigNo, setTaxRigNo] = useState('')
  const [cpassword, setCpassword] = useState('')
  const [npassword, setNpassword] = useState('')
  const [cnpassword, setCnpassword] = useState('')


  const fetchUser = async(token) =>{
    // fetch the data from form to makes a file in local system
    const data = { token: token  };
      let res = await fetch(`/api/getuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      let response = await res.json()

      setFirstname(response.firstname)
      setLastname(response.lastname)
      setEmail(response.email)
      setphoneNo(response.phoneno)
      setState(response.state)
      setTaxRigNo(response.taxRigNo)
      setstreetAddress(response.streetAddress)
      setZip(response.zip)
  }


  const changeUserPassword = async (e) => {
    e.preventDefault()

    
    // fetch the data from form to makes a file in local system
    const data = { token: user.token, cpassword, npassword, cnpassword  };
    if( npassword !== cnpassword ){
      document.getElementById('checkPassword').innerHTML = "Your Password is not Match!"
    }
    else{
      document.getElementById('checkPassword').innerHTML = ""
      let res = await fetch(`/api/updatepassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        let response = await res.json()  
        if (response.success === true) {
          toast.success(response.message , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
          setCpassword('')
          setNpassword('')
          setCnpassword('')
        }
        else {
          toast.error(response.message , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
        }
        
    }
      
    

  }


  const submit = async (e) => {
    e.preventDefault()

    
    // fetch the data from form to makes a file in local system
    const data = { token: user.token, firstname, lastname, phoneno, streetAddress, state, zip, taxRigNo  };
   
      let res = await fetch(`/api/updateuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      let response = await res.json()  
      
        if (response.success === true) {
            toast.success(response.message , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
        }

        else {
            toast.error(response.message , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
        }

  }



  const handleChange = (e) => {
    if ( e.target.name === 'firstname') {
      setFirstname(e.target.value)
    }
    else if ( e.target.name === 'lastname') {
      setLastname(e.target.value)
    }
    else if ( e.target.name === 'email') {
      setEmail(e.target.value)
    }
    else if ( e.target.name === 'phoneno') {
      setphoneNo(e.target.value)
    }
    else if ( e.target.name === 'streetAddress') {
      setstreetAddress(e.target.value)
    }
    else if (e.target.name === 'state') {
      setState(e.target.value)
    }
    else if (e.target.name === 'taxRigNo') {
      setTaxRigNo(e.target.value)
    }
    else if (e.target.name === 'zip') {
      setZip(e.target.value)
    }
    else if (e.target.name === 'cpassword') {
      setCpassword(e.target.value)
    }
    else if (e.target.name === 'npassword') {
      setNpassword(e.target.value)
    }
    else if (e.target.name === 'cnpassword') {
      setCnpassword(e.target.value)
    }
  }

  
  return (
    <>
    <Head>
      <title>MyAccount_EjaratPro</title>
      <meta name="description" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
   </Head>
     {/* React tostify */}
    <ToastContainer position="bottom-center" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable theme="light"/>

    <section className="text-gray-600 bg-white body-font relative">
      <div className="container px-5 pb-36 mx-auto">
        
        <h1 className='text-center text-4xl text-gray-800 py-10'>Profile Settings</h1>
        <div className="lg:w-10/12 md:w-2/3 mx-auto">

          {/* Account Details */}
          <h1 className='pb-4 text-xl font-sans font-semibold text-indigo-700'>1. Account Details</h1>
          <form method='POST' onSubmit={submit}>
            <div className="flex space-y-3 flex-wrap -m-2">


              <div className='w-full sm:flex'>

                <div className='flex-col space-y-3 w-9/12'>
                  <div className="w-9/12">
                    <label htmlFor="name" className="leading-7 text-sm text-gray-600">First Name</label>
                    <input onChange={handleChange} value={firstname} type="text" id="firstname" name="firstname" className="w-full py-1 px-3 bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 leading-8 transition-colors duration-200 ease-in-out" />
                  </div>
                  <div className="w-9/12">
                    <div className="relative">
                        <label htmlFor="lastname" className="leading-7 text-sm text-gray-600">Last Name</label>
                        <input onChange={handleChange} value={lastname} type="text" id="lastname" name="lastname" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                    </div>
                  </div>
                </div>

                <div>

                  <div className="w-36 mt-3 h-[7rem] text-center">
                    <div className="relative w-52">
                      <img
                        className="w-36 h-40 rounded-lg absolute"
                        src={src}
                        alt=""
                      />
                      <div className="w-36 h-40 border-2 border-gray-400 flex flex-col ml-auto justify-between group hover:bg-gray-200 opacity-60 rounded-lg absolute cursor-pointer transition duration-500">
                        
                        <div className='flex flex-col ml-auto -mr-7 justify-end'>
                          <AiOutlineEdit onClick={handleClickContainer} className="text-gray-700 p-[3px] border-2 border-gray-300 bg-white rounded-full text-2xl"/>
                          <MdClose onClick={()=>setSrc('https://t3.ftcdn.net/jpg/03/34/83/22/360_F_334832255_IMxvzYRygjd20VlSaIAFZrQWjozQH6BQ.jpg')} className="text-gray-700 border-2 border-gray-300 bg-white rounded-full text-xl mt-[113px]"/>
                        </div>

                      </div>
                    </div>
                    <input
                      id="imageInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>

                </div>
              </div>

              <div className="w-6/12">
                <div className="relative">
                  <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
                  {user && user.token ? <input value={user.email} type="text" className="cursor-not-allowed w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" readOnly/>: 
                  <input onChange={handleChange} value={email} type="text" id="email" name="email" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" placeholder="your.email@gmail.com" required  />}
                </div>
              </div>
           
              <div className='w-full sm:flex space-x-3'>
                <div className="w-full">
                  <label htmlFor="phoneno" className="leading-7 text-sm text-gray-600">Phone No</label>
                  <input onChange={handleChange} value={phoneno} type="Number" id="phoneno" name="phoneno" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                </div>
                <div className="w-full">
                  <label htmlFor="taxRigNo" className="leading-7 text-sm text-gray-600">Tax Rig. No</label>
                  <input onChange={handleChange} value={taxRigNo} type="Number" id="taxRigNo" name="taxRigNo" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                </div>
              </div>
              <div className='w-full sm:flex space-x-3'>
                <div className="w-full">
                  <label htmlFor="streetAddress" className="leading-7 text-sm text-gray-600">Street Address</label>
                  <input onChange={handleChange} value={streetAddress} type="text" id="streetAddress" name="streetAddress" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                </div>
                <div className="w-full">
                  <label htmlFor="state" className="leading-7 text-sm text-gray-600">State</label>
                  <input onChange={handleChange} value={state} type="text" id="state" name="state" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                </div>
                <div className="w-full">
                  <label htmlFor="zip" className="leading-7 text-sm text-gray-600">Zip</label>
                  <input onChange={handleChange} value={zip} type="text" id="zip" name="zip" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                </div>

              </div>
              <div className="p-2 mt-3 md:mt-5 w-full bg-gray-50 rounded-md">
                <button type='submit' className="flex ml-auto items-center bg-indigo-600 text-white rounded-xl font-semibold border-0 py-2 px-8 focus:outline-none hover:bg-indigo-700 text-lg md:mt-0">Save</button>
              </div>
            </div>
          </form>

          {/* Password Setting */}
          <div className='mt-10'>
            <h1 className='pb-5 text-xl font-sans font-semibold text-indigo-700'>2. Change Password</h1>

            <form method='POST' onSubmit={changeUserPassword}>
            <div className="flex flex-wrap -m-2">
      
              <div className='w-full sm:flex'>
                <div className="p-2 w-full sm:w-1/2">
                  <div className="relative">
                    <label htmlFor="cpassword" className="leading-7 text-sm text-gray-600">Current Password</label>
                    <input onChange={handleChange} value={cpassword} type="password" id="cpassword" name="cpassword" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                  </div>
                </div>
                <div className="p-2 w-full sm:w-1/2">
                  <div className="relative">
                    <label htmlFor="npassword" className="leading-7 text-sm text-gray-600">New Password</label>
                    <input onChange={handleChange} value={npassword} type="password" id="npassword" name="npassword" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                  </div>
                </div>
                <div className="p-2 w-full sm:w-1/2">
                  <div className="relative">
                    <label htmlFor="cnpassword" className="leading-7 text-sm text-gray-600">Confirm New Password</label>
                    <input onChange={handleChange} value={cnpassword} type="password" id="cnpassword" name="cnpassword" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                  </div>
                </div>
              </div>
                <h1 id="checkPassword" className= 'text-sm text-red-600 ml-10 sm:ml-auto sm:mr-5 md:mr-0 lg:mr-24 xl:mr-28'></h1>

              <div className="p-2 mt-3 md:mt-5 w-full bg-gray-50 rounded-md">
                <button type='submit' className="flex ml-auto items-center bg-indigo-600 text-white rounded-xl font-semibold border-0 py-2 px-8 focus:outline-none hover:bg-indigo-700 text-lg md:mt-0">Save</button>
              </div>
            </div>
            </form>
          </div>
          
        </div>

      </div>
    </section>
    </>
  )
}





export default Myaccount