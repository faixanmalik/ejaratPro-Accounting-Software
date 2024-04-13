import React, {Fragment, useEffect, useRef, useState} from 'react'
import mongoose from "mongoose";
import moment from 'moment/moment';
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePrinter, AiOutlineSave } from 'react-icons/ai';
import Contact from 'models/Contact';
import { ProSidebarProvider } from 'react-pro-sidebar';
import FullLayout from '@/panel/layouts/FullLayout';
import ReactToPrint from 'react-to-print';
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from 'next/link';

import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Typography,
  Select, 
  Option,
  IconButton
} from "@material-tailwind/react";


import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { BiExport, BiImport, BiUserCircle } from 'react-icons/bi';
import { BsCashCoin } from 'react-icons/bs';
import { FiUsers } from 'react-icons/fi';
import Buildings from 'models/Buildings';
import { useRouter } from 'next/router';
import ContractAndTenant from 'models/ContractAndTenant';
import { MdAccountBox } from 'react-icons/md';
import Cheque from 'models/Cheque';
import { useSearchParams } from 'next/navigation';
import PaymentMethod from 'models/PaymentMethod';
import useTranslation from 'next-translate/useTranslation';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import {XLSX, read, utils} from 'xlsx';




  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }


  function Icon({ id, open }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    );
  }

  const Cheques = ({ userEmail, dbPaymentMethod, dbCheques, dbContacts, dbBuildings, dbTenants }) => {
    
    const router = useRouter();
    const { t } = useTranslation('realEstate');

    const searchParams = useSearchParams()
    const openReceiptVoucher = searchParams.get('openReceiptVoucher')
    const openSalesInv = searchParams.get('openSalesInv')
    const urlName = searchParams.get('name')

    
    const [contacts, setContacts] = useState([])
    const [id, setId] = useState('')
    const [selectedIds, setSelectedIds] = useState([]);

		const [search, setSearch] = useState('')
		const [totalNoOfPages, setTotalNoOfPages] = useState(1)
		const [active, setActive] = useState(1);
		const pageSize = 10;


    // authentications
    const [isAdmin, setIsAdmin] = useState(false)

    const [isOpenSaveChange, setIsOpenSaveChange] = useState(true)
    const [isChecked, setIsChecked] = useState(false);
		const [filteredData, setFilteredData] = useState([])
    const [filteredInvoices, setFilteredInvoices] = useState([])


    // Sales Invoice States to show the cheque
    const [journalNo, setJournalNo] = useState('')

    // Date
    const today = new Date().toISOString().split('T')[0];
    const [journalDate, setJournalDate] = useState(today)
  
    const [memo, setMemo] = useState('')
    const [attachment, setAttachment] = useState('')
    const [name, setName] = useState('')
    const [phoneNo, setPhoneNo] = useState(0)
    const [email, setEmail] = useState('')
    const [city, setCity] = useState('')
    const [receivedBy, setReceivedBy] = useState('')
    const [project, setProject] = useState('')
    const [chqNo, setChqNo] = useState('')

    const [dueDate, setDueDate] = useState('')
    const [fullAmount, setFullAmount] = useState(0)
    const [fullTax, setFullTax] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const [discount, setDiscount] = useState('')
    
    const [totalPaid, setTotalPaid] = useState(0)
    const [amount, setAmount] = useState('')
    const [reference, setReference] = useState('')

    // JV
    const [inputList, setInputList] = useState([
      { journalNo, date: journalDate, products: '', desc:'', amount:'', taxRate:'', taxAmount:'', totalAmountPerItem:'', discount: discount},
      { journalNo, date: journalDate, products: '', desc:'', amount:'', taxRate:'', taxAmount:'', totalAmountPerItem:'', discount: discount},
    ]);


    function handleRowCheckboxChange(e, id) {

      const isChecked = selectedIds.includes(id);

      if (isChecked) {
        setSelectedIds(selectedIds.filter(rowId => rowId !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    }

    useEffect(() => {
      if(selectedIds.length > 0) {
        setIsChecked(true);
      }
      else{
        setIsChecked(false);
      }
      
    }, [selectedIds])
    

    useEffect(() => {
      setContacts(dbContacts)

      let filteredInvoices = dbCheques.filter((item)=>{
        return item.userEmail === userEmail;
      })
      setFilteredInvoices(filteredInvoices)

      const myUser = JSON.parse(localStorage.getItem('myUser'))
      if(myUser.department === 'Admin'){
        setIsAdmin(true)
      }

    }, [dbCheques, userEmail])

    useEffect(() => {

      if(urlName){
        const newFilteredData = dbCheques.filter((item)=>{
          return item.name === urlName;
        });
        setFilteredData(newFilteredData)
      }
      else{
        setFilteredData(dbCheques)
      }

      
    //   const newFilteredData = dbVouchers.filter((item)=>{
    //     return item.buildingNameInEnglish.toLowerCase().includes(search.toLowerCase());
    //   });
    //   setFilteredData(newFilteredData)

    }, [search, urlName])
    

    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === 'search') {
        setSearch(value);
      } 
    }


    // For print
    const componentRef = useRef();
    const speceficComponentRef = useRef();


    const next = () => {
      if (active === 10) return;
      setActive(active + 1);
    };
     
    const prev = () => {
      if (active === 1) return;
      setActive(active - 1);
    };


		useEffect(() => {
			// Calculate the total number of pages and update the state
			const totalNoOfPages = Math.ceil(filteredInvoices.length / pageSize);
			setTotalNoOfPages(totalNoOfPages);
		}, [filteredInvoices]);

		useEffect(() => {
			const startIndex = (active - 1) * pageSize;
			const endIndex = startIndex + pageSize;
			const currentItems = filteredInvoices.slice(startIndex, endIndex);
	
			if (currentItems.length > 0) {
				setFilteredInvoices(currentItems);
			}
		}, [active]);



    const getData = async (id, type) => {

      if( type === 'ReceiptVoucher'){

        router.push('?openReceiptVoucher=true');
        setIsOpenSaveChange(false);

        const data = { id, path: 'Cheques' };
        let res = await fetch(`/api/getDataEntry`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        let response = await res.json();
      
        if (response.success === true) {

          const { journalDate, journalNo, inputList, memo, name, reference,
            attachment, phoneNo, email, city, amount, totalPaid
          } = response.data;
          
          let dbJournalDate = moment(journalDate).format("YYYY-MM-DD")

          setId(response.data._id)
          setJournalDate(dbJournalDate)
          setJournalNo(journalNo)
          setInputList(inputList)
          setMemo(memo)
          setName(name)
          setReference(reference)
          setAttachment(attachment)
          setPhoneNo(phoneNo)
          setEmail(email)
          setCity(city)
          setAmount(amount)
          setTotalPaid(totalPaid)
        }

      }
      else if(type === 'SalesInvoice'){

        router.push('?openSalesInv=true');
        setIsOpenSaveChange(false);
      
        const data = { id, path: 'Cheques' };
        let res = await fetch(`/api/getDataEntry`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        let response = await res.json();
      
        if (response.success === true) {

          const { journalDate, dueDate, journalNo, inputList, memo, name, 
            attachment, fullAmount, fullTax, discount, chqNo, totalAmount,
            phoneNo, email, city, project, receivedBy
          } = response.data;
      
          let dbJournalDate = moment(journalDate).format("YYYY-MM-DD")
          let dbDueDate = moment(dueDate).format("YYYY-MM-DD")
        
          setId(response.data._id)
          setJournalDate(dbJournalDate)
          setJournalNo(journalNo)
          setInputList(inputList)
          setMemo(memo)
          setName(name)
          setAttachment(attachment.data)
          setFullAmount(fullAmount)
          setFullTax(fullTax)
          setDiscount(discount)
          setChqNo(chqNo)
          setTotalAmount(totalAmount)
          setPhoneNo(phoneNo)
          setName(name)
          setEmail(email)
          setCity(city)
          setProject(project)
          setReceivedBy(receivedBy)
          setDueDate(dbDueDate)
        }
      }
      else if( type === 'Cheque'){

        const data = { id, path: 'Cheques' };
        let res = await fetch(`/api/getDataEntry`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        let response = await res.json();
        
        const { name, email, totalAmount, receivedBy, totalPaid, id:_id } = response.data;


        let paidBy = response.data.inputList[0].paidBy;
        let paidAmount = response.data.inputList[0].paid;

        // Now, return the data you want to use in the calling function
        return {
          name: name || '',
          amount: totalAmount || paidAmount || 0,
          receivedBy: receivedBy || paidBy || '',
          chequeId: id || '',
          email: email || '',
        };

      }
    }

    const newContract = async (e) => {
      e.preventDefault();
      if (selectedIds.length > 1) {
        toast.error('Select only 1 item', {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        throw new Error("Select only 1 item");
      } else {
        let id = selectedIds[0];
    
        try {
          const data = await getData(id, 'Cheque');
          return data; // Return the data from getData
        } catch (error) {
          throw error;
        }
      }
    }

    const depositCheck = async (e)=>{
      e.preventDefault();

      try {

        if(selectedIds.length > 1){
          toast.error('select only 1 item' , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
        }
        else{
          const contractData = await newContract(e);

          let chartsOfAccount;
          const filteredData = dbPaymentMethod.filter(item => item.paymentType === contractData.receivedBy);
          if (filteredData.length > 0) {
            chartsOfAccount = filteredData[0]?.chartsOfAccount;
          }
      
          let formData = {
            open: true,
            referCheque: true,
            name: contractData.name || '',
            email: contractData.email || '',
            amount: contractData.amount || 0,
            chequeId: contractData.chequeId || 0,
            creditAccount: chartsOfAccount || '',
            debitAccount: 'Bank',
            chequeStatus: 'Deposited',
          }

          const query = new URLSearchParams(formData).toString();
          router.push(`/panel/realEstate/chequeTransactions?${query}`);

        }
      } catch (error) {
        // Handle the error here
        console.error("Error in Cheque Trx:", error);
      }

    }

    const clearCheck = async(e)=>{
      e.preventDefault();

      const data = { selectedIds, changeStatus: 'Cleared', path: 'clearCheque' };

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

    const returnCheque = async(e)=>{
      e.preventDefault();

      try {

        if(selectedIds.length > 1){
          toast.error('select only 1 item' , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
        }
        else{
          const contractData = await newContract(e);

          let chartsOfAccount;
          const filteredData = dbPaymentMethod.filter(item => item.paymentType === contractData.receivedBy);
          if (filteredData.length > 0) {
            chartsOfAccount = filteredData[0]?.chartsOfAccount;
          }
      
          let formData = {
            open: true,
            referCheque: true,
            name: contractData.name || '',
            email: contractData.email || '',
            amount: contractData.amount || 0,
            chequeId: contractData.chequeId || 0,
            debitAccount: chartsOfAccount || '',
            creditAccount: 'Bank',
            chequeStatus: 'Returned',
          }

          const query = new URLSearchParams(formData).toString();
          router.push(`/panel/realEstate/chequeTransactions?${query}`);

        }
      } catch (error) {
        // Handle the error here
        console.error("Error in Cheque Trx:", error);
      }
    }

    const refundToCustomer = async(e)=>{
      e.preventDefault();

      try {

        if(selectedIds.length > 1){
          toast.error('select only 1 item' , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
        }
        else{
          const contractData = await newContract(e);

          let chartsOfAccount;
          const filteredData = dbPaymentMethod.filter(item => item.paymentType === contractData.receivedBy);
          if (filteredData.length > 0) {
            chartsOfAccount = filteredData[0]?.chartsOfAccount;
          }

          let debitAccount;
          const filteredContacts = dbContacts.filter(item => item.email === contractData.email);
          if (filteredContacts.length > 0) {
            debitAccount = filteredContacts[0]?.accounts;
          }
          
      
          let formData = {
            open: true,
            referCheque: true,
            name: contractData.name || '',
            email: contractData.email || '',
            amount: contractData.amount || 0,
            chequeId: contractData.chequeId || 0,
            debitAccount: debitAccount,
            creditAccount: chartsOfAccount || '',
            chequeStatus: 'Refund to Customer',
          }

          const query = new URLSearchParams(formData).toString();
          router.push(`/panel/realEstate/chequeTransactions?${query}`);

        }
      } catch (error) {
        // Handle the error here
        console.error("Error in Cheque Trx:", error);
      }
    }

    const refundToSupplier = async(e)=>{
      e.preventDefault();

      try {

        if(selectedIds.length > 1){
          toast.error('select only 1 item' , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
        }
        else{

          const contractData = await newContract(e);

          let chartsOfAccount;
          const filteredData = dbPaymentMethod.filter(item => item.paymentType === contractData.receivedBy);
          if (filteredData.length > 0) {
            chartsOfAccount = filteredData[0]?.chartsOfAccount;
          }

          let debitAccount;
          const filteredContacts = dbContacts.filter(item => item.email === contractData.email);
          if (filteredContacts.length > 0) {
            debitAccount = filteredContacts[0]?.accounts;
          }
          
      
          let formData = {
            open: true,
            referCheque: true,
            name: contractData.name || '',
            email: contractData.email || '',
            amount: contractData.amount || 0,
            chequeId: contractData.chequeId || 0,
            debitAccount: debitAccount,
            creditAccount: chartsOfAccount || '',
            chequeStatus: 'Refund to Supplier',
          }

          const query = new URLSearchParams(formData).toString();
          router.push(`/panel/realEstate/chequeTransactions?${query}`);
        }
      } catch (error) {
        // Handle the error here
        console.error("Error in Cheque Trx:", error);
      }

    }


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
  
        const header = ['journalNo','journalDate', 'name', 'chqNo' , 'dueDate', 'totalAmount', 'chequeStatus']
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
        importEntries(row);
    }

    const importEntries = async(row)=>{
      const data = { userEmail, row, path:'importCheques', importEntries:'importEntries' };
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
            <div className="pl-4 flex">
              <h3 className="text-lg font-bold leading-6 text-gray-900">{t('chequeTitle')}</h3>
            </div>
          </div>
          <div className="mt-2 md:col-span-2 md:mt-0">

            <div className='flex justify-between'>

              <div className='w-1/4'>
                <div className="relative rounded-lg bg-gray-50 border-2 border-blue-800">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-4 h-4 text-blue-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                      </svg>
                  </div>
                  <div className='pl-8'>
                    <input value={search} onChange={handleChange} type="text" id="search" name='search' className="block w-full p-2 text-sm text-gray-900 rounded-lg bg-gray-50 outline-none placeholder:text-gray-500" placeholder={t('chequeSearchLabel')} required/>
                  </div>
                </div>
              </div>

              <div className='flex'>

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

                <div>
                  <DownloadTableExcel
                    filename="Cheques"
                    sheet="Cheques"
                    currentTableRef={componentRef.current}>
                    <button type="button" className="text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2">
                      {t('export')}
                      <BiExport className='text-lg ml-2'/>
                    </button>
                  </DownloadTableExcel>
                </div>

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
                  documentTitle='Units'
                  pageStyle='print'
                />

              </div>
              
            </div>

            {isChecked === true ? <div className='flex justify-end my-2'>
              <button onClick={(e)=>depositCheck(e, true)} className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm p-2 text-center mr-2 mb-2`} disabled={isAdmin === false}>
                {t('depositFunds')}
              </button>
              <button onClick={(e)=>returnCheque(e, true)} className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm p-2 text-center mr-2 mb-2`} disabled={isAdmin === false}>
                {t('returnFunds')}
              </button>
              <button onClick={(e)=>refundToCustomer(e, true)} className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm p-2 text-center mr-2 mb-2`} disabled={isAdmin === false}>
                {t('refundToCustomer')}
              </button>
              <button onClick={(e)=>refundToSupplier(e, true)} className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm p-2 text-center mr-2 mb-2`} disabled={isAdmin === false}>
                {t('refundToSupplier')}
              </button>
              <button onClick={(e)=>clearCheck(e)} className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm p-2 text-center mr-2 mb-2`} disabled={isAdmin === false}>
                {t('clearFunds')}
              </button>
              
            </div>: ''}

            <form method="POST">
              <div className="overflow-hidden shadow sm:rounded-md">
                
                <div className="mt-2 overflow-x-auto shadow-sm">
                  <table ref={componentRef} className="w-full text-sm text-left text-gray-500 ">
                    <thead className="text-[11px] text-gray-700 uppercase bg-[#e9ecf7]">
											<tr>
												<th scope="col" className="p-4">
													<div className="flex items-center">
														<input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
													</div>
												</th>
												<th scope="col" className="p-1">
														{t('voucherNo')}
												</th>
												<th scope="col" className="p-1">
														{t('date')}
												</th>
												<th scope="col" className="p-1">
														{t('name')}
												</th>
												<th scope="col" className="p-1">
														{t('chqNo')}
												</th>
												<th scope="col" className="p-1">
														{t('dueDate')}
												</th>
												<th scope="col" className="p-1">
														{t('amount')}
												</th> 
												<th scope="col" className="p-1">
														{t('chequeStatus')}
												</th> 
												<th scope="col" className="p-1">
														{t('view')}
												</th>
											</tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.map((item, index)=>{

                      return <tr key={index} className="text-[13px] bg-white border-b hover:bg-gray-50">
												<td className="w-4 p-4">
													<div className="flex items-center">
														<input id="checkbox-table-search-1" type="checkbox" onChange={e => handleRowCheckboxChange(e, item._id)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
													</div>
												</td>
												<td className="p-1">
													<div className='text-sm text-black font-semibold'>{item.journalNo}</div>
												</td>
												<td className="p-1">
													<div className='text-sm'>{moment(item.journalDate).utc().format('D MMM YYYY')}</div>
												</td>
												<td className="p-1">
													<div className='text-sm'>{item.name}</div>
												</td>
												<td className="p-1">
													<div className='text-sm'>#{item.chqNo || item.inputList[0].ref}</div>
												</td>
												<td className="p-1">
													<div className='text-sm'>{item.type === 'ReceiptVoucher' 
                          ? moment(item.inputList[0].chequeDueDate).utc().format('D MMM YYYY') 
                          : moment(item.dueDate).utc().format('D MMM YYYY')}</div>
												</td>
												<td className="p-1">
													<div className='text-sm text-black font-semibold'>{item.inputList[0].paid || item.totalAmount}</div>
												</td>
												<td className="p-1">
													<div className='text-sm tracking-wider text-green-700 font-extrabold'>{item.chequeStatus || ''}</div>
												</td>
                        <td className="flex items-center py-4 space-x-4 rtl:space-x-reverse">
                          <button type='button' onClick={(e)=>{getData(item._id, item.type)}} 
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


        {/* Pagination */}
        <div className="flex items-center gap-8 justify-end mr-10">
          <IconButton
            size="sm"
            variant="outlined"
            onClick={prev}
            disabled={active === 1}
          >
            <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
          </IconButton>
          <Typography color="gray" className="font-normal pt-4">
              Page <strong className="text-gray-900">{active}</strong> of{" "}
              <strong className="text-gray-900">{totalNoOfPages}</strong>
          </Typography>
          <IconButton
            size="sm"
            variant="outlined"
            onClick={next}
            disabled={active === totalNoOfPages}
          >
            <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
          </IconButton>
        </div>
      </div>

      {/* Sales invoice form open */}
      <Transition.Root show={openSalesInv === 'true' ? true : false} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={()=>{router.push('?openSalesInv=false')}}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
          </Transition.Child>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95" enterTo="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 md:scale-100" leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
                <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-5xl">
                  <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                    <button type='button' className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-6 lg:right-8" onClick={() => router.push('?openSalesInv=false')}>
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <div className='w-full'>
                      <form method="POST">
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
                                <label htmlFor="journalNo" className="block text-sm font-medium text-gray-700">
                                  {t('journalNo')}
                                </label>
                                <input
                                  type="text"
                                  name="journalNo"
                                  value={journalNo}
                                  id="journalNo"
                                  className="mt-1 cursor-not-allowed p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  readOnly
                                />
                              </div>
                            </div>

                            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
                              <div className="w-full">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                  {t('name')}
                                </label>
                                <input
                                  type="text"
                                  name="name"
                                  value={name}
                                  id="name"
                                  className="mt-1 cursor-not-allowed p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  readOnly
                                />
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
                                <label htmlFor="project" className="block text-sm font-medium text-gray-700">
                                  {t('project')}
                                </label>
                                <input
                                  type="text"
                                  name="project"
                                  value={project}
                                  id="project"
                                  className="mt-1 cursor-not-allowed p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  readOnly
                                />
                              </div>

                            </div>


                            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
                          
                              <div className="w-full">
                                <label htmlFor="receivedBy" className="block text-sm font-medium text-gray-700">
                                  {t('receivedBy')}
                                </label>
                                <input
                                  type="text"
                                  name="receivedBy"
                                  value={receivedBy}
                                  id="receivedBy"
                                  className="mt-1 cursor-not-allowed p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  readOnly
                                />
                              </div>

                              <div className="w-1/2">
                                <label htmlFor="chqNo" className="block text-sm font-medium text-gray-700">
                                  {t('chqNo')}
                                </label>
                                <input
                                  type="number"
                                  onChange={handleChange}
                                  name="chqNo"
                                  value={chqNo}
                                  id="chqNo"
                                  className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>

                              <div className="w-1/2">
                                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                                {t('dueDate')}
                                </label>
                                <input 
                                  type="date"
                                  onChange={handleChange}
                                  name="dueDate"
                                  id="dueDate"
                                  value={dueDate}
                                  className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  required
                                />
                              </div>

                            </div>



                            <div className='flex space-x-4 rtl:space-x-reverse my-10'>

                                  <table className="w-full text-sm text-left text-gray-500 ">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                      <tr>
                                        <th scope="col" className="p-2">
                                            {t('products')}
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
                                      </tr>
                                    </thead>
                                  
                                    <tbody >
                                    {inputList.map(( inputList , index)=>{
                                      return <tr key={index} className="bg-white text-black border-b hover:bg-gray-50">
                                      
                                        <td className="p-2 w-1/5">
                                          <input
                                            type="text"
                                            value={ inputList.products }
                                            name="products"
                                            id="products"
                                            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                          />
                                        </td>
                                        <td className="p-2">
                                          <input
                                            type="text"
                                            value={ inputList.desc }
                                            name="desc"
                                            id="desc"
                                            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                          />
                                        </td>

                                        <td className="p-2">
                                          <input
                                            type="number"
                                            value={ inputList.amount }
                                            name="amount"
                                            id="amount"
                                            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                          />
                                        </td>

                                        <td className="p-2 w-1/6">
                                          <input
                                            type="number"
                                            value={ inputList.taxRate }
                                            name="taxRate"
                                            id="taxRate"
                                            className="mt-1 p-2 cursor-not-allowed block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            readOnly
                                          />
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
                                    {t('fullTax')}
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
                                  <label htmlFor="discount" className="block w-full text-sm font-medium text-gray-700">
                                    {t('discount')}
                                  </label>
                                  <input
                                    type="number"
                                    value = { discount }
                                    onChange={handleChange}
                                    name="discount"
                                    id="discount"
                                    className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                              documentTitle='Sales Invoice'
                              pageStyle='print'
                            />

                            <button type='button' onClick={()=>{editEntry(id)}} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">{t('saveChanges')}</button>
                            {isOpenSaveChange && <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">{t('save')}</button>}
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

      {/* Receipt Voucher form open */}
      <Transition.Root show={openReceiptVoucher === 'true' ? true : false} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={()=>{router.push('?openReceiptVoucher=false')}}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95" enterTo="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 md:scale-100" leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
              <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-0 lg:max-w-full">
                <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:py-8">
                  <button type='button' className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-6 lg:right-8" onClick={() => router.push('?openReceiptVoucher=false')}>
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <div className='w-full'>
                    <form method="POST">
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
                              <label htmlFor="journalNo" className="block text-sm font-medium text-gray-700">
                                {t('journalNo')}
                              </label>
                              <input
                                type="text"
                                name="journalNo"
                                value={journalNo}
                                id="journalNo"
                                className="mt-1 cursor-not-allowed p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                readOnly
                              />
                            </div>
                          </div>

                          <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
                            
                            <div className="w-full">
                              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                {t('name')}
                              </label>
                              <input
                                type="text"
                                onChange={handleChange}
                                name="name"
                                value={name}
                                id="name"
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              
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
                          </div>

                          <div className='flex space-x-4 rtl:space-x-reverse mb-14'>


                            <div className="w-1/4">
                              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                {t('amount')}
                              </label>
                              <input
                                type="number"
                                name="amount"
                                value={totalPaid}
                                id="amount"
                                className="mt-1 cursor-not-allowed p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                readOnly
                              />
                            </div>
                        
                            <div className="w-1/3">
                              <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
                                {t('reference')}
                              </label>
                              <input
                                type="text"
                                name="reference"
                                value={reference}
                                onChange={handleChange}
                                id="reference"
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>

                          </div>

                          <div className='space-x-4 rtl:space-x-reverse my-10'>
                            <table className="w-full text-sm text-left text-gray-500 ">
                              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                  <th scope="col" className="p-2">
                                      {t('billNo')}
                                  </th>
                                  <th scope="col" className="p-2">
                                      {t('paidBy')}
                                  </th>
                                  <th scope="col" className="p-2">
                                      {t('desc')}
                                  </th>
                                  <th scope="col" className="p-2">
                                      {t('dueDate')}
                                  </th>
                                  <th scope="col" className="p-2">
                                      {t('bank')}
                                  </th>
                                  <th scope="col" className="p-2">
                                      {t('reference')}
                                  </th>
                                  <th scope="col" className="p-2 min-w-[10px]">
                                      {t('paid')}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                              {inputList.map(( item , index)=>{

                                return <tr key={index} className="bg-white flex-col text-black border-b hover:bg-gray-50">
                                  <td className="p-2">
                                    {item.billNo ? item.billNo : 'Undefined'}
                                  </td>

                                  <td className="p-2 max-w-[140px]">
                                    <input
                                      type="text"
                                      value={ item.paidBy }
                                      name="desc"
                                      id="desc"
                                      className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </td>
                                  <td className="p-2 max-w-[150px]">
                                    <input
                                      type="text"
                                      value={ item.desc }
                                      name="desc"
                                      id="desc"
                                      className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </td>
                                  <td className="p-2">
                                    <input
                                      type="date"
                                      value={ item.chequeDueDate }
                                      name="chequeDueDate"
                                      id="chequeDueDate"
                                      className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </td>

                                  <td className="p-2">
                                    <input
                                      type="text"
                                      value={ item.bank }
                                      name="desc"
                                      id="desc"
                                      className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </td>

                                  <td className="p-2 max-w-[140px]">
                                    <input
                                      type="text"
                                      value={ item.ref }
                                      name="ref"
                                      id="ref"
                                      className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </td>


                                  <td className="p-2 max-w-[130px]">
                                    <input
                                      type="number"
                                      value={ item.paid }
                                      name="paid"
                                      id="paid"
                                      className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </td>

                                </tr>})}

                              </tbody>
                            </table>
                            { inputList.length === 0  ? <h1 className='text-red-600 text-center text-base my-3'>No data found!</h1> : ''}
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
                            documentTitle='Receipt Voucher'
                            pageStyle='print'
                          />

                          {isOpenSaveChange && <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">{t('save')}</button>}
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
  let dbCheques = await Cheque.find()

  let dbBuildings = await Buildings.find()
  let dbContacts = await Contact.find()
  let dbTenants = await Contact.find({'type': 'Tenant'})
  let dbPaymentMethod = await PaymentMethod.find()



  // Pass data to the page via props
  return {
    props: {
      dbCheques: JSON.parse(JSON.stringify(dbCheques)),
      dbContacts: JSON.parse(JSON.stringify(dbContacts)),
      dbTenants: JSON.parse(JSON.stringify(dbTenants)),
      dbBuildings: JSON.parse(JSON.stringify(dbBuildings)),
      dbPaymentMethod: JSON.parse(JSON.stringify(dbPaymentMethod)),
    }
  }
}   
export default Cheques;