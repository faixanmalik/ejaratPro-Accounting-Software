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
import dbBuildings from 'models/Buildings'; 

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { BiUserCircle } from 'react-icons/bi';
import { BsCashCoin } from 'react-icons/bs';
import { MdAdUnits } from 'react-icons/md';
import Charts from 'models/Charts';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/router';


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

  const Buildings = ({ userEmail, dbVouchers, dbContacts, dbCharts }) => {
    
    const [open, setOpen] = useState(false)

    const { t } = useTranslation('realEstate')
    const router = useRouter();

    const [id, setId] = useState('')
    const [selectedIds, setSelectedIds] = useState([]);
    const [isOpenSaveChange, setIsOpenSaveChange] = useState(true)

    // authentications
    const [isAdmin, setIsAdmin] = useState(false)
    const [filteredInvoices, setFilteredInvoices] = useState([])
    const [filteredContacts, setFilteredContacts] = useState([])


    function handleRowCheckboxChange(e, id) {
      if (e.target.checked) {
        setSelectedIds([...selectedIds, id]);
      } else {
        setSelectedIds(selectedIds.filter(rowId => rowId !== id));
      }
    }

    useEffect(() => {

      let filteredInvoices = dbVouchers.filter((item)=>{
        return item.userEmail === userEmail;
      })
      setFilteredInvoices(filteredInvoices)

      let filteredContacts = dbContacts.filter((item)=>{
        return item.userEmail === userEmail;
      })
      setFilteredContacts(filteredContacts)

      const myUser = JSON.parse(localStorage.getItem('myUser'))
      if(myUser.department === 'Admin'){
        setIsAdmin(true)
      }
    }, [userEmail])

    const [attachment, setAttachment] = useState('')
    const [name, setName] = useState('')
    const [phoneNo, setPhoneNo] = useState(0)
    const [email, setEmail] = useState('')
    const [search, setSearch] = useState('')

    const [openExtraForm, setOpenExtraForm] = React.useState(1);
    const handleOpenExtraForm = (value) => setOpenExtraForm(openExtraForm === value ? 0 : value); 

    const [nameInInvoice, setNameInInvoice] = useState('')
    const [lessorName, setLessorName] = useState('')
    const [adjective, setAdjective] = useState('')
    const [buildingType, setBuildingType] = useState('')
    const [idNumber, setIdNumber] = useState('')
    const [expID, setExpID] = useState('')
    const [bank, setBank] = useState('')
    const [passPortNumber, setPassPortNumber] = useState('')
    const [expPassPort, setExpPassPort] = useState('')
    const [nationality, setNationality] = useState('')
    const [ibanNo, setIbanNo] = useState('')
    const [vatRegistrationNo, setVatRegistrationNo] = useState('')
    const [bankAccountNumber, setBankAccountNumber] = useState('')
    const [tradeLicenseNo, setTradeLicenseNo] = useState('')
    
    const [buildingNameInArabic, setBuildingNameInArabic] = useState('')
    const [buildingNameInEnglish, setBuildingNameInEnglish] = useState('')
    const [totalUnits, setTotalUnits] = useState('')
    const [unitsPerFloor, setUnitsPerFloor] = useState('')
    const [parkings, setParkings] = useState('')
    const [roof, setRoof] = useState('')
    
    const [mizan, setMizan] = useState('')
    const [plotArea, setPlotArea] = useState('')
    const [floor, setFloor] = useState('')
    const [buildingArea, setBuildingArea] = useState('')
    const [electricityMeterNo, setElectricityMeterNo] = useState('')
    const [titleDeedNo, setTitleDeedNo] = useState('')

    const [contractStartDate, setContractStartDate] = useState('')
    const [investmentStructure, setInvestmentStructure] = useState('')
    const [gracePeriodFrom, setGracePeriodFrom] = useState('')
    const [contractEndDate, setContractEndDate] = useState('')
    const [amount, setAmount] = useState('')
    const [gracePeriodTo, setGracePeriodTo] = useState('')
    const [paymentScheduling, setPaymentScheduling] = useState('')

    const [unitNo, setUnitNo] = useState('')
    const [unitName, setUnitName] = useState('')
    const [country, setCountry] = useState('')
    const [city, setCity] = useState('')
    const [area, setArea] = useState('')
    const [unitRent, setUnitRent] = useState('')
    const [unitType, setUnitType] = useState('')
    const [unitUse, setUnitUse] = useState('')
    const [unitSize, setUnitSize] = useState('')
    const [bathroom, setBathroom] = useState('')
    const [parking, setParking] = useState('')
    const [balcony, setBalcony] = useState('')
    const [ac, setAc] = useState('')
    const [unitStatus, setUnitStatus] = useState('')
    const [noOfFunctionLoop, setNoOfFunctionLoop] = useState(1)

    const [receiveUnitsArray, setReceiveUnitsArray] = useState([])
    const [increment, setIncrement] = useState(100)

    const [filteredData, setFilteredData] = useState([])
    


    // Modals
    const [openModal, setOpenModal] = useState(false)

    const [openUnitTypeModal, setOpenUnitTypeModal] = useState(false)
    const [openUnitUseModal, setOpenUnitUseModal] = useState(false)
    const [openNationalityModal, setOpenNationalityModal] = useState(false)
    const [openCountryModal, setOpenCountryModal] = useState(false)
    const [openCityModal, setOpenCityModal] = useState(false)
    const [openAreaModal, setOpenAreaModal] = useState(false)
    const cancelButtonRef = useRef(null)


    
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


    const [nationalitiesArray, setNationalitiesArray] = useState(() => {
      if (typeof window !== 'undefined') {
        const storedNationalities = localStorage.getItem('nationalities');
        return storedNationalities ? JSON.parse(storedNationalities) : ['Jordian', 'UAE', 'Indian', 'Pakistani', 'Morco', 'Egypt'];
      } else {
        return ['Jordian', 'UAE', 'Indian', 'Pakistani', 'Morco', 'Egypt'];
      }
    })


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


    


    useEffect(() => {

      localStorage.setItem('unitTypes', JSON.stringify(unitTypesArray));
      localStorage.setItem('unitUses', JSON.stringify(unitUsesArray));
      localStorage.setItem('nationalities', JSON.stringify(nationalitiesArray));
      localStorage.setItem('countries', JSON.stringify(countriesArray));
      localStorage.setItem('cities', JSON.stringify(citiesArray));
      localStorage.setItem('areas', JSON.stringify(areasArray));


    }, [unitTypesArray, unitUsesArray, nationalitiesArray, countriesArray, citiesArray, areasArray]);


    useEffect(() => {
      
      let highestValue = receiveUnitsArray.reduce((max, item) => Math.max(max, item.unitNo), -Infinity);
      if(receiveUnitsArray.length === 0){
        setUnitNo('')
      }
      else{
        setUnitNo(highestValue + 100)
      }

    }, [receiveUnitsArray])
    


    const handleChange = (e) => {
      const { name, value } = e.target;
      
      if(name === 'tradeLicenseNo'){
        setTradeLicenseNo(value)
      }
      else if(name === 'noOfFunctionLoop'){
        setNoOfFunctionLoop(value)
      }
      else if(name === 'bankAccountNumber'){
        setBankAccountNumber(value)
      }
      else if(name === 'vatRegistrationNo'){
        setVatRegistrationNo(value)
      }
      else if(name === 'phoneNo'){
        setPhoneNo(value)
      }
      else if(name === 'ibanNo'){
        setIbanNo(value)
      }
      else if(name === 'nameInInvoice'){
        setNameInInvoice(value)
      }
      else if(name === 'lessorName'){
        setLessorName(value)
      }
      else if(name === 'adjective'){
        setAdjective(value)
      }
      else if(name === 'buildingType'){
        setBuildingType(value)
      }
      else if(name === 'bank'){
        setBank(value)
      }
      else if(name === 'idNumber'){
        setIdNumber(value)
      }
      else if(name === 'expID'){
        setExpID(value)
      }
      else if(name === 'passPortNumber'){
        setPassPortNumber(value)
      }
      else if(name === 'expPassPort'){
        setExpPassPort(value)
      }
      else if(name === 'nationality'){
        setNationality(value)
      }
      else if (name === 'buildingNameInArabic') {
        setBuildingNameInArabic(value);
      } 
      else if (name === 'buildingNameInEnglish') {
        setBuildingNameInEnglish(value);
      } 
      else if (name === 'totalUnits') {
        setTotalUnits(value);
      } 
      else if (name === 'unitsPerFloor') {
        setUnitsPerFloor(value);
      } 
      else if (name === 'parkings') {
        setParkings(value);
      } 
      else if (name === 'roof') {
        setRoof(value);
      } 
      else if (name === 'titleDeedNo') {
        setTitleDeedNo(value);
      } 
      else if (name === 'country') {
        setCountry(value);
      } 
      else if (name === 'city') {
        setCity(value);
      }
      else if (name === 'area') {
        setArea(value);
      }
      else if (name === 'mizan') {
        setMizan(value);
      } 
      else if (name === 'plotArea') {
        setPlotArea(value);
      } 
      else if (name === 'floor') {
        setFloor(value);
      } 
      else if (name === 'buildingArea') {
        setBuildingArea(value);
      } 
      else if (name === 'electricityMeterNo') {
        setElectricityMeterNo(value);
      }
      else if (name === 'contractStartDate') {
        setContractStartDate(value);
      } 
      else if (name === 'investmentStructure') {
        setInvestmentStructure(value);
      } 
      else if (name === 'gracePeriodFrom') {
        setGracePeriodFrom(value);
      } 
      else if (name === 'contractEndDate') {
        setContractEndDate(value);
      } 
      else if (name === 'amount') {
        setAmount(value);
      } 
      else if (name === 'gracePeriodTo') {
        setGracePeriodTo(value);
      } 
      else if (name === 'paymentScheduling') {
        setPaymentScheduling(value);
      }
      else if (name === 'unitNo') {
        setUnitNo(value);
        setUnitName(value);
      } 
      else if (name === 'unitName') {
        setUnitName(value);
      } 
      else if (name === 'unitRent') {
        setUnitRent(value);
      } 
      else if (name === 'unitType') {
        setUnitType(value);
      } 
      else if (name === 'unitUse') {
        setUnitUse(value);
      } 
      else if (name === 'unitSize') {
        setUnitSize(value);
      } 
      else if (name === 'bathroom') {
        setBathroom(value);
      } 
      else if (name === 'parking') {
        setParking(value);
      } 
      else if (name === 'balcony') {
        setBalcony(value);
      } 
      else if (name === 'ac') {
        setAc(value);
      } 
      else if (name === 'unitStatus') {
        setUnitStatus(value);
      }
      else if(name === 'email'){
        setEmail(value)
      }
      else if(name === 'search'){
        setSearch(value);
      }
      else if(name === 'attachment'){
        setAttachment(value)
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

    useEffect(() => {
      
      const newFilteredData = filteredInvoices.filter((item)=>{
        return item.buildingNameInEnglish.toLowerCase().includes(search.toLowerCase());
      });
      setFilteredData(newFilteredData)

    }, [search])

    // JV
    const submit = async(e)=>{
      e.preventDefault()

      // fetch the data from form to makes a file in local system
      const data = { userEmail, receiveUnitsArray, nameInInvoice, lessorName, adjective, buildingType, idNumber, expID, bank, passPortNumber, expPassPort, nationality, ibanNo, vatRegistrationNo, bankAccountNumber, tradeLicenseNo, buildingNameInArabic, buildingNameInEnglish, totalUnits, unitsPerFloor, parkings, roof, country, city, area, mizan, plotArea, floor, buildingArea, electricityMeterNo, titleDeedNo, contractStartDate, investmentStructure, gracePeriodFrom, contractEndDate, amount, gracePeriodTo, paymentScheduling, attachment, name, phoneNo, email , path:'Buildings' };

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

      const data = { id, receiveUnitsArray, nameInInvoice, lessorName, adjective, buildingType, idNumber, expID, bank, passPortNumber, expPassPort, nationality, ibanNo, vatRegistrationNo, bankAccountNumber, tradeLicenseNo, buildingNameInArabic, buildingNameInEnglish, totalUnits, unitsPerFloor, parkings, roof, country, city, area, mizan, plotArea, floor, buildingArea, electricityMeterNo, titleDeedNo, contractStartDate, investmentStructure, gracePeriodFrom, contractEndDate, amount, gracePeriodTo, paymentScheduling, attachment, name, phoneNo, email , path:'Buildings' };
      
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

      const data = { selectedIds, userEmail, path: 'Buildings' };
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
      setIsOpenSaveChange(false)

      const data = { id, path: 'Buildings' };
      let res = await fetch(`/api/getDataEntry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      let response = await res.json()

      if (response.success === true){
        const {receiveUnitsArray, nameInInvoice, lessorName, adjective, buildingType, idNumber, expID, bank, passPortNumber, expPassPort, nationality, ibanNo, vatRegistrationNo, bankAccountNumber, tradeLicenseNo, buildingNameInArabic, buildingNameInEnglish, totalUnits, unitsPerFloor, parkings, roof, country, city, area, mizan, plotArea, floor, buildingArea, electricityMeterNo, titleDeedNo, contractStartDate, investmentStructure, gracePeriodFrom, contractEndDate, amount, gracePeriodTo, paymentScheduling, attachment, name, phoneNo, email} = response.data;
        
        let dbContractStartDate = moment(contractStartDate, 'YYYY-MM-DD', true).isValid() ? moment(contractStartDate).utc().format('YYYY-MM-DD') : '';
        let dbContractEndDate = moment(contractEndDate, 'YYYY-MM-DD', true).isValid() ? moment(contractEndDate).utc().format('YYYY-MM-DD') : '';
        let dbGracePeriodFromDate = moment(gracePeriodFrom, 'YYYY-MM-DD', true).isValid() ? moment(gracePeriodFrom).utc().format('YYYY-MM-DD') : '';
        let dbGracePeriodToDate = moment(gracePeriodTo, 'YYYY-MM-DD', true).isValid() ? moment(gracePeriodTo).utc().format('YYYY-MM-DD') : '';
        let dbExpDate = moment(expID, 'YYYY-MM-DD', true).isValid() ? moment(expID).utc().format('YYYY-MM-DD') : '';
        let dbPassPortDate = moment(expPassPort, 'YYYY-MM-DD', true).isValid() ? moment(expPassPort).utc().format('YYYY-MM-DD') : '';

        setId(response.data._id)
        setReceiveUnitsArray(receiveUnitsArray);
        setNameInInvoice(nameInInvoice);
        setLessorName(lessorName);
        setAdjective(adjective);
        setBuildingType(buildingType);
        setIdNumber(idNumber);
        setExpID(dbExpDate);
        setBank(bank);
        setPassPortNumber(passPortNumber);
        setExpPassPort(dbPassPortDate);
        setNationality(nationality);
        setIbanNo(ibanNo);
        setVatRegistrationNo(vatRegistrationNo);
        setBankAccountNumber(bankAccountNumber);
        setTradeLicenseNo(tradeLicenseNo);
        setBuildingNameInArabic(buildingNameInArabic);
        setBuildingNameInEnglish(buildingNameInEnglish);
        setTotalUnits(totalUnits);
        setUnitsPerFloor(unitsPerFloor);
        setParkings(parkings);
        setRoof(roof);
        setCountry(country);
        setCity(city);
        setArea(area);
        setMizan(mizan);
        setPlotArea(plotArea);
        setFloor(floor);
        setBuildingArea(buildingArea);
        setElectricityMeterNo(electricityMeterNo);
        setTitleDeedNo(titleDeedNo);
        setContractStartDate(dbContractStartDate);
        setInvestmentStructure(investmentStructure);
        setGracePeriodFrom(dbGracePeriodFromDate);
        setContractEndDate(dbContractEndDate);
        setAmount(amount);
        setGracePeriodTo(dbGracePeriodToDate);
        setPaymentScheduling(paymentScheduling);
        setAttachment(attachment);
        setName(name);
        setPhoneNo(phoneNo);
        setEmail(email);
      }
    }

    // For print
    const componentRef = useRef();
    const speceficComponentRef = useRef();

    let adjectives = ['Agent', 'Owner' ];
    let buildingTypes = ['Management', 'Owned', 'Investment']
    let bankAccounts = ['Dubai Islamic Bank', 'Meezan Bank', 'Ajman Bank', 'FAB']
    let investmentStructures = [ 'Fixed', 'of Rent %', 'of Collection %' ]
    let paymentSchedulings = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    let aces = ['Window', 'Split', 'Central']
    let unitStatuses = ['Available', 'Occupied', 'Booked', 'Hold', 'Rent Dispute']

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

    const addNationality = (e)=>{
      e.preventDefault();

      if (nationality.trim() !== '') {
        setNationalitiesArray((prev) => [...prev, nationality]);
        setOpenNationalityModal(false);
        setNationality('')
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

    
    const saveUnit = async(e) => {
      e.preventDefault();

      let unitNoIncrement = parseInt(unitNo); // Starting unitNo value

      for (let i = 0; i < noOfFunctionLoop; i++) {
        const data = { unitNo: unitNoIncrement, unitName, unitRent, unitType, unitUse, unitSize, bathroom, parking, balcony, ac, unitStatus};

        const indexToUpdate = receiveUnitsArray.findIndex((item) => item.unitNo === unitNo);

        if (indexToUpdate !== -1) {
          // Update the unit properties
          setReceiveUnitsArray((prevReceiveUnitsArray) => {
            const updatedArray = [...prevReceiveUnitsArray];
            updatedArray[indexToUpdate] = {
              ...updatedArray[indexToUpdate],
              ...data,
            };
            return updatedArray;
          });
        }
        else{
          setReceiveUnitsArray((prevReceiveUnitsArray) => {
            return [...prevReceiveUnitsArray, data];
          });
        }
    
        // Increment unitNo for the next iteration
        unitNoIncrement += increment;
      }

    }

    const editUnit = async(e, index) => {
      e.preventDefault();

      let editingdata = receiveUnitsArray[index];
      const { unitNo, unitName, unitRent, unitType, unitUse, unitSize, bathroom,
      parking, balcony, ac, unitStatus } = editingdata;

      setUnitNo(unitNo)
      setUnitName(unitName)
      setUnitRent(unitRent)
      setUnitType(unitType)
      setUnitUse(unitUse)
      setUnitSize(unitSize)
      setBathroom(bathroom)
      setParking(parking)
      setBalcony(balcony)
      setAc(ac)
      setUnitStatus(unitStatus)
    }

    const delUnit = async(indexToDelete) => {
      const updatedUnitsArray = [...receiveUnitsArray];
      updatedUnitsArray.splice(indexToDelete, 1);
      setReceiveUnitsArray(updatedUnitsArray);
    }


    const data = [
      {
        label: t('owner'),
        value: "owner",
        icon: BiUserCircle,
        desc: (
          <div>

            <div className='flex  space-x-4 rtl:space-x-reverse mb-14'>
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
                <label htmlFor="nameInInvoice" className="block text-sm font-medium text-gray-700">
                  {t('nameInInvoice')}
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="nameInInvoice"
                  value={nameInInvoice}
                  id="nameInInvoice"
                  className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  className="mt-1 p-2 bg-white block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
              <div className="w-full">
                <label htmlFor="lessorName" className="block text-sm font-medium text-gray-700">
                  {t('lessorName')}
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="lessorName"
                  value={lessorName}
                  id="lessorName"
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="adjective" className="block text-sm font-medium text-gray-700">
                  {t('adjective')}
                </label>
                <select id="adjective" name="adjective" onChange={ handleChange } value={adjective} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option value=''>select adjective</option>
                  {adjectives.map((item, index)=>{
                    return <option key={index} value={item}>{item}</option>
                  })}
                </select>
              </div>
              <div className="w-full">
                <label htmlFor="buildingType" className="block text-sm font-medium text-gray-700">
                  {t('buildingType')}
                </label>
                <select id="buildingType" name="buildingType" onChange={ handleChange } value={buildingType} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option value=''>select building type</option>
                  {buildingTypes.map((item, index)=>{
                    return <option key={index} value={item}>{item}</option>
                  })}
                </select>
              </div>
              
            </div>

            <Accordion open={openExtraForm === 0} icon={<Icon id={1} open={openExtraForm} />}>
              <AccordionHeader onClick={() => handleOpenExtraForm(1)}>{t('accordationLabel')}</AccordionHeader>
              <AccordionBody>
                <div>
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
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="bank" className="block text-sm font-medium text-gray-700">
                        {t('bank')}
                      </label>
                      <select id="bank" name="bank" onChange={ handleChange } value={bank} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                        <option value=''>select bank</option>
                        {bankAccounts.map((item, index)=>{
                          return <option key={index} value={item}>{item}</option>
                        })}
                      </select>
                    </div>
                  </div>

                  <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
                    <div className="w-full">
                      <label htmlFor="passPortNumber" className="block text-sm font-medium text-gray-700">
                        {t('passPortNumber')}
                      </label>
                      <input
                        type="number"
                        onChange={handleChange}
                        name="passPortNumber"
                        value={passPortNumber}
                        id="passPortNumber"
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="expPassPort" className="block text-sm font-medium text-gray-700">
                        {t('expPassPort')}
                      </label>
                      <input 
                        type="date"
                        onChange={handleChange}
                        name="expPassPort"
                        id="expPassPort"
                        value={expPassPort}
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="w-full">
                      <div className='flex justify-between'>
                        <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                          {t('nationality')}
                        </label>
                        <label onClick={()=>{setOpenNationalityModal(true), setUnitType('')}} htmlFor="unitType" className="block cursor-pointer text-sm font-medium text-green-700">
                          {t('add')}?
                        </label>
                      </div>
                      <select id="nationality" name="nationality" onChange={ handleChange } value={nationality} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                        <option value=''>select nationality</option>
                        {nationalitiesArray.map((item, index)=>{
                          return <option key={index} value={item}>{item}</option>
                        })}
                      </select>
                      <Transition.Root show={openNationalityModal} as={Fragment}>
                        <Dialog as="div" className="relative z-20" initialFocus={cancelButtonRef} onClose={setOpenNationalityModal}>
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
                                          {t('addNationality')}
                                        </Dialog.Title>
                                        <div className="mt-2">
                                          <input
                                            type="text"
                                            onChange={handleChange}
                                            name="nationality"
                                            value={nationality}
                                            id="nationality"
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
                                      onClick={(e) => addNationality(e)}
                                    >
                                      {t('save')}
                                    </button>
                                    <button
                                      type="button"
                                      className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                      onClick={() => setOpenNationalityModal(false)}
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
                    <div className="w-full">
                      <label htmlFor="ibanNo" className="block text-sm font-medium text-gray-700">
                        {t('ibanNo')}
                      </label>
                      <input
                        type="number"
                        onChange={handleChange}
                        name="ibanNo"
                        value={ibanNo}
                        id="ibanNo"
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="vatRegistrationNo" className="block text-sm font-medium text-gray-700">
                        {t('vatRegistrationNo')}
                      </label>
                      <input 
                        type="number"
                        onChange={handleChange}
                        name="vatRegistrationNo"
                        id="vatRegistrationNo"
                        value={vatRegistrationNo}
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-700">
                        {t('bankAccountNumber')}
                      </label>
                      <input 
                        type="number"
                        onChange={handleChange}
                        name="bankAccountNumber"
                        id="bankAccountNumber"
                        value={bankAccountNumber}
                        className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="tradeLicenseNo" className="block text-sm font-medium text-gray-700">
                        {t('tradeLicenseNo')}
                      </label>
                      <input 
                        type="number"
                        onChange={handleChange}
                        name="tradeLicenseNo"
                        id="tradeLicenseNo"
                        value={tradeLicenseNo}
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
        label: t('buildingName'),
        value: "buildingDetails",
        icon: HiOutlineBuildingOffice2,
        desc: (
          <div>

            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
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
                <label htmlFor="totalUnits" className="block text-sm font-medium text-gray-700">
                  {t('totalUnits')}
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="totalUnits"
                  value={totalUnits}
                  id="totalUnits"
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="w-8/12">
                <label htmlFor="unitsPerFloor" className="block text-sm font-medium text-gray-700">
                  {t('unitsPerFloor')}
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="unitsPerFloor"
                  value={unitsPerFloor}
                  id="unitsPerFloor"
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
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
                <label htmlFor="titleDeedNo" className="block text-sm font-medium text-gray-700">
                  {t('titleDeedNo')}
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="titleDeedNo"
                  value={titleDeedNo}
                  id="titleDeedNo"
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
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
              <div className="w-full">
                <label htmlFor="mizan" className="block text-sm font-medium text-gray-700">
                  {t('mizan')}
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="mizan"
                  value={mizan}
                  id="mizan"
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="plotArea" className="block text-sm font-medium text-gray-700">
                  {t('plotArea')}
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="plotArea"
                  value={plotArea}
                  id="plotArea"
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="floor" className="block text-sm font-medium text-gray-700">
                  {t('floor')}
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="floor"
                  value={floor}
                  id="floor"
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="w-full">
                <label htmlFor="buildingArea" className="block text-sm font-medium text-gray-700">
                  {t('buildingArea')}
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="buildingArea"
                  value={buildingArea}
                  id="buildingArea"
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

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
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
      {
        label: t('receiveUnits'),
        value: "receiveUnits",
        icon: MdAdUnits,
        desc: (
          <div>
            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
              <div className="w-full">
                <label htmlFor="unitNo" className="block text-sm font-medium text-gray-700">
                  {t('unitNo')}
                </label>
                <input
                  type="number"
                  name="unitNo"
                  value={unitNo}
                  onChange={handleChange}
                  id="unitNo"
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="unitName" className="block text-sm font-medium text-gray-700">
                  {t('unitName')}
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="unitName"
                  value={unitName}
                  id="unitName"
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="unitRent" className="block text-sm font-medium text-gray-700">
                  {t('unitRent')}
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="unitRent"
                  value={unitRent}
                  id="unitRent"
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
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
                <label htmlFor="unitSize" className="block text-sm font-medium text-gray-700">
                  {t('unitSize')}
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="unitSize"
                  value={unitSize}
                  id="unitSize"
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className='flex space-x-4 rtl:space-x-reverse mb-14'>
              <div className="w-11/12">
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
              <div className="w-11/12">
                <label htmlFor="parking" className="block text-sm font-medium text-gray-700">
                  {t('parking')}
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="parking"
                  value={parking}
                  id="parking"
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="w-11/12">
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
                <label htmlFor="unitStatus" className="block text-sm font-medium text-gray-700">
                  {t('unitStatus')}
                </label>
                <select id="unitStatus" name="unitStatus" value={unitStatus} onChange={ handleChange } className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option value=''>select unit status</option>
                  {unitStatuses.map((item, index)=>{
                    return <option key={index} value={item}>{item}</option>
                  })}
                </select>
              </div>

              <div className="w-11/12">
                <label htmlFor="noOfFunctionLoop" className="block text-sm font-medium text-gray-700">
                  {t('noToSave')}
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="noOfFunctionLoop"
                  value={noOfFunctionLoop}
                  id="noOfFunctionLoop"
                  className="bg-white mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="w-full mt-auto">
                <button onClick={(e)=>{saveUnit(e)}} className='ml-auto text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm px-4 py-2 text-center mr-2'>
                  {t('saveUnit')}
                  <AiOutlineSave className='text-xl ml-2'/>
                </button>
              </div>

            </div>

            <div className="mt-2 overflow-x-auto shadow-sm">
              <table ref={componentRef} className="w-full text-sm text-left text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-[#e9ecf7]">
                  <tr>
                    <th scope="col" className="py-4 pl-4">
                        {t('unitNo')}
                    </th>
                    <th scope="col" className="px-1">
                        {t('unitName')}
                    </th>
                    <th scope="col" className="p-1">
                        {t('unitRent')}
                    </th>
                    <th scope="col" className="p-1">
                        {t('unitType')}
                    </th>
                    <th scope="col" className="p-1">
                        {t('unitUse')}
                    </th>
                    <th scope="col" className="p-1">
                        {t('unitSize')}
                    </th>
                    <th scope="col" className="p-1">
                        {t('bathroom')}
                    </th>
                    <th scope="col" className="p-1">
                        {t('parking')}
                    </th>
                    <th scope="col" className="p-1">
                        {t('balcony')}
                    </th>
                    <th scope="col" className="p-1">
                        {t('ac')}
                    </th>
                    <th scope="col" className="p-1">
                        {t('unitSize')}
                    </th>
                    <th scope="col" className="p-1">
                        {t('editAndDel')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {receiveUnitsArray.map((item, index)=>{
                  return <tr key={index} className="bg-white border-b hover:bg-gray-50">
                    <td className="pl-4 py-3">
                      <div className=' text-black font-semibold'>{item.unitNo}</div>
                    </td>
                    <td className="p-1">
                      <div className=''>{item.unitName}</div>
                    </td>
                    <td className="p-1">
                      <div className=''>{item.unitRent}</div>
                    </td>
                    <td className="p-1">
                      <div className=''>{item.unitType}</div>
                    </td>
                    <td className="p-1">
                      <div className=''>{item.unitUse}</div>
                    </td>
                    <td className="p-1">
                      <div className=''>{item.unitSize}</div>
                    </td>
                    <td className="p-1">
                      <div className=''>{item.bathroom}</div>
                    </td>
                    <td className="p-1">
                      <div className=''>{item.parking}</div>
                    </td>
                    <td className="p-1">
                      <div className=''>{item.balcony}</div>
                    </td>
                    <td className="p-1">
                      <div className=''>{item.ac}</div>
                    </td>
                    <td className="p-1">
                      <div className=''>{item.unitStatus}</div>
                    </td>
                    <td className="flex items-center px-3 mr-5 space-x-4 rtl:space-x-reverse">
                      {/* <button type='button' onClick={()=>{getData(item._id)}} 
                          className={`${isAdmin === false ? 'cursor-not-allowed': ''} font-medium text-blue-600 dark:text-blue-500 hover:underline`} disabled={isAdmin === false}>
                          <AiOutlineEdit className='text-lg'/>
                        </button> */}
                      <button type='button' onClick={(e)=>{editUnit(e,index)}} 
                        className={`font-medium mt-3 text-blue-600 dark:text-blue-500 hover:underline`}>
                        <AiOutlineEdit className='text-xl my-auto font'/>
                      </button>

                      <button type='button' onClick={()=>{delUnit(index)}} 
                        className={`font-medium mt-3 text-blue-600 dark:text-blue-500 hover:underline`}>
                        <AiOutlineDelete className='text-xl my-auto font'/>
                      </button>

                    </td>
                        
                  </tr>})}
                  
                </tbody>
              </table>
              { receiveUnitsArray.length === 0  ? <h1 className='text-red-600 text-center text-base my-3'>No data found!</h1> : ''}
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
            <div className="pl-4 flex justify-between">
              <h3 className="text-lg font-bold leading-6 text-gray-900">{t('buildingTitle')}</h3>
              <button 
                onClick={()=>{
                  setOpen(true)
                  setId('')
                  setIsOpenSaveChange(true)
                  setReceiveUnitsArray([]);
                  setNameInInvoice('');
                  setLessorName('');
                  setAdjective('');
                  setBuildingType('');
                  setIdNumber('');
                  setExpID('');
                  setBank('');
                  setPassPortNumber('');
                  setExpPassPort('');
                  setNationality('');
                  setIbanNo('');
                  setVatRegistrationNo('');
                  setBankAccountNumber('');
                  setTradeLicenseNo('');
                  setBuildingNameInArabic('');
                  setBuildingNameInEnglish('');
                  setTotalUnits('');
                  setUnitsPerFloor('');
                  setParkings('');
                  setRoof('');
                  setCountry('');
                  setCity('');
                  setArea('');
                  setMizan('');
                  setPlotArea('');
                  setFloor('');
                  setBuildingArea('');
                  setElectricityMeterNo('');
                  setTitleDeedNo('');
                  setContractStartDate('');
                  setInvestmentStructure('');
                  setGracePeriodFrom('');
                  setContractEndDate('');
                  setAmount('');
                  setGracePeriodTo('');
                  setPaymentScheduling('');
                  setAttachment('');
                  setName('');
                  setPhoneNo('');
                  setEmail('');
                }} 
                className={`${isAdmin === false ? 'cursor-not-allowed': ''} bg-blue-800 hover:bg-blue-900 text-white px-14 py-2 rounded-lg`} disabled={isAdmin === false}>
                {t('new')}
              </button>
            </div>
          </div>
          <div className="mt-4 md:col-span-2 md:mt-0">
            <div className='flex justify-between'>

              <div className='w-1/4'>

                <div className="relative rounded-lg bg-gray-50 border-2 border-blue-800">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-blue-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                  </div>
                  <div className='pl-8'>
                    <input value={search} onChange={handleChange} type="text" id="search" name='search' className="block w-full p-2 text-sm text-gray-900 rounded-lg bg-gray-50 outline-none placeholder:text-gray-500" placeholder={t('buildingSearchLabel')} required/>
                  </div>
                </div>
              </div>

              <div className="mt-2 md:col-span-2 md:mt-0">
                <div className='flex'>

                  <button onClick={() => setOpenModal(true)}
                    className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2`} disabled={isAdmin === false}
                    >
                      {t('delete')}
                    <AiOutlineDelete className='text-lg ml-2'/>
                  </button>

                  <Transition.Root show={openModal} as={Fragment}>
                    <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenModal}>
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
                                <div className="sm:flex sm:items-start">
                                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                  </div>
                                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                      {t('deleteBuildings')}
                                    </Dialog.Title>
                                    <div className="mt-2">
                                      <p className="text-sm text-gray-500">
                                        {t('deleteBuildingsPara')}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                  type="button"
                                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                  onClick={delEntry}
                                >
                                  {t('delete')}
                                </button>
                                <button
                                  type="button"
                                  className=" inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                  onClick={() => setOpenModal(false)}
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

                  <ReactToPrint
                    trigger={()=>{
                      return <button 
                        type='button'
                        className={`text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2`}>
                        {t('printAll')}
                        <AiOutlinePrinter className='text-lg ml-2'/>
                      </button>
                    }}
                    content={() => componentRef.current}
                    documentTitle='Buildings and Owners'
                    pageStyle='print'
                  />
                  </div>

              </div>

              
            
            </div>
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
                            {t('buildingType')}
                        </th>
                        <th scope="col" className="p-1">
                            {t('owner')}
                        </th>
                        <th scope="col" className="p-1">
                            {t('area')}
                        </th>
                        <th scope="col" className="p-1">
                            {t('startDate')}
                        </th>
                        <th scope="col" className="p-1">
                            {t('endDate')}
                        </th>
                        <th scope="col" className="p-1">
                            {t('investment')}
                        </th>
                        <th scope="col" className="w-[80px]">
                            {t('investmentStructure')}
                        </th>
                        <th scope="col" className="p-1">
                            {t('view')}/{t('edit')}
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
                        <td className="p-1 w-[100px]">
                          <div className=' text-black font-semibold'>{item.buildingNameInEnglish}</div>
                        </td>
                        <td className="p-1">
                          <div className=''>{item.buildingType}</div>
                        </td>
                        <td className="p-1 w-[100px]">
                          <div className=''>{item.nameInInvoice}</div>
                        </td>
                        <td className="p-1 w-[100px]">
                          <div className=''>{item.area}</div>
                        </td>
                        <td className="p-1">
                          <div className=' text-black font-semibold'>{moment(item.contractStartDate).format('D MMM YYYY')}</div>
                        </td>
                        <td className="p-1">
                          <div className=' text-black font-semibold'>{moment(item.contractEndDate).format('D MMM YYYY')}</div>
                        </td>
                        <td className="p-1">
                          <div className=' text-black font-semibold'>{parseInt(item.amount).toLocaleString()}</div>
                        </td>
                        <td className="p-1">
                          <div className=''>{item.investmentStructure}</div>
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
                <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-2 lg:max-w-7xl">
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
  let dbVouchers = await dbBuildings.find()
  let dbContacts = await Contact.find()
  let dbCharts = await Charts.find()

  // Pass data to the page via props
  return {
    props: {
      dbVouchers: JSON.parse(JSON.stringify(dbVouchers)),
      dbContacts: JSON.parse(JSON.stringify(dbContacts)),
      dbCharts: JSON.parse(JSON.stringify(dbCharts)),
    }
  }
}   
export default Buildings;