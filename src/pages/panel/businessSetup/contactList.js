import React, {Fragment, useEffect, useState, useRef} from 'react'
import mongoose from "mongoose";
import moment from 'moment/moment';
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Contact from 'models/Contact';
import { ProSidebarProvider } from 'react-pro-sidebar';
import FullLayout from '@/panel/layouts/FullLayout';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';

import { BiExport, BiImport } from 'react-icons/bi';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import {XLSX, read, utils} from 'xlsx';
import Charts from 'models/Charts';
import PaymentMethod from 'models/PaymentMethod';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';


const ContactList = ({ userEmail, dbContact, dbAccounts, dbPaymentType}) => {

  const router = useRouter();
  const { t } = useTranslation('businessSetup')

  const searchParams = useSearchParams()
  const open = searchParams.get('open')
  const openTenant = searchParams.get('openTenant')

  const mainCountries = [ "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Brazzaville)", "Congo (Kinshasa)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"];

  // Add States
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNo, setPhoneNo] = useState('')
  const [secondaryEmail, setSecondaryEmail] = useState('')
  const [secondaryPhoneNo, setSecondaryPhoneNo] = useState('')
  const [country, setCountry] = useState('United States')
  const [streetAddress, setStreetAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [taxRigNo, setTaxRigNo] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [terms, setTerms] = useState('Due on receipt')
  const [openingBalance, setOpeningBalance] = useState('')
  const [date, setDate] = useState('')
  const [accounts, setAccounts] = useState('')

  const [allContact, setAllContact] = useState(dbContact)
  const [filterCharts, setFilterCharts] = useState('allContacts')
  const [isOpenSaveChange, setIsOpenSaveChange] = useState(true)
  const [filteredInvoices, setFilteredInvoices] = useState([])
  

  // authentications
  const [isAdmin, setIsAdmin] = useState(false)


  useEffect(() => {
    const all = dbContact.filter((data) => {
      if(filterCharts === 'allContacts'){
        return data.type;
      }
      else{
        if(data.type === `${filterCharts}`){
          return data.type;
        }
      }
    })
    setAllContact(all)

    const myUser = JSON.parse(localStorage.getItem('myUser'))
    if(myUser.department === 'Admin'){
      setIsAdmin(true)
    }

    let filteredInvoices = allContact.filter((item)=>{
      return item.userEmail === userEmail;
    })
    setFilteredInvoices(filteredInvoices)

  }, [filterCharts, userEmail]);

  useEffect(() => {
    setType('Tenant')
  }, [openTenant])
  


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

      const header = ['sr','name', 'type', 'email', 'phoneNo' , 'openingBalance']

      const heads = header.map((head, index) => ({ title: head, entry: head, key: index }));


      parsedData.splice(0,1)
      convertToJson(header, parsedData)
    };
    reader.readAsBinaryString(file);
  }

  const convertToJson = (header, data)=>{
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
    const data = { row, path:'contactList', importEntries:'importEntries' };
      let res = await fetch(`/api/addEntry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      let response = await res.json()

      if(response.success === true){
        window.location.reload();
      }
      else {
        toast.error(response.message , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
      }
  }



  // id For delete contact
  const [id, setId] = useState('')
  const [selectedIds, setSelectedIds] = useState([]);

  function handleRowCheckboxChange(e, id) {
    if (e.target.checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(rowId => rowId !== id));
    }
  }
  

  const handleChange = (e) => {
  
    if(e.target.name === 'name'){
      setName(e.target.value)
    }
    else if(e.target.name === 'type'){
      setType(e.target.value)
    }
    else if(e.target.name === 'email'){
      setEmail(e.target.value)
    }
    else if(e.target.name === 'phoneNo'){
      setPhoneNo(e.target.value)
    }
    else if(e.target.name === 'secondaryEmail'){
      setSecondaryEmail(e.target.value)
    }
    else if(e.target.name === 'secondaryPhoneNo'){
      setSecondaryPhoneNo(e.target.value)
    }
    else if(e.target.name === 'country'){
      setCountry(e.target.value)
    }
    else if(e.target.name === 'accounts'){
      setAccounts(e.target.value)
    }
    else if(e.target.name === 'streetAddress'){
      setStreetAddress(e.target.value)
    }
    else if(e.target.name === 'city'){
      setCity(e.target.value)
    }
    else if(e.target.name === 'state'){
      setState(e.target.value)
    }
    else if(e.target.name === 'zip'){
      setZip(e.target.value)
    }
    else if(e.target.name === 'taxRigNo'){
      setTaxRigNo(e.target.value)
    }
    else if(e.target.name === 'paymentMethod'){
      setPaymentMethod(e.target.value)
    }
    else if(e.target.name === 'terms'){
      setTerms(e.target.value)
    }
    else if(e.target.name === 'openingBalance'){
      setOpeningBalance(e.target.value)
    }
    else if(e.target.name === 'date'){
      setDate(e.target.value)
    }
  }

  const editEntry = async(id)=>{
    

    const data = { id, name, type, accounts, email, phoneNo, secondaryEmail, secondaryPhoneNo, country, streetAddress, city, state, zip, taxRigNo, paymentMethod, terms , openingBalance, date ,  path: 'contactList'};
    
    let res = await fetch(`/api/editEntry`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      let response = await res.json()
      
      if (response.success === true) {
        router.push('?open=false');
      }

    else {
      toast.error(response.message , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
    }
      
    
  }

  const delEntry = async()=>{

    const data = { selectedIds , path: 'contactList' };
    let res = await fetch(`/api/delEntry`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    let response = await res.json()
    if (response.success === true) {
      window.location.reload();
    }
    else {
      toast.error(response.message , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
    }
  }

  const getData = async (id) =>{
    router.push('?open=true');
    setIsOpenSaveChange(false)

    const data = { id, path: 'contactList' };
    let res = await fetch(`/api/getDataEntry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      let response = await res.json()

      const date = moment(response.contact.date).utc().format('YYYY-MM-DD')
      if (response.success === true){
        setId(response.contact._id)
        setName(response.contact.name)
        setType(response.contact.type)
        setEmail(response.contact.email)
        setPhoneNo(response.contact.phoneNo)
        setSecondaryEmail(response.contact.secondaryEmail)
        setSecondaryPhoneNo(response.contact.secondaryPhoneNo)
        setCountry(response.contact.country)
        setStreetAddress(response.contact.streetAddress)
        setCity(response.contact.city)
        setState(response.contact.state)
        setZip(response.contact.zip)
        setTaxRigNo(response.contact.taxRigNo)
        setAccounts(response.contact.accounts)
        setTerms(response.contact.terms)
        setOpeningBalance(response.contact.openingBalance)
        setPaymentMethod(response.contact.paymentMethod)
        setDate(date)
      }
  }

  const submit = async(e)=>{
    e.preventDefault()
    
    // fetch the data from form to makes a file in local system
    const data = { userEmail, name, type, accounts, email, phoneNo, secondaryEmail, secondaryPhoneNo, country, streetAddress, city, state, zip, taxRigNo, paymentMethod, terms , openingBalance, date, path:'contactList' };
      let res = await fetch(`/api/addEntry`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      let response = await res.json()

      if(response.success === true){
        router.push('?open=false');
      }
      else {
          toast.error(response.message , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
      }
  }

  const openSettings = async ()=>{
    setIsOpenSaveChange(true), setName(''), setType(''), setEmail(''), setPhoneNo(''), setSecondaryEmail(''), setSecondaryPhoneNo(''), setCountry('United States'), setStreetAddress(''), setCity(''), setState(''), setZip(''), setTaxRigNo(''), setTerms('Due on receipt'), setOpeningBalance(''), setPaymentMethod('Cash'), setDate('')
  }

  let contactType = ['Customer','Supplier', 'Tenant', 'Owner']
  

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
    <ToastContainer position="bottom-center" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light"/>

    <div className="mt-10 sm:mt-0">
      <div className="md:grid md:grid-cols-1 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0 flex">
            <h3 className="text-lg font-bold leading-6 text-gray-900">{t('contactListTitle')}</h3>
            <Link
              onClick={()=>openSettings()}
              href={'?open=true'}
              className={`${isAdmin === false ? 'cursor-not-allowed': ''} no-underline ml-auto bg-blue-800 hover:bg-blue-900 text-white px-14 py-2 rounded-lg`} disabled={isAdmin === false}>
              {t('new')}
            </Link>
            
          </div>
          <div className='flex space-x-7 rtl:space-x-reverse ml-5 mt-4 font-bold text-sm'>
            <button className='text-indigo-600 hover:text-indigo-800' onClick={()=>{setFilterCharts('allContacts')}}>{t('allContacts')}</button>
            <button className='text-indigo-600 hover:text-indigo-800' onClick={()=>{setFilterCharts('Customer')}}>{t('customer')}</button>
            <button className='text-indigo-600 hover:text-indigo-800' onClick={()=>{setFilterCharts('Supplier')}}>{t('supplier')}</button>
            <button className='text-indigo-600 hover:text-indigo-800' onClick={()=>{setFilterCharts('Tenant')}}>{t('tenant')}</button>
            <button className='text-indigo-600 hover:text-indigo-800' onClick={()=>{setFilterCharts('Owner')}}>{t('owner')}</button>
          </div>
        </div>
        <div className="mt-2 md:col-span-2 md:mt-0">


          <div className='flex items-center space-x-2 rtl:space-x-reverse mb-1'>
            <div>
              <DownloadTableExcel
                filename="Contact List"
                sheet="Contact List"
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
            <div className=''>
              <button type="button" onClick={delEntry}
              className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2`} disabled={isAdmin === false}
              >
                {t('delete')}
                <AiOutlineDelete className='text-lg ml-2'/>
              </button>
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
                      <th scope="col" className="p-3">
                          {t('sr')}
                      </th>
                      <th scope="col" className="p-3">
                          {t('name')}
                      </th>
                      <th scope="col" className="p-3">
                          {t('type')}
                      </th>
                      <th scope="col" className="p-3">
                          {t('email')}
                      </th>
                      <th scope="col" className="p-3">
                          {t('phoneNo')}
                      </th>
                      <th scope="col" className="p-3">
                          <span className="">{t('viewOrEdit')}</span>
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
                    <td scope="row" className="p-3 font-medium text-gray-900 whitespace-nowrap">
                        {index + 1}
                    </td>
                    <td scope="row" className="p-3 font-medium text-gray-900 whitespace-nowrap">
                        {item.name}
                    </td>
                    <td className="p-3">
                        {item.type}
                    </td>
                    <td className="p-3">
                        {item.email}
                    </td>
                    <td className="p-3">
                        {item.phoneNo}
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


    <Transition.Root show={open === 'true' ? true : false} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={()=>{router.push('?open=false')}}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95" enterTo="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 md:scale-100" leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
              <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-5xl">
                <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                  <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-6 lg:right-8" onClick={() => router.push('?open=false')}>
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  
                  <div className='w-full'>
                    <div className="mt-10 sm:mt-0 w-full">
                      <div className="md:grid md:grid-cols-1 md:gap-6">
                        <div className="md:col-span-1">
                          <div className="px-4 sm:px-0">
                            <h3 className="text-lg font-bold leading-6 text-gray-900">{t('addContact')}</h3>
                          </div>
                        </div>
                        <div className="mt-2 md:col-span-2 md:mt-0 w-full">
                          <form method="POST" onSubmit={submit}>
                            <div className="overflow-hidden shadow sm:rounded-md">
                              <div className="bg-white px-4 py-5 sm:p-6">
                                <div className="grid grid-cols-6 gap-6">

                                  <div className="col-span-6 sm:col-span-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('name')}</label>
                                    <input type="name" onChange={handleChange} name="name" id="name" value={name} placeholder='John Doe' className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required/>
                                  </div>
                            
                                    <div className="col-span-6 sm:col-span-2">
                                      <label htmlFor="type" className="block text-sm font-medium text-gray-700">{t('contactType')}</label>
                                      <select id="type" name="type" onChange={handleChange} value={type} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                        <option>Select Contact Type</option>
                                        {contactType.map((item, index)=>{
                                          return <option key={index} value={item}>{item}</option>
                                        })}
                                      </select>
                                    </div>

                                    {/* <div className="col-span-6 sm:col-span-3">
                                      <label htmlFor="accounts" className="block text-sm font-medium text-gray-700">{t('accounts')}</label>
                                      <select id="accounts" name="accounts" onChange={handleChange} value={accounts} autoComplete="accounts" className="mt-1 py-2 block w-full rounded-md border border-gray-300 bg-white px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                        <option>select accounts</option>
                                        {dbAccounts.map((item,index)=>{
                                          return <option key={index} value={item.accountName}>{item.accountCode} - {item.accountName}</option>
                                        })}
                                      </select>
                                    </div> */}

                                    <div className="col-span-6 sm:col-span-3">
                                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('email')}</label>
                                      <input onChange={handleChange} value={email} type="text" name="email" id="email" autoComplete="email" className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                      <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700">{t('phoneNo')}</label>
                                      <input onChange={handleChange} value={phoneNo} type="number" name="phoneNo" id="phoneNo" className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required/>
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                      <label htmlFor="secondaryEmail" className="block text-sm font-medium text-gray-700">{t('secondaryEmail')}</label>
                                      <input onChange={handleChange} value={secondaryEmail} type="text" name="secondaryEmail" id="secondaryEmail" autoComplete="secondaryEmail" className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                      <label htmlFor="secondaryPhoneNo" className="block text-sm font-medium text-gray-700">{t('secondaryPhoneNo')}</label>
                                      <input onChange={handleChange} value={secondaryPhoneNo} type="number" name="secondaryPhoneNo" id="secondaryPhoneNo" className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
                                    </div>

                                    <div className="col-span-6 sm:col-span-2">
                                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">{t('country')}</label>
                                      <select id="country" name="country" onChange={handleChange} value={country} autoComplete="country" className="mt-1 py-2 block w-full rounded-md border border-gray-300 bg-white px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                        <option>select country</option>
                                        {mainCountries.map((item, index)=>{
                                          return <option key={index} value={item}>{item}</option>
                                        })}
                                      </select>
                                    </div>

                                    <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">{t('city')}</label>
                                      <input onChange={handleChange} value={city} type="text" name="city" id="city" autoComplete="address-level2" className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                      />
                                    </div>

                                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">{t('state')}</label>
                                      <input onChange={handleChange} value={state} type="text" name="state" id="state" className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                      />
                                    </div>

                                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                      <label htmlFor="zip" className="block text-sm font-medium text-gray-700">{t('zip')}</label>
                                      <input onChange={handleChange} value={zip} type="number" name="zip" id="zip" className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
                                    </div>

                                    <div className="col-span-4">
                                      <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700">{t('streetAddress')}</label>
                                      <input onChange={handleChange} value={streetAddress} type="text" name="streetAddress" id="streetAddress" autoComplete="streetAddress" className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
                                    </div>

                                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                      <label htmlFor="taxRigNo" className="block text-sm font-medium text-gray-700">{t('taxRegNo')}</label>
                                      <input onChange={handleChange} value={taxRigNo} type="number" name="taxRigNo" id="taxRigNo" autoComplete="taxRigNo" className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
                                    </div>

                                    <div className="col-span-6 sm:col-span-2">
                                      <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">{t('paymentMethod')}</label>
                                      <select id="paymentMethod" name="paymentMethod" onChange={handleChange} value={paymentMethod} className="mt-1 py-2 block w-full rounded-md border border-gray-300 bg-white px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                        <option value={''}>Select Payment Method</option>
                                        {dbPaymentType.map((item, index)=>{
                                          return <option key={index} value={item.paymentType}>{item.paymentType}</option>
                                        })}
                                      </select>
                                    </div>

                                    <div className="col-span-6 sm:col-span-2">
                                      <label htmlFor="terms" className="block text-sm font-medium text-gray-700">{t('terms')}</label>
                                      <select id="terms" name="terms" onChange={handleChange} value={terms} className="mt-1 py-2 block w-full rounded-md border border-gray-300 bg-white px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" required>
                                        <option value={'Due on receipt'}>Due on receipt</option>
                                        <option value={'Net 15'}>Net 15</option>
                                        <option value={'Net 30'}>Net 30</option>
                                        <option value={'Net 60'}>Net 60</option>
                                      </select>
                                    </div>

                                    {/* <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                      <label htmlFor="openingBalance" className="block text-sm font-medium text-gray-700">{t('openingBalance')}</label>
                                      <input onChange={handleChange} value={openingBalance} type="number" name="openingBalance" id="openingBalance" className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required/>
                                    </div> */}

                                </div>
                              </div>
                              <div className="bg-gray-50 space-x-3 rtl:space-x-reverse px-4 py-3 text-right sm:px-6">
                                <button type='button' onClick={()=>{editEntry(id)}} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">{t('saveChanges')}</button>
                                {isOpenSaveChange && <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">{t('save')}</button>}
                            </div>
                            
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>

                    <div>
                  
                    </div>
                  </div>

                
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
  let dbContact = await Contact.find()
  let dbAccounts = await Charts.find()
  let dbCustomer = await Contact.find({type: "Customer"})
  let dbSupplier = await Contact.find({type: "Supplier"})
  let dbPaymentType = await PaymentMethod.find()
  

  // Pass data to the page via props
  return {
     props: { 
      dbContact: JSON.parse(JSON.stringify(dbContact)),
      dbAccounts: JSON.parse(JSON.stringify(dbAccounts)),
      dbCustomer: JSON.parse(JSON.stringify(dbCustomer)),
      dbSupplier: JSON.parse(JSON.stringify(dbSupplier)),
      dbPaymentType: JSON.parse(JSON.stringify(dbPaymentType)),
      }
  }
}

export default ContactList