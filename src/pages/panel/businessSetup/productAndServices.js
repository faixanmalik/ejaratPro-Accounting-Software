import React, {useState, Fragment, useRef, useEffect} from 'react'
import Product from 'models/Product';
import mongoose from "mongoose";
import { XMarkIcon } from '@heroicons/react/24/outline'
import {Dialog, Transition } from '@headlessui/react'
import Link from 'next/link';
import Charts from 'models/Charts';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ProSidebarProvider } from 'react-pro-sidebar';
import FullLayout from '@/panel/layouts/FullLayout';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';

import { BiExport, BiImport } from 'react-icons/bi';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import {XLSX, read, utils} from 'xlsx';
import TaxRate from 'models/TaxRate';
import { Switch } from "@material-tailwind/react";
import useTranslation from 'next-translate/useTranslation';



const ProductAndServices = ({ locale,  setIsLoading, userEmail, product, charts, dbTaxRate}) => {

  const [open, setOpen] = useState(false)

  const { t } = useTranslation('businessSetup')

  const [id, setId] = useState('')
  const [selectedIds, setSelectedIds] = useState([]);

  // authentications
  const [isAdmin, setIsAdmin] = useState(false)
  const [isOpenSaveChange, setIsOpenSaveChange] = useState(true)
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [filteredCharts, setFilteredCharts] = useState([])

  useEffect(() => {
    const myUser = JSON.parse(localStorage.getItem('myUser'))
    if(myUser.department === 'Admin'){
      setIsAdmin(true)
    }

    let filteredInvoices = product.filter((item)=>{
      return item.userEmail === userEmail;
    })
    setFilteredInvoices(filteredInvoices)

    let filteredCharts = charts.filter((item)=>{
      return item.userEmail === userEmail;
    })
    setFilteredCharts(filteredCharts)
    setIsLoading(false)

  }, [userEmail]);

  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e) => {
    const inputValue = e.target.value;

    setSearchInput(inputValue);
    
    let filtered = product.filter(item => item.userEmail === userEmail);
    
    if (inputValue != '') {
      filtered = filtered.filter(item => {
        return item.name.toLowerCase().includes(inputValue.toLowerCase())
      });
    }

    setFilteredInvoices(filtered);
  };



  function handleRowCheckboxChange(e, id) {
    if (e.target.checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(rowId => rowId !== id));
    }
  }

  const tableRef = useRef(null);
  const hiddenFileInput = React.useRef(null);
  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  const handleFileChange = (e)=>{
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryData = event.target.result;
      const workbook = read(binaryData,{type:'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const parsedData = utils.sheet_to_json(worksheet, {header: 1});

      const header = ['sr','code', 'name', 'costPrice', 'salesPrice' , 'qty']

      const heads = header.map((head, index) => ({ title: head, entry: head, key: index }));


      parsedData.splice(0,1)
      convertToJson(header, parsedData)
    };
    reader.readAsBinaryString(file);
  }

  const convertToJson = (header, data)=>{
    setIsLoading(true)
    const row = [];
    data.forEach(element => {
      const rowData = {};
      element.forEach((element, index) => {
        rowData[header[index]] = element;
      });
      row.push(rowData);
    });
    importEntries(row)
  }

  const importEntries = async(row)=>{
    const data = { row, path:'productAndServices', importEntries:'importEntries' };
      let res = await fetch(`/api/addEntry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      let response = await res.json()
      setIsLoading(false)

      if(response.success === true){
        toast.success(response.message , { position: "top-right", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      else {
        toast.error(response.message , { position: "top-right", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
      }
  }

  function handleLinkedCheck(e) {
    if (e.target.checked) {
      setLinkedCheck(true);
    } else {
      setLinkedCheck(false);
    }
  }

  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [linkAccount, setLinkAccount] = useState('')
  const [linkContract, setLinkContract] = useState(false)
  const [desc, setdesc] = useState('')
  const [linkedCheck, setLinkedCheck] = useState('')


  const handleChange = (e) => {
    if(e.target.name === 'code'){
      setCode(e.target.value)
    }
    else if(e.target.name === 'name'){
      setName(e.target.value)
    }
    else if(e.target.name === 'linkAccount'){
      setLinkAccount(e.target.value)
    }
    else if(e.target.name === 'linkContract'){
      setLinkContract(e.target.value)
    }
    else if(e.target.name === 'desc'){
        setdesc(e.target.value)
    }
  
  }

  const submit = async(e)=>{
    e.preventDefault()
    setIsLoading(true)

    // fetch the data from form to makes a file in local system
    const data = { userEmail, code, name, linkAccount, linkContract, desc, path: 'productAndServices'  };

    let res = await fetch(`/api/addEntry`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    let response = await res.json()
    setIsLoading(false)
    if (response.success === true) {
      toast.success(response.message , { position: "top-right", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
    }
    else {
      toast.error(response.message , { position: "top-right", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
    }
  }

  const getData = async (id) =>{
    setOpen(true)
    setIsLoading(true)
    setIsOpenSaveChange(false)

    const data = { id, path: 'productAndServices' };
    let res = await fetch(`/api/getDataEntry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      let response = await res.json()
      setIsLoading(false)

      if (response.success === true){
        setId(response.product._id)

        setCode(response.product.code)
        setName(response.product.name)
        setLinkAccount(response.product.linkAccount)
        setLinkContract(response.product.linkContract)
        setdesc(response.product.desc)
      }
      else{
        toast.error(response.message , { position: "top-right", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: false, draggable: true, progress: undefined, theme: "light", });
      }
  }

  const delEntry = async()=>{

    setIsLoading(true)
    const data = { selectedIds, path: 'productAndServices' };

    let res = await fetch(`/api/delEntry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      let response = await res.json()
      setIsLoading(false)
      
      if (response.success === true) {
        toast.success(response.message , { position: "top-right", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      else {
        toast.error(response.message , { position: "top-right", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
      }
    
  }

  const editEntry = async(id)=>{

    setIsLoading(true)

    const data = { id, code, name, linkAccount, linkContract, desc , path: 'productAndServices' };
    let res = await fetch(`/api/editEntry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      let response = await res.json()
      setIsLoading(false)
      
      if (response.success === true){
        toast.success(response.message , { position: "top-right", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      else {
        toast.error(response.message , { position: "top-right", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: false, draggable: true, progress: undefined, theme: "light", });
    }
      
    
  }
  

  return (
    <>
    <ProSidebarProvider>
    <style jsx global>{`
        footer {
          display: none;
        }
        header {
          display: none;
        }
      `}</style>
    <FullLayout>
    {/* React tostify */}
    <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light"/>

    <div className="mt-10 sm:mt-0">
      <div className="md:grid md:grid-cols-1 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0 flex justify-between">
            <h3 className="text-lg font-bold leading-6 text-gray-900">{t('productTitle')}</h3>
            <button onClick={()=>{
              setOpen(true);
              setCode('');
              setName('');
              setLinkAccount('');
              setLinkContract('');
              setdesc('');
              setIsOpenSaveChange(true)
            }} 
              className={`${isAdmin === false ? 'cursor-not-allowed': ''} bg-blue-800 hover:bg-blue-900 text-white px-14 py-2 rounded-lg`} disabled={isAdmin === false}>
              {t('new')}
            </button>
          </div>
        </div>
        <div className="mt-2 md:col-span-2 md:mt-0">
          <div className='flex justify-between'>

            <div className='w-full'>
              <input
                type="text"
                value={searchInput}
                className='w-1/2 bg-transparent text-gray-700 border-2 border-blue-800 outline-none font-semibold rounded-lg text-sm px-3 py-2 mb-2'
                onChange={handleSearch}
                placeholder="Search..."
              />
            </div>
            <div className='flex items-center space-x-2 rtl:space-x-reverse mb-1'>
              <div className=''>
                <button type="button" onClick={delEntry}
                className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2`} disabled={isAdmin === false}
                >
                  {t('delete')}
                  <AiOutlineDelete className='text-lg ml-2'/>
                </button>
              </div>
              <div>
                <DownloadTableExcel
                  filename="Products and Services"
                  sheet="Products and Services"
                  currentTableRef={tableRef.current}>
                  <button type="button" className="text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2">
                    {t('export')}
                    <BiExport className='text-lg ml-2'/>
                  </button>

                </DownloadTableExcel>
              </div>
              <div className=''>
                <button type="button" onClick={handleClick} 
                  className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2`} disabled={isAdmin === false}>
                    {t('import')}
                  <BiImport className='text-lg ml-2'/>
                </button>
                <input type="file"
                  ref={hiddenFileInput}
                  onChange={handleFileChange}
                  style={{display:'none'}} 
                /> 
              </div>
              
            </div>
          </div>
          <form method="POST">
            <div className="overflow-hidden shadow sm:rounded-md">
              <div className="overflow-x-auto shadow-sm">
                <table className="w-full text-sm text-left text-gray-500" ref={tableRef}>
                    <thead className="text-xs text-gray-700 uppercase bg-[#e9ecf7]">
                        <tr>
                          <th scope="col" className="p-4">
                            <div className="flex items-center">
                              <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            </div>
                          </th>
                          <th scope="col" className="px-6 py-3">
                            {t('sr')}
                          </th>
                          <th scope="col" className="px-6 py-3">
                            {t('code')}
                          </th>
                          <th scope="col" className="px-6 py-3">
                            {t('name')}
                          </th>
                          <th scope="col" className="px-6 py-3">
                              {t('linkedAccount')}
                          </th>
                          <th scope="col" className="px-6 py-3">
                              {t('linkedContract')}
                          </th>
                          <th scope="col" className="px-6 py-3">
                              {t('viewOrEdit')}
                          </th>
                        </tr>
                    </thead>
                    <tbody>
                        
                      {filteredInvoices.map((item, index)=>{
                        return <tr key={index} className="bg-white border-b hover:bg-gray-50">
                        <td className="w-4 p-4">
                          <div className="flex items-center">
                            <input id="checkbox-table-search-1" type="checkbox" onChange={e => handleRowCheckboxChange(e, item._id)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                          </div>
                        </td>
                        <th scope="row" className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">
                          {index + 1}
                        </th>
                        <td className="px-6 py-3">
                          {item.code}
                        </td>
                        <td className="px-6 py-3">
                          {item.name}
                        </td>
                        <td className="px-6 py-3">
                          {item.linkAccount}
                        </td>
                        <td className="px-6 py-3">
                          {item.linkContract}
                        </td>
                        <td className="flex items-center px-6 mr-5 py-4 space-x-4 rtl:space-x-reverse">
                          <button type='button' onClick={()=>{getData(item._id)}} 
                            className= {`${isAdmin === false ? 'cursor-not-allowed': ''} font-medium text-blue-600 dark:text-blue-500 hover:underline" `} disabled={isAdmin === false}><AiOutlineEdit className='text-lg'/></button>
                        </td>
                      </tr>})}
                    </tbody>
                </table>
                  {filteredInvoices.length === 0  ? <h1 className='text-red-600 text-center text-base my-3'>No data found</h1> : ''}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" dir={`${locale === 'ar' && 'rtl'}`} className="relative z-20" onClose={()=>{setOpen(false)}}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95" enterTo="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 md:scale-100" leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
              <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-5xl">
                <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                  <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-6 lg:right-8" onClick={() => setOpen(false)}>
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>


                  <form method="POST" onSubmit={submit} className='w-full'>
                    <div className="overflow-hidden shadow sm:rounded-md">
                      <div className="bg-white px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-6 gap-6">
                          <div className="col-span-2">
                            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                              {t('code')} *
                            </label>
                            <input
                              value={code}
                              onChange={handleChange}
                              type="text"
                              name="code"
                              id="code"
                              autoComplete="given-name"
                              className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              required
                            />
                          </div>
                          <div className="col-span-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                              {t('name')}
                            </label>
                            <input
                              value={name}
                              onChange={handleChange}
                              type="text"
                              name="name"
                              id="name"
                              autoComplete="given-name"
                              className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              required
                            />
                          </div>
                          
                          <div className="col-span-2">
                            <label htmlFor="linkAccount" className="block text-sm font-medium text-gray-700">
                              {t('linkedAccount')} *
                            </label>
                            <select
                              onChange={handleChange}
                              value={linkAccount}
                              id="linkAccount"
                              name="linkAccount"
                              className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              required
                            >
                              <option value="" disabled>Select account</option>
                              {filteredCharts.map((item, index)=>{
                                return <option key={index} value={item.accountName}>{item.accountCode} - {item.accountName}</option>
                              })}

                            </select>
                          </div>


                          <div className='col-span-4 flex'>

                            <div className="w-1/4 flex space-x-5 rtl:space-x-reverse my-auto">
                              <label htmlFor="linkContract" className="block text-sm font-medium text-gray-700">
                                {t('linkedContract')}
                              </label>
                              <div>
                                <Switch color="blue" value={linkedCheck} onChange={handleLinkedCheck} />
                              </div>
                            </div>
                          </div>

                          {linkedCheck ? <div className='col-span-2'>
                            <label htmlFor="linkContract" className="block text-sm font-medium text-gray-700">
                              {t('linkedContract')}
                            </label>
                            <select
                              onChange={handleChange}
                              value={linkContract}
                              id="linkContract"
                              name="linkContract"
                              className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white px-1 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            >
                              <option>Select account</option>
                              <option value='unitRent'>Unit Rent</option>
                              <option value='commission'>Commission</option>
                              <option value='parkingRent'>Parking Rent</option>
                              <option value='securityDeposit'>Security Deposit</option>
                            </select>
                          </div>: <div className='h-[61px]'> </div>}


                          <div className="col-span-6">
                            <label htmlFor="desc" className="block text-sm font-medium text-gray-700">
                              {t('desc')}
                            </label>
                            <textarea cols="30" rows="4" type="text"
                              onChange={handleChange}
                              value={desc}
                              name="desc"
                              id="desc"
                              className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            </textarea>
                          </div>

                        </div>
                      </div>
                      <div className="bg-gray-50 space-x-3 rtl:space-x-reverse px-4 py-3 text-right sm:px-6">
                        <button type='button' onClick={()=>{editEntry(id)}} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">{t('saveChanges')}</button>
                        {isOpenSaveChange && <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">{t('save')}</button>}
                    </div>
                    </div>
                  </form>

                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>

    </FullLayout>
    </ProSidebarProvider>

    </>
  )
}




export async function getServerSideProps() {
  if (!mongoose.connections[0].readyState){
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URI)
  }
  let product = await Product.find()
  let chartsOfAccount = await Charts.find()
  let dbTaxRate = await TaxRate.find()

   
  // Pass data to the page via props
  return {
     props: { 
        product: JSON.parse(JSON.stringify(product)),
        charts: JSON.parse(JSON.stringify(chartsOfAccount)),
        dbTaxRate: JSON.parse(JSON.stringify(dbTaxRate)),
    } 
    }
}

export default ProductAndServices