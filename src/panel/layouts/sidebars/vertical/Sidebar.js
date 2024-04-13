import { React, Fragment, useState, useEffect } from 'react'
import Logo from "../../logo/Logo";
import { useRouter } from "next/router";
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Menu, MenuItem, SubMenu, Sidebar } from 'react-pro-sidebar';

import {AiOutlineBank, AiOutlineCloseCircle, AiOutlineContacts, AiOutlineFundProjectionScreen, AiOutlineProject, AiOutlineSetting, AiOutlineShoppingCart, AiOutlineTeam, AiOutlineTransaction, AiOutlineUser, AiOutlineUserSwitch } from 'react-icons/ai'
import { BiFingerprint, BiHomeAlt, BiLocationPlus, BiPurchaseTagAlt, BiUserCheck, BiUserCircle } from 'react-icons/bi'
import {MdOutlineInventory2, MdOutlineRealEstateAgent, MdPayment, MdProductionQuantityLimits} from 'react-icons/md'
import {IoPieChartSharp, IoBusinessOutline} from 'react-icons/io5'
import {HiOutlineCash, HiOutlineDocumentReport, HiOutlineReceiptTax} from 'react-icons/hi'
import {HiOutlineBanknotes} from 'react-icons/hi2'

import {BsBank, BsChatQuote, BsShop} from 'react-icons/bs'
import {FiShoppingBag, FiUserPlus, FiUsers} from 'react-icons/fi'
import {FaFileContract, FaRegBuilding, FaToriiGate, FaUserFriends} from 'react-icons/fa'
import {TbFileInvoice} from 'react-icons/tb'
import {RiBankCardLine, RiBankLine, RiBillLine, RiCommunityLine} from 'react-icons/ri'
import {SlCalender} from 'react-icons/sl'
import { Link } from 'react-feather';
import useTranslation from 'next-translate/useTranslation';



const Sidebar2 = ({ showMobilemenu }) => {

    
  const router = useRouter();
  const { t } = useTranslation('panel')
  const location = router.pathname;
  const [open, setOpen] = useState(false)

  const [isOwner, setisOwner] = useState(false)

  useEffect(() => {
    let myUser = JSON.parse(localStorage.getItem("myUser"));
    if(myUser && myUser.department === 'Admin'){
      setisOwner(true)
    }
  }, [])


  return (
    <div className="w-full">
      <div className="py-[17px] flex justify-center">
        <Logo className/>
        <button className="text-2xl ml-6 items-center lg:hidden" onClick={showMobilemenu} >
          <AiOutlineCloseCircle />
        </button>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={setOpen}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95" enterTo="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 md:scale-100" leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
                <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-5xl">

                  <div className="relative mt-6 w-full overflow-x-auto shadow-sm">
                    <table className="w-full text-sm text-left text-gray-500 ">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            {t('businessSetup')}
                          </th>
                          <th scope="col" className="px-6 py-3">
                            {t('purchaseInvoice')}
                          </th>
                          <th scope="col" className="px-6 py-3">
                            {t('salesInvoice')}
                          </th>
                          <th scope="col" className="px-6 py-3">
                            {t('reports')}
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-2">
                            <a href={'/panel/businessSetup/chartsOfAccount'} className='no-underline text-gray-500 font-medium text-base'>{t('chartsOfAccount')}</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/purchaseModule/purchaseInvoice'} className='no-underline text-gray-500 font-medium text-base'>{t('purchaseInvoice')}</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/salesModule/salesInvoice'} className='no-underline text-gray-500 font-medium text-base'>{t('salesInvoice')}</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/financialManagment/reports/generalLedger'} className='no-underline text-gray-500 font-medium text-base'>{t('generalLedger')}</a>
                          </td>
                        </tr>

                        <tr className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-2">
                            <a href={'/panel/businessSetup/taxRate'} className='no-underline text-gray-500 font-medium text-base'>{t('taxRate')}</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/purchaseModule/paymentVoucher'} className='no-underline text-gray-500 font-medium text-base'>{t('paymentVoucher')}</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/salesModule/creditSalesInvoice'} className='no-underline text-gray-500 font-medium text-base'>{t('creditSaleInvoice')}</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/financialManagment/reports/trialBalance'} className='no-underline text-gray-500 font-medium text-base'>{t('trialBalance')}</a>
                          </td>
                        </tr>


                        <tr className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-2">
                            <a href={'/panel/businessSetup/contactList'} className='no-underline text-gray-500 font-medium text-base'>{t('contactList')}</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/purchaseModule/debitNote'} className='no-underline text-gray-500 font-medium text-base'>{t('debitNote')}</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/salesModule/receiptVoucher'} className='no-underline text-gray-500 font-medium text-base'>{t('receiptVoucher')}</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/financialManagment/reports/profitAndLoss'} className='no-underline text-gray-500 font-medium text-base'>{t('profitAndLoss')}</a>
                          </td>
                        </tr>

                        <tr className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-2">
                            <a href={'/panel/businessSetup/productAndServices'} className='no-underline text-gray-500 font-medium text-base'>{t('productAndServices')}</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/purchaseModule/expenses'} className='no-underline text-gray-500 font-medium text-base'>{t('expenses')}</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/salesModule/creditNote'} className='no-underline text-gray-500 font-medium text-base'>{t('creditNote')}</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/financialManagment/reports/balanceSheet'} className='no-underline text-gray-500 font-medium text-base'>{t('balanceSheet')}</a>
                          </td>
                        </tr>

                        <tr className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-2">
                            <a href={'/panel/businessSetup/bankAccount'} className='no-underline text-gray-500 font-medium text-base'>{t('bankAccount')}</a>
                          </td>
                          <td className="px-6 py-2"></td>
                          <td className="px-6 py-2">
                            <a href={'/panel/salesModule/journalVoucher'} className='no-underline text-gray-500 font-medium text-base'>{t('journalVoucher')}</a>
                          </td>
                          <td className="px-6 py-2">
                            <a href={'/panel/financialManagment/reports/contactTransactionSummary'} className='no-underline text-gray-500 font-medium text-base'>{t('contactTransaction')}</a>
                          </td>
                        </tr>

                        <tr className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-2">
                            <a href={'/panel/businessSetup/paymentMethod'} className='no-underline text-gray-500 font-medium text-base'>{t('paymentMethod')}</a>
                          </td>
                          <td className="px-6 py-2"></td>
                          <td className="px-6 py-2"></td>
                          <td className="px-6 py-2"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="pt-1 mt-2">

      <Sidebar width='250px' className=''>
        <Menu className='bg-white'>
          <div className='flex justify-center mb-3'>
            <button onClick={() => { setOpen(true) }} className='bg-blue-800 hover:bg-blue-900 mb-2 font-medium text-white px-24 py-2 rounded-lg'>{t('new')}</button>
          </div>
          
          <Menu>
            <MenuItem icon={<BiHomeAlt className='text-lg'/>} className={ location === '/panel' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium' } href={`/${router.locale}/panel`}>
              {t('dasboard')}
            </MenuItem>
      
            <SubMenu label={t('realEstate')} icon={<MdOutlineRealEstateAgent className='text-lg'/>}>
              <MenuItem href={`/${router.locale}/panel/realEstate/buildings`} icon={<FaRegBuilding className='text-lg'/>} className={ location === '/panel/realEstate/buildings' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('buildingsAndOwners')}
               </MenuItem>
              <MenuItem href={`/${router.locale}/panel/realEstate/units`} icon={<RiCommunityLine className='text-lg'/>} className={ location === '/panel/realEstate/units' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('units')}
              </MenuItem>
              <MenuItem href={`/${router.locale}/panel/realEstate/contractAndTenants`} icon={<FaFileContract className='text-lg'/>} className={ location === '/panel/realEstate/contractAndTenants' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('contractAndTenants')}
              </MenuItem>
              <MenuItem href={`/${router.locale}/panel/realEstate/cheques`} icon={<HiOutlineBanknotes className='text-lg'/>} className={ location === '/panel/realEstate/cheques' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('fundsManagement')}
              </MenuItem>
              <MenuItem href={`/${router.locale}/panel/realEstate/chequeTransactions`} icon={<AiOutlineTransaction className='text-lg'/>} className={ location === '/panel/realEstate/chequeTransactions' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('chequeTrx')}
              </MenuItem>
            </SubMenu>

            <SubMenu label={t('purchaseModule')} icon={<RiBankCardLine className='text-lg'/>}>

              <MenuItem href={`/${router.locale}/panel/purchaseModule/purchaseInvoice`} icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/purchaseModule/purchaseOrder' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('purchaseInvoice')}
              </MenuItem>
              <MenuItem href={`/${router.locale}/panel/purchaseModule/debitNote`} icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/purchaseModule/debitNote' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('debitNote')}
              </MenuItem>
              <MenuItem href={`/${router.locale}/panel/purchaseModule/expenses`} icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/purchaseModule/expenses' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('expenses')}
              </MenuItem>
              <MenuItem href={`/${router.locale}/panel/purchaseModule/paymentVoucher`} icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/purchaseModule/paymentVoucher' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('paymentVoucher')}
              </MenuItem>

            </SubMenu>

            <SubMenu label={t('salesModule')} icon={<RiBankCardLine className='text-lg'/>}>

              <MenuItem href={`/${router.locale}/panel/salesModule/salesInvoice`} icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/salesModule/salesInvoice' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('salesInvoice')}
              </MenuItem>
              <MenuItem href={`/${router.locale}/panel/salesModule/creditSaleInvoice`} icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/salesModule/creditSaleInvoice' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('creditSaleInvoice')}
              </MenuItem>
              <MenuItem href={`/${router.locale}/panel/salesModule/creditNote`} icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/salesModule/creditNote' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('creditNote')}
              </MenuItem>
              <MenuItem href={`/${router.locale}/panel/salesModule/receiptVoucher`} icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/salesModule/receiptVoucher' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('receiptVoucher')}
              </MenuItem>
              <MenuItem href={`/${router.locale}/panel/salesModule/journalVoucher`} icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/salesModule/journalVoucher' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('journalVoucher')}
              </MenuItem>
            </SubMenu>

            <SubMenu label={t('payroll')} icon={<FiUserPlus className='text-lg'/>}>
              <MenuItem href={`/${router.locale}/panel/payroll/employees`} icon={<FiUsers className='text-lg'/>} className={ location === '/panel/payroll/employees' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('employees')}
              </MenuItem>
            </SubMenu>
            
            <SubMenu label={t('reports')} icon={<HiOutlineDocumentReport className='text-lg'/>}>
              <MenuItem href={`/${router.locale}/panel/financialManagment/reports/generalLedger`} icon={<HiOutlineDocumentReport className='text-lg'/>} className={ location === '/panel/financialManagment/reports/generalLedger' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('generalLedger')}
              </MenuItem>
              <MenuItem href={`/${router.locale}/panel/financialManagment/reports/trialBalance`} icon={<HiOutlineDocumentReport className='text-lg'/>} className={ location === '/panel/financialManagment/reports/trialBalance' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('trialBalance')}
              </MenuItem>
              <MenuItem href={`/${router.locale}/panel/financialManagment/reports/profitAndLoss`} icon={<HiOutlineDocumentReport className='text-lg'/>} className={ location === '/panel/financialManagment/reports/profitAndLoss' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('profitAndLoss')}
              </MenuItem>
              <MenuItem href={`/${router.locale}/panel/financialManagment/reports/balanceSheet`} icon={<HiOutlineDocumentReport className='text-lg'/>} className={ location === '/panel/financialManagment/reports/balanceSheet' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('balanceSheet')}
              </MenuItem>
              <MenuItem href={`/${router.locale}/panel/financialManagment/reports/contactTransactionSummary`} icon={<HiOutlineDocumentReport className='text-lg'/>} className={ location === '/panel/financialManagment/reports/contactTransactionSummary' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('contactTransaction')}
              </MenuItem>
            </SubMenu>

            <SubMenu label={t('userManagment')} icon={<AiOutlineUser className='text-lg'/>}>
              <MenuItem href={`/${router.locale}/panel/userManagment/addRole`} icon={<BiUserCheck className='text-lg'/>} className={ location === '/panel/userManagment/addRole' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('addRole')}
              </MenuItem>
              {isOwner === true && <MenuItem href="/panel/userManagment/clients" icon={<FaUserFriends className='text-lg'/>} className={ location === '/panel/userManagment/clients' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('clients')}
              </MenuItem>}
            </SubMenu>

            <SubMenu label={t('businessSetup')} icon={<IoBusinessOutline className='text-lg'/>}>
              <MenuItem href={`/${router.locale}/panel/businessSetup/chartsOfAccount`} icon={<IoPieChartSharp className='text-lg'/>} className={ location === '/panel/businessSetup/chartsOfAccount' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('chartsOfAccount')}
              </MenuItem>
              <MenuItem href={`/${router.locale}/panel/businessSetup/taxRate`} icon={<HiOutlineReceiptTax className='text-lg'/>} className={ location === '/panel/businessSetup/taxRate' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('taxRate')}
              </MenuItem>
              <MenuItem href={`/${router.locale}/panel/businessSetup/contactList`} icon={<AiOutlineContacts className='text-lg'/>} className={ location === '/panel/businessSetup/contactList' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('contactList')}
              </MenuItem>
              <MenuItem href={`/${router.locale}/panel/businessSetup/productAndServices`} icon={<MdProductionQuantityLimits className='text-lg'/>} className={ location === '/panel/businessSetup/productAndServices' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('productAndServices')}
              </MenuItem>
              <MenuItem href={`/${router.locale}/panel/businessSetup/paymentMethod`} icon={<MdPayment className='text-lg'/>} className={ location === '/panel/businessSetup/paymentMethod' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('paymentMethod')}
              </MenuItem>
              <MenuItem href={`/${router.locale}/panel/businessSetup/bankAccount`} icon={<BsBank className='text-lg'/>} className={ location === '/panel/businessSetup/bankAccounts' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
                {t('bankAccount')}
              </MenuItem>
            </SubMenu>
            
          </Menu>
        </Menu>
      </Sidebar>


      </div>
    </div>
  );
};



export default Sidebar2;
