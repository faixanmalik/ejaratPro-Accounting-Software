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
import Employees from 'models/Employees';
import ReactToPrint from 'react-to-print';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation'
import Link from 'next/link';
import ContractAndTenant from 'models/ContractAndTenant';

import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { BiUserCircle } from 'react-icons/bi';
import { BsCashCoin } from 'react-icons/bs';
import { FiUsers } from 'react-icons/fi';
import { MdAccountBox } from 'react-icons/md';


import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Typography,
  Select, 
  Option,
  IconButton,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import Contact from 'models/Contact';
import Product from 'models/Product';
import useTranslation from 'next-translate/useTranslation';

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


const ContractTermination = ({ dbProducts, dbTenants, dbContracts, dbContacts}) => {

  const router = useRouter();
  const { t } = useTranslation('realEstate');
  const searchParams = useSearchParams()
  const open = searchParams.get('open')
  const contractId = searchParams.get('contractId')


  const [inputList, setInputList] = useState([
    { products:'', amount:'', accruedRent:'', refund: '', },
    { products:'', amount:'', accruedRent:'', refund: '', },
    { products:'', amount:'', accruedRent:'', refund: '', },
  ]);

  const [totalDays, setTotalDays] = useState(0)

  const [contractStartDate, setContractStartDate] = useState('')
  const [contractEndDate, setContractEndDate] = useState('')
  

  useEffect(() => {

    if(contractId){

      let filterContractData = dbContracts.filter((item)=>{
        return item._id === contractId;
      })
      
      
      const { tenantName, buildingNameInEnglish, newContractUnitRent, newContractRentParking, newContractSecurityDeposit, unitNo, newContractStartDate, newContractEndDate } = filterContractData[0]
      
      let contractStartDate = moment(newContractStartDate).utc().format('YYYY-MM-DD')

      // let newContractEndDate = moment(newContractEndDate).utc().format('YYYY-MM-DD')

      if(contractEndDate){
        setContractEndDate(contractEndDate)
      }
      else{
        let momentContractEndDate = moment(newContractEndDate).utc().format('YYYY-MM-DD')
        setContractEndDate(momentContractEndDate)
      }
      
      let startDate = new Date(contractStartDate);
      let endDate = new Date(contractEndDate);
      let timeDifference = endDate.getTime() - startDate.getTime();
      let daysDifference = timeDifference / (1000 * 60 * 60 * 24) + 1;
      setTotalDays(daysDifference)
      
      setContractStartDate(contractStartDate)
      
      setTenant(tenantName)
      setBuildingNameInEnglish(buildingNameInEnglish)
      setUnitNo(unitNo)


      let referData = [
        { name: 'Unit Rent', index: 0, amount: newContractUnitRent},
        { name: 'Parking Rent', index: 1, amount: newContractRentParking},
        { name: 'Security Deposit', index: 2, amount: newContractSecurityDeposit},
      ]
      
      let updatedInputList = inputList.map((item, index) => {
        
        if(item.products === 'Security Deposit'){
          const matchingItem = referData.find((referItem) => referItem.index === index);

          if (matchingItem) {
            return {
              ...item,
              amount: matchingItem.amount,
              products: matchingItem.name,
              accruedRent: 0,
              refund: matchingItem.amount,
            };
          }
          return item;
        }
        else{
          const matchingItem = referData.find((referItem) => referItem.index === index);
          
          if (matchingItem) {
            return {
              ...item,
              amount: matchingItem.amount,
              products: matchingItem.name,
              accruedRent: ( matchingItem.amount / 365 ) * totalDays,
              refund: matchingItem.amount - (( matchingItem.amount / 365 ) * totalDays),
            };
          }
          return item;
        }
      });

      setInputList(updatedInputList);
    }
  }, [router, totalDays, contractEndDate])


  const [buildingNameInEnglish, setBuildingNameInEnglish] = useState('')
  const [unitNo, setUnitNo] = useState(100)
  const [tenant, setTenant] = useState('')


  // For print
  const speceficComponentRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
      
    if (name === 'contractEndDate') {
      setContractEndDate(value);
    }
  }


  const newContractData = [ 
    {
      label: t('endContract'),
      value: "endContract",
      icon: HiOutlineBuildingOffice2,
      desc: (
        <div>

          <div className='flex space-x-4 rtl:space-x-reverse mb-14'>

            <div className="w-8/12">
              <label htmlFor="tenant" className="block text-sm font-medium text-gray-700">
                {t('tenant')}
              </label>
              <input
                type="text"
                onChange={handleChange}
                name="tenant"
                value={tenant}
                id="tenant"
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="w-full">
              <label htmlFor="buildingNameInEnglish" className="block text-sm font-medium text-gray-700">
                {t('building')}
              </label>
              <input
                type="text"
                onChange={handleChange}
                name="buildingNameInEnglish"
                value={buildingNameInEnglish}
                id="buildingNameInEnglish"
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="w-8/12">
              <label htmlFor="unitNo" className="block text-sm font-medium text-gray-700">
                {t('unitNo')}
              </label>
              <input
                type="number"
                onChange={handleChange}
                name="unitNo"
                value={unitNo}
                id="unitNo"
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className='flex space-x-4 rtl:space-x-reverse mb-14'>

            <div className="w-full">
              <label htmlFor="newContractStartDate" className="block text-sm font-medium text-gray-700">
               {t('contractStartDate')}
              </label>
              <input
                type="date"
                onChange={handleChange}
                name="contractStartDate"
                value={contractStartDate}
                id="contractStartDate"
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="w-full">
              <label htmlFor="contractEndDate" className="block text-sm font-medium text-gray-700">
               {t('contractEndDate')}
              </label>
              <input
                type="date"
                onChange={handleChange}
                name="contractEndDate"
                value={contractEndDate}
                id="contractEndDate"
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="w-8/12">
              <label htmlFor="totalDays" className="block text-sm font-medium text-gray-700">
                {t('totalDays')}
              </label>
              <input
                type="number"
                name="totalDays"
                value={totalDays}
                id="totalDays"
                className="cursor-not-allowed mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                readOnly
              />
            </div>
          </div>

          <div className='flex space-x-4 rtl:space-x-reverse mb-14'>

            <table className="w-full text-sm text-left text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="p-2">
                      {t('products')}
                  </th>
                  <th scope="col" className="p-2">
                      {t('amount')}
                  </th>
                  <th scope="col" className="p-2">
                      {t('accuredRent')}
                  </th>
                  <th scope="col" className="p-2">
                      {t('refund')}
                  </th>
                </tr>
              </thead>

              <tbody >
              {inputList.map(( inputList , index)=>{
                return <tr key={index} className="bg-white text-black border-b hover:bg-gray-50">
                
                  <td className="p-2 w-1/3">
                    <select id="products" name="products" onChange={ e => change(e, index) } value={inputList.products} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                      <option value=''>select products</option>
                      {dbProducts.map((item, index)=>{
                        return <option key={index} value={item.name}>{item.name}</option>
                      })}
                    </select>
                  </td>

                  <td className="p-2">
                    <input
                      type="number"
                      value={ inputList.amount }
                      name="amount"
                      id="amount"
                      className="cursor-not-allowed mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      readOnly
                    />
                  </td>

                  <td className="p-2">
                    <input
                      type="number"
                      value={ Math.floor(inputList.accruedRent) }
                      name="accruedRent"
                      id="accruedRent"
                      className="mt-1 p-2 cursor-not-allowed block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      readOnly
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={ Math.floor(inputList.refund) }
                      name="refund"
                      id="refund"
                      className="mt-1 p-2 cursor-not-allowed block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      readOnly
                    />
                  </td>

                </tr>})}
                  
              </tbody>
            </table>

          </div>

        </div>
      ),
    },
  ];

  const endContract = (e)=>{
    e.preventDefault();

    try {

      let formData = {
        open: true,
        refer: true,
        contractId: contractId,
        name: tenant,
        unitRent: 0,
        parkingRent: 0,
      }
  
      inputList.forEach(item => {
        if (item.products === 'Unit Rent') {
          formData.unitRent = Math.abs(Math.floor(item.refund));
        } else if (item.products === 'Parking Rent') {
          formData.parkingRent = Math.abs(Math.floor(item.refund));
        }
      });
      
      const query = new URLSearchParams(formData).toString();
      
      // totalDays > 365 then cr sales invoice, otherwise credit note
      if(totalDays > 365){
        router.push(`/panel/salesModule/creditSaleInvoice?${query}`);
      }
      else{
        router.push(`/panel/salesModule/creditNote?${query}`);
      }
      
    } catch (error) {
      console.log(error);
    }
    
  }

  const reverseSecurityDeposit = (e)=>{
    e.preventDefault();

    try {

      let formData = {
        open: true,
        refer: true,
        name: tenant,
        securityDeposit: 0,
      }
  
      inputList.forEach(item => {
        if (item.products === 'Security Deposit') {
          formData.securityDeposit = Math.abs(Math.floor(item.refund));
        }
      });
  
      const query = new URLSearchParams(formData).toString();
      router.push(`/panel/salesModule/creditNote?${query}`);
      
    } catch (error) {
      console.log(error);
    }
  }

  const returnCheques = (e)=>{
    e.preventDefault();

    try {

      let formData = {
        name: tenant,
      }
      const query = new URLSearchParams(formData).toString();
      router.push(`/panel/realEstate/cheques?${query}`);
      
    } catch (error) {
      console.log(error);
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

    <Transition.Root show={open === 'true' ? true : false} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={()=>{router.push('/panel/realEstate/contractAndTenants')}}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95" enterTo="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 md:scale-100" leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
              <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-2 lg:max-w-5xl">
                <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6">
                  <button type='button' className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-6 lg:right-8" onClick={() => router.push('/panel/realEstate/contractAndTenants')}>
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <div className='w-full'>
                    <form method="POST" onSubmit={(e)=>{submitNewContract(e, false)}}>
                      <div className="overflow-hidden shadow sm:rounded-md">
                        <div ref={speceficComponentRef} className="bg-white py-5">


                          <Tabs value="endContract">
                            <TabsHeader className='bg-[#f0f3f4]'>
                              {newContractData.map(({ label, index, value, icon }) => (
                                <Tab key={index} value={value}>
                                  <div className="flex items-center gap-2">
                                    {React.createElement(icon, { className: "w-5 h-5" })}
                                    {label}
                                  </div>
                                </Tab>
                              ))}
                            </TabsHeader>
                            <TabsBody className='mt-5'>
                              {newContractData.map(({ value, index, desc }) => (
                                <TabPanel key={index} value={value}>
                                  {desc}
                                </TabPanel>
                              ))}
                            </TabsBody>
                          </Tabs>

                          <div className="flex justify-end bg-gray-50 px-4 py-3 text-right sm:px-6">

                            <div className='flex space-x-3 rtl:space-x-reverse'>

                              <button type="submit" onClick={(e)=>{endContract(e)}} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                {t('endContract')}
                              </button>

                              <button type="submit" onClick={(e)=>{ reverseSecurityDeposit(e) }} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                {t('reverseSecurityDeposit')}
                              </button>

                              <button type="submit" onClick={(e)=>{ returnCheques(e) }} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                {t('returnCheques')}
                              </button>

                              <Link target="_blank" href={`/panel/realEstate/tenantStatement?id=${contractId}`} className='no-underline inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                                {t('previewStatement')}
                              </Link>

                            </div>

                            
                          </div>
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
  let dbContacts = await Contact.find()
  let dbContracts = await ContractAndTenant.find()
  let dbTenants = await Contact.find({'type': 'Tenant'})
  let dbProducts = await Product.find()

  // Pass data to the page via props
  return {
    props: {
      dbContacts: JSON.parse(JSON.stringify(dbContacts)),
      dbContracts: JSON.parse(JSON.stringify(dbContracts)), 
      dbTenants: JSON.parse(JSON.stringify(dbTenants)),
      dbProducts: JSON.parse(JSON.stringify(dbProducts)),
    }
  }
}

export default ContractTermination