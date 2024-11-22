import { z } from 'zod'

export const signUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6)
})


export const loginSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6)
})

export const AddressSchema = z.object({
  lineOne: z.string(),
  lineTwo: z.string().nullable(),
  pincode: z.string().length(6),
  country: z.string(),
  city: z.string(),
  userId: z.number()
})

export const updateUserSchema = z.object({
  name: z.string().optional(),
  defaultShippingAddress: z.number().optional(),
  defaultBillingAddress: z.number().optional()
})


export const updateUserRoleSchema = z.object({
  role: z.string(),
})