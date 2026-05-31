import UserDetailsForm from '@/components/admin/customer/UserDetailsForm'
import { IUser } from '@/types/user';
import React from 'react'
/** Replace with API data when wired up */
const demoUser: IUser = {
    id: "1",
    firstName: "Kaiya",
    lastName: "Botosh",
    userName: "kaiyabotosh",
    fullName: "Kaiya Botosh",
    email: "user@email.domain",
    role: "user",
    phone: "(123) 123 1234",
    country: "United States",
    state: "Alabama",
    zipCode: "35010",
    description:
        "Hi I'm Kaiya Botosh, has been the industry's standard dummy text ever since the 1500s.",
};

export default function UserEditWrapper() {
    return (
        <UserDetailsForm user={demoUser} />
    )
}

