import React, { useEffect, useState } from 'react'
import FullLayout from '@/panel/layouts/FullLayout';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { ToastContainer } from 'react-toastify';
import { FiUsers } from 'react-icons/fi';
import { Card, CardBody, Accordion, AccordionHeader, AccordionBody, Tabs, TabsHeader, TabsBody, Tab, TabPanel} from "@material-tailwind/react";
import mongoose from "mongoose";
import ContractAndTenant from 'models/ContractAndTenant';
import moment from 'moment/moment';
import ChequeTransaction from 'models/ChequeTransaction';
import Cheque from 'models/Cheque';
import ReceiptVoucher from 'models/ReceiptVoucher';
import CreditSalesInvoice from 'models/CreditSalesInvoice';
import CreditNote from 'models/CreditNote';
import PaymentVoucher from 'models/PaymentVoucher';
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

const TenantStatement = ({ dbContracts, dbChequeTrx, dbCheques, dbReceipts, dbCreditSalesInvoices, dbCreditNotes, dbPaymentVoucher }) => {

  const router = useRouter();
  const { t } = useTranslation('realEstate')
  const searchParams = useSearchParams()
  const tenantId = searchParams.get('id')

  const [openTenantExtraForm, setOpenTenantExtraForm] = React.useState(1);
  const handleOpenTenantExtraForm = (value) => setOpenTenantExtraForm(openTenantExtraForm === value ? 0 : value);

  const [selectedIds, setSelectedIds] = useState([]);

  const [tenantName, setTenantName] = useState('')
  const [tenantEmail, setTenantEmail] = useState('')
  const [buildingNameInEnglish, setBuildingNameInEnglish] = useState('')
  const [unitNo, setUnitNo] = useState('')
  const [tenantPhoneNo, setTenantPhoneNo] = useState('')

  const [filteredContracts, setFilteredContracts] = useState([])
  const [filteredTrx, setFilteredTrx] = useState([])


  function handleRowCheckboxChange(e, id) {

    const isChecked = selectedIds.includes(id);

    if (isChecked) {
      setSelectedIds(selectedIds.filter(rowId => rowId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  }
  
  useEffect(() => {

    let myUser = JSON.parse(localStorage.getItem("myUser"));
    let userEmail = myUser.businessName;

    let headingData = dbContracts.filter((item)=> item._id === tenantId)

    if(headingData.length > 0) {
      setTenantEmail(headingData[0].tenantEmail)
      setBuildingNameInEnglish(headingData[0].buildingNameInEnglish)
      setUnitNo(headingData[0].unitNo)
      setTenantPhoneNo(headingData[0].tenantPhoneNo)
      setTenantName(headingData[0].tenantName)
    }

    let filteredContracts = dbContracts.filter((item)=> item.tenantEmail === headingData[0].tenantEmail)
    setFilteredContracts(filteredContracts)
  


    // Make the trx Array
    let filteredTrx = dbChequeTrx
    .filter((item) => {
      if(item.email === headingData[0].tenantEmail && item.userEmail === userEmail){
        
        let inputList = item.inputList;
        
        if(!item.chequeStatus){
          item.chequeStatus = 'Deposited';
        }
        let hasAccountsReceivable = inputList.some((element) => {
          return element.account === 'Accounts Receivable';
        });

        if (hasAccountsReceivable) {
          return item; // Include the item in the filtered result
        }
      }
      else{
        return false;
      }
    })
      .map((item) => {

        let chqId = item.chequeId;
        let chqData = dbCheques.find((newItem) => newItem._id === chqId);
        item.totalCredit = 0;
        return {
          ...item, // Include all properties from item
          chqData: chqData, // Add chqData as a new property
          balance:0
        };
    });
    


    // Credit Sales Invoice
    dbCreditSalesInvoices = dbCreditSalesInvoices.map((item)=>{
      if(item.email === headingData[0].tenantEmail && item.userEmail === userEmail){
        return {
          ...item,
          journalNo: item.billNo,
          chequeStatus: 'Received',
          totalDebit: parseInt(item.totalAmount, 10),
          totalCredit: 0,
          balance:0
        };
      }
    })


    // Credit Note Invoice
    dbCreditNotes = dbCreditNotes.map((item)=>{
      if(item.email === headingData[0].tenantEmail && item.userEmail === userEmail){
        return {
          ...item,
          chequeStatus: 'Received',
          totalDebit: 0,
          totalCredit: parseInt(item.totalAmount, 10),
          balance:0
        };
      }
    })


    // Payment Voucher
    dbPaymentVoucher = dbPaymentVoucher.map((item)=>{
      if(item.email === headingData[0].tenantEmail && item.userEmail === userEmail){
        return {
          ...item,
          chequeStatus: 'Received',
          totalDebit: parseInt(item.totalPaid, 10),
          totalCredit: 0,
          balance:0
        };
      }
    })

    // Receipts Voucher
    dbReceipts = dbReceipts.map((receipt) => {

      if(receipt.userEmail === userEmail && receipt.email === headingData[0].tenantEmail){

        // const filteredInputList = receipt.inputList.filter((item) => item.paidBy !== 'Cheque');
        const filteredInputList = receipt.inputList;
        const totalAmount = filteredInputList.reduce((total, item) => total + parseInt(item.paid), 0);
        
        if (filteredInputList.length > 0) {
          receipt.inputList = filteredInputList;
          return {
            ...receipt,
            chequeStatus: 'Deposited',
            totalDebit: 0,
            totalCredit: parseInt(totalAmount, 10),
            balance:0
          };
        }
      }
    });


    filteredTrx = filteredTrx.filter(item => item !== undefined);
    dbCreditSalesInvoices = dbCreditSalesInvoices.filter(item => item !== undefined);
    dbCreditNotes = dbCreditNotes.filter(item => item !== undefined);
    dbPaymentVoucher = dbPaymentVoucher.filter(item => item !== undefined);
    dbReceipts = dbReceipts.filter(item => item !== undefined);


    filteredTrx = filteredTrx.concat( dbCreditSalesInvoices, dbReceipts, dbCreditNotes, dbPaymentVoucher);
    setFilteredTrx(filteredTrx);
    

  }, [tenantId])

  


  const newContractData = [
      
    {
      label: t('contracts'),
      value: "contracts",
      icon: FiUsers,
      desc: (
        <div>

          <div className="overflow-hidden shadow sm:rounded-md">
            
            <div className="overflow-x-auto shadow-sm">
              <table className="w-full text-sm text-left text-gray-500 ">
                <thead className="text-[11px] text-gray-700 uppercase bg-[#f2f4f5]">
                  <tr className=''>
                    <th scope="col" className="px-4 py-[16px]">
                        {t('contractStartDate')}
                    </th>
                    <th scope="col" className="p-1">
                        {t('contractEndDate')}
                    </th>
                    <th scope="col" className="p-1">
                        {t('unitRent')}
                    </th>
                    <th scope="col" className="p-1">
                        {t('rentParking')}
                    </th>
                    <th scope="col" className="pr-3">
                        {t('contractStatus')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContracts.map((item, index)=>{
                  return <tr key={index} className="text-[13px] bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-[15px] w-[150px]">
                      {moment(item.newContractStartDate).utc().format('D MMM YYYY')}
                    </td>
                    <td className="p-1 w-[90px]">
                      {moment(item.newContractEndDate).utc().format('D MMM YYYY')}
                    </td>
                    <td className="p-1 w-[100px] text-black font-semibold">
                      {(item.newContractUnitRent).toLocaleString()}
                    </td>
                    <td className="p-1 w-[100px] text-black font-semibold">
                      {(item.newContractRentParking).toLocaleString()}
                    </td>
                    <td className="p-1 w-[100px] text-green-800 font-semibold">
                      {item.newContractStatus}
                    </td>
                  </tr>})}
                  
                </tbody>
              </table>
              { filteredContracts.length === 0  ? <h1 className='text-red-600 text-center text-base my-3'>No data found!</h1> : ''}
            </div>

          </div>
        </div>
      ),
    },
    {
      label: t('account'),
      value: "account",
      icon: FiUsers,
      desc: (
        <div>
          <div className="overflow-hidden shadow sm:rounded-md">
            <div className="overflow-x-auto shadow-sm">
              <table className="w-full text-sm text-left text-gray-500 ">
                <thead className="text-[11px] text-gray-700 uppercase bg-[#f2f4f5]">
                  <tr className=''>
                    <th scope="col" className="px-4 py-[16px]">
                      {t('trxType')}
                    </th>
                    <th scope="col" className="p-1">
                      {t('trxNo')}
                    </th>
                    <th scope="col" className="p-1">
                      {t('desc')}
                    </th>
                    <th scope="col" className="p-1">
                      {t('date')}
                    </th>
                    <th scope="col" className="p-1">
                      {t('debit')}
                    </th>
                    <th scope="col" className="p-1">
                      {t('credit')}
                    </th>
                    <th scope="col" className="p-1">
                      {t('balance')}
                    </th>
                    <th scope="col" className="pr-3">
                      {t('status')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrx.map((item, index)=>{

                    let previousBalance = 0;
                    filteredTrx.forEach((item) => {
                      item.balance = previousBalance + item.totalDebit - item.totalCredit;
                      previousBalance = item.balance;
                    });

                  return <tr key={index} className="text-[13px] bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-[15px] w-[150px] text-black font-medium">
                      {item.type === 'JV' ? item.path : item.type}
                    </td>
                    <td className="p-1 w-[90px]">
                      {item.journalNo}
                    </td>
                    <td className="p-1 w-[100px]">
                      {item.desc}
                    </td>
                    <td className="p-1 w-[100px]">
                      {moment(item.journalDate).utc().format('D MMM YYYY')}
                    </td>
                    <td className="p-1 w-[100px] text-black font-medium">
                      {(item.totalDebit).toLocaleString() || ''}
                    </td>
                    <td className="p-1 w-[100px] text-black font-medium">
                      {(item.totalCredit).toLocaleString() || ''}
                    </td>
                    <td className="p-1 w-[100px] text-black font-semibold">
                      {(item.balance).toLocaleString() || ''}
                    </td>
                    <td className="p-1 w-[100px] text-green-800 font-semibold">
                      {item.chequeStatus || ''}
                    </td>
                  </tr>})}
                  
                </tbody>
              </table>
              { filteredTrx.length === 0  ? <h1 className='text-red-600 text-center text-base my-3'>No data found!</h1> : ''}
            </div>
          </div>

        </div>
      ),
    },
  ];
  

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
          <h3 className="text-lg font-bold leading-6 text-gray-900">{t('statementLabel')}</h3>
        </div>
      </div>
      <div className="mt-2 md:col-span-2 md:mt-0">

        <Card className="w-full">
          <CardBody>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="mb-4 h-12 w-12 text-blue-800"
            >
              <path
                fillRule="evenodd"
                d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
                clipRule="evenodd"
              />
              <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 005.022-2.051.75.75 0 10-1.202-.897 3.744 3.744 0 01-3.008 1.51c0-1.23.592-2.323 1.51-3.008z" />
            </svg>

            <div className='flex w-full'>
              <div className='flex flex-col space-y-8 w-3/5'>

                <div className='w-full flex space-x-4 rtl:space-x-reverse'>
                  <div className="w-full">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      {t('name')}
                    </label>
                    <input 
                      type="text"
                      name="name"
                      value={tenantName}
                      id="name"
                      className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      readOnly
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="building" className="block text-sm font-medium text-gray-700">
                      {t('building')}
                    </label>
                    <input
                      type="text"
                      name="building"
                      value={buildingNameInEnglish}
                      id="building"
                      className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      readOnly
                    />
                  </div>
                </div>
                <div className='w-full flex space-x-4 rtl:space-x-reverse'>
                  <div className="w-1/2">
                    <label htmlFor="unitNo" className="block text-sm font-medium text-gray-700">
                      {t('unitNo')}
                    </label>
                    <input 
                      type="number"
                      name="unitNo"
                      value={unitNo}
                      id="unitNo"
                      className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      readOnly
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700">
                      {t('phoneNo')}
                    </label>
                    <input
                      type="number"
                      name="phoneNo"
                      value={tenantPhoneNo}
                      id="phoneNo"
                      className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      readOnly
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      {t('email')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={tenantEmail}
                      id="email"
                      className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      readOnly
                    />
                  </div>
                </div>
                
              </div>
              <div className='w-2/5 flex justify-center'>
                <img
                  className="h-44 w-44 rounded-full object-cover object-center"
                  src="https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
                  alt="nature image"
                />
              </div>
            </div>
            
          </CardBody>
        </Card>

        <Card className="w-full my-4">
          <CardBody>
            <div className='flex w-full'>
              <Tabs value="contracts" className='w-full'>
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
                <TabsBody className='w-full'>
                  {newContractData.map(({ value, index, desc }) => (
                    <TabPanel key={index} value={value} className='p-0'>
                      {desc}
                    </TabPanel>
                  ))}
                </TabsBody>
              </Tabs>
            </div>
          </CardBody>
        </Card>
        
      </div>
    </div>
  </div>

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
  let dbContracts = await ContractAndTenant.find()
  let dbChequeTrx = await ChequeTransaction.find()
  let dbReceipts = await ReceiptVoucher.find()
  let dbCheques = await Cheque.find()
  let dbCreditSalesInvoices = await CreditSalesInvoice.find()
  let dbCreditNotes = await CreditNote.find()
  let dbPaymentVoucher = await PaymentVoucher.find()


  // Pass data to the page via props
  return {
    props: {
      dbContracts: JSON.parse(JSON.stringify(dbContracts)),
      dbChequeTrx: JSON.parse(JSON.stringify(dbChequeTrx)),
      dbReceipts: JSON.parse(JSON.stringify(dbReceipts)),
      dbCheques: JSON.parse(JSON.stringify(dbCheques)),
      dbCreditSalesInvoices: JSON.parse(JSON.stringify(dbCreditSalesInvoices)),
      dbCreditNotes: JSON.parse(JSON.stringify(dbCreditNotes)),
      dbPaymentVoucher: JSON.parse(JSON.stringify(dbPaymentVoucher)),
    }
  }
}   

export default TenantStatement