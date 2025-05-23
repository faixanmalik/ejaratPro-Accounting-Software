// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Contact from 'models/Contact';
import Charts from '../../../models/Charts'
import moment from 'moment';
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
import CreditSalesInvoice from 'models/CreditSalesInvoice';
import PaymentMethod from 'models/PaymentMethod';
import Buildings from 'models/Buildings';
import Units from 'models/Units';
import ContractAndTenant from 'models/ContractAndTenant';
import ChequeTransaction from 'models/ChequeTransaction';
import Cheque from 'models/Cheque';


export default async function handler(req, res) {

    if (req.method == 'POST'){

        const { path } = req.body;
        
        if(path === 'chartsOfAccounts'){

            const { id } = req.body;

            await Charts.updateOne({ _id: id }, req.body);
            res.status(200).json({ success: true, message: "Update Successfully!" }) 
  
        }
        else if (path === 'contactList'){

            const { id } = req.body;

            await Contact.updateOne({ _id: id }, req.body);
            res.status(200).json({ success: true, message: "Update Successfully!" }) 
            
        }
        else if (path === 'productAndServices'){
            const { id } = req.body;

            await Product.updateOne({ _id: id }, req.body);
            res.status(200).json({ success: true, message: "Update Successfully!" }) 
        }

        else if (path === 'bankAccount'){
            const { id} = req.body;

            await BankAccount.updateOne({ _id: id }, req.body);
            res.status(200).json({ success: true, message: "Update Successfully!" }) 
        }

        else if (path === 'journalVoucher'){
            const { id } = req.body;

            await JournalVoucher.updateOne({ _id: id }, req.body);
            res.status(200).json({ success: true, message: "Update Successfully!" }) 
        }

        else if (path === 'employees'){
            const { id } = req.body;

            await Employees.updateOne({ _id: id }, req.body);
            res.status(200).json({ success: true, message: "Update Successfully!" }) 
        }

        else if(path === 'addRole'){
            const { id } = req.body;

            await Role.updateOne({ _id: id }, req.body);
            res.status(200).json({ success: true, message: "Update Successfully!" }) 
        }

        else if(path === 'PaymentMethod'){
            const { id } = req.body;

            await PaymentMethod.updateOne({ _id: id }, req.body);
            res.status(200).json({ success: true, message: "Update Successfully!" }) 
        }

        // Credit Sales Invoice
        else if (path === 'CreditSalesInvoice'){
            const { id } = req.body;

            await CreditSalesInvoice.updateOne({ _id: id }, req.body);
            res.status(200).json({ success: true, message: "Update Successfully!" }) 
        }

        // purchase Invoice
        else if (path === 'PurchaseInvoice'){
            const { id } = req.body;

            await PurchaseInvoice.updateOne({ _id: id }, req.body);
            res.status(200).json({ success: true, message: "Update Successfully!" }) 
        }


        else if(path === 'TaxRate'){

            const { id } = req.body;

            await TaxRate.updateOne({ _id: id }, req.body);
            res.status(200).json({ success: true, message: "Update Successfully!" }) 
        }

        

        // Debit Note Invoice
        else if (path === 'DebitNote'){
            const { id } = req.body;

            await DebitNote.updateOne({ _id: id }, req.body);
            res.status(200).json({ success: true, message: "Update Successfully!" }) 
        }

        // Credit Note
        else if (path === 'CreditNote'){
            const { id } = req.body;

            await CreditNote.updateOne({ _id: id }, req.body);
            res.status(200).json({ success: true, message: "Update Successfully!" }) 
        }


        // Sales Invoice
        else if (path === 'SalesInvoice'){

            const { id, journalNo } = req.body;

            await Cheque.updateOne({ journalNo: journalNo }, req.body);
            await SalesInvoice.updateOne({ _id: id }, req.body);
            res.status(200).json({ success: true, message: "Update Successfully!" }) 
        }



        // Expenses Invoice
        else if (path === 'Expenses'){

            const { id } = req.body;

            await Expenses.updateOne({ _id: id }, req.body);
            res.status(200).json({ success: true, message: "Update Successfully!" }) 
        }

        else if(path === 'Buildings'){

            const { id } = req.body;
            
            // Attempt to update the document
            await Buildings.updateOne({ _id: id }, req.body);
            res.status(200).json({ success: true, message: 'Update Successfully!' });
        }

        else if(path === 'Units'){
            const { id } = req.body;
            
            // Attempt to update the document
            await Units.updateOne({ _id: id }, req.body);
            res.status(200).json({ success: true, message: 'Update Successfully!' });
        }

        else if(path === 'NewContract'){
            const { id } = req.body;
            
            // Attempt to update the document
            await ContractAndTenant.updateOne({ _id: id }, req.body);
            res.status(200).json({ success: true, message: 'Update Successfully!' });
        }

        else if (path === 'ChequeTransaction'){
            const { id } = req.body;

            await ChequeTransaction.updateOne({ _id: id }, req.body);
            res.status(200).json({ success: true, message: "Update Successfully!" }) 
        }

        else if (path === 'clearCheque'){
            const { selectedIds, changeStatus } = req.body;
            
            selectedIds.forEach( async(newItem) => {
                await Cheque.findByIdAndUpdate(newItem, {chequeStatus: changeStatus});
            })
            res.status(200).json({ success: true, message: "Edit Successfully !" }) 
        }



        else if (path === 'retainedBalance'){

            const { id, updatedBalance } = req.body;
            await Charts.findByIdAndUpdate(id, {balance: updatedBalance});
  
            res.status(200).json({ success: true, message: "Update Successfully!" }) 
        }



        
        else{
            res.status(400).json({ success: false, message: "Internal server error !" }) 
        }  
    }
    else{
        res.status(400).json({ success: false, message: "Internal server error !" }) 
    }
}