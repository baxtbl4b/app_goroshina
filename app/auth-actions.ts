"use server"

import { redirect } from "next/navigation"

// In a real application, these would be a database or a more robust cache
const smsCodes = new Map<string, string>() // Map<phoneNumber, code>
const registeredUsers = new Map<string, { isNewUser: boolean }>() // Map<phoneNumber, { isNewUser: boolean }>

export async function sendSmsCodeForAuth(phoneNumber: string) {
  if (!phoneNumber) {
    return { success: false, message: "Пожалуйста, введите номер телефона." }
  }

  const phoneRegex = /^\d{10,15}$/ // Example: 10 to 15 digits
  if (!phoneRegex.test(phoneNumber)) {
    return { success: false, message: "Пожалуйста, введите действительный номер телефона." }
  }

  let isNewUser = false
  if (!registeredUsers.has(phoneNumber)) {
    // User does not exist, "register" them
    registeredUsers.set(phoneNumber, { isNewUser: true })
    isNewUser = true
    console.log(`New user "registered": ${phoneNumber}`)
  } else {
    // Existing user
    registeredUsers.set(phoneNumber, { isNewUser: false }) // Ensure status is not new for this session
    console.log(`Existing user: ${phoneNumber}`)
  }

  // Simulate sending SMS code
  const code = Math.floor(1000 + Math.random() * 9000).toString() // 4-digit code
  smsCodes.set(phoneNumber, code)
  console.log(`SMS code for ${phoneNumber}: ${code}`) // For demonstration, log the code
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

  return { success: true, message: "Код отправлен на ваш номер телефона.", isNewUser }
}

export async function verifySmsCodeAndLogin(phoneNumber: string, code: string) {
  if (!phoneNumber || !code) {
    return { success: false, message: "Пожалуйста, введите номер телефона и код." }
  }

  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

  const storedCode = smsCodes.get(phoneNumber)

  if (storedCode === code) {
    smsCodes.delete(phoneNumber) // Invalidate code after use

    const userStatus = registeredUsers.get(phoneNumber)
    if (userStatus && userStatus.isNewUser) {
      console.log(`New user ${phoneNumber} verified. Redirecting to profile completion.`)
      // For new users, redirect to a profile completion page
      redirect(`/profile-completion?phone=${phoneNumber}`)
    } else {
      console.log(`Existing user ${phoneNumber} logged in successfully!`)
      // For existing users, redirect to the main account page
      redirect("/account")
    }
  } else {
    return { success: false, message: "Неверный код или номер телефона." }
  }
}

// This action is for the profile completion page
export async function completeProfile(formData: FormData) {
  const phoneNumber = formData.get("phoneNumber") as string
  const name = formData.get("name") as string
  const email = formData.get("email") as string // Optional

  if (!phoneNumber || !name) {
    return { success: false, message: "Имя и номер телефона обязательны." }
  }

  console.log(`Completing profile for ${phoneNumber}: Name - ${name}, Email - ${email || "N/A"}`)
  await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate saving data

  // In a real app, you'd save this data to your user database
  // and potentially update session/authentication state.

  redirect("/account") // Redirect to main account page after profile completion
}

// This action keeps the old /register page working.
// It simply re-uses the existing sendSmsCodeForAuth() helper
// and then redirects the user to /register/success if the SMS
// code was "sent" successfully.

export async function registerUser(formData: FormData) {
  const phoneNumber = formData.get("phoneNumber") as string | undefined

  if (!phoneNumber) {
    return { success: false, message: "Пожалуйста, введите номер телефона." }
  }

  // Delegate to the existing logic
  const result = await sendSmsCodeForAuth(phoneNumber)

  // On success – take the user to the success screen
  if (result.success) {
    redirect(`/register/success?phone=${encodeURIComponent(phoneNumber)}`)
  }

  // If something went wrong, propagate the error back to the client form
  return result
}
