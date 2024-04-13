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
import dbUnits from 'models/Units'; 
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
import { BiUserCircle } from 'react-icons/bi';
import { BsCashCoin } from 'react-icons/bs';
import { FiUsers } from 'react-icons/fi';
import Buildings from 'models/Buildings';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';




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

  const Units = ({ userEmail, dbVouchers, dbContacts, dbBuildings, dbTenants }) => {
    
    const router = useRouter();
    const { t } = useTranslation('realEstate')
    const [open, setOpen] = useState(false)
    const [openNewContract, setOpenNewContract] = useState(false)

    const [contacts, setContacts] = useState([])
    const [id, setId] = useState('')
    const [selectedIds, setSelectedIds] = useState([]);

    const [active, setActive] = React.useState(1);


    // authentications
    const [isAdmin, setIsAdmin] = useState(false)
    const [filteredInvoices, setFilteredInvoices] = useState([])
    const [filteredBuildings, setFilteredBuildings] = useState([])
    const [filteredTenants, setFilteredTenants] = useState([])
    const [filteredContacts, setFilteredContacts] = useState([])

    const [isOpenSaveChange, setIsOpenSaveChange] = useState(true)
    const [isChecked, setIsChecked] = useState(false);


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

      let filteredInvoices = dbVouchers.filter((item)=>{
        return item.userEmail === userEmail;
      })
      setFilteredInvoices(filteredInvoices)

      let filteredBuildings = dbBuildings.filter((item)=>{
        return item.userEmail === userEmail;
      })
      setFilteredBuildings(filteredBuildings)

      
      let filteredTenants = dbTenants.filter((item)=>{
        return item.userEmail === userEmail;
      })
      setFilteredTenants(filteredTenants)

      let filteredContacts = dbContacts.filter((item)=>{
        return item.userEmail === userEmail;
      })
      setFilteredContacts(filteredContacts)

      const myUser = JSON.parse(localStorage.getItem('myUser'))
      if(myUser.department === 'Admin'){
        setIsAdmin(true)
      }
    }, [userEmail])

    const [search, setSearch] = useState('')

    const [attachment, setAttachment] = useState('')
    const [name, setName] = useState('')
    const [phoneNo, setPhoneNo] = useState(0)
    const [email, setEmail] = useState('')


    const [nameInBill, setNameInBill] = useState('')
    const [idNumber, setIdNumber] = useState('')
    const [expID, setExpID] = useState('')
    const [building, setBuilding] = useState('')
    const [passPortNumber, setPassPortNumber] = useState('')
    const [expPassPort, setExpPassPort] = useState('')
    
    const [contractStartDate, setContractStartDate] = useState('')
    const [investmentStructure, setInvestmentStructure] = useState('')
    const [gracePeriodFrom, setGracePeriodFrom] = useState('')
    const [contractEndDate, setContractEndDate] = useState('')
    const [amount, setAmount] = useState('')
    const [gracePeriodTo, setGracePeriodTo] = useState('')
    const [paymentScheduling, setPaymentScheduling] = useState('')
    
    
    const [unitNo, setUnitNo] = useState('')
    const [buildingNameInArabic, setBuildingNameInArabic] = useState('')
    const [buildingNameInEnglish, setBuildingNameInEnglish] = useState('')
    const [plotNo, setPlotNo] = useState('')
    const [rent, setRent] = useState('')
    const [bathroom, setBathroom] = useState('')
    const [parkings, setParkings] = useState('')
    const [rentParking, setRentParking] = useState('')
    const [roof, setRoof] = useState('')
    const [balcony, setBalcony] = useState('')
    const [size, setSize] = useState('')
    const [electricityMeterNo, setElectricityMeterNo] = useState('')
    const [waterMeterNumber, setWaterMeterNumber] = useState('')
    const [sewageNumber, setSewageNumber] = useState('')
    const [ac, setAc] = useState('')
    const [unitType, setUnitType] = useState('')
    const [unitUse, setUnitUse] = useState('')
    const [unitStatus, setUnitStatus] = useState('')
    const [view, setView] = useState('')
    const [country, setCountry] = useState('')
    const [city, setCity] = useState('')
    const [area, setArea] = useState('')
    const [notes, setNotes] = useState('')  

    const [totalNoOfPages, setTotalNoOfPages] = useState(1)
    
    const [filteredData, setFilteredData] = useState([])

    const [openTenantExtraForm, setOpenTenantExtraForm] = React.useState(1);
    const handleOpenTenantExtraForm = (value) => setOpenTenantExtraForm(openTenantExtraForm === value ? 0 : value);
    
    const [tenant, setTenant] = useState('')
    const [tenantName, setTenantName] = useState('')
    const [tenantEmail, setTenantEmail] = useState('')
    const [tenantPhoneNo, setTenantPhoneNo] = useState('')
    const [tenantOpeningBalance, setTenantOpeningBalance] = useState('')

    const [tenantPassPortNumber, setTenantPassPortNumber] = useState('')
    const [tenantExpPassPort, setTenantExpPassPort] = useState('')
    const [tenantVatRegistrationNo, setTenantVatRegistrationNo] = useState('')
    const [tenantIbanNo, setTenantIbanNo] = useState('')
    const [tenantBank, setTenantBank] = useState('')
    const [tenantBankAccountNumber, setTenantBankAccountNumber] = useState('')
    const [tenantIdNumber, setTenantIdNumber] = useState('')
    const [tenantExpIdNumber, setTenantExpIdNumber] = useState('')

    const [newContractStartDate, setNewContractStartDate] = useState('')
    const [newContractEndDate, setNewContractEndDate] = useState('')
    const [newContractUnitRent, setNewContractUnitRent] = useState('')
    const [newContractCommission, setNewContractCommission] = useState('')
    const [newContractRentParking, setNewContractRentParking] = useState('')
    const [newContractBouncedChequeFine, setNewContractBouncedChequeFine] = useState('')
    const [newContractStatus, setNewContractStatus] = useState('')
    const [newContractPaymentScheduling, setNewContractPaymentScheduling] = useState('')
    const [newContractSecurityDeposit, setNewContractSecurityDeposit] = useState('')
    const [newContractNotes, setNewContractNotes] = useState('')


    useEffect(() => {
      
      const newFilteredData = filteredInvoices.filter((item)=>{
        return item.buildingNameInEnglish.toLowerCase().includes(search.toLowerCase());
      });
      setFilteredData(newFilteredData)

    }, [search])
    

    const handleChange = (e) => {
      const { name, value } = e.target;
        
      if (name === 'tenantIdNumber') {
        setTenantIdNumber(value);
      } else if (name === 'tenantExpIdNumber') {
        setTenantExpIdNumber(value);
      } else if (name === 'newContractStartDate') {
        setNewContractStartDate(value);

        const newStartDate = new Date(value);
        const newEndDate = new Date(newStartDate);

        newEndDate.setFullYear(newStartDate.getFullYear() + 1);
        newEndDate.setDate(newStartDate.getDate() - 1);
        setNewContractEndDate(newEndDate.toISOString().split('T')[0]);

      } else if (name === 'newContractEndDate') {
        setNewContractEndDate(value);
      } else if (name === 'newContractUnitRent') {
        setNewContractUnitRent(value);
      } else if (name === 'newContractCommission') {
        setNewContractCommission(value);
      } else if (name === 'newContractRentParking') {
        setNewContractRentParking(value);
      } else if (name === 'newContractBouncedChequeFine') {
        setNewContractBouncedChequeFine(value);
      } else if (name === 'newContractStatus') {
        setNewContractStatus(value);
      } else if (name === 'newContractPaymentScheduling') {
        setNewContractPaymentScheduling(value);
      } else if (name === 'newContractSecurityDeposit') {
        setNewContractSecurityDeposit(value);
      } else if (name === 'newContractNotes') {
        setNewContractNotes(value);
      } else if (name === 'tenantPassPortNumber') {
        setTenantPassPortNumber(value);
      } else if (name === 'tenantExpPassPort') {
        setTenantExpPassPort(value);
      } else if (name === 'tenantVatRegistrationNo') {
        setTenantVatRegistrationNo(value);
      } else if (name === 'tenantIbanNo') {
        setTenantIbanNo(value);
      } else if (name === 'tenantBank') {
        setTenantBank(value);
      } else if (name === 'tenantBankAccountNumber') {
        setTenantBankAccountNumber(value);
      } else if (name === 'attachment') {
        setAttachment(value);
      } else if (name === 'search') {
        setSearch(value);
      } else if (name === 'phoneNo') {
          setPhoneNo(value);
      } else if (name === 'email') {
          setEmail(value);
      } else if (name === 'nameInBill') {
          setNameInBill(value);
      } else if (name === 'idNumber') {
          setIdNumber(value);
      } else if (name === 'expID') {
          setExpID(value);
      } else if (name === 'building') {
          setBuilding(value);
      } else if (name === 'passPortNumber') {
          setPassPortNumber(value);
      } else if (name === 'expPassPort') {
          setExpPassPort(value);
      } else if (name === 'buildingNameInArabic') {
          setBuildingNameInArabic(value);
      } else if (name === 'buildingNameInEnglish') {
          setBuildingNameInEnglish(value);
      } else if (name === 'parkings') {
          setParkings(value);
      } else if (name === 'roof') {
          setRoof(value);
      } else if (name === 'country') {
          setCountry(value);
      } else if (name === 'city') {
          setCity(value);
      } else if (name === 'area') {
          setArea(value);
      } else if (name === 'electricityMeterNo') {
          setElectricityMeterNo(value);
      } else if (name === 'contractStartDate') {
          setContractStartDate(value);
      } else if (name === 'investmentStructure') {
          setInvestmentStructure(value);
      } else if (name === 'gracePeriodFrom') {
          setGracePeriodFrom(value);
      } else if (name === 'contractEndDate') {
          setContractEndDate(value);
      } else if (name === 'amount') {
          setAmount(value);
      } else if (name === 'gracePeriodTo') {
          setGracePeriodTo(value);
      } else if (name === 'paymentScheduling') {
          setPaymentScheduling(value);
      } else if (name === 'unitNo') {
          setUnitNo(value);
      } else if (name === 'balcony') {
          setBalcony(value);
      } else if (name === 'ac') {
          setAc(value);
      } else if (name === 'unitType') {
          setUnitType(value);
      } else if (name === 'unitUse') {
          setUnitUse(value);
      } else if (name === 'bathroom') {
          setBathroom(value);
      } else if (name === 'unitStatus') {
          setUnitStatus(value);
      } else if (name === 'plotNo') {
          setPlotNo(value);
      } else if (name === 'rent') {
          setRent(value);
      } else if (name === 'rentParking') {
          setRentParking(value);
      } else if (name === 'size') {
          setSize(value);
      } else if (name === 'waterMeterNumber') {
          setWaterMeterNumber(value);
      } else if (name === 'sewageNumber') {
          setSewageNumber(value);
      } else if (name === 'view') {
          setView(value);
      } else if (name === 'notes') {
          setNotes(value);
      }
      else if(name === 'name'){
        setName(value)
        const newData = filteredContacts.filter(item => item.name === value);
        if(newData.length > 0){
          setEmail(newData[0].email)
          setPhoneNo(newData[0].phoneNo)
          setCity(newData[0].city)
        }
        else{
          setEmail('')
          setPhoneNo('')
          setCity('')
        }
      }
    }

    // JV
    const submit = async(e)=>{
      e.preventDefault()

      // fetch the data from form to makes a file in local system
      const data = { userEmail, attachment, name, phoneNo, email, nameInBill, idNumber, expID, building, passPortNumber, expPassPort, buildingNameInArabic, buildingNameInEnglish, parkings, roof, country, city, area, electricityMeterNo, contractStartDate, investmentStructure, gracePeriodFrom, contractEndDate, amount, gracePeriodTo, paymentScheduling, unitNo, balcony, ac, unitType, unitUse, bathroom, unitStatus, plotNo, rent, rentParking, size, waterMeterNumber, sewageNumber, view, notes , path:'Units' };

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

    const editEntry = async(id)=>{
      setOpen(true)

      const data = { id, attachment, name, phoneNo, email, nameInBill, idNumber, expID, building, passPortNumber, expPassPort, buildingNameInArabic, buildingNameInEnglish, parkings, roof, country, city, area, electricityMeterNo, contractStartDate, investmentStructure, gracePeriodFrom, contractEndDate, amount, gracePeriodTo, paymentScheduling, unitNo, balcony, ac, unitType, unitUse, bathroom, unitStatus, plotNo, rent, rentParking, size, waterMeterNumber, sewageNumber, view, notes , path:'Units' };
      
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

      const data = { selectedIds , path: 'Units' };
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
      setIsOpenSaveChange(false)

      const data = { id, path: 'Units' };
      let res = await fetch(`/api/getDataEntry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      let response = await res.json()

      if (response.success === true){

        const { attachment, name, phoneNo, email, nameInBill, idNumber, expID, building, passPortNumber, expPassPort, buildingNameInArabic, buildingNameInEnglish, parkings, roof, country, city, area, electricityMeterNo, contractStartDate, investmentStructure, gracePeriodFrom, contractEndDate, amount, gracePeriodTo, paymentScheduling, unitNo, balcony, ac, unitType, unitUse, bathroom, unitStatus, plotNo, rent, rentParking, size, waterMeterNumber, sewageNumber, view, notes} = response.data;
        
        let dbContractStartDate = moment(contractStartDate, 'YYYY-MM-DD', true).isValid() ? moment(contractStartDate).utc().format('YYYY-MM-DD') : '';
        let dbContractEndDate = moment(contractEndDate, 'YYYY-MM-DD', true).isValid() ? moment(contractEndDate).utc().format('YYYY-MM-DD') : '';
        let dbGracePeriodFromDate = moment(gracePeriodFrom, 'YYYY-MM-DD', true).isValid() ? moment(gracePeriodFrom).utc().format('YYYY-MM-DD') : '';
        let dbGracePeriodToDate = moment(gracePeriodTo, 'YYYY-MM-DD', true).isValid() ? moment(gracePeriodTo).utc().format('YYYY-MM-DD') : '';
        let dbExpDate = moment(expID, 'YYYY-MM-DD', true).isValid() ? moment(expID).utc().format('YYYY-MM-DD') : '';
        let dbPassPortDate = moment(expPassPort, 'YYYY-MM-DD', true).isValid() ? moment(expPassPort).utc().format('YYYY-MM-DD') : '';

        setId(response.data._id)
        setContractStartDate(dbContractStartDate);
        setGracePeriodFrom(dbGracePeriodFromDate);
        setContractEndDate(dbContractEndDate);
        setGracePeriodTo(dbGracePeriodToDate);
        setExpPassPort(dbPassPortDate);
        setExpID(dbExpDate);

        setAttachment(attachment || '');
        setPhoneNo(phoneNo || '');
        setEmail(email || '');
        setNameInBill(nameInBill || '');
        setIdNumber(idNumber || '');
        setBuilding(building || '');
        setPassPortNumber(passPortNumber || '');
        setBuildingNameInArabic(buildingNameInArabic || '');
        setBuildingNameInEnglish(buildingNameInEnglish || '');
        setParkings(parkings || '');
        setRoof(roof || '');
        setCountry(country || '');
        setCity(city || '');
        setArea(area || '');
        setElectricityMeterNo(electricityMeterNo || '');
        setInvestmentStructure(investmentStructure || '');
        setAmount(amount || '');
        setPaymentScheduling(paymentScheduling || '');
        setUnitNo(unitNo || '');
        setBalcony(balcony || '');
        setAc(ac || '');
        setUnitType(unitType || '');
        setUnitUse(unitUse || '');
        setBathroom(bathroom || '');
        setUnitStatus(unitStatus || '');
        setPlotNo(plotNo || '');
        setRent(rent || '');
        setRentParking(rentParking || '');
        setSize(size || '');
        setWaterMeterNumber(waterMeterNumber || '');
        setSewageNumber(sewageNumber || '');
        setView(view || '');
        setNotes(notes || '');
        setName(name || '');
      }
    }


    // For print
    const componentRef = useRef();
    const speceficComponentRef = useRef();

    // Modals
    const [openUnitTypeModal, setOpenUnitTypeModal] = useState(false)
    const [openUnitUseModal, setOpenUnitUseModal] = useState(false)
    const [openCountryModal, setOpenCountryModal] = useState(false)
    const [openCityModal, setOpenCityModal] = useState(false)
    const [openAreaModal, setOpenAreaModal] = useState(false)
    const cancelButtonRef = useRef(null)


    const [countriesArray, setCountriesArray] = useState(() => {
      if (typeof window !== 'undefined') {
        const storedCountries = localStorage.getItem('countries');
        return storedCountries ? JSON.parse(storedCountries) : ['UAE'];
      } else {
        return ['UAE'];
      }
    })

    const [citiesArray, setCitiesArray] = useState(() => {
      if (typeof window !== 'undefined') {
        const storedCities = localStorage.getItem('cities');
        return storedCities ? JSON.parse(storedCities) : ['Dubai'];
      } else {
        return ['Dubai'];
      }
    })


    const [areasArray, setAreasArray] = useState(() => {
      if (typeof window !== 'undefined') {
        const storedAreas = localStorage.getItem('areas');
        return storedAreas ? JSON.parse(storedAreas) : ['Downtown'];
      } else {
        return ['Downtown'];
      }
    })

    const [unitTypesArray, setUnitTypesArray] = useState(() => {
      if (typeof window !== 'undefined') {
        const storedUnitTypes = localStorage.getItem('unitTypes');
        return storedUnitTypes ? JSON.parse(storedUnitTypes) : ['Studio', '1 BHK', '2 BHK', 'SHOP'];
      } else {
        return ['Studio', '1 BHK', '2 BHK', 'SHOP'];
      }
    });

    const [unitUsesArray, setUnitUsesArray] = useState(() => {
      if (typeof window !== 'undefined') {
        const storedUnitUses = localStorage.getItem('unitUses');
        return storedUnitUses ? JSON.parse(storedUnitUses) : ['Residencial', 'Commercial'];
      } else {
        return ['Residencial', 'Commercial'];
      }
    })


    useEffect(() => {

      localStorage.setItem('unitTypes', JSON.stringify(unitTypesArray));
      localStorage.setItem('unitUses', JSON.stringify(unitUsesArray));
      localStorage.setItem('countries', JSON.stringify(countriesArray));
      localStorage.setItem('cities', JSON.stringify(citiesArray));
      localStorage.setItem('areas', JSON.stringify(areasArray));

    }, [unitTypesArray, unitUsesArray, countriesArray, citiesArray, areasArray]);

    let investmentStructures = [ 'Fixed', 'of Rent %', 'of Collection %' ]
    let paymentSchedulings = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    let aces = ['Window', 'Split', 'Central']
    let unitStatuses = ['Available', 'Occupied', 'Booked', 'Hold', 'Rent Dispute']
    let newContractStatusArray = ['Active','Expired','Close']


    const addUnitType = (e)=>{
      e.preventDefault();

      if (unitType.trim() !== '') {
        setUnitTypesArray((prev) => [...prev, unitType]);
        setOpenUnitTypeModal(false);
        setUnitType('')
      }
      else{
        toast.error('Please Enter Details', { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
      }
    }

    const addUnitUse = (e)=>{
      e.preventDefault();

      if (unitUse.trim() !== '') {
        setUnitUsesArray((prev) => [...prev, unitUse]);
        setOpenUnitUseModal(false);
        setUnitUse('')
      }
      else{
        toast.error('Please Enter Details', { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
      }
    }

    const addCountry = (e)=>{
      e.preventDefault();

      if (country.trim() !== '') {
        setCountriesArray((prev) => [...prev, country]);
        setOpenCountryModal(false);
        setCountry('')
      }
      else{
        toast.error('Please Enter Details', { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
      }
    }

    const addCity = (e)=>{
      e.preventDefault();

      if (city.trim() !== '') {
        setCitiesArray((prev) => [...prev, city]);
        setOpenCityModal(false);
        setCity('')
      }
      else{
        toast.error('Please Enter Details', { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
      }
    }

    const addArea = (e)=>{
      e.preventDefault();

      if (area.trim() !== '') {
        setAreasArray((prev) => [...prev, area]);
        setOpenAreaModal(false);
        setArea('')
      }
      else{
        toast.error('Please Enter Details', { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
      }
    }


    const data = [
      {
        label: t('owner'),
        value: "owner",
        icon: BiUserCircle,
        desc: (
          <div>
            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
              <div className="w-full">
                <div className='flex justify-between'>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    {t('name')}
                  </label>
                  <Link target="_blank" href={'/panel/businessSetup/contactList?open=true'} className="no-underline block cursor-pointer text-sm font-medium text-green-700">
                    {t('add')}?
                  </Link>
                </div>
                <select id="name" name="name" onChange={ handleChange } value={name} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option value=''>select contacts</option>
                  {filteredContacts.map((item, index)=>{
                    return <option key={index} value={item.name}>{item.name} - {item.type}
                    </option>
                  })}
                </select>
              </div>
              <div className="w-full">
                <label htmlFor="nameInBill" className="block text-sm font-medium text-gray-700">
                  {t('nameInInvoice')}
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="nameInBill"
                  value={nameInBill}
                  id="nameInBill"
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
            </div> 

            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
              <div className="w-full">
                <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">
                  {t('idNumber')}
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="idNumber"
                  value={idNumber}
                  id="idNumber"
                  className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="expID" className="block text-sm font-medium text-gray-700">
                  {t('expID')}
                </label>
                <input 
                  type="date"
                  onChange={handleChange}
                  name="expID"
                  id="expID"
                  value={expID}
                  className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="building" className="block text-sm font-medium text-gray-700">
                  {t('building')}
                </label>
                <select id="building" name="building" onChange={ handleChange } value={building} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option value=''>select building</option>
                  {filteredBuildings.map((item, index)=>{
                    return <option key={index} value={item.buildingNameInEnglish}>{item.buildingNameInEnglish}</option>
                  })}
                </select>
              </div>
            </div>

            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
              <div className="w-1/3">
                <label htmlFor="passPortNumber" className="block text-sm font-medium text-gray-700">
                  {t('passPortNumber')}
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="passPortNumber"
                  value={passPortNumber}
                  id="passPortNumber"
                  className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-1/3">
                <label htmlFor="expPassPort" className="block text-sm font-medium text-gray-700">
                {t('expPassPort')}
                </label>
                <input 
                  type="date"
                  onChange={handleChange}
                  name="expPassPort"
                  id="expPassPort"
                  value={expPassPort}
                  className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-center w-full mt-10">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" />
              </label>
            </div>

          </div>
        ),
      },
      {
        label: t('unitDetails'),
        value: "unitDetails",
        icon: HiOutlineBuildingOffice2,
        desc: (
          <div>

            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>

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
                <div className="w-full">
                    <label htmlFor="buildingNameInArabic" className="block text-sm font-medium text-gray-700">
                        {t('buildingNameInArabic')}
                    </label>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="buildingNameInArabic"
                        value={buildingNameInArabic}
                        id="buildingNameInArabic"
                        className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="buildingNameInEnglish" className="block text-sm font-medium text-gray-700">
                        {t('buildingNameInEnglish')}
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
                    <label htmlFor="plotNo" className="block text-sm font-medium text-gray-700">
                        {t('plotNo')}
                    </label>
                    <input
                        type="number"
                        onChange={handleChange}
                        name="plotNo"
                        value={plotNo}
                        id="plotNo"
                        className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="w-8/12">
                    <label htmlFor="rent" className="block text-sm font-medium text-gray-700">
                        {t('rent')}
                    </label>
                    <input
                        type="number"
                        onChange={handleChange}
                        name="rent"
                        value={rent}
                        id="rent"
                        className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>

                <div className="w-8/12">
                    <label htmlFor="bathroom" className="block text-sm font-medium text-gray-700">
                        {t('bathroom')}
                    </label>
                    <input
                        type="number"
                        onChange={handleChange}
                        name="bathroom"
                        value={bathroom}
                        id="bathroom"
                        className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="w-8/12">
                    <label htmlFor="parkings" className="block text-sm font-medium text-gray-700">
                        {t('parkings')}
                    </label>
                    <input
                        type="number"
                        onChange={handleChange}
                        name="parkings"
                        value={parkings}
                        id="parkings"
                        className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="w-8/12">
                    <label htmlFor="rentParking" className="block text-sm font-medium text-gray-700">
                        {t('rentParking')}
                    </label>
                    <input
                        type="number"
                        onChange={handleChange}
                        name="rentParking"
                        value={rentParking}
                        id="rentParking"
                        className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="w-8/12">
                    <label htmlFor="roof" className="block text-sm font-medium text-gray-700">
                      {t('roof')}
                    </label>
                    <input
                        type="number"
                        onChange={handleChange}
                        name="roof"
                        value={roof}
                        id="roof"
                        className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="w-8/12">
                    <label htmlFor="balcony" className="block text-sm font-medium text-gray-700">
                        {t('balcony')}
                    </label>
                    <input
                        type="number"
                        onChange={handleChange}
                        name="balcony"
                        value={balcony}
                        id="balcony"
                        className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="w-8/12">
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                        {t('size')}
                    </label>
                    <input
                        type="number"
                        onChange={handleChange}
                        name="size"
                        value={size}
                        id="size"
                        className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
                <div className="w-full">
                    <label htmlFor="electricityMeterNo" className="block text-sm font-medium text-gray-700">
                        {t('electricityMeterNo')}
                    </label>
                    <input
                        type="number"
                        onChange={handleChange}
                        name="electricityMeterNo"
                        value={electricityMeterNo}
                        id="electricityMeterNo"
                        className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="waterMeterNumber" className="block text-sm font-medium text-gray-700">
                        {t('waterMeterNumber')}
                    </label>
                    <input
                        type="number"
                        onChange={handleChange}
                        name="waterMeterNumber"
                        value={waterMeterNumber}
                        id="waterMeterNumber"
                        className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="sewageNumber" className="block text-sm font-medium text-gray-700">
                        {t('sewageNumber')}
                    </label>
                    <input
                        type="number"
                        onChange={handleChange}
                        name="sewageNumber"
                        value={sewageNumber}
                        id="sewageNumber"
                        className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

            </div>

            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
                <div className="w-full">
                    <label htmlFor="ac" className="block text-sm font-medium text-gray-700">
                      {t('ac')}
                    </label>
                    <select id="ac" name="ac" onChange={ handleChange } value={ac} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                        <option value=''>select ac</option>
                        {aces.map((item, index)=>{
                            return <option key={index} value={item}>{item}</option>
                        })}
                    </select>
                </div>
                <div className="w-full">
                  <div className='flex justify-between'>
                    <label htmlFor="unitType" className="block text-sm font-medium text-gray-700">
                      {t('unitType')}
                    </label>
                    <label onClick={()=>{setOpenUnitTypeModal(true), setUnitType('')}} htmlFor="unitType" className="block cursor-pointer text-sm font-medium text-green-700">
                      {t('add')}?
                    </label>
                  </div>
                    <select id="unitType" name="unitType" onChange={ handleChange } value={unitType} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                        <option value=''>select unit type</option>
                        {unitTypesArray.map((item, index)=>{
                            return <option key={index} value={item}>{item}</option>
                        })}
                    </select>
                    <Transition.Root show={openUnitTypeModal} as={Fragment}>
                      <Dialog as="div" className="relative z-20" initialFocus={cancelButtonRef} onClose={setOpenUnitTypeModal}>
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0"
                          enterTo="opacity-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                              as={Fragment}
                              enter="ease-out duration-300"
                              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                              enterTo="opacity-100 translate-y-0 sm:scale-100"
                              leave="ease-in duration-200"
                              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                  <div className="sm:items-start w-full">
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                        {t('addUnitType')}
                                      </Dialog.Title>
                                      <div className="mt-2">
                                        <input
                                          type="text"
                                          onChange={handleChange}
                                          name="unitType"
                                          value={unitType}
                                          id="unitType"
                                          className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                  <button
                                    type="button"
                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                    onClick={(e) => addUnitType(e)}
                                  >
                                    {t('save')}
                                  </button>
                                  <button
                                    type="button"
                                    className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    onClick={() => setOpenUnitTypeModal(false)}
                                    ref={cancelButtonRef}
                                  >
                                    {t('cancel')}
                                  </button>
                                </div>
                              </Dialog.Panel>
                            </Transition.Child>
                          </div>
                        </div>
                      </Dialog>
                    </Transition.Root>
                </div>
                <div className="w-full">
                  <div className='flex justify-between'>
                    <label htmlFor="unitUse" className="block text-sm font-medium text-gray-700">
                      {t('unitUse')}
                    </label>
                    <label onClick={()=>{setOpenUnitUseModal(true), setUnitUse('')}} htmlFor="unitType" className="block cursor-pointer text-sm font-medium text-green-700">
                      {t('add')}?
                    </label>
                  </div>
                  <select id="unitUse" name="unitUse" onChange={ handleChange } value={unitUse} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                    <option value=''>select unit use</option>
                    {unitUsesArray.map((item, index)=>{ 
                      return <option key={index} value={item}>{item}</option>
                    })}
                  </select>
                  <Transition.Root show={openUnitUseModal} as={Fragment}>
                    <Dialog as="div" className="relative z-20" initialFocus={cancelButtonRef} onClose={setOpenUnitUseModal}>
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                      </Transition.Child>

                      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                          <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                          >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="sm:items-start w-full">
                                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                      {t('addUnitUse')}
                                    </Dialog.Title>
                                    <div className="mt-2">
                                      <input
                                        type="text"
                                        onChange={handleChange}
                                        name="unitUse"
                                        value={unitUse}
                                        id="unitUse"
                                        className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                  type="button"
                                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                  onClick={(e) => addUnitUse(e)}
                                >
                                  {t('save')}
                                </button>
                                <button
                                  type="button"
                                  className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                  onClick={() => setOpenUnitUseModal(false)}
                                  ref={cancelButtonRef}
                                >
                                  {t('cancel')}
                                </button>
                              </div>
                            </Dialog.Panel>
                          </Transition.Child>
                        </div>
                      </div>
                    </Dialog>
                  </Transition.Root>
                </div>

                
                

                <div className="w-full">
                    <label htmlFor="unitStatus" className="block text-sm font-medium text-gray-700">
                        {t('unitStatus')}
                    </label>
                    <select id="unitStatus" name="unitStatus" onChange={ handleChange } value={unitStatus} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                        <option value=''>select unit status</option>
                        {unitStatuses.map((item, index)=>{ 
                            return <option key={index} value={item}>{item}</option>
                        })}
                    </select>
                </div>

                <div className="w-full">
                    <label htmlFor="view" className="block text-sm font-medium text-gray-700">
                        {t('unitView')}
                    </label>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="view"
                        value={view}
                        id="view"
                        className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>

                <div className="w-full">
                  <div className='flex justify-between'>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      {t('country')}
                    </label>
                    <label onClick={()=>{setOpenCountryModal(true), setCountry('')}} htmlFor="unitType" className="block cursor-pointer text-sm font-medium text-green-700">
                      {t('add')}?
                    </label>
                  </div>
                  <select id="country" name="country" onChange={ handleChange } value={country} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                      <option value=''>select country</option>
                      {countriesArray.map((item, index)=>{
                          return <option key={index} value={item}>{item}</option>
                      })}
                  </select>
                  <Transition.Root show={openCountryModal} as={Fragment}>
                    <Dialog as="div" className="relative z-20" initialFocus={cancelButtonRef} onClose={setOpenCountryModal}>
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                      </Transition.Child>

                      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                          <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                          >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="sm:items-start w-full">
                                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                      {t('addCountry')}
                                    </Dialog.Title>
                                    <div className="mt-2">
                                      <input
                                        type="text"
                                        onChange={handleChange}
                                        name="country"
                                        value={country}
                                        id="country"
                                        className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                  type="button"
                                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                  onClick={(e) => addCountry(e)}
                                >
                                  {t('save')}
                                </button>
                                <button
                                  type="button"
                                  className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                  onClick={() => setOpenCountryModal(false)}
                                  ref={cancelButtonRef}
                                >
                                  {t('cancel')}
                                </button>
                              </div>
                            </Dialog.Panel>
                          </Transition.Child>
                        </div>
                      </div>
                    </Dialog>
                  </Transition.Root>
                </div>
                <div className="w-full">
                  <div className='flex justify-between'>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      {t('city')}
                    </label>
                    <label onClick={()=>{setOpenCityModal(true), setCity('')}} htmlFor="unitType" className="block cursor-pointer text-sm font-medium text-green-700">
                      {t('add')}?
                    </label>
                  </div>
                  <select id="city" name="city" onChange={ handleChange } value={city} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                    <option value=''>select city</option>
                    {citiesArray.map((item, index)=>{
                      return <option key={index} value={item}>{item}</option>
                    })}
                  </select>
                  <Transition.Root show={openCityModal} as={Fragment}>
                  <Dialog as="div" className="relative z-20" initialFocus={cancelButtonRef} onClose={setOpenCityModal}>
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                          enterTo="opacity-100 translate-y-0 sm:scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                          <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                              <div className="sm:items-start w-full">
                                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                  <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                    {t('addCity')}
                                  </Dialog.Title>
                                  <div className="mt-2">
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
                              </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                              <button
                                type="button"
                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                onClick={(e) => addCity(e)}
                              >
                                {t('save')}
                              </button>
                              <button
                                type="button"
                                className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                onClick={() => setOpenCityModal(false)}
                                ref={cancelButtonRef}
                              >
                                {t('cancel')}
                              </button>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition.Root>
                </div>
                <div className="w-full">
                  <div className='flex justify-between'>
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                      {t('area')}
                    </label>
                    <label onClick={()=>{setOpenAreaModal(true), setArea('')}} htmlFor="unitType" className="block cursor-pointer text-sm font-medium text-green-700">
                      {t('add')}?
                    </label>
                  </div>
                  <select id="area" name="area" onChange={ handleChange } value={area} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                      <option value=''>select area</option>
                      {areasArray.map((item, index)=>{
                          return <option key={index} value={item}>{item}</option>
                      })}
                  </select>
                  <Transition.Root show={openAreaModal} as={Fragment}>
                  <Dialog as="div" className="relative z-20" initialFocus={cancelButtonRef} onClose={setOpenAreaModal}>
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                          enterTo="opacity-100 translate-y-0 sm:scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                          <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                              <div className="sm:items-start w-full">
                                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                  <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                    {t('addArea')}
                                  </Dialog.Title>
                                  <div className="mt-2">
                                    <input
                                      type="text"
                                      onChange={handleChange}
                                      name="area"
                                      value={area}
                                      id="area"
                                      className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                              <button
                                type="button"
                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                onClick={(e) => addArea(e)}
                              >
                                {t('save')}
                              </button>
                              <button
                                type="button"
                                className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                onClick={() => setOpenAreaModal(false)}
                                ref={cancelButtonRef}
                              >
                                {t('cancel')}
                              </button>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition.Root>
                </div>

            </div>

            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
                <textarea cols="30" rows="5" type="text"
                    onChange={ handleChange }
                    name="notes"
                    placeholder={t('addNotesHere')}
                    value={notes}
                    id="notes"
                    className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </textarea>
            </div>

          </div>
        ),
      },
      {
        label: t('management'),
        value: "management",
        icon: BsCashCoin,
        desc: (
          <div>

            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
              <div className="w-full">
                <label htmlFor="contractStartDate" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="investmentStructure" className="block text-sm font-medium text-gray-700">
                {t('investmentStructure')}
                </label>
                <select id="investmentStructure" name="investmentStructure" onChange={ handleChange } value={investmentStructure} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option value=''>select investment structure</option>
                  {investmentStructures.map((item, index)=>{
                    return <option key={index} value={item}>{item}</option>
                  })}
                </select>
              </div>
              <div className="w-full">
                <label htmlFor="gracePeriodFrom" className="block text-sm font-medium text-gray-700">
                  {t('gracePeriodFrom')}
                </label>
                <input
                  type="date"
                  onChange={handleChange}
                  name="gracePeriodFrom"
                  value={gracePeriodFrom}
                  id="gracePeriodFrom"
                  className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
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
              <div className="w-full">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  {t('amount')}
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="amount"
                  value={amount}
                  id="amount"
                  className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="gracePeriodTo" className="block text-sm font-medium text-gray-700">
                  {t('gracePeriodTo')}
                </label>
                <input
                  type="date"
                  onChange={handleChange}
                  name="gracePeriodTo"
                  value={gracePeriodTo}
                  id="gracePeriodTo"
                  className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className='flex space-x-4 rtl:space-x-reverse'>

              <div className="w-1/4">
                <label htmlFor="paymentScheduling" className="block text-sm font-medium text-gray-700">
                  {t('paymentScheduling')}
                </label>
                <select id="paymentScheduling" name="paymentScheduling" onChange={ handleChange } value={paymentScheduling} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option value=''>select payment scheduling</option>
                  {paymentSchedulings.map((item, index)=>{
                    return <option key={index} value={item}>{item}</option>
                  })}
                </select>
              </div>
              
            </div>

          </div>
        ),
      },
    ];

    const next = () => {
      if (active === 10) return;
      setActive(active + 1);
    };
     
    const prev = () => {
      if (active === 1) return;
      setActive(active - 1);
    };

    useEffect(() => {

      let pageSize = 10
      let totalNoOfPages = Math.ceil(filteredInvoices.length / pageSize);
      
      setTotalNoOfPages(totalNoOfPages)
      
      const startIndex = (active - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const currentItems = filteredInvoices.slice(startIndex, endIndex);
      setFilteredData(currentItems)

    }, [active])

    useEffect(() => {

      let data = dbTenants.filter((item)=>{
        return item.name === tenant;
      })

      if(data.length > 0) {
        let {name, email, phoneNo, openingBalance} = data[0];

        setTenantName(name)
        setTenantEmail(email)
        setTenantPhoneNo(phoneNo)
        setTenantOpeningBalance(openingBalance)
      }

    }, [tenant])

    const newContractData = [
      
      {
        label: t('unitDetails'),
        value: "unitDetails",
        icon: HiOutlineBuildingOffice2,
        desc: (
          <div>

            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>

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
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="buildingNameInArabic" className="block text-sm font-medium text-gray-700">
                        {t('buildingNameInArabic')}
                    </label>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="buildingNameInArabic"
                        value={buildingNameInArabic}
                        id="buildingNameInArabic"
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="buildingNameInEnglish" className="block text-sm font-medium text-gray-700">
                        {t('buildingNameInEnglish')}
                    </label>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="buildingNameInEnglish"
                        value={buildingNameInEnglish}
                        id="buildingNameInEnglish"
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="w-8/12">
                    <label htmlFor="plotNo" className="block text-sm font-medium text-gray-700">
                        {t('plotNo')}
                    </label>
                    <input
                        type="number"
                        onChange={handleChange}
                        name="plotNo"
                        value={plotNo}
                        id="plotNo"
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="w-8/12">
                    <label htmlFor="rent" className="block text-sm font-medium text-gray-700">
                        {t('rent')}
                    </label>
                    <input
                        type="number"
                        onChange={handleChange}
                        name="rent"
                        value={rent}
                        id="rent"
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>

                <div className="w-8/12">
                    <label htmlFor="bathroom" className="block text-sm font-medium text-gray-700">
                        {t('bathroom')}
                    </label>
                    <input
                        type="number"
                        onChange={handleChange}
                        name="bathroom"
                        value={bathroom}
                        id="bathroom"
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="w-8/12">
                    <label htmlFor="parkings" className="block text-sm font-medium text-gray-700">
                        {t('parkings')}
                    </label>
                    <input
                        type="number"
                        onChange={handleChange}
                        name="parkings"
                        value={parkings}
                        id="parkings"
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="w-8/12">
                    <label htmlFor="rentParking" className="block text-sm font-medium text-gray-700">
                        {t('rentParking')}
                    </label>
                    <input
                        type="number"
                        onChange={handleChange}
                        name="rentParking"
                        value={rentParking}
                        id="rentParking"
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="w-8/12">
                    <label htmlFor="roof" className="block text-sm font-medium text-gray-700">
                        {t('roof')}
                    </label>
                    <input
                        type="number"
                        onChange={handleChange}
                        name="roof"
                        value={roof}
                        id="roof"
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="w-8/12">
                    <label htmlFor="balcony" className="block text-sm font-medium text-gray-700">
                        {t('balcony')}
                    </label>
                    <input
                        type="number"
                        onChange={handleChange}
                        name="balcony"
                        value={balcony}
                        id="balcony"
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="w-8/12">
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                        {t('size')}
                    </label>
                    <input
                        type="number"
                        onChange={handleChange}
                        name="size"
                        value={size}
                        id="size"
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
                <div className="w-full">
                    <label htmlFor="electricityMeterNo" className="block text-sm font-medium text-gray-700">
                        {t('electricityMeterNo')}
                    </label>
                    <input
                        type="number"
                        onChange={handleChange}
                        name="electricityMeterNo"
                        value={electricityMeterNo}
                        id="electricityMeterNo"
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="waterMeterNumber" className="block text-sm font-medium text-gray-700">
                        {t('waterMeterNumber')}
                    </label>
                    <input
                        type="number"
                        onChange={handleChange}
                        name="waterMeterNumber"
                        value={waterMeterNumber}
                        id="waterMeterNumber"
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="sewageNumber" className="block text-sm font-medium text-gray-700">
                        {t('sewageNumber')}
                    </label>
                    <input
                        type="number"
                        onChange={handleChange}
                        name="sewageNumber"
                        value={sewageNumber}
                        id="sewageNumber"
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

            </div>

            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
                <div className="w-full">
                    <label htmlFor="ac" className="block text-sm font-medium text-gray-700">
                        {t('ac')}
                    </label>
                    <select id="ac" name="ac" onChange={ handleChange } value={ac} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                        <option value=''>select ac</option>
                        {aces.map((item, index)=>{
                            return <option key={index} value={item}>{item}</option>
                        })}
                    </select>
                </div>
                <div className="w-full">
                    <label htmlFor="unitType" className="block text-sm font-medium text-gray-700">
                        {t('unitType')}
                    </label>
                    <select id="unitType" name="unitType" onChange={ handleChange } value={unitType} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                        <option value=''>select unit type</option>
                        {unitTypesArray.map((item, index)=>{
                            return <option key={index} value={item}>{item}</option>
                        })}
                    </select>
                </div>
                <div className="w-full">
                    <label htmlFor="unitUse" className="block text-sm font-medium text-gray-700">
                        {t('unitUse')}
                    </label>
                    <select id="unitUse" name="unitUse" onChange={ handleChange } value={unitUse} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                        <option value=''>select unit use</option>
                        {unitUsesArray.map((item, index)=>{ 
                            return <option key={index} value={item}>{item}</option>
                        })}
                    </select>
                </div>

                
                

                <div className="w-full">
                    <label htmlFor="unitStatus" className="block text-sm font-medium text-gray-700">
                        {t('unitStatus')}
                    </label>
                    <select id="unitStatus" name="unitStatus" onChange={ handleChange } value={unitStatus} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                        <option value=''>select unit status</option>
                        {unitStatuses.map((item, index)=>{ 
                            return <option key={index} value={item}>{item}</option>
                        })}
                    </select>
                </div>

                <div className="w-full">
                    <label htmlFor="view" className="block text-sm font-medium text-gray-700">
                        {t('view')}
                    </label>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="view"
                        value={view}
                        id="view"
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>

                <div className="w-full">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        {t('country')}
                    </label>
                    <select id="country" name="country" onChange={ handleChange } value={country} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                        <option value=''>select country</option>
                        {countriesArray.map((item, index)=>{
                            return <option key={index} value={item}>{item}</option>
                        })}
                    </select>
                </div>
                <div className="w-full">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        {t('city')}
                    </label>
                    <select id="city" name="city" onChange={ handleChange } value={city} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                        <option value=''>select city</option>
                        {citiesArray.map((item, index)=>{
                          return <option key={index} value={item}>{item}</option>
                        })}
                    </select>
                </div>
                <div className="w-full">
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                        {t('area')}
                    </label>
                    <select id="area" name="area" onChange={ handleChange } value={area} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                        <option value=''>select area</option>
                        {areasArray.map((item, index)=>{
                            return <option key={index} value={item}>{item}</option>
                        })}
                    </select>
                </div>

            </div>

            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
                <textarea cols="30" rows="5" type="text"
                    onChange={ handleChange }
                    name="notes"
                    placeholder={t('addNotesHere')}
                    value={notes}
                    id="notes"
                    className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </textarea>
            </div>

          </div>
        ),
      },
      {
        label: t('customerDetails'),
        value: "customerDetails",
        icon: FiUsers,
        desc: (
          <div>
            <div className='flex justify-between'>
              <div className=''>
                <Select size="md" label={t('tenantProfile')} name='tenant' id='tenant' value={tenant} onChange={(e) => setTenant(e)}>
                  {filteredTenants.map((item, index) => {
                    return <Option key={index} value={item.name}>{item.name}</Option>
                  })}
                </Select>
              </div>
              <div>
                <Link href={'/panel/businessSetup/contactList?open=true&openTenant=true'} className='text-sm font-medium text-blue-600 no-underline'>{t('addNewTenant')}</Link>
              </div>
            </div>


            <div className="bg-white py-5">
              <div className="grid grid-cols-6 gap-6">

                <div className="col-span-6 sm:col-span-1">
                  <label htmlFor="tenantName" className="block text-sm font-medium text-gray-700">{t('name')}</label>
                  <input disabled type="tenantName" name="tenantName" id="tenantName" value={tenantName} className="cursor-not-allowed bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
                </div>


                <div className="col-span-6 sm:col-span-1">
                  <label htmlFor="tenantEmail" className="block text-sm font-medium text-gray-700">{t('email')}</label>
                  <input disabled value={tenantEmail} type="text" name="tenantEmail" id="tenantEmail" autoComplete="email" className="cursor-not-allowed bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
                </div>

                <div className="col-span-6 sm:col-span-1">
                  <label htmlFor="tenantPhoneNo" className="block text-sm font-medium text-gray-700">{t('phoneNo')}</label>
                  <input disabled value={tenantPhoneNo} type="number" name="tenantPhoneNo" id="tenantPhoneNo" className="cursor-not-allowed bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
                </div>

                <div className="col-span-6 sm:col-span-1">
                  <label htmlFor="tenantOpeningBalance" className="block text-sm font-medium text-gray-700">{t('openingBalance')}</label>
                  <input disabled value={tenantOpeningBalance} type="number" name="tenantOpeningBalance" id="tenantOpeningBalance" className="cursor-not-allowed bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
                </div>

                <div className="col-span-6 sm:col-span-1">
                  <label htmlFor="tenantIdNumber" className="block text-sm font-medium text-gray-700">{t('idNumber')}</label>
                  <input onChange={handleChange} value={tenantIdNumber} type="number" name="tenantIdNumber" id="tenantIdNumber" className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
                </div>

                <div className="col-span-6 sm:col-span-1">
                  <label htmlFor="tenantExpIdNumber" className="block text-sm font-medium text-gray-700">{t('expID')}</label>
                  <input onChange={handleChange} value={tenantExpIdNumber} type="date" name="tenantExpIdNumber" id="tenantExpIdNumber" className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
                </div>

              </div>

            </div>
            <Accordion open={openTenantExtraForm === 0} icon={<Icon id={1} open={openTenantExtraForm} />}>
              <AccordionHeader onClick={() => handleOpenTenantExtraForm(1)}>{t('accordationLabel')}</AccordionHeader>
              <AccordionBody>
                <div>
                  <div className='flex space-x-4 rtl:space-x-reverse mb-14'>

                    <div className="w-full">
                      <label htmlFor="tenantPassPortNumber" className="block text-sm font-medium text-gray-700">
                        {t('passPortNumber')}
                      </label>
                      <input
                        type="number"
                        onChange={handleChange}
                        name="tenantPassPortNumber"
                        value={tenantPassPortNumber}
                        id="tenantPassPortNumber"
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="w-full">
                      <label htmlFor="tenantExpPassPort" className="block text-sm font-medium text-gray-700">
                        {t('expPassPort')}
                      </label>
                      <input 
                        type="date"
                        onChange={handleChange}
                        name="tenantExpPassPort"
                        id="tenantExpPassPort"
                        value={tenantExpPassPort}
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="w-full">
                      <label htmlFor="tenantVatRegistrationNo" className="block text-sm font-medium text-gray-700">
                        {t('vatRegistrationNo')}
                      </label>
                      <input 
                        type="number"
                        onChange={handleChange}
                        name="tenantVatRegistrationNo"
                        id="tenantVatRegistrationNo"
                        value={tenantVatRegistrationNo}
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div> 
                  </div>

                  <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
                    <div className="w-full">
                      <label htmlFor="tenantIbanNo" className="block text-sm font-medium text-gray-700">
                        {t('ibanNo')}
                      </label>
                      <input
                        type="number"
                        onChange={handleChange}
                        name="tenantIbanNo"
                        value={tenantIbanNo}
                        id="tenantIbanNo"
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="w-full">
                      <label htmlFor="tenantBank" className="block text-sm font-medium text-gray-700">
                        {t('bank')}
                      </label>
                      <input 
                        type="text"
                        onChange={handleChange}
                        name="tenantBank"
                        id="tenantBank"
                        value={tenantBank}
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="w-full">
                      <label htmlFor="tenantBankAccountNumber" className="block text-sm font-medium text-gray-700">
                        {t('bankAccountNumber')}
                      </label>
                      <input 
                        type="number"
                        onChange={handleChange}
                        name="tenantBankAccountNumber"
                        id="tenantBankAccountNumber"
                        value={tenantBankAccountNumber}
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    
                  </div>
                </div>
              </AccordionBody>
            </Accordion>

            <div className="flex items-center justify-center w-full mt-10">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" />
              </label>
            </div>


          </div>
        ),
      },
      {
        label: t('rent'),
        value: "rent",
        icon: BsCashCoin,
        desc: (
          <div>

            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
              <div className="w-full">
                <label htmlFor="newContractStartDate" className="block text-sm font-medium text-gray-700">
                 {t('contractStartDate')}
                </label>
                <input
                  type="date"
                  onChange={handleChange}
                  name="newContractStartDate"
                  value={newContractStartDate}
                  id="newContractStartDate"
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="newContractEndDate" className="block text-sm font-medium text-gray-700">
                 {t('contractEndDate')}
                </label>
                <input
                  type="date"
                  onChange={handleChange}
                  name="newContractEndDate"
                  value={newContractEndDate}
                  id="newContractEndDate"
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="newContractUnitRent" className="block text-sm font-medium text-gray-700">
                 {t('unitRent')}
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="newContractUnitRent"
                  value={newContractUnitRent}
                  id="newContractUnitRent"
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
              
              <div className="w-full">
                <label htmlFor="newContractCommission" className="block text-sm font-medium text-gray-700">
                  {t('commision')}
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="newContractCommission"
                  value={newContractCommission}
                  id="newContractCommission"
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="newContractRentParking" className="block text-sm font-medium text-gray-700">
                  {t('rentParking')}
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="newContractRentParking"
                  value={newContractRentParking}
                  id="newContractRentParking"
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="newContractBouncedChequeFine" className="block text-sm font-medium text-gray-700">
                  {t('bouncedChequeFine')}
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="newContractBouncedChequeFine"
                  value={newContractBouncedChequeFine}
                  id="newContractBouncedChequeFine"
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>

              <div className="w-full">
                <label htmlFor="newContractSecurityDeposit" className="block text-sm font-medium text-gray-700">
                  {t('securityDeposit')}
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="newContractSecurityDeposit"
                  value={newContractSecurityDeposit}
                  id="newContractSecurityDeposit"
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="newContractStatus" className="block text-sm font-medium text-gray-700">
                  {t('contractStatus')}
                </label>
                <select id="newContractStatus" name="newContractStatus" onChange={ handleChange } value={newContractStatus} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option value=''>select contract status</option>
                  {newContractStatusArray.map((item, index)=>{
                    return <option key={index} value={item}>{item}</option>
                  })}
                </select>
              </div>
              <div className="w-full">
                <label htmlFor="newContractPaymentScheduling" className="block text-sm font-medium text-gray-700">
                  {t('paymentScheduling')}
                </label>
                <select id="newContractPaymentScheduling" name="newContractPaymentScheduling" onChange={ handleChange } value={newContractPaymentScheduling} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option value=''>select payment scheduling</option>
                  {paymentSchedulings.map((item, index)=>{
                    return <option key={index} value={item}>{item}</option>
                  })}
                </select>
              </div>
              
            </div>
            <div className='flex space-x-4 rtl:space-x-reverse'>

              <div className="w-full">
                <textarea cols="30" rows="5" type="text"
                  onChange={handleChange}
                  value={newContractNotes}
                  name="newContractNotes"
                  id="newContractNotes"
                  placeholder={t('addNotesHere')}
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </textarea>
                
              </div>
              
            </div>

            <div className="flex items-center justify-center w-full mt-10">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" />
              </label>
            </div>
          </div>
        ),
      },
    ];

    const newContract = async(e)=>{
      e.preventDefault();
      
      if(selectedIds.length > 1){
        toast.error('select only 1 item' , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
      }
      else{
        setOpenNewContract(true);
        let id = selectedIds[0];
        getData(id);
      }
    }

    const submitNewContract = async(e) => {
      e.preventDefault();

      let data = {
        userEmail, unitNo, buildingNameInArabic, buildingNameInEnglish, plotNo, rent, bathroom, parkings, rentParking, roof,  balcony, size,  electricityMeterNo, waterMeterNumber, sewageNumber, ac, unitType, unitUse, unitStatus, view, country, city,  area,  notes,
        tenant, tenantName, tenantEmail, tenantPhoneNo, tenantOpeningBalance, tenantPassPortNumber, tenantExpPassPort, tenantVatRegistrationNo, tenantIbanNo, tenantBank, tenantBankAccountNumber, tenantIdNumber, tenantExpIdNumber,
        newContractStartDate, newContractEndDate, newContractUnitRent, newContractCommission, newContractRentParking, newContractBouncedChequeFine, newContractStatus, newContractPaymentScheduling, newContractSecurityDeposit, newContractNotes,
        path: 'NewContract'
      }

      let res = await fetch(`/api/addEntry`, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      let response = await res.json()

      if (response.success === true) {

        let formData = {
          open: true,
          refer:true,
          name: tenantName || '',
          unitRent: newContractUnitRent || 0,
          commission: newContractCommission || 0,
          parkingRent: newContractRentParking || 0,
          securityDeposit: newContractSecurityDeposit || 0,
        }
        const query = new URLSearchParams(formData).toString();
        router.push(`/panel/salesModule/creditSaleInvoice?${query}`);
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
            <div className="pl-4 flex justify-between">
              <h3 className="text-lg font-bold leading-6 text-gray-900">{t('unitTitle')}</h3>
              <button 
                onClick={()=>{
                    setOpen(true)
                    setId('')
                    setIsOpenSaveChange(true)

                    setAttachment('');
                    setPhoneNo('');
                    setEmail('');
                    setNameInBill('');
                    setIdNumber('');
                    setExpID('');
                    setBuilding('');
                    setPassPortNumber('');
                    setExpPassPort('');
                    setBuildingNameInArabic('');
                    setBuildingNameInEnglish('');
                    setParkings('');
                    setRoof('');
                    setCountry('');
                    setCity('');
                    setArea('');
                    setElectricityMeterNo('');
                    setContractStartDate('');
                    setInvestmentStructure('');
                    setGracePeriodFrom('');
                    setContractEndDate('');
                    setAmount('');
                    setGracePeriodTo('');
                    setPaymentScheduling('');
                    setUnitNo(''); // You mentioned setting unitNo to 100 initially
                    setBalcony('');
                    setAc('');
                    setUnitType('');
                    setUnitUse('');
                    setBathroom('');
                    setUnitStatus('');
                    setPlotNo('');
                    setRent('');
                    setRentParking('');
                    setSize('');
                    setWaterMeterNumber('');
                    setSewageNumber('');
                    setView('');
                    setNotes('');
                    setName('');
                }} 
                className={`${isAdmin === false ? 'cursor-not-allowed': ''} bg-blue-800 hover:bg-blue-900 text-white px-14 py-2 rounded-lg`} disabled={isAdmin === false}>
                {t('new')}
              </button>
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
                    <input value={search} onChange={handleChange} type="text" id="search" name='search' className="block w-full p-2 text-sm text-gray-900 rounded-lg bg-gray-50 outline-none placeholder:text-gray-500" placeholder={t('searchUnit')} required/>
                  </div>
                </div>
              </div>
              <div className='flex'>

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

              <Link href={'/panel/salesModule/salesInvoice?open=true&refer=true'} className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 no-underline flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm p-2 text-center mr-2 mb-2`} disabled={isAdmin === false}>
                {t('reserveUnits')}
              </Link>
              <button onClick={(e)=>newContract(e)} className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm p-2 text-center mr-2 mb-2`} disabled={isAdmin === false}>
                {t('newContract')}
              </button>
              {/* <button className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm p-2 text-center mr-2 mb-2`} disabled={isAdmin === false}>
                Change Unit Status
              </button>
              <button className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm p-2 text-center mr-2 mb-2`} disabled={isAdmin === false}>
                Archive Unit
              </button> */}

              <button onClick={delEntry} className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-red-800 flex hover:text-white border-2 border-red-800 hover:bg-red-800 font-semibold rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2`} disabled={isAdmin === false}>
                {t('delete')}
                <AiOutlineDelete className='text-lg ml-2'/>
              </button>
              
            </div>: ''}

            <form method="POST">
              <div className="overflow-hidden shadow sm:rounded-md">
                
                <div className="mt-2 overflow-x-auto shadow-sm">
                  <table ref={componentRef} className="w-full text-sm text-left text-gray-500 ">
                    <thead className="text-[11px] text-gray-700 uppercase bg-[#e9ecf7]">
                      <tr className=''>
                        <th scope="col" className="p-4">
                          <div className="flex items-center">
                            <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                          </div>
                        </th>
                        <th scope="col" className="p-1">
                          {t('buildingName')}
                        </th>
                        <th scope="col" className="p-1">
                          {t('unitNo')}
                        </th>
                        <th scope="col" className="p-1">
                            {t('unitStatus')}
                        </th>
                        <th scope="col" className="p-1">
                            {t('unitType')}
                        </th>
                        <th scope="col" className="p-1">
                            {t('unitRent')}
                        </th>
                        <th scope="col" className="p-1">
                            {t('unitUse')}
                        </th>
                        <th scope="col" className="p-1">
                            {t('space')}
                        </th>
                        <th scope="col" className="p-1">
                            {t('city')}
                        </th>
                        <th scope="col" className="p-1">
                            {t('area')}
                        </th>
                        <th scope="col" className="pr-3">
                          {t('editAndDel')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.map((item, index)=>{
                      return <tr key={index} className="text-[13px] bg-white border-b hover:bg-gray-50">
                        <td className="w-4 p-4">
                          <div className="flex items-center">
                            <input id={`checkbox-table-search-${item._id}`} checked={selectedIds.includes(item._id)} type="checkbox" onChange={e => handleRowCheckboxChange(e, item._id)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                          </div>
                        </td>
                        <td className="p-1 w-[140px]">
                          <div className=' text-black font-semibold'>{item.buildingNameInEnglish}</div>
                        </td>
                        <td className="p-1 w-[90px]">
                          <div className='text-black font-semibold'>{item.unitNo}</div>
                        </td>
                        <td className="p-1 w-[100px]">
                          <div className=''>{item.unitStatus}</div>
                        </td>
                        <td className="p-1 w-[100px]">
                          <div className=''>{item.unitType}</div>
                        </td>
                        <td className="p-1 w-[100px]">
                          <div className=''>{item.rent}</div>
                        </td>
                        <td className="p-1 w-[100px]">
                          <div className=''>{item.unitUse}</div>
                        </td>
                        <td className="p-1 w-[100px]">
                          <div className=''>{item.size}</div>
                        </td>
                        <td className="p-1 w-[170px]">
                          <div className=''>{item.city}</div>
                        </td>
                        <td className="p-1 w-[100px]">
                          <div className=''>{item.area}</div>
                        </td>
                        
                        <td className="flex items-center px-3 mr-5 py-4 space-x-4 rtl:space-x-reverse">
                          <button type='button' onClick={()=>{getData(item._id), setOpen(true)}} 
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

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={()=>{setOpen(false)}}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
          </Transition.Child>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95" enterTo="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 md:scale-100" leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
                <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-2 lg:max-w-6xl">
                  <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6">
                    <button type='button' className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-6 lg:right-8" onClick={() => setOpen(false)}>
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <div className='w-full'>
                      <form method="POST" onSubmit={(e)=>{submit(e)}}>
                        <div className="overflow-hidden shadow sm:rounded-md">
                          <div ref={speceficComponentRef} className="bg-white py-5">


                            <Tabs value="owner">
                              <TabsHeader className='bg-[#f0f3f4]'>
                                {data.map(({ label, index, value, icon }) => (
                                  <Tab key={index} value={value}>
                                    <div className="flex items-center gap-2">
                                      {React.createElement(icon, { className: "w-5 h-5" })}
                                      {label}
                                    </div>
                                  </Tab>
                                ))}
                              </TabsHeader>
                              <TabsBody className='mt-5'>
                                {data.map(({ value, index, desc }) => (
                                  <TabPanel key={index} value={value}>
                                    {desc}
                                  </TabPanel>
                                ))}
                              </TabsBody>
                            </Tabs>

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
                                documentTitle='Building and Owner'
                                pageStyle='print'
                              />

                              <button type='button' onClick={()=>{editEntry(id)}} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">{t('saveChanges')}</button>
                              {isOpenSaveChange && <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">{t('save')}</button>}
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


      <Transition.Root show={openNewContract} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={()=>{setOpenNewContract(false)}}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
          </Transition.Child>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95" enterTo="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 md:scale-100" leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
                <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-2 lg:max-w-6xl">
                  <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6">
                    <button type='button' className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-6 lg:right-8" onClick={() => setOpenNewContract(false)}>
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <div className='w-full'>
                      <form method="POST" onSubmit={(e)=>{submitNewContract(e)}}>
                        <div className="overflow-hidden shadow sm:rounded-md">
                          <div ref={speceficComponentRef} className="bg-white py-5">


                            <Tabs value="unitDetails">
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

                            <div className="bg-gray-50 space-x-3 rtl:space-x-reverse px-4 py-3 text-right sm:px-6">

                              <ReactToPrint
                                trigger={()=>{
                                  return <button 
                                    type="button"
                                    className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                                    Print
                                    <AiOutlinePrinter className='text-lg ml-2'/>
                                  </button>
                                }}
                                content={() => speceficComponentRef.current}
                                documentTitle='Building and Owner'
                                pageStyle='print'
                              />

                              <button type='button' onClick={()=>{editEntry(id)}} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Save Changes</button>
                              <button type="submit" onClick={(e)=>{submitNewContract(e)}} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Save Contract</button>
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
  let dbVouchers = await dbUnits.find()
  let dbBuildings = await Buildings.find()
  let dbContacts = await Contact.find()
  let dbTenants = await Contact.find({'type': 'Tenant'})

  // Pass data to the page via props
  return {
    props: {
      dbVouchers: JSON.parse(JSON.stringify(dbVouchers)),
      dbContacts: JSON.parse(JSON.stringify(dbContacts)),
      dbTenants: JSON.parse(JSON.stringify(dbTenants)),
      dbBuildings: JSON.parse(JSON.stringify(dbBuildings)),
    }
  }
}   
export default Units;