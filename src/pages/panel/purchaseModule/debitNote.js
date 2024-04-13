import React, {Fragment, useEffect, useRef, useState} from 'react'
import mongoose from "mongoose";
import moment from 'moment/moment';
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Menu, Dialog, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlusCircle, AiOutlinePrinter } from 'react-icons/ai';
import { ProSidebarProvider } from 'react-pro-sidebar';
import FullLayout from '@/panel/layouts/FullLayout';
import dbDebitNote from 'models/DebitNote';
import Contact from 'models/Contact';
import Charts from 'models/Charts';
import Employees from 'models/Employees';
import TaxRate from 'models/TaxRate';
import ReactToPrint from 'react-to-print';
import Project from 'models/Project';
import useTranslation from 'next-translate/useTranslation';


  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const DebitNote = ({ userEmail, dbVouchers, dbCharts, dbContacts, dbEmployees, dbTaxRate, dbProject }) => {
    
    const [open, setOpen] = useState(false)
    const { t } = useTranslation('modules')
    const [contacts, setContacts] = useState([])
    const [id, setId] = useState('')
    const [selectedIds, setSelectedIds] = useState([]);

    // authentications
    const [isAdmin, setIsAdmin] = useState(false)

    const [filteredInvoices, setFilteredInvoices] = useState([])
    const [filteredContacts, setFilteredContacts] = useState([])
    const [filteredCharts, setFilteredCharts] = useState([])
    const [filteredProject, setFilteredProject] = useState([])
    const [filteredTaxRate, setFilteredTaxRate] = useState([])
  

    function handleRowCheckboxChange(e, id) {
      if (e.target.checked) {
        setSelectedIds([...selectedIds, id]);
      } else {
        setSelectedIds(selectedIds.filter(rowId => rowId !== id));
      }
    }

    useEffect(() => {
      setContacts(dbContacts, dbEmployees)

      const myUser = JSON.parse(localStorage.getItem('myUser'))
      if(myUser.department === 'Admin'){
        setIsAdmin(true)
      }

      let filteredInvoices = dbVouchers.filter((item)=>{
        return item.userEmail === userEmail;
      })
      setFilteredInvoices(filteredInvoices)

      let filteredContacts = dbContacts.filter((item)=>{
        return item.userEmail === userEmail;
      })
      setFilteredContacts(filteredContacts)

      let filteredCharts = dbCharts.filter((item)=>{
        return item.userEmail === userEmail;
      })
      setFilteredCharts(filteredCharts)

      let filteredProject = dbProject.filter((item)=>{
        return item.userEmail === userEmail;
      })
      setFilteredProject(filteredProject)

      let filteredTaxRate = dbTaxRate.filter((item)=>{
        return item.userEmail === userEmail;
      })
      setFilteredTaxRate(filteredTaxRate)

    }, [userEmail])

    // JV
    const [billNo, setBillNo] = useState('')
    // Date
    const today = new Date().toISOString().split('T')[0];
    const [journalDate, setJournalDate] = useState(today)
    const [memo, setMemo] = useState('')
    const [attachment, setAttachment] = useState('')
    const [name, setName] = useState('')
    const [phoneNo, setPhoneNo] = useState(0)
    const [email, setEmail] = useState('')
    const [city, setCity] = useState('')
    const [address, setAddress] = useState('')
    const [reference, setReference] = useState('')
    const [project, setProject] = useState('')
    const [accuralDate, setAccuralDate] = useState('')
    const [fullAmount, setFullAmount] = useState(0)
    const [fullTax, setFullTax] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)

    // JV
    const [inputList, setInputList] = useState([
      { billNo: '', date: journalDate, account: '', desc:'', amount:'', taxRate:'', taxAmount:'', totalAmountPerItem:''},
      { billNo: '', date: journalDate, account: '', desc:'', amount:'', taxRate:'', taxAmount:'', totalAmountPerItem:''},
    ]);

    // JV
    const handleChange = (e) => {
      if(e.target.name === 'journalDate'){
        setJournalDate(e.target.value)
      }
      else if(e.target.name === 'accuralDate'){
        setAccuralDate(e.target.value)
      }
      else if(e.target.name === 'reference'){
        setReference(e.target.value)
      }
      else if(e.target.name === 'address'){
        setAddress(e.target.value)
      }
      else if(e.target.name === 'city'){
        setCity(e.target.value)
      }
      else if(e.target.name === 'email'){
        setEmail(e.target.value)
      }
      else if(e.target.name === 'phoneNo'){
        setPhoneNo(e.target.value)
      }
      else if(e.target.name === 'memo'){
        setMemo(e.target.value)
      }
      else if(e.target.name === 'project'){
        setProject(e.target.value)
      }
      else if(e.target.name === 'attachment'){
        setAttachment(e.target.value)
      }
      else if(e.target.name === 'type'){
        setType(e.target.value)
      }
      else if(e.target.name === 'name'){
        setName(e.target.value)
        const newData = dbContacts.filter(item => item.name === e.target.value);
        if(newData.length > 0){
          setEmail(newData[0].email)
          setPhoneNo(newData[0].phoneNo)
          setCity(newData[0].city)
          setAddress(newData[0].streetAddress)
        }
        else{
          setEmail('')
          setPhoneNo('')
          setCity('')
          setAddress('')
        }
      }
      else if(e.target.name === 'fullAmount'){
        setFullAmount(e.target.value)
      }
      else if(e.target.name === 'fullTax'){
        setFullTax(e.target.value)
      }
      else if(e.target.name === 'totalAmount'){
        setTotalAmount(e.target.value)
      }
    }

    // JV
    const submit = async(e)=>{
      e.preventDefault()
      
      inputList.forEach(item => {
        item.date = journalDate;
      });


      // fetch the data from form to makes a file in local system
      const data = { userEmail, phoneNo, email, project, city, address, reference, accuralDate, inputList, name,  memo, journalDate, billNo, fullAmount, fullTax, totalAmount, attachment, path:'DebitNote' };

      let res = await fetch(`/api/addEntry`, {
        method: 'POST',
        headers:{
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

    // JV
    const addLines = () => {
      setInputList([...inputList,
        {account:'', desc:'', amount:'', taxRate:'', taxAmount:'', totalAmountPerItem:''},
      ])
    }
    const delLines = (indexToDelete) => {
        const updatedInputList = [...inputList];
        updatedInputList.splice(indexToDelete, 1);
        setInputList(updatedInputList);
    };

    function calculateTax(percentage, whole) {
      return (percentage / 100) * whole;
    }

    // JV
    const change = (e, index) => {
      const values = [...inputList];
      values[index][e.target.name] = e.target.value;

      if (e.target.name === 'amount' || e.target.name === 'taxRate') {
        const amount = parseFloat(e.target.name === 'amount' ? e.target.value : values[index].amount);
        const tax = parseFloat(e.target.name === 'taxRate' ? e.target.value : values[index].taxRate);
        const taxRate = calculateTax(amount, tax);
        
        const totalAmount = amount + taxRate;

        values[index].taxAmount = isNaN(taxRate) ? 0 : taxRate;
        values[index].totalAmountPerItem = isNaN(totalAmount) ? 0 : totalAmount;
        setInputList(values);
      } else {
        setInputList(values);
      }


      // Full Amount
      var fullAmount = 0;
      var fullTax = 0;

      for (let index = 0; index < inputList.length; index++) {
        fullAmount += parseInt(inputList[index].amount);
        fullTax += parseInt(inputList[index].taxAmount);
      }
      
      setFullAmount(fullAmount);
      setFullTax(fullTax);

      // total Amount
      let totalAmount = fullAmount + fullTax;
      setTotalAmount(totalAmount);
    }

    const editEntry = async(id)=>{
      setOpen(true)

      const data = { id, phoneNo, email, project, city, address, reference, accuralDate, inputList, name,  memo, journalDate, billNo, fullAmount, fullTax, totalAmount, attachment, path:'DebitNote' };
      
      let res = await fetch(`/api/editEntry`, {
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

    const delEntry = async()=>{

      const data = { selectedIds , path: 'DebitNote' };
      
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
      setOpen(true)

      const data = { id, path: 'DebitNote' };
      let res = await fetch(`/api/getDataEntry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      let response = await res.json()

      if (response.success === true){
        const dbJournalDate = moment(response.data.journalDate).utc().format('YYYY-MM-DD')
        const dbAccuralDate = moment(response.data.accuralDate).utc().format('YYYY-MM-DD')
        
        setId(response.data._id)
        setJournalDate(dbJournalDate)
        setBillNo(response.data.billNo)
        setInputList(response.data.inputList)
        setMemo(response.data.memo)
        setName(response.data.name)
        setProject(response.data.project)
        setAttachment(response.data.attachment.data)
        setFullAmount(response.data.fullAmount)
        setFullTax(response.data.fullTax)
        setTotalAmount(response.data.totalAmount)
        setPhoneNo(response.data.phoneNo)
        setName(response.data.name)
        setEmail(response.data.email)
        setCity(response.data.city)
        setReference(response.data.reference)
        setAddress(response.data.address)
        setAccuralDate(dbAccuralDate)
      }
    }

    // For print
    const componentRef = useRef();
    const speceficComponentRef = useRef();

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
          <div className="px-4 sm:px-0 flex justify-between">
            <h3 className="text-lg font-bold leading-6 text-gray-900">{t('debitNoteTitle')}</h3>
            <button 
              onClick={()=>{
                setOpen(true)
                setId('')
                setJournalDate(today)

                const invoiceNumber = (filteredInvoices.length + 1).toString().padStart(4, '0');
                const formattedInvoice = `DN-${invoiceNumber}`;
                setBillNo(formattedInvoice)

                setInputList([
                  {
                    billNo : formattedInvoice, date: journalDate, account:'', desc:'', amount:'', taxRate:'', taxAmount:'', totalAmountPerItem:'' 
                  },
                ])
                setMemo('')
                setAttachment('')
                setFullAmount(0)
                setFullTax(0)
                setTotalAmount(0)
                setPhoneNo(0)
                setName('')
                setEmail('')
                setCity('')
                setReference('')
                setAddress('')
                setAccuralDate('')
              }} 
              className={`${isAdmin === false ? 'cursor-not-allowed': ''} bg-blue-800 hover:bg-blue-900 text-white px-14 py-2 rounded-lg`} disabled={isAdmin === false}>
              {t('new')}
            </button>
            
          </div>
        </div>
        <div className="mt-2 md:col-span-2 md:mt-0">
          <div className='flex'>
            <button onClick={delEntry}
              className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2`} disabled={isAdmin === false}
              >
                {t('delete')}
              <AiOutlineDelete className='text-lg ml-2'/>
            </button>

            <ReactToPrint
              trigger={()=>{
                return <button 
                  type='button'
                  className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2`} disabled={isAdmin === false}>
                  {t('printAll')}
                  <AiOutlinePrinter className='text-lg ml-2'/>
                </button>
              }}
              content={() => componentRef.current}
              documentTitle={`${userEmail} - Debit Note Invoices`}
              pageStyle='print'
            />
          </div>
          
          <form method="POST">
            <div className="overflow-hidden shadow sm:rounded-md">
              
              <div className="overflow-x-auto shadow-sm">
                <table ref={componentRef} className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-[#e9ecf7]">
                    <tr>
                      <th scope="col" className="p-4">
                        <div className="flex items-center">
                          <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        </div>
                      </th>
                      <th scope="col" className="p-1">
                          {t('billNo')}
                      </th>
                      <th scope="col" className="p-1">
                          {t('date')}
                      </th>
                      <th scope="col" className="p-1">
                          {t('supplier')}
                      </th>
                      <th scope="col" className="p-1">
                          {t('account')}
                      </th>
                      <th scope="col" className="p-1">
                          {t('accuralDate')}
                      </th>
                      <th scope="col" className="p-1">
                          {t('totalAmount')}
                      </th>
                      <th scope="col" className="p-1">
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
                      <td className="p-1">
                        <div className='text-sm text-black font-semibold'>{item.billNo}</div>
                      </td>
                      <td className="p-1">
                        <div className='text-sm'>{moment(item.journalDate).utc().format('D MMM YYYY')}</div>
                      </td>
                      <td className="p-1">
                        <div className='text-sm'>{item.name}</div>
                      </td>
                      <td className="p-1">
                        <div className='text-sm'>{item.inputList[0].account}</div>
                      </td>
                      <td className="p-1">
                        <div className='text-sm text-black font-semibold'>{moment(item.accuralDate).format('D MMM YYYY')}</div>
                      </td>
                      <td className="p-1">
                        <div className='text-sm text-black font-semibold'>{parseInt(item.totalAmount).toLocaleString()}</div>
                      </td>
                      <td className="flex items-center px-3 mr-5 py-4 space-x-4 rtl:space-x-reverse">
                        <button type='button' onClick={()=>{getData(item._id)}} 
                            className={`${isAdmin === false ? 'cursor-not-allowed': ''} font-medium text-blue-600 dark:text-blue-500 hover:underline`} disabled={isAdmin === false}>
                            <AiOutlineEdit className='text-lg'/>
                          </button>
                      </td>
                          
                    </tr>})}
                    
                  </tbody>
                </table>
                { filteredInvoices.length === 0  ? <h1 className='text-red-600 text-center text-base my-3'>No data found!</h1> : ''}
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>

    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={()=>{setOpen(false)}}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95" enterTo="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 md:scale-100" leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
              <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-5xl">
                <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                  <button type='button' className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-6 lg:right-8" onClick={() => setOpen(false)}>
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <div className='w-full'>
                    <form method="POST" onSubmit={submit}>
                      <div className="overflow-hidden shadow sm:rounded-md">


                        <div ref={speceficComponentRef} className="bg-white px-4 py-5 sm:p-6">

                          <div className='flex space-x-4 rtl:space-x-reverse mb-14'>

                            <div className="w-full">
                              <label htmlFor="journalDate" className="block text-sm font-medium text-gray-700">
                                {t('journalDate')}
                              </label>
                              <input 
                                type="date"
                                onChange={handleChange}
                                name="journalDate"
                                id="journalDate"
                                value={journalDate}
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>

                            <div className="w-full">
                              <label htmlFor="billNo" className="block text-sm font-medium text-gray-700">
                                {t('billNo')}
                              </label>
                              <input
                              type="text"
                              name="billNo"
                              value={billNo}
                              id="billNo"
                              className="mt-1 p-2 cursor-not-allowed block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              readOnly
                              />
                            </div>
                          </div>

                          <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
                            <div className="w-full">
                              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                {t('supplierName')}
                              </label>
                              <select id="name" name="name" onChange={ handleChange } value={name} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                <option value=''>select contacts</option>
                                {filteredContacts.map((item, index)=>{
                                  return <option key={index} value={item.name}>{item.name} - {item.type}
                                  </option>
                                })}
                              </select>
                            </div>

                            

                            <div className="w-full">
                              <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700">
                                {t('phoneNo')}
                              </label>
                              <input
                                type="number"
                                onChange={handleChange}
                                name="phoneNo"
                                value={phoneNo}
                                id="phoneNo"
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                            
                            <div className="w-full">
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                {t('email')}
                              </label>
                              <input
                                type="text"
                                onChange={handleChange}
                                name="email"
                                value={email}
                                id="email"
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>

                            <div className="w-full">
                              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                {t('city')}
                              </label>
                              <input
                                type="text"
                                onChange={handleChange}
                                name="city"
                                value={city}
                                id="city"
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>

                            <div className="w-full">
                              <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
                                {t('reference')}
                              </label>
                              <input
                                type="text"
                                onChange={handleChange}
                                name="reference"
                                value={reference}
                                id="reference"
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>

                          </div>


                          <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
                        
                            <div className="w-full">
                              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                {t('address')}
                              </label>
                              <input
                                type="text"
                                onChange={handleChange}
                                name="address"
                                value={address}
                                id="address"
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>

                            <div className="w-1/3">
                              <label htmlFor="project" className="block text-sm font-medium text-gray-700">
                                {t('project')}
                              </label>
                            
                              <select id="project" name="project" onChange={ handleChange } value={project} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                <option value=''>select project</option>
                                {filteredProject.map((item, index)=>{
                                  return <option key={index} value={item.name}>{item.name}</option>
                                })}
                              </select>
                            </div>

                            
                            <div className="w-1/3">
                              <label htmlFor="accuralDate" className="block text-sm font-medium text-gray-700">
                                {t('accuralDate')}
                              </label>
                              <input 
                                type="date"
                                onChange={handleChange}
                                name="accuralDate"
                                id="accuralDate"
                                value={accuralDate}
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>



                            <div className='flex space-x-4 rtl:space-x-reverse my-10'>

                                <table className="w-full text-sm text-left text-gray-500 ">
                                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                      <th scope="col" className="p-2">
                                          {t('account')}
                                      </th>
                                      <th scope="col" className="p-2">
                                          {t('desc')}
                                      </th>
                                      <th scope="col" className="p-2">
                                          {t('amount')}
                                      </th>
                                      <th scope="col" className="p-2">
                                          {t('taxRate')}
                                      </th>
                                      <th scope="col" className="p-2">
                                          {t('taxAmount')}
                                      </th>
                                      <th scope="col" className="p-2">
                                          {t('total')}
                                      </th>
                                      <th scope="col" className="p-2 w-20">
                                          {t('addOrDel')}
                                      </th>
                                    </tr>
                                  </thead>
                                
                                  <tbody >
                                  {inputList.map(( inputList , index)=>{
                                    return <tr key={index} className="bg-white text-black border-b hover:bg-gray-50">
                                    
                                      <td className="p-2 w-1/5">
                                        <select id="account" name="account" onChange={ e => change(e, index) } value={inputList.account} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                          <option value=''>select account</option>
                                          {filteredCharts.map((item, index)=>{
                                            return <option key={index} value={item.accountName}>{item.accountName}</option>
                                          })}
                                        </select>
                                      </td>
                                      <td className="p-2">
                                        <input
                                          type="text"
                                          onChange={ e=> change(e, index) }
                                          value={ inputList.desc }
                                          name="desc"
                                          id="desc"
                                          className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                      </td>

                                      <td className="p-2">
                                        <input
                                          type="number"
                                          onChange={ e=> change(e, index) }
                                          value={ inputList.amount }
                                          name="amount"
                                          id="amount"
                                          className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                      </td>
                                      
                                      <td className="p-2 w-1/6">
                                        <select id="taxRate" name="taxRate" onChange={ e => change(e, index) } value={inputList.taxRate} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                          <option>select tax</option>
                                          {filteredTaxRate.map((item, index)=>{
                                            return <option key={index} value={item.taxRate}>{item.name}({item.taxRate}%) </option>
                                          })}
                                        </select>
                                      </td>

                                      <td className="p-2">
                                        <input
                                          type="number"
                                          value={ inputList.taxAmount }
                                          name="taxAmount"
                                          id="taxAmount"
                                          className="mt-1 p-2 cursor-not-allowed block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                          readOnly
                                        />
                                      </td>

                                      <td className="p-2">
                                        <input
                                          type="number"
                                          value = { inputList.totalAmountPerItem }
                                          name="totalAmountPerItem"
                                          id="totalAmountPerItem"
                                          className="mt-1 p-2 cursor-not-allowed block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                          readOnly
                                          />
                                      </td>
                                      <td className="p-1 flex items-center mt-[18px]">
                                      
                                        <button type='button' className='mx-auto' onClick={addLines}><AiOutlinePlusCircle className='text-xl text-green-600'/></button>
                                        <button type='button' className='mx-auto'><AiOutlineDelete onClick={()=>index != 0 && delLines(index)} className='text-xl text-red-700'/></button>
                                      </td>

                                  </tr>})}
                                      
                                  </tbody>
                                </table>
                        
                          </div>
                        
                          <div className='bg-gray-100'>
                            <div className='flex flex-col ml-auto mr-10 space-y-2 w-1/3 py-3 mt-20'>
                              <div className="flex items-center">
                                <label htmlFor="fullAmount" className="block w-full text-sm font-medium text-gray-700">
                                  {t('totalAmount')}
                                </label>
                                <input
                                  type="number"
                                  value = { fullAmount }
                                  name="fullAmount"
                                  id="fullAmount"
                                  className="mt-1 p-2 cursor-not-allowed block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  readOnly
                                />
                              </div>
                              <div className="flex items-center">
                                <label htmlFor="fullTax" className="block w-full text-sm font-medium text-gray-700">
                                  {t('vat')}
                                </label>
                                <input
                                  type="number"
                                  value = { fullTax }
                                  name="fullTax"
                                  id="fullTax"
                                  className="mt-1 p-2 cursor-not-allowed block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  readOnly
                                />
                              </div>
                              <div className="flex items-center">
                                <label htmlFor="totalAmount" className="block w-full text-sm font-medium text-gray-700">
                                  {t('totalAmount')}
                                </label>
                                <input
                                  type="number"
                                  value = { totalAmount }
                                  name="totalAmount"
                                  id="totalAmount"
                                  className="mt-1 cursor-not-allowed p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  readOnly
                                />
                              </div>
                              
                            </div>
                          </div>

                          <div className=" mt-14">
                            <label htmlFor="memo" className="block text-sm font-medium text-gray-700">
                              {t('memo')}
                            </label>
                            <textarea cols="30" rows="4" type="text"
                                name="memo"
                                onChange={handleChange}
                                id="memo"
                                value={memo}
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            </textarea>
                          </div>
                            
                          {/* <div className="mt-7">
                            <label htmlFor="attachment" className="block text-sm font-medium text-gray-700">
                                Attachment:
                            </label>
                            <input
                                type="file"
                                onChange={handleChange}
                                name="attachment"
                                value={attachment}
                                id="attachment"
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                multiple
                            />
                          </div> */}

                        </div>
                        <div className="bg-gray-50 space-x-3 rtl:space-x-reverse px-4 py-3 text-right sm:px-6">


                          <ReactToPrint
                            trigger={()=>{
                              return <button 
                                type="button"
                                className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                                {t('print')}
                                <AiOutlinePrinter className='text-lg ml-2'/>
                              </button>
                            }}
                            content={() => speceficComponentRef.current}
                            documentTitle={`${userEmail} - Debit Note Invoice`}
                            pageStyle='print'
                          />

                          <button type='button' onClick={()=>{editEntry(id)}} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">{t('saveChanges')}</button>
                          <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">{t('save')}</button>
                        </div>
                      </div>
                    </form>
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
  let dbVouchers = await dbDebitNote.find()
  let dbContacts = await Contact.find()
  let dbEmployees = await Employees.find()
  let dbCharts = await Charts.find()
  let dbTaxRate = await TaxRate.find()
  let dbProject = await Project.find()

  // Pass data to the page via props
  return {
    props: {
      dbVouchers: JSON.parse(JSON.stringify(dbVouchers)),
      dbContacts: JSON.parse(JSON.stringify(dbContacts)),  
      dbEmployees: JSON.parse(JSON.stringify(dbEmployees)),  
      dbCharts: JSON.parse(JSON.stringify(dbCharts)),  
      dbTaxRate: JSON.parse(JSON.stringify(dbTaxRate)),  
      dbProject: JSON.parse(JSON.stringify(dbProject)),  
    }
  }
}
export default DebitNote