//import express
const express = require("express");

//import prisma client
const prisma = require("../prisma/client");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

//function findUsers
const findUsers = async (req, res) => {
  try {
    //get all users from database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    //send response
    res.status(200).send({
      success: true,
      message: "Get all users successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const createUser = async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(442).json({
            success: false,
            message: "Validation error",
            errors: errors.array()
        })
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    try {
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            }
        })
        res.status(201).send({
            success: true,
            message: "User Create Successfully",
            data: user
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error"
        })
    }
}

const findUserById = async (req, res)=>{
    const {id} = req.params;
    try {
        const user = await prisma.user.findUnique({
            where:{
                id: Number(id)
            },
            select:{
                id: true,
                name: true,
                email:true,
            }
        })

        res.status(200).send({
            success: true,
            message: `Get user By ID : ${id}`,
            data: user,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error"
        })
        
    }
}

//function updateUser
const updateUser = async (req, res) => {

    //get ID from params
    const { id } = req.params;

    // Periksa hasil validasi
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Jika ada error, kembalikan error ke pengguna
        return res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array(),
        });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try {

        //update user
        const user = await prisma.user.update({
            where: {
                id: Number(id),
            },
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            },
        });

        //send response
        res.status(200).send({
            success: true,
            message: 'User updated successfully',
            data: user,
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};


const deleteUser = async (req, res) => {

    //get ID from params
    const { id } = req.params;

    try {

        //delete user
        await prisma.user.delete({
            where: {
                id: Number(id),
            },
        });

        //send response
        res.status(200).send({
            success: true,
            message: 'User deleted successfully',
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }

};

module.exports = { findUsers, createUser, findUserById, updateUser, deleteUser };
