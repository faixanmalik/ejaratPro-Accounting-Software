import React, { useEffect, useRef, useState } from 'react'
import mongoose from "mongoose";
import moment from 'moment/moment';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import JournalVoucher from 'models/JournalVoucher';
import Charts from 'models/Charts';
import { ProSidebarProvider } from 'react-pro-sidebar';
import FullLayout from '@/panel/layouts/FullLayout';
import CreditSalesInvoice from 'models/CreditSalesInvoice';
import SalesInvoice from 'models/SalesInvoice';
import PurchaseInvoice from 'models/PurchaseInvoice';
import DebitNote from 'models/DebitNote';
import CreditNote from 'models/CreditNote';
import ReceiptVoucher from 'models/ReceiptVoucher';
import PaymentVoucher from 'models/PaymentVoucher';
import Expenses from 'models/Expenses';
import Product from 'models/Product';
import { NavItem } from 'reactstrap';
import PaymentMethod from 'models/PaymentMethod';
import ChequeTransaction from 'models/ChequeTransaction';
import useTranslation from 'next-translate/useTranslation';
import ReactToPrint from 'react-to-print';
import { AiOutlinePrinter } from 'react-icons/ai';

const GeneralLedger = ({ userEmail, dbPaymentMethod, dbChequeTransaction, dbProducts, dbExpensesVoucher, dbPaymentVoucher, dbReceiptVoucher, dbDebitNote, dbCreditNote, dbPurchaseInvoice, dbSalesInvoice, dbCreditSalesInvoice, dbJournalVoucher, dbCharts }) => {

    // Cash Receipt
    const { t } = useTranslation('reporting')

    const componentRef = useRef();
    const [printButton, setPrintButton] = useState(false)

    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [account, setAccount] = useState('')
    const [dbAccount, setDbAccount] = useState(false)
    const [newEntry, setNewEntry] = useState([])
    const [coaAccount, setCoaAccount] = useState('')
    const [filteredCharts, setFilteredCharts] = useState([])
    const [openingBalance, setOpeningBalance] = useState(0)



    useEffect(() => {

        let filteredCharts = dbCharts.filter((item)=>{
        return item.userEmail === userEmail;
        })
        setFilteredCharts(filteredCharts)
    
    }, [userEmail])
    


    useEffect(() => {

        

        if(account != 'Cash' && account != 'Bank' ){
            const dbchart = filteredCharts.filter((data) => {
                if (data.accountName === account) {
                    return data.account;
                }
            })

            
            if(!dbchart.length == 0){
                if(dbchart[0].account === 'Incomes' || dbchart[0].account === 'Equity' || dbchart[0].account === 'Liabilities'){
                    setDbAccount(true)
                }
                else{
                    setDbAccount(false)
                }
            }
        }
        else{
            setDbAccount(false)
        }


        const checkAccount = filteredCharts.filter((data) => {
            if (data.accountName === account) {
                return data.account;
            }
        })
        if(checkAccount.length > 0) {
            setCoaAccount(checkAccount[0].account)
        }

    }, [account, dbAccount])


    let dbAllEntries = [];
    const submit = ()=>{

        const filterAccount = filteredCharts.filter((item)=> {
            return item.accountName === account
        })
        if(filterAccount.length > 0){
            const openingBalance = filterAccount[0].balance;
            setOpeningBalance(openingBalance)
        }

        setPrintButton(true);

        let allVouchers = [];

        allVouchers = allVouchers.concat(dbExpensesVoucher, dbChequeTransaction, dbPaymentVoucher, dbReceiptVoucher, dbDebitNote, dbCreditNote, dbPurchaseInvoice, dbSalesInvoice, dbCreditSalesInvoice, dbJournalVoucher);

        // Data filter
        const dbAll = allVouchers.filter((data) => {

            if(data.userEmail === userEmail) {

                if(data.type === 'PurchaseInvoice'){
                    let journal = data.inputList.filter((newData)=>{
    
                        let debitAmount = newData.totalAmountPerItem - newData.taxAmount;
                        let creditAmount = newData.amount;
                        let debitAccount = newData.account;
                        let creditAccount = 'Accounts Payable';
    
                        if(account === debitAccount || account === creditAccount){
                            Object.assign(newData, {
                                coaAccount: account,
                                debit: account === debitAccount ? parseInt(debitAmount) : 0,
                                debitAccount: account === debitAccount ? debitAccount : '',
                                credit: account === creditAccount ? parseInt(creditAmount) : 0,
                                creditAccount: account === creditAccount ? creditAccount : '',
                                balance: 0
                            });
    
                            if(fromDate && toDate){
                                let checkDbDate = data.journalDate? data.journalDate : data.date;
                                const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                                if (dbDate >= fromDate && dbDate <= toDate) {
                                    return newData;
                                }
                            }
                            else {
                                return newData;
                            }
                        }
                    })
                    dbAllEntries = dbAllEntries.concat(journal);
                }
                else if(data.type === 'ReceiptVoucher'){
                    
                    let journal = data.inputList.filter((newData)=>{
    
                        let dbAccount = newData.paidBy;
                        let dbFromAccount = dbPaymentMethod.filter((item)=>{
                            return item.chartsOfAccount === account && item.paymentType === dbAccount;
                        });
    
                        let linkedAccountCOA;
    
                        if (dbFromAccount.length > 0) {
                            linkedAccountCOA = dbFromAccount[0].chartsOfAccount;
                        }
    
                        let debitAmount = newData.paid;
                        let creditAmount = newData.paid;
                        let debitAccount = linkedAccountCOA;
                        let creditAccount = 'Accounts Receivable';
    
                        if(account === debitAccount || account === creditAccount){
                            Object.assign(newData, {
                                coaAccount: account,
                                account: account,
                                debit: account === debitAccount ? parseInt(debitAmount) : 0,
                                debitAccount: account === debitAccount ? debitAccount : '',
                                credit: account === creditAccount ? parseInt(creditAmount) : 0,
                                creditAccount: account === creditAccount ? creditAccount : '',
                                balance: 0
                            });
    
                            if(fromDate && toDate){
                                let checkDbDate = data.journalDate? data.journalDate : data.date;
                                const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                                if (dbDate >= fromDate && dbDate <= toDate) {
                                    return newData;
                                }
                            }
                            else {
                                return newData;
                            }
                        }
                    })
                    dbAllEntries = dbAllEntries.concat(journal);
                }
                else if(data.type === 'PaymentVoucher'){
    
                    let dbAccount = data.fromAccount;
                    let dbFromAccount = dbPaymentMethod.filter((item)=>{
                        return item.chartsOfAccount === account && item.paymentType === dbAccount;
                    });
    
                    let linkedAccountCOA;
    
                    if (dbFromAccount.length > 0) {
                        linkedAccountCOA = dbFromAccount[0].chartsOfAccount;
                    }
    
                    let debitAmount = data.totalPaid;
                    let debitAccount = 'Accounts Payable';
                    let creditAmount = data.totalPaid;
                    let creditAccount = linkedAccountCOA;
    
                    if(account === debitAccount || account === creditAccount){
                        Object.assign(data, {
                            coaAccount: account,
                            account: account,
                            debit: account === debitAccount ? parseInt(debitAmount) : 0,
                            debitAccount: account === debitAccount ? debitAccount : '',
                            credit: account === creditAccount ? parseInt(creditAmount) : 0,
                            creditAccount: account === creditAccount ? creditAccount : '',
                            balance: 0
                        });
    
                        if(fromDate && toDate){
                            let checkDbDate = data.journalDate? data.journalDate : data.date;
                            const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                            if (dbDate >= fromDate && dbDate <= toDate) {
                                return data;
                            }
                        }
                        else {
                            return data;
                        }
                    }
                }
                else if(data.type === 'DebitNote'){
                    
                    let journal = data.inputList.filter((newData)=>{
    
                        let debitAmount = newData.amount;
                        let creditAmount = newData.totalAmountPerItem;
                        let debitAccount = 'Accounts Payable';
                        let creditAccount = 'Purchase Return';
    
                        if(account === debitAccount || account === creditAccount){
                            Object.assign(newData, {
                                coaAccount: account,
                                account: account,
                                debit: account === debitAccount ? parseInt(debitAmount) : 0,
                                debitAccount: account === debitAccount ? debitAccount : '',
                                credit: account === creditAccount ? parseInt(creditAmount) : 0,
                                creditAccount: account === creditAccount ? creditAccount : '',
                                balance: 0
                            });
    
                            if(fromDate && toDate){
                                let checkDbDate = data.journalDate? data.journalDate : data.date;
                                const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                                if (dbDate >= fromDate && dbDate <= toDate) {
                                    return newData;
                                }
                            }
                            else {
                                return newData;
                            }
                        }
                    })
                    dbAllEntries = dbAllEntries.concat(journal);
                    
                }
                else if(data.type === 'CreditNote'){
    
                    let journal = data.inputList.filter((newData)=>{
    
                        
                        let product = newData.products;
                        let checkProductLinking = dbProducts.filter((item)=>{
                            return item.name === product;
                        });
                        let linkedCOA = checkProductLinking[0].linkAccount;
    
                        let debitAmount = data.fullAmount;
                        let creditAmount = data.totalAmount;
                        let debitAccount = linkedCOA;
                        let creditAccount = 'Accounts Receivable';
    
                        if(account === debitAccount || account === creditAccount){
                            Object.assign(newData, {
                                coaAccount: account,
                                account: account,
                                debit: account === debitAccount ? parseInt(debitAmount) : 0,
                                debitAccount: account === debitAccount ? debitAccount : '',
                                credit: account === creditAccount ? parseInt(creditAmount) : 0,
                                creditAccount: account === creditAccount ? creditAccount : '',
                            });
    
                            if(fromDate && toDate){
                                let checkDbDate = data.journalDate? data.journalDate : data.date;
                                const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                                if (dbDate >= fromDate && dbDate <= toDate) {
                                    return newData;
                                }
                            }
                            else {
                                return newData;
                            }
                        }
    
                    });
                    dbAllEntries = dbAllEntries.concat(journal);
    
                }
                else if(data.type === 'Expenses'){
                    let journal = data.inputList.filter((newData)=>{
    
    
                        let dbAccount = data.paidBy;
                        let dbFromAccount = dbPaymentMethod.filter((item)=>{
                            return item.chartsOfAccount === account && item.paymentType === dbAccount;
                        });
    
                        let linkedAccountCOA;
                        if (dbFromAccount.length > 0) {
                            linkedAccountCOA = dbFromAccount[0].chartsOfAccount;
                        }
    
                        let debitAmount = newData.totalAmountPerItem - newData.taxAmount;
                        let debitAccount = newData.accounts;
                        let creditAmount = newData.amount;
                        let creditAccount = linkedAccountCOA;
                        
                        if(account === debitAccount || account === creditAccount){
                            Object.assign(newData, {
                                coaAccount: account,
                                account: account,
                                debit: account === debitAccount ? parseInt(debitAmount) : 0,
                                debitAccount: account === debitAccount ? debitAccount : '',
                                credit: account === creditAccount ? parseInt(creditAmount) : 0,
                                creditAccount: account === creditAccount ? creditAccount : '',
                                balance: 0
                            });
    
                            if(fromDate && toDate){
                                let checkDbDate = data.journalDate? data.journalDate : data.date;
                                const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                                if (dbDate >= fromDate && dbDate <= toDate) {
                                    return newData;
                                }
                            }
                            else {
                                return newData;
                            }
                        }
                    })
                    dbAllEntries = dbAllEntries.concat(journal);
                }
                else if(data.type === 'SalesInvoice'){
                    let journal = data.inputList.filter((newData)=>{
    
                        // check product account
                        let product = newData.products;
                        let checkProductLinking = dbProducts.filter((item)=>{
                            return item.name === product;
                        });
                        let linkedCOA = checkProductLinking[0].linkAccount;
    
    
                        let dbAccount = data.fromAccount;
                        let dbFromAccount = dbPaymentMethod.filter((item)=>{
                            return item.chartsOfAccount === account && item.paymentType === dbAccount;
                        });
    
                        let linkedAccountCOA;
                        if (dbFromAccount.length > 0) {
                            linkedAccountCOA = dbFromAccount[0].chartsOfAccount;
                        }
                        
                        let debitAmount = newData.totalAmountPerItem;
                        let debitAccount = linkedAccountCOA;
                        
                        let creditAmount = newData.totalAmountPerItem - newData.taxAmount;
                        let creditAccount = linkedCOA;
                        
                        if(account === debitAccount || account === creditAccount){
    
                            Object.assign(newData, {
                                coaAccount: account,
                                account: account,
                                debit: account === debitAccount ? parseInt(debitAmount) : 0,
                                debitAccount: account === debitAccount ? debitAccount : '',
                                credit: account === creditAccount ? parseInt(creditAmount) : 0,
                                creditAccount: account === creditAccount ? creditAccount : '',
                                balance: 0
                            });
    
                            
                            if(fromDate && toDate){
                                let checkDbDate = data.journalDate? data.journalDate : data.date;
                                const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                                if (dbDate >= fromDate && dbDate <= toDate) {
                                    return newData;
                                }
                            }
                            else {
                                return newData;
                            }
                        }
                    })
                    dbAllEntries = dbAllEntries.concat(journal);
                }
                else if(data.type === 'CreditSalesInvoice'){
                    let journal = data.inputList.filter((newData)=>{
    
                        let product = newData.products;
                        let checkProductLinking = dbProducts.filter((item)=>{
                            return item.name === product;
                        });
                        let linkedCOA = checkProductLinking[0].linkAccount;
    
                    
                        let debitAmount = newData.totalAmountPerItem;
                        let debitAccount = data.fromAccount;
                        let creditAmount = newData.amount - newData.taxAmount;
                        let creditAccount = linkedCOA;
    
                        if(account === debitAccount || account === creditAccount){
                            Object.assign(newData, {
                                coaAccount: account,
                                account: account,
                                debit: account === debitAccount ? parseInt(debitAmount) : 0,
                                debitAccount: account === debitAccount ? debitAccount : '',
                                credit: account === creditAccount ? parseInt(creditAmount) : 0,
                                creditAccount: account === creditAccount ? creditAccount : '',
                                balance: 0
                            });
    
                            if(fromDate && toDate){
                                let checkDbDate = data.journalDate? data.journalDate : data.date;
                                const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                                if (dbDate >= fromDate && dbDate <= toDate) {
                                    return newData;
                                }
                            }
                            else {
                                return newData;
                            }
                        }
    
                    });
                    dbAllEntries = dbAllEntries.concat(journal);
                }
                else{
                    let journal = data.inputList.filter((newData)=>{
    
                        let debitAmount = newData.debit && newData.debit;
                        let debitAccount = newData.debit && newData.account;
                        
                        let creditAmount = newData.credit && newData.credit;
                        let creditAccount = newData.credit && newData.account;
    
                        
                        if(account === debitAccount || account === creditAccount){
    
                            Object.assign(newData, {
                                coaAccount: account,
                                account: account,
                                debit: account === debitAccount ? parseInt(debitAmount) : 0,
                                debitAccount: account === debitAccount ? debitAccount : '',
                                credit: account === creditAccount ? parseInt(creditAmount) : 0,
                                creditAccount: account === creditAccount ? creditAccount : '',
                                balance: 0
                            });
    
                            if(fromDate && toDate){
                                let checkDbDate = data.journalDate? data.journalDate : data.date;
                                const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                                if (dbDate >= fromDate && dbDate <= toDate) {
                                    return newData;
                                }
                            }
                            else {
                                return newData;
                            }
                        }
    
                    });
                    dbAllEntries = dbAllEntries.concat(journal);
                }
    
                if(data.fullTax > 0){
                    if(data.type === 'PurchaseInvoice' || data.type === 'Expenses'){
                        let debitAmount = data.fullTax;
                        let debitAccount = 'Tax Payable';
                        let creditAmount = 0;
                        let creditAccount = 'Tax Payable';
    
                        if(account === debitAccount || account === creditAccount){
                            Object.assign(data, {
                                coaAccount: account,
                                account: account,
                                debit: account === debitAccount ? parseInt(debitAmount) : 0,
                                debitAccount: account === debitAccount ? debitAccount : '',
                                credit: account === creditAccount ? parseInt(creditAmount) : 0,
                                creditAccount: account === creditAccount ? creditAccount : '',
                            });
    
                            if(fromDate && toDate){
                                let checkDbDate = data.journalDate? data.journalDate : data.date;
                                const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                                if (dbDate >= fromDate && dbDate <= toDate) {
                                    return data;
                                }
                            }
                            else {
                                return data;
                            }
                        }
                    }
                    else if(account !== null && account !== ""){
                        let debitAmount = 0;
                        let debitAccount = 'Tax Payable';
                        let creditAmount = data.fullTax;
                        let creditAccount = 'Tax Payable';
    
                        if(account === debitAccount || account === creditAccount){
                            Object.assign(data, {
                                coaAccount: account,
                                account: account,
                                debit: account === debitAccount ? parseInt(debitAmount) : 0,
                                debitAccount: account === debitAccount ? debitAccount : '',
                                credit: account === creditAccount ? parseInt(creditAmount) : 0,
                                creditAccount: account === creditAccount ? creditAccount : '',
                            });
    
                            if(fromDate && toDate){
                                let checkDbDate = data.journalDate? data.journalDate : data.date;
                                const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                                if (dbDate >= fromDate && dbDate <= toDate) {
                                    return data;
                                }
                            }
                            else {
                                return data;
                            }
                        }
    
                    }
    
                }
                if(data.discount > 0){
                    
                    let debitAmount = data.discount;
                    let debitAccount = 'Sales Discount';
                    let creditAmount = 0;
                    let creditAccount = 'Sales Discount';
    
                    if(account === debitAccount || account === creditAccount){
                        Object.assign(data, {
                            coaAccount: account,
                            account: account,
                            debit: account === debitAccount ? parseInt(debitAmount) : 0,
                            debitAccount: account === debitAccount ? debitAccount : '',
                            credit: account === creditAccount ? parseInt(creditAmount) : 0,
                            creditAccount: account === creditAccount ? creditAccount : '',
                        });
    
                        if(fromDate && toDate){
                            let checkDbDate = data.journalDate? data.journalDate : data.date;
                            const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                            if (dbDate >= fromDate && dbDate <= toDate) {
                                return data;
                            }
                        }
                        else {
                            return data;
                        }
                    }
                }

            }
            
        })

        
        dbAllEntries = dbAllEntries.concat(dbAll);

        // Date filter
        dbAllEntries.sort((a, b) => new Date(a.journalDate) - new Date(b.journalDate));
        
        setNewEntry(dbAllEntries)
    }

    const handleChange = (e) => {
        if (e.target.name === 'account') {
            setAccount(e.target.value)
        }
        else if (e.target.name === 'fromDate') {
            setFromDate(e.target.value)
        }
        else if (e.target.name === 'toDate') {
            setToDate(e.target.value)
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
    <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />

    <div className='w-full'>
        <form>
            <div className="overflow-idden shadow sm:rounded-md">
                <div className="bg-white px-4 sm:p-3">
                    <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-1">
                            <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">
                                {t('from')}
                            </label>
                            <input
                                type="date"
                                onChange={handleChange}
                                name="fromDate"
                                id="fromDate"
                                value={fromDate}
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="col-span-6 sm:col-span-1">
                            <label htmlFor="toDate" className="block text-sm font-medium text-gray-700">
                                {t('to')}
                            </label>
                            <input
                                type="date"
                                onChange={handleChange}
                                name="toDate"
                                id="toDate"
                                value={toDate}
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="account" className="block text-sm font-medium text-gray-700">
                                {t('account')}
                            </label>
                            <select id="account" name="account" onChange={handleChange} value={account} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                <option>select account</option>
                                {filteredCharts.map((item, index) => {
                                    return <option key={index} value={item.accountName}>{item.accountCode} - {item.accountName}</option>
                                })}
                            </select>
                        </div>
                        <button onClick={submit} type='button' className='bg-blue-800 hover:bg-blue-900 text-white px-10 h-10 mt-4 rounded-lg'>{t('update')}</button>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <div className="md:grid md:grid-cols-1 md:gap-2">
        <div className="md:col-span-1">
            <div className="md:col-span-1">
                <div className="px-4 mt-4 sm:px-0 flex">
                    <h3 className="text-lg mx-auto font-black tracking-wide leading-6 text-blue-800">General Ledger Summary</h3>
                </div>
            </div>
            {printButton == true && <div className='flex justify-between mb-0'>
                
                <div className='mb-0 ml-2'>
                    <h1 className='text-blue-700 mb-0 mt-2 text-center text-base'>Opening Balance: <span className='font-bold font-sans'>{openingBalance.toLocaleString()}</span></h1>
                </div>

               <ReactToPrint
                trigger={()=>{
                  return <button 
                    type="button"
                    className='inline-flex items-center justify-center py-1 px-3 bg-blue-800 hover:bg-blue-900 text-white rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'>
                    {t('print')}
                    <AiOutlinePrinter className='text-lg ml-2'/>
                  </button>
                }}
                content={() => componentRef.current}
                documentTitle={`${userEmail} (${account}) - Ledger`}
                pageStyle='print'
                />
            </div>}
        </div>
        <div className="md:col-span-2">
            <form method="POST">
                <div ref={componentRef} className="overflow-hidden shadow sm:rounded-md">

                    <div className="overflow-x-auto shadow-sm">
                        <table className="w-full text-sm text-left text-gray-500 ">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 print:px-2 py-3">
                                        {t('voucherNo')}
                                    </th>
                                    <th scope="col" className="px-6 print:px-2 py-3">
                                        {t('products')}
                                    </th>
                                    <th scope="col" className="px-6 print:px-2 py-3">
                                        {t('date')}
                                    </th>
                                    <th scope="col" className="px-6 print:px-2 py-3">
                                        {t('debit')}
                                    </th>
                                    <th scope="col" className="px-6 print:px-2 py-3">
                                        {t('credit')}
                                    </th>
                                    <th scope="col" className="px-6 print:px-2 py-3 text-blue-800 font-bold">
                                        {t('balance')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>

                                {/* All Vouchers */}
                                { newEntry.map((item, index) => {

                                    let debit = Math.round(item.debit * 100) / 100;
                                    let credit = Math.round(item.credit * 100) / 100;

                                    let previousBalance = openingBalance;
                                    newEntry.forEach((item) => {
                                      if(dbAccount === true){
                                        item.balance = previousBalance + parseFloat(item.credit) - parseFloat(item.debit);
                                      }
                                      else if(dbAccount === false){
                                        item.balance = previousBalance + parseFloat(item.debit) - parseFloat(item.credit);
                                      }
                                      previousBalance = item.balance;
                                    });

                                    return <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 print:px-2 py-3">
                                            {item.journalNo ? item.journalNo : item.billNo}
                                        </td>
                                        <td className="px-6 print:px-2 py-3">
                                            <div className='text-blue-700 font-bold'>{item.products ? item.products : item.account}</div>
                                        </td>
                                        <td className="px-6 print:px-2 py-3">
                                            {item.date 
                                              ? moment(item.date).format('DD-MM-YYYY')
                                              : moment(item.journalDate).format('DD-MM-YYYY')
                                            }
                                        </td>
                                        <td className="px-6 print:px-2 py-3">
                                          {
                                            (debit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                          }
                                        </td>
                                        <td className="px-6 print:px-2 py-3">
                                          {
                                            (credit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                          }
                                        </td>
                                        <td className="px-6 print:px-2 py-3 bg-gray-50 text-blue-700 font-bold">
                                            {
                                                Math.abs(item.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                            }
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                        { newEntry.length === 0  ? <h1 className='text-red-600 text-center text-base my-3'>No data found!</h1> : ''}
                    </div>
                </div>
            </form>
        </div>
    </div>

    </FullLayout>
    </ProSidebarProvider>


    </>
    )
}

export async function getServerSideProps() {
    if (!mongoose.connections[0].readyState) {
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGO_URI)
    }
    let dbJournalVoucher = await JournalVoucher.find()
    let dbCharts = await Charts.find()
    let dbCreditSalesInvoice = await CreditSalesInvoice.find()
    let dbSalesInvoice = await SalesInvoice.find()
    let dbChequeTransaction = await ChequeTransaction.find()
    let dbPurchaseInvoice = await PurchaseInvoice.find()
    let dbDebitNote = await DebitNote.find()
    let dbCreditNote = await CreditNote.find()
    let dbReceiptVoucher = await ReceiptVoucher.find()
    let dbPaymentVoucher = await PaymentVoucher.find()
    let dbExpensesVoucher = await Expenses.find()
    let dbProducts = await Product.find()
    let dbPaymentMethod = await PaymentMethod.find()

    // Pass data to the page via props
    return {
        props: {
            dbJournalVoucher: JSON.parse(JSON.stringify(dbJournalVoucher)),
            dbCharts: JSON.parse(JSON.stringify(dbCharts)),
            dbCreditSalesInvoice: JSON.parse(JSON.stringify(dbCreditSalesInvoice)),
            dbSalesInvoice: JSON.parse(JSON.stringify(dbSalesInvoice)),
            dbChequeTransaction: JSON.parse(JSON.stringify(dbChequeTransaction)),
            dbPurchaseInvoice: JSON.parse(JSON.stringify(dbPurchaseInvoice)),
            dbDebitNote: JSON.parse(JSON.stringify(dbDebitNote)),
            dbCreditNote: JSON.parse(JSON.stringify(dbCreditNote)),
            dbReceiptVoucher: JSON.parse(JSON.stringify(dbReceiptVoucher)),
            dbPaymentVoucher: JSON.parse(JSON.stringify(dbPaymentVoucher)),
            dbExpensesVoucher: JSON.parse(JSON.stringify(dbExpensesVoucher)),
            dbProducts: JSON.parse(JSON.stringify(dbProducts)),
            dbPaymentMethod: JSON.parse(JSON.stringify(dbPaymentMethod)),
        }
    }
}

export default GeneralLedger