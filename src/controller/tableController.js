import Table from "../model/Table.js"
import createHttpError from "http-errors";
import mongoose from "mongoose";

const addTable = async (req, res, next)=> {
 
    try{
        const {tableNo} = req.body;
        if(!tableNo){
            const error = createHttpError(400, "Please provide table No.!");
            return next(error)
        }

        const isTablePresent = await Table.findOne({tableNo});

        if(isTablePresent){
            const error = createHttpError(400, "Table already exists!");
            return next(error)
        }

        const newTable = new Table({tableNo})
        await newTable.save();

        res.status(201).json({success: true, message:"Table Added", data: newTable})




    }
    catch(error)
    {
        next(error);

    }
}

const getTables = async (req, res, next)  => {

        try{

            const tables = await Table.find().populate( {
                path:"currentOrder",
                select:"customerDetails"
            }  );
            
            res.status(200).json({success:true, message:"Tables fetched successfully", data: tables})
        }
        catch(error){
            next(error);
        }
}

const updateTable = async (req, res, next) => {

        try{

            const{ status, orderId} = req.body;

              const {id} = req.params;
            
                    if(!mongoose.Types.ObjectId.isValid(id)){
                        const error = createHttpError(404, "Invalid Id!")
                        return next(error);
                    }
            
            const tables = await Table.findByIdAndUpdate(
                id,
                {status, currentOrder: orderId},
                {new:true}
            );
            if(!tables){
                const error = createHttpError(404, "Table not found!");
                return next(error);
            }

            res.status(200).json({success:true, message: "Table successfully updated!", data: tables})

        }
        catch(error){
            next(error)
        }
}



export {addTable, getTables, updateTable}