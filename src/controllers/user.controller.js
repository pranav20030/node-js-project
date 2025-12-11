import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler( async (req, res) => {
   // get user detail from frontend
   // validation - not empty
   // check if user already exists: username and email
   // check for images, check for avatar
   // upload them to cloudinary, avatar
   // create user object - creare entry in db
   // remove password and refresh token field from response
   // check for user creation
   // return res
   

   const {fullName, email, username, password} = req.body
   console.log("BODY:", req.body);


   // if(fullName === ""){
   //    throw new ApiError(422, "Fullname is required")
   // }

   if(
      [fullName, email, username, password].some((field) =>field?.trim() === "" )
   ){
      throw new ApiError(422, "All fields are required")
   }
    const existedUser = await User.findOne({
      $or: [{email}, {username}]
    })

    if(existedUser){
      throw new ApiError(409, "User with email or username already exist ")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImagePath = req.files?.coverImage?.[0]?.path

    console.log("avatarLocalPath", avatarLocalPath)

    if(!avatarLocalPath) {
     throw new ApiError(422,"Avatar file is Required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImagePath)

    if(!avatar) {
     throw new ApiError(422,"Avatar file is Required")
    }

   const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    )

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering user")
    }

   return res.status(200).json(
      new ApiResponse(200, createdUser, "User registered Successfully")
   )
})


export {registerUser}