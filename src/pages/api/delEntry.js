// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Charts from 'models/Charts';
import Contact from 'models/Contact';
import Product from 'models/Product';
import BankAccount from 'models/BankAccount';
import JournalVoucher from 'models/JournalVoucher';
import Employees from 'models/Employees';
import Role from 'models/Role';
import PurchaseInvoice from 'models/PurchaseInvoice';
import TaxRate from 'models/TaxRate';
import DebitNote from 'models/DebitNote';
import CreditNote from 'models/CreditNote';
import SalesInvoice from 'models/SalesInvoice';
import Expenses from 'models/Expenses';
import PaymentVoucher from 'models/PaymentVoucher';
import CreditSalesInvoice from 'models/CreditSalesInvoice';
import ReceiptVoucher from 'models/ReceiptVoucher';
import PaymentMethod from 'models/PaymentMethod';
import Buildings from 'models/Buildings';
import Units from 'models/Units';
import ContractAndTenant from 'models/ContractAndTenant';
import Cheque from 'models/Cheque';
import ChequeTransaction from 'models/ChequeTransaction';
import User from 'models/User';


export default async function handler(req, res) {

    if (req.method == 'POST'){
        const { path } = req.body;

        if(path === 'chartsOfAccounts'){
            const { selectedIds } = req.body;
            await Charts.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }
        else if (path === 'bankAccount'){
            const { selectedIds } = req.body;
            await BankAccount.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
            
        }
        else if (path === 'contactList'){
            const { selectedIds } = req.body;
            await Contact.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }
        else if (path === 'productAndServices'){
            const { selectedIds } = req.body;
            await Product.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }
        else if (path === 'journalVoucher'){
            const { selectedIds } = req.body;
            await JournalVoucher.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }
        else if (path === 'employees'){
            const { selectedIds } = req.body;
            await Employees.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }
        else if (path === 'addRole'){
            const { selectedIds } = req.body;
            await Role.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }
        else if (path === 'PaymentMethod'){
            const { selectedIds } = req.body;
            await PaymentMethod.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }

        else if (path === 'CreditSalesInvoice'){
          const { selectedIds } = req.body;

          try {

            selectedIds.forEach( async(newItem) => {
              let creditInvoice = await CreditSalesInvoice.findById(newItem);
              
              if(creditInvoice.contractId){
                await ContractAndTenant.findByIdAndUpdate(creditInvoice.contractId, { newContractStatus: 'Active', unitStatus:'Available' });
              }
            });
            
            await CreditSalesInvoice.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
            
          } catch (error) {
            console.log(error);
          } 
        }
        else if (path === 'PurchaseInvoice'){
          const { selectedIds } = req.body;
          await PurchaseInvoice.deleteMany( { _id: { $in: selectedIds } } )
          res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }
        else if (path === 'TaxRate'){
          const { selectedIds } = req.body;
          await TaxRate.deleteMany( { _id: { $in: selectedIds } } )
          res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }
        else if (path === 'CreditNote'){
          const { selectedIds } = req.body;

          selectedIds.forEach( async(newItem) => {
            let creditInvoice = await CreditNote.findById(newItem);
            
            if(creditInvoice.contractId){
              await ContractAndTenant.findByIdAndUpdate(creditInvoice.contractId, { newContractStatus: 'Active', unitStatus:'Available' });
            }
          });

          await CreditNote.deleteMany( { _id: { $in: selectedIds } } )
          res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }
        else if (path === 'DebitNote'){
          const { selectedIds } = req.body;
          await DebitNote.deleteMany( { _id: { $in: selectedIds } } )
          res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }
        else if (path === 'SalesInvoice'){
          const { selectedIds } = req.body;

          selectedIds.forEach( async(newItem) => {
            let salesInvoices = await SalesInvoice.findById(newItem);
            let journalNumber = salesInvoices.journalNo;
            await Cheque.findOneAndDelete({ journalNo: journalNumber })
          });

          await SalesInvoice.deleteMany( { _id: { $in: selectedIds } } )
          res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }
        else if (path === 'Expenses'){
          const { selectedIds } = req.body;
          await Expenses.deleteMany( { _id: { $in: selectedIds } } )
          res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }

        else if (path === 'PaymentVoucher'){
          const { selectedIds } = req.body;

          try {
            selectedIds.forEach( async(newItem) => {
              let data = await PaymentVoucher.findById(newItem);

              if(data.inputList.length > 0){

                let inputList = data.inputList;

                for (const newItem of inputList) {
                  await PurchaseInvoice.findByIdAndUpdate(newItem.id, { $inc: { amountPaid: -newItem.paid } });
                }

                let purchaseInvoices = await PurchaseInvoice.find()
                for (const item of purchaseInvoices) {
                  if(item.amountPaid === item.totalAmount) {
                    await PurchaseInvoice.findByIdAndUpdate(item.id, { billStatus: 'paid' });
                  }
                  else if(item.amountPaid > item.totalAmount) {
                    await PurchaseInvoice.findByIdAndUpdate(item.id, { billStatus: 'Advance' });
                  }
                  else if (item.amountReceived === item.totalAmount) {
                    await PurchaseInvoice.findByIdAndUpdate(item.id, { billStatus: 'returned' });
                  }
                  else {
                    await PurchaseInvoice.findByIdAndUpdate(item.id, { billStatus: 'unpaid' });
                  }
                }

                await PaymentVoucher.deleteMany( { _id: { $in: selectedIds } } )
                res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
              }
            });
          } catch (error) {
            res.status(400).json({ success: false, message: "Internal Server Error !" }) 
          }
        }
        else if (path === 'ReceiptVoucher'){
            const { selectedIds } = req.body;

            try {
                selectedIds.forEach( async(newItem) => {

                    let receiptInvoices = await ReceiptVoucher.findById(newItem);
                    let inputList = receiptInvoices.inputList

                    inputList.forEach( async(item) => {
                        let journalNumber = item.journalNo;
                        await Cheque.findOneAndDelete({ journalNo: journalNumber })
                    })

                    let data = await ReceiptVoucher.findById(newItem);
                    if(data.inputList.length > 0){

                        let inputList = data.inputList;
                        for (const newItem of inputList) {
                            await CreditSalesInvoice.findOneAndUpdate({billNo:newItem.billNo}, { $inc: { amountPaid: -newItem.paid } });
                        }
    
                        let Invoices = await CreditSalesInvoice.find()
                        for (const item of Invoices) {
                            if(item.amountPaid === item.totalAmount) {
                                await CreditSalesInvoice.findByIdAndUpdate(item.id, { billStatus: 'paid' });
                            }
                            else {
                                await CreditSalesInvoice.findByIdAndUpdate(item.id, { billStatus: 'unpaid' });
                            }
                        }
                        await ReceiptVoucher.deleteMany( { _id: { $in: selectedIds } } )
                        res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
                    }
                    else{
                        res.status(400).json({ success: false, message: "Internal Server Error !" }) 
                    }

                }); 
            } catch (error) {
                res.status(400).json({ success: false, message: "Internal Server Error !" }) 
            }
        }
        else if (path === 'Buildings'){
          const { selectedIds, userEmail } = req.body;

          selectedIds.forEach( async(newItem) => {
            let data = await Buildings.findById(newItem);
            let units = data.receiveUnitsArray;
            console.log(units)
            // units.forEach(async element => {
              // await Units.deleteMany({ userEmail: userEmail, unitNo: element.unitNo });
            // });
          });

          // await Buildings.deleteMany( { _id: { $in: selectedIds } } )
          // res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }
        else if (path === 'Units'){
            const { selectedIds } = req.body;
            await Units.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }
        else if (path === 'ContractAndTenants'){
            const { selectedIds } = req.body;
            await ContractAndTenant.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }
        else if (path === 'ChequeTransaction'){
            const { selectedIds } = req.body;
            
            selectedIds.forEach( async(newItem) => {
                let transaction = await ChequeTransaction.findById(newItem);
                let chqId = transaction.chequeId;
                await Cheque.findByIdAndUpdate(chqId, {chequeStatus: 'Issued'})
            });

            await ChequeTransaction.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }

        else if( path === 'clients'){
          const { selectedIds } = req.body;

          await User.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }

        



        else{
            res.status(400).json({ success: false, message: "Internal Server Error!" }) 
        }
    }
    else{
        res.status(400).json({ success: false, message: "Internal Server Error!" }) 
    }
}